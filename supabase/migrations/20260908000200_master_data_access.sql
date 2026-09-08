-- Master data access, catalog import, and the document snapshot that now carries packing.

begin;

create policy products_read on public.products
  for select to authenticated using (private.is_member(org_id));
create policy products_write on public.products
  for insert to authenticated with check (private.is_member(org_id));
create policy products_update on public.products
  for update to authenticated using (private.is_member(org_id)) with check (private.is_member(org_id));
create policy products_delete on public.products
  for delete to authenticated using (private.has_org_role(org_id, array['owner', 'admin']));

create policy shipment_packages_read on public.shipment_packages
  for select to authenticated using (private.is_member(org_id));
create policy shipment_packages_write on public.shipment_packages
  for insert to authenticated with check (private.is_member(org_id));
create policy shipment_packages_update on public.shipment_packages
  for update to authenticated using (private.is_member(org_id)) with check (private.is_member(org_id));
create policy shipment_packages_delete on public.shipment_packages
  for delete to authenticated using (private.is_member(org_id));

create policy package_contents_read on public.package_contents
  for select to authenticated using (private.is_member(org_id));
create policy package_contents_write on public.package_contents
  for insert to authenticated with check (private.is_member(org_id));
create policy package_contents_update on public.package_contents
  for update to authenticated using (private.is_member(org_id)) with check (private.is_member(org_id));
create policy package_contents_delete on public.package_contents
  for delete to authenticated using (private.is_member(org_id));

grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.shipment_packages to authenticated;
grant select, insert, update, delete on public.package_contents to authenticated;

/**
 * Imports a catalog in one transaction. Either every row lands or none does, because a
 * spreadsheet that half-imported leaves the operator with no way to know which half —
 * re-running it duplicates, and skipping it loses rows.
 *
 * Validation happens per row and reports the row number the user sees in their file, so
 * a rejection is something they can act on rather than a failure they have to hunt.
 */
create or replace function public.import_products(target_org uuid, rows jsonb)
returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  entry jsonb;
  line integer := 0;
  problems jsonb := '[]'::jsonb;
  inserted integer := 0;
  updated integer := 0;
  clean_sku text;
  clean_description text;
  existing uuid;
begin
  if not private.is_member(target_org) then
    raise exception 'That organization is not available.' using errcode = '42501';
  end if;
  if jsonb_typeof(rows) <> 'array' then
    raise exception 'Provide the catalog as a list of rows.' using errcode = 'check_violation';
  end if;
  if jsonb_array_length(rows) > 2000 then
    raise exception 'Import at most 2000 rows at a time.' using errcode = 'check_violation';
  end if;

  for entry in select * from jsonb_array_elements(rows) loop
    line := line + 1;
    clean_description := btrim(coalesce(entry ->> 'description', ''));
    clean_sku := nullif(btrim(coalesce(entry ->> 'sku', '')), '');

    if clean_description = '' then
      problems := problems || jsonb_build_object('row', line, 'problem', 'Description is required.');
      continue;
    end if;
    if char_length(clean_description) > 500 then
      problems := problems || jsonb_build_object('row', line, 'problem', 'Description is too long.');
      continue;
    end if;
    if (entry ->> 'hs_code') is not null and (entry ->> 'hs_code') <> ''
      and (entry ->> 'hs_code') !~ '^[0-9]{6,10}$' then
      problems := problems || jsonb_build_object('row', line, 'problem', 'HS code must be 6 to 10 digits.');
      continue;
    end if;
    if (entry ->> 'country_of_origin') is not null and (entry ->> 'country_of_origin') <> ''
      and upper(entry ->> 'country_of_origin') !~ '^[A-Z]{2}$' then
      problems := problems || jsonb_build_object('row', line, 'problem', 'Country must be a two-letter code.');
      continue;
    end if;
    if (entry ->> 'unit_price') is not null and (entry ->> 'unit_price') <> ''
      and (entry ->> 'unit_price') !~ '^[0-9]+(\.[0-9]+)?$' then
      problems := problems || jsonb_build_object('row', line, 'problem', 'Unit price must be a positive number.');
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
      update public.products set
        description = clean_description,
        hs_code = nullif(entry ->> 'hs_code', ''),
        country_of_origin = upper(nullif(entry ->> 'country_of_origin', '')),
        unit = coalesce(nullif(btrim(entry ->> 'unit'), ''), 'pcs'),
        unit_price = coalesce(nullif(entry ->> 'unit_price', '')::numeric, 0),
        net_weight_kg = nullif(entry ->> 'net_weight_kg', '')::numeric,
        gross_weight_kg = nullif(entry ->> 'gross_weight_kg', '')::numeric,
        package_kind = nullif(btrim(entry ->> 'package_kind'), '')
      where id = existing;
      updated := updated + 1;
    else
      insert into public.products (
        org_id, sku, description, hs_code, country_of_origin, unit, unit_price,
        net_weight_kg, gross_weight_kg, package_kind
      )
      values (
        target_org,
        clean_sku,
        clean_description,
        nullif(entry ->> 'hs_code', ''),
        upper(nullif(entry ->> 'country_of_origin', '')),
        coalesce(nullif(btrim(entry ->> 'unit'), ''), 'pcs'),
        coalesce(nullif(entry ->> 'unit_price', '')::numeric, 0),
        nullif(entry ->> 'net_weight_kg', '')::numeric,
        nullif(entry ->> 'gross_weight_kg', '')::numeric,
        nullif(btrim(entry ->> 'package_kind'), '')
      );
      inserted := inserted + 1;
    end if;
  end loop;

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

  return jsonb_build_object('inserted', inserted, 'updated', updated);
