-- Shipment reuse, allocation limits and a catalog import that reports every bad row.
--
-- Defects this fixes (docs/delivery/product-review-2026-10-06.md):
--   * A second shipment for the same buyer had to be re-typed: nothing copied an earlier one.
--   * Package allocations could exceed the line they packed, with no refusal.
--   * import_products accepted a weight such as "abc" until a cast failed and the whole
--     import ended with a generic error and no row number; a duplicate SKU inside one file
--     silently overwrote the earlier row; over-length units or package types, gross below
--     net, and out-of-range figures likewise failed without saying where.
--   * Row numbers counted only kept rows, so they did not match the user's file.
--
-- What changes:
--   * public.duplicate_shipment copies a shipment's parties, terms, lines and packing into a
--     new draft. Documents are never copied or touched.
--   * private.package_contents_same_shipment also refuses allocating more of a line than
--     the line holds, under a row lock on that line.
--   * public.import_products gains dry_run (validate and count, write nothing) and reports
--     every problem on a row against the row's `line` in the user's file when supplied.
--
--   * private.bump_own_revision ignores an update that changes nothing, so saving an
--     unchanged form no longer marks every document stale.
--
-- Rollback: re-create bump_own_revision from 20260907000400; drop
-- public.duplicate_shipment(uuid, text) and
-- public.import_products(uuid, jsonb, boolean); re-create import_products(uuid, jsonb) from
-- 20260908000200 and package_contents_same_shipment from 20260909000100.

begin;

-- ---------------------------------------------------------------------------------------
-- A save that changes nothing is not an edit
-- ---------------------------------------------------------------------------------------

/**
 * Saving the shipment form without changing anything used to advance the revision, which
 * marked every document stale for no reason. Only an update that changes a column other
 * than the bookkeeping ones counts now. The explicit revision bump that line, package and
 * allocation triggers issue still passes through untouched.
 */
create or replace function private.bump_own_revision() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
begin
  if new.revision is distinct from old.revision then
    return new;
  end if;
  if (to_jsonb(new) - 'updated_at' - 'revision') = (to_jsonb(old) - 'updated_at' - 'revision') then
    return new;
  end if;
  new.revision := old.revision + 1;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------------------
-- Allocation cannot exceed the line
-- ---------------------------------------------------------------------------------------

create or replace function private.package_contents_same_shipment() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  line_quantity numeric;
  elsewhere numeric;
begin
  if not exists (
    select 1
    from public.shipment_packages p
    join public.shipment_items i on i.shipment_id = p.shipment_id and i.org_id = p.org_id
    where p.id = new.package_id and i.id = new.item_id and p.org_id = new.org_id
  ) then
    raise exception 'A package can only hold lines from its own shipment.'
      using errcode = 'check_violation';
  end if;

  -- Locked so two concurrent allocations of the same line cannot both fit the remainder.
  select i.quantity into line_quantity
  from public.shipment_items i where i.id = new.item_id for update;

  -- Other packages only: an upsert into this package replaces its own earlier amount.
  select coalesce(sum(pc.quantity), 0) into elsewhere
  from public.package_contents pc
  where pc.item_id = new.item_id and pc.package_id <> new.package_id;

  if elsewhere + new.quantity > line_quantity then
    raise exception 'That allocation packs more than the line holds.'
      using errcode = 'check_violation',
            detail = json_build_object(
              'line_quantity', line_quantity, 'allocated_elsewhere', elsewhere
            )::text;
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------------------
-- Reuse an earlier shipment
-- ---------------------------------------------------------------------------------------

/**
 * Starts a new draft from an earlier shipment: parties, terms, currency, marks, lines and
 * packing are copied; status, dates and documents are not. The source shipment and its
 * documents are only read.
 *
 * Lines keep the values they had on the source, not today's catalog values, so the copy
 * says exactly what the earlier shipment said until the user changes it. An archived party
 * is left empty rather than carried into new work.
 */
create or replace function public.duplicate_shipment(source_shipment uuid, new_reference text)
returns uuid
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  source public.shipments;
  clean_reference text := btrim(coalesce(new_reference, ''));
  created uuid;
  item record;
  new_item uuid;
  item_map jsonb := '{}'::jsonb;
  pkg record;
  new_package uuid;
begin
  select * into source from public.shipments s where s.id = source_shipment;
  if source.id is null or not private.is_member(source.org_id) then
    raise exception 'That shipment is not available.' using errcode = '42501';
  end if;
  if char_length(clean_reference) not between 1 and 60 then
    raise exception 'Enter a shipment reference of 1 to 60 characters.'
      using errcode = 'check_violation';
  end if;
  if exists (
    select 1 from public.shipments s
    where s.org_id = source.org_id and s.reference = clean_reference
  ) then
    raise exception 'A shipment with that reference already exists.' using errcode = '23505';
  end if;

  insert into public.shipments (
    org_id, reference, exporter_id, consignee_id, notify_id, incoterm, incoterm_place,
    port_of_loading, port_of_discharge, country_of_origin, country_of_destination, currency,
    marks_and_numbers, created_by
  )
  values (
    source.org_id,
    clean_reference,
    (select c.id from public.companies c
     where c.id = source.exporter_id and c.org_id = source.org_id and c.archived_at is null),
    (select c.id from public.companies c
     where c.id = source.consignee_id and c.org_id = source.org_id and c.archived_at is null),
    (select c.id from public.companies c
     where c.id = source.notify_id and c.org_id = source.org_id and c.archived_at is null),
    source.incoterm,
    source.incoterm_place,
    source.port_of_loading,
    source.port_of_discharge,
    source.country_of_origin,
    source.country_of_destination,
    source.currency,
    source.marks_and_numbers,
    actor
  )
  returning id into created;

  for item in
    select * from public.shipment_items i
    where i.shipment_id = source.id and i.org_id = source.org_id
    order by i.position, i.created_at
  loop
    insert into public.shipment_items (
      org_id, shipment_id, product_id, position, description, hs_code, country_of_origin,
      quantity, unit, unit_price, net_weight_kg, gross_weight_kg, package_count, package_kind
    )
    values (
      source.org_id, created, item.product_id, item.position, item.description, item.hs_code,
      item.country_of_origin, item.quantity, item.unit, item.unit_price, item.net_weight_kg,
      item.gross_weight_kg, item.package_count, item.package_kind
    )
    returning id into new_item;
    item_map := item_map || jsonb_build_object(item.id::text, new_item::text);
  end loop;

  for pkg in
    select * from public.shipment_packages p
    where p.shipment_id = source.id and p.org_id = source.org_id
    order by p.position, p.created_at
  loop
    insert into public.shipment_packages (
      org_id, shipment_id, position, kind, package_count, length_cm, width_cm, height_cm,
      net_weight_kg, gross_weight_kg, marks
    )
    values (
      source.org_id, created, pkg.position, pkg.kind, pkg.package_count, pkg.length_cm,
      pkg.width_cm, pkg.height_cm, pkg.net_weight_kg, pkg.gross_weight_kg, pkg.marks
    )
    returning id into new_package;

    -- A source line that is over-allocated (its quantity was lowered after packing) is left
    -- unallocated in the copy rather than refusing the whole copy; reconciliation then
    -- shows it as a line to pack.
    insert into public.package_contents (org_id, package_id, item_id, quantity)
    select source.org_id, new_package, (item_map ->> pc.item_id::text)::uuid, pc.quantity
    from public.package_contents pc
    join public.shipment_items i on i.id = pc.item_id and i.org_id = source.org_id
    where pc.package_id = pkg.id and pc.org_id = source.org_id
      and (
        select coalesce(sum(other.quantity), 0) from public.package_contents other
        where other.item_id = pc.item_id
      ) <= i.quantity;
  end loop;

  -- A copy starts its own history. Setting the revision explicitly is not counted as an edit.
  update public.shipments s set revision = 1 where s.id = created;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    source.org_id, actor, 'shipment.duplicated', 'shipment', created::text,
    jsonb_build_object('source', source.id, 'source_reference', source.reference)
  );

  return created;