end;
$$;

/**
 * Adds a catalog entry to a shipment as a line, copying its values at this moment.
 * Done in the database so the copy is one statement: a client that read the product and
 * then wrote the line could interleave with an edit to that product and store a mixture
 * of two versions.
 */
create or replace function public.add_product_to_shipment(
  target_shipment uuid,
  target_product uuid,
  line_quantity numeric
)
returns uuid
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  shipment public.shipments;
  product public.products;
  next_position integer;
  created uuid;
begin
  select * into shipment from public.shipments s where s.id = target_shipment;
  if shipment.id is null or not private.is_member(shipment.org_id) then
    raise exception 'That shipment is not available.' using errcode = '42501';
  end if;

  select * into product from public.products p
  where p.id = target_product and p.org_id = shipment.org_id;
  if product.id is null then
    raise exception 'That catalog entry is not available.' using errcode = '42501';
  end if;
  if line_quantity is null or line_quantity <= 0 then
    raise exception 'Enter a quantity greater than zero.' using errcode = 'check_violation';
  end if;

  select coalesce(max(i.position), 0) + 1 into next_position
  from public.shipment_items i where i.shipment_id = target_shipment;

  insert into public.shipment_items (
    org_id, shipment_id, product_id, position, description, hs_code, country_of_origin,
    quantity, unit, unit_price, net_weight_kg, gross_weight_kg, package_kind
  )
  values (
    shipment.org_id, target_shipment, product.id, next_position, product.description,
    product.hs_code, product.country_of_origin, line_quantity, product.unit,
    product.unit_price,
    -- Catalog weights are per unit; the line carries the weight of the quantity shipped.
    case when product.net_weight_kg is null then null
      else round(product.net_weight_kg * line_quantity, 3) end,
    case when product.gross_weight_kg is null then null
      else round(product.gross_weight_kg * line_quantity, 3) end,
    product.package_kind
  )
  returning id into created;

  return created;
end;
$$;

/**
 * Regenerated so a document set also states how the goods are packed. The packing list
 * was previously reduced to a per-line carton count, which cannot express dimensions,
 * marks or a carton holding more than one article.
 */
create or replace function public.generate_document(target_shipment uuid, document_kind text)
returns uuid
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  shipment public.shipments;
  prefix text;
  allocated text;
  snapshot jsonb;
  created uuid;
begin
  select * into shipment from public.shipments s where s.id = target_shipment;
  if shipment.id is null or not private.is_member(shipment.org_id) then
    raise exception 'That shipment is not available.' using errcode = '42501';
  end if;
  if document_kind not in (
    'commercial_invoice', 'proforma_invoice', 'packing_list', 'delivery_note',
    'certificate_of_origin'
  ) then
    raise exception 'That document type is not available.' using errcode = 'check_violation';
  end if;
  if not exists (select 1 from public.shipment_items i where i.shipment_id = target_shipment) then
    raise exception 'Add at least one line item before generating a document.'
      using errcode = 'check_violation';
  end if;

  prefix := case document_kind
    when 'commercial_invoice' then 'CI'
    when 'proforma_invoice' then 'PI'
    when 'packing_list' then 'PL'
    when 'delivery_note' then 'DN'
    else 'CO'
  end;
  allocated := private.allocate_number(shipment.org_id, document_kind, prefix);

  select jsonb_build_object(
    'kind', document_kind,
    'number', allocated,
    'generated_at', now(),
    'shipment', jsonb_build_object(
      'reference', shipment.reference,
      'incoterm', shipment.incoterm,
      'incoterm_place', shipment.incoterm_place,
      'port_of_loading', shipment.port_of_loading,
      'port_of_discharge', shipment.port_of_discharge,
      'country_of_origin', shipment.country_of_origin,
      'country_of_destination', shipment.country_of_destination,
      'currency', shipment.currency,
      'shipped_on', shipment.shipped_on,
      'marks_and_numbers', shipment.marks_and_numbers,
      'revision', shipment.revision
    ),
    'exporter', (select to_jsonb(c) from public.companies c where c.id = shipment.exporter_id),
    'consignee', (select to_jsonb(c) from public.companies c where c.id = shipment.consignee_id),
    'notify', (select to_jsonb(c) from public.companies c where c.id = shipment.notify_id),
    'items', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'position', i.position,
          'description', i.description,
          'hs_code', i.hs_code,
          'country_of_origin', i.country_of_origin,
          'quantity', i.quantity,
          'unit', i.unit,
          'unit_price', i.unit_price,
          'line_total', round(i.quantity * i.unit_price, 2),
          'net_weight_kg', i.net_weight_kg,
          'gross_weight_kg', i.gross_weight_kg,
          'package_count', i.package_count,
          'package_kind', i.package_kind
        ) order by i.position, i.created_at
      )
      from public.shipment_items i where i.shipment_id = target_shipment
    ), '[]'::jsonb),
    'packages', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'position', p.position,
          'kind', p.kind,
          'package_count', p.package_count,
          'length_cm', p.length_cm,
          'width_cm', p.width_cm,
          'height_cm', p.height_cm,
          'net_weight_kg', p.net_weight_kg,
          'gross_weight_kg', p.gross_weight_kg,
          'volume_m3', p.volume_m3,
          'marks', p.marks,
          'contents', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'position', ci.position,
                'description', ci.description,
                'quantity', pc.quantity,
                'unit', ci.unit
              ) order by ci.position
            )
            from public.package_contents pc
            join public.shipment_items ci on ci.id = pc.item_id
            where pc.package_id = p.id
          ), '[]'::jsonb)
        ) order by p.position, p.created_at
      )
      from public.shipment_packages p where p.shipment_id = target_shipment
    ), '[]'::jsonb),
    'totals', (
      select jsonb_build_object(
        'quantity', coalesce(sum(i.quantity), 0),
        'net_weight_kg', coalesce(sum(i.net_weight_kg), 0),
        'gross_weight_kg', coalesce(sum(i.gross_weight_kg), 0),
        'packages', coalesce(sum(i.package_count), 0),
        'value', coalesce(sum(round(i.quantity * i.unit_price, 2)), 0)
      )
      from public.shipment_items i where i.shipment_id = target_shipment
    ),
    -- Packing totals stay separate from line totals. When an operator has described the
    -- cartons explicitly these are the figures a carrier is quoted from, and silently
    -- merging them with the per-line estimates would hide the difference.
    'packing_totals', (
      select jsonb_build_object(
        'packages', coalesce(sum(p.package_count), 0),
        'gross_weight_kg', coalesce(sum(p.gross_weight_kg), 0),
        'net_weight_kg', coalesce(sum(p.net_weight_kg), 0),
        'volume_m3', coalesce(sum(p.volume_m3), 0)
      )
      from public.shipment_packages p where p.shipment_id = target_shipment
    )
  ) into snapshot;

  insert into public.documents (
    org_id, shipment_id, kind, number, shipment_revision, snapshot, created_by
  )
  values (
    shipment.org_id, target_shipment, document_kind, allocated, shipment.revision, snapshot, actor
  )
  returning id into created;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    shipment.org_id, actor, 'document.generated', 'document', created::text,
    jsonb_build_object('kind', document_kind, 'number', allocated)
  );

  return created;
end;
$$;

do $$
declare routine text;
begin
  foreach routine in array array[
    'public.generate_document(uuid, text)',
    'public.import_products(uuid, jsonb)',
    'public.add_product_to_shipment(uuid, uuid, numeric)'
  ] loop
    execute format('revoke execute on function %s from public, anon', routine);
    execute format('grant execute on function %s to authenticated', routine);
  end loop;
end;
$$;

commit;