end;
$$;

-- ---------------------------------------------------------------------------------------
-- Catalog import, version 2
-- ---------------------------------------------------------------------------------------

drop function public.import_products(uuid, jsonb);

/**
 * Imports a catalog in one transaction, or with dry_run validates it and reports what it
 * would do without writing anything.
 *
 * Every problem on a row is reported, keyed to the row's line in the user's own file when
 * the caller supplies `line` (the application does), so the file is fixed in one pass.
 * Any problem rolls a real import back completely.
 */
create or replace function public.import_products(
  target_org uuid,
  rows jsonb,
  dry_run boolean default false
)
returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  entry jsonb;
  position_in_file integer := 0;
  line integer;
  issues text[];
  problems jsonb := '[]'::jsonb;
  seen jsonb := '{}'::jsonb;
  inserted integer := 0;
  updated integer := 0;
  clean_sku text;
  clean_description text;
  clean_hs text;
  clean_country text;
  clean_unit text;
  clean_package text;
  raw text;
  price numeric;
  net numeric;
  gross numeric;
  existing uuid;
  number_pattern constant text := '^[0-9]+(\.[0-9]+)?$';
begin
  if not private.is_member(target_org) then
    raise exception 'That organization is not available.' using errcode = '42501';
  end if;
  if rows is null or jsonb_typeof(rows) <> 'array' then
    raise exception 'Provide the catalog as a list of rows.' using errcode = 'check_violation';
  end if;
  if jsonb_array_length(rows) > 2000 then
    raise exception 'Import at most 2000 rows at a time.' using errcode = 'check_violation';
  end if;

  for entry in select * from jsonb_array_elements(rows) loop
    position_in_file := position_in_file + 1;
    line := case when (entry ->> 'line') ~ '^[0-9]{1,7}$' then (entry ->> 'line')::integer
      else position_in_file end;
    issues := array[]::text[];
    price := null;
    net := null;
    gross := null;

    clean_description := btrim(coalesce(entry ->> 'description', ''));
    clean_sku := nullif(btrim(coalesce(entry ->> 'sku', '')), '');
    clean_hs := nullif(btrim(coalesce(entry ->> 'hs_code', '')), '');
    clean_country := upper(nullif(btrim(coalesce(entry ->> 'country_of_origin', '')), ''));
    clean_unit := coalesce(nullif(btrim(coalesce(entry ->> 'unit', '')), ''), 'pcs');
    clean_package := nullif(btrim(coalesce(entry ->> 'package_kind', '')), '');

    if clean_description = '' then
      issues := array_append(issues, 'Description is required.'::text);
    elsif char_length(clean_description) > 500 then
      issues := array_append(issues, 'Description is longer than 500 characters.'::text);
    end if;
    if clean_sku is not null and char_length(clean_sku) > 60 then
      issues := array_append(issues, 'SKU is longer than 60 characters.'::text);
    end if;
    if clean_sku is not null then
      if seen ? upper(clean_sku) then
        issues := array_append(issues, format(
          'SKU %s also appears on line %s.', clean_sku, seen ->> upper(clean_sku)
        ));
      else
        seen := seen || jsonb_build_object(upper(clean_sku), line);
      end if;
    end if;
    if clean_hs is not null and clean_hs !~ '^[0-9]{6,10}$' then
      issues := array_append(issues, 'HS code must be 6 to 10 digits.'::text);
    end if;
    if clean_country is not null and clean_country !~ '^[A-Z]{2}$' then
      issues := array_append(issues, 'Country must be a two-letter code, such as DE.'::text);
    end if;
    if char_length(clean_unit) > 12 then
      issues := array_append(issues, 'Unit is longer than 12 characters.'::text);
    end if;
    if clean_package is not null and char_length(clean_package) > 40 then
      issues := array_append(issues, 'Package type is longer than 40 characters.'::text);
    end if;

    raw := nullif(btrim(coalesce(entry ->> 'unit_price', '')), '');
    if raw is not null then
      if raw !~ number_pattern then
        issues := array_append(issues, format('Unit price "%s" is not a number of zero or more.', raw));
      elsif raw::numeric >= 10000000000 then
        issues := array_append(issues, 'Unit price is too large.'::text);
      else
        price := raw::numeric;
      end if;
    end if;
    raw := nullif(btrim(coalesce(entry ->> 'net_weight_kg', '')), '');
    if raw is not null then
      if raw !~ number_pattern then
        issues := array_append(issues, format('Net weight "%s" is not a number of zero or more.', raw));
      elsif raw::numeric >= 10000000000 then
        issues := array_append(issues, 'Net weight is too large.'::text);
      else
        net := raw::numeric;
      end if;
    end if;
    raw := nullif(btrim(coalesce(entry ->> 'gross_weight_kg', '')), '');
    if raw is not null then
      if raw !~ number_pattern then
        issues := array_append(issues, format('Gross weight "%s" is not a number of zero or more.', raw));
      elsif raw::numeric >= 10000000000 then
        issues := array_append(issues, 'Gross weight is too large.'::text);
      else
        gross := raw::numeric;
      end if;
    end if;
    if net is not null and gross is not null and gross < net then
      issues := array_append(issues, 'Gross weight is less than net weight.'::text);
    end if;

    if cardinality(issues) > 0 then
      problems := problems || jsonb_build_object(
        'row', line, 'problem', array_to_string(issues, ' ')
      );
      continue;
    end if;

    -- A SKU already in the catalog is the same article, so the import corrects it rather
    -- than creating a second entry the operator would then have to reconcile by hand.
    existing := null;
    if clean_sku is not null then
      select p.id into existing
      from public.products p
      where p.org_id = target_org
        and p.archived_at is null
        and upper(btrim(p.sku)) = upper(clean_sku);
    end if;

    if existing is not null then
      if not dry_run then
        update public.products set
          description = clean_description,
          hs_code = clean_hs,
          country_of_origin = clean_country,
          unit = clean_unit,
          unit_price = coalesce(price, 0),
          net_weight_kg = net,
          gross_weight_kg = gross,
          package_kind = clean_package
        where id = existing;
      end if;
      updated := updated + 1;
    else
      if not dry_run then
        insert into public.products (
          org_id, sku, description, hs_code, country_of_origin, unit, unit_price,
          net_weight_kg, gross_weight_kg, package_kind
        )
        values (
          target_org, clean_sku, clean_description, clean_hs, clean_country, clean_unit,
          coalesce(price, 0), net, gross, clean_package
        );
      end if;
      inserted := inserted + 1;
    end if;
  end loop;

  if dry_run then
    return jsonb_build_object(
      'inserted', inserted, 'updated', updated, 'problems', problems, 'dry_run', true
    );
  end if;

  -- Any problem rolls the whole import back. The caller gets the full problem list so the
  -- user fixes their file once, rather than discovering the next bad row on each retry.
  if jsonb_array_length(problems) > 0 then
    raise exception using
      errcode = 'check_violation',
      message = 'import rejected',
      detail = problems::text;
  end if;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    target_org, (select auth.uid()), 'products.imported', 'organization', target_org::text,
    jsonb_build_object('inserted', inserted, 'updated', updated)
  );

  return jsonb_build_object('inserted', inserted, 'updated', updated, 'dry_run', false);
end;
$$;

do $$
declare routine text;
begin
  foreach routine in array array[
    'public.duplicate_shipment(uuid, text)',
    'public.import_products(uuid, jsonb, boolean)'
  ] loop
    execute format('revoke execute on function %s from public, anon', routine);
    execute format('grant execute on function %s to authenticated', routine);
  end loop;
end;
$$;

commit;
