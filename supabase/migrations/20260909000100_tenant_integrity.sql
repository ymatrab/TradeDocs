-- Tenant integrity and document immutability.
--
-- Row security decides which rows a caller may see. It does not decide which rows a row may
-- point at: a member of organization B could set their own shipment's consignee to a
-- company id belonging to organization A, and generate_document — which runs as the
-- definer — would then copy A's company into B's document. The same was true of a line's
-- product, a package's shipment and a package's contents.
--
-- The fix is structural rather than a check in each code path. Every tenant-owned parent is
-- made addressable by (org_id, id), and every child references its parent by that pair, so
-- a reference across organizations cannot be stored at all. The definer routines also scope
-- every lookup to the shipment's organization, so the guarantee holds twice.
--
-- Any existing cross-tenant reference makes this migration fail rather than be silently
-- kept. That is intended: such a row is a leak to investigate, not data to preserve.
--
-- Rollback: drop the composite constraints, restore the single-column foreign keys named
-- below, and re-create generate_document and freeze_document from 20260908000200 and
-- 20260907000400. No data is rewritten by this migration.

begin;

-- Parents addressable by (org_id, id). `id` is already unique, so these add no new rule;
-- they exist so the composite foreign keys below have something to reference.
alter table public.companies add constraint companies_org_id_id_key unique (org_id, id);
alter table public.shipments add constraint shipments_org_id_id_key unique (org_id, id);
alter table public.shipment_items add constraint shipment_items_org_id_id_key unique (org_id, id);
alter table public.shipment_packages
  add constraint shipment_packages_org_id_id_key unique (org_id, id);
alter table public.products add constraint products_org_id_id_key unique (org_id, id);

-- Parties. `no action` rather than `restrict`: it refuses a direct delete of a company a
-- shipment still names exactly as before, but is checked at the end of the statement, so
-- deleting a whole organization (which cascades to both tables) is not refused mid-way.
alter table public.shipments
  drop constraint shipments_exporter_id_fkey,
  drop constraint shipments_consignee_id_fkey,
  drop constraint shipments_notify_id_fkey;
alter table public.shipments
  add constraint shipments_exporter_id_fkey foreign key (org_id, exporter_id)
    references public.companies (org_id, id) on delete no action,
  add constraint shipments_consignee_id_fkey foreign key (org_id, consignee_id)
    references public.companies (org_id, id) on delete no action,
  add constraint shipments_notify_id_fkey foreign key (org_id, notify_id)
    references public.companies (org_id, id) on delete no action;

-- Lines belong to a shipment of their own organization, and come from a product of it.
-- `set null (product_id)` clears only the provenance column: org_id is not nullable and
-- must survive a catalog entry being deleted.
alter table public.shipment_items
  drop constraint shipment_items_shipment_id_fkey,
  drop constraint shipment_items_product_id_fkey;
alter table public.shipment_items
  add constraint shipment_items_shipment_id_fkey foreign key (org_id, shipment_id)
    references public.shipments (org_id, id) on delete cascade,
  add constraint shipment_items_product_id_fkey foreign key (org_id, product_id)
    references public.products (org_id, id) on delete set null (product_id);

alter table public.shipment_packages drop constraint shipment_packages_shipment_id_fkey;
alter table public.shipment_packages
  add constraint shipment_packages_shipment_id_fkey foreign key (org_id, shipment_id)
    references public.shipments (org_id, id) on delete cascade;

alter table public.package_contents
  drop constraint package_contents_package_id_fkey,
  drop constraint package_contents_item_id_fkey;
alter table public.package_contents
  add constraint package_contents_package_id_fkey foreign key (org_id, package_id)
    references public.shipment_packages (org_id, id) on delete cascade,
  add constraint package_contents_item_id_fkey foreign key (org_id, item_id)
    references public.shipment_items (org_id, id) on delete cascade;

-- A generated document is evidence. Deleting its shipment used to cascade it away; now the
-- shipment cannot be deleted while documents exist. `no action` for the same reason as the
-- parties: removing a whole organization still removes both.
alter table public.documents drop constraint documents_shipment_id_fkey;
alter table public.documents
  add constraint documents_shipment_id_fkey foreign key (org_id, shipment_id)
    references public.shipments (org_id, id) on delete no action;

/**
 * Same organization is necessary but not sufficient for package contents: a carton on one
 * shipment must not claim a line from another shipment of the same organization, or the
 * packing list would describe goods that are not on it.
 */
create or replace function private.package_contents_same_shipment() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
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
  return new;
end;
$$;

create trigger package_contents_same_shipment
  before insert or update on public.package_contents
  for each row execute function private.package_contents_same_shipment();

/**
 * Immutability, completed. Ownership and provenance are now frozen alongside the content,
 * and status may only move forward: a final document can be superseded or voided, and
 * nothing comes back from either.
 *
 * created_by may still become null, because that column is `on delete set null`: erasing
 * an account must not be blocked by the documents that account once generated.
 */
create or replace function private.freeze_document() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
begin
  if new.snapshot is distinct from old.snapshot
    or new.number is distinct from old.number
    or new.shipment_revision is distinct from old.shipment_revision
    or new.kind is distinct from old.kind
    or new.shipment_id is distinct from old.shipment_id
    or new.org_id is distinct from old.org_id
    or new.created_at is distinct from old.created_at
    or (new.created_by is distinct from old.created_by and new.created_by is not null)
  then
    raise exception 'A generated document cannot be rewritten. Generate a new one instead.'
      using errcode = 'check_violation';
  end if;

  if new.status is distinct from old.status
    and not (old.status = 'final' and new.status in ('superseded', 'voided'))
  then
    raise exception 'A document can only move from final to superseded or voided.'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

/**
 * Minor units per ISO 4217 currency, as ICU 75 / CLDR (what Intl.NumberFormat uses) states
 * them. Everything absent is two places. The renderer never consults this list: the number
 * of places is written into each snapshot, so a document re-renders the way it was issued
 * even if this list is later corrected.
 */
create or replace function private.currency_minor_units(code text) returns integer
  language sql
  immutable
  set search_path = ''
as $$
  select case
    when code in (
      'AFN', 'ALL', 'BIF', 'CLP', 'DJF', 'GNF', 'IQD', 'IRR', 'ISK', 'JPY', 'KMF', 'KPW',
      'KRW', 'LAK', 'LBP', 'MGA', 'MMK', 'PYG', 'RSD', 'RWF', 'SLL', 'SOS', 'SYP', 'UGX',
      'VND', 'VUV', 'XAF', 'XOF', 'XPF', 'YER'
    ) then 0
    when code in ('BHD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND') then 3
    else 2
  end;
$$;

/**
 * Regenerated with every lookup scoped to the shipment's organization, money rounded to the
 * currency's minor units, and the snapshot stamped with the schema it follows.
 *
 * schema_version 2 adds `schema_version` and `money_places`. Snapshots without them are
 * version 1 and rendered with two decimal places, exactly as they were issued.
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
  places integer;
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
  if not exists (
    select 1 from public.shipment_items i
    where i.shipment_id = target_shipment and i.org_id = shipment.org_id
  ) then
    raise exception 'Add at least one line item before generating a document.'
      using errcode = 'check_violation';
  end if;

  places := private.currency_minor_units(shipment.currency);
  prefix := case document_kind
    when 'commercial_invoice' then 'CI'
    when 'proforma_invoice' then 'PI'
    when 'packing_list' then 'PL'
    when 'delivery_note' then 'DN'
    else 'CO'
  end;
  allocated := private.allocate_number(shipment.org_id, document_kind, prefix);

  select jsonb_build_object(
    'schema_version', 2,
    'money_places', places,
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
    'exporter', (
      select to_jsonb(c) from public.companies c
      where c.id = shipment.exporter_id and c.org_id = shipment.org_id
    ),
    'consignee', (
      select to_jsonb(c) from public.companies c
      where c.id = shipment.consignee_id and c.org_id = shipment.org_id
    ),
    'notify', (
      select to_jsonb(c) from public.companies c
      where c.id = shipment.notify_id and c.org_id = shipment.org_id
    ),
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
          'line_total', round(i.quantity * i.unit_price, places),
          'net_weight_kg', i.net_weight_kg,
          'gross_weight_kg', i.gross_weight_kg,
          'package_count', i.package_count,
          'package_kind', i.package_kind
        ) order by i.position, i.created_at
      )
      from public.shipment_items i
      where i.shipment_id = target_shipment and i.org_id = shipment.org_id
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
            join public.shipment_items ci
              on ci.id = pc.item_id and ci.org_id = shipment.org_id
            where pc.package_id = p.id and pc.org_id = shipment.org_id
          ), '[]'::jsonb)
        ) order by p.position, p.created_at
      )
      from public.shipment_packages p
      where p.shipment_id = target_shipment and p.org_id = shipment.org_id
    ), '[]'::jsonb),
    'totals', (
      select jsonb_build_object(
        'quantity', coalesce(sum(i.quantity), 0),
        'net_weight_kg', coalesce(sum(i.net_weight_kg), 0),
        'gross_weight_kg', coalesce(sum(i.gross_weight_kg), 0),
        'packages', coalesce(sum(i.package_count), 0),
        'value', coalesce(sum(round(i.quantity * i.unit_price, places)), 0)
      )
      from public.shipment_items i
      where i.shipment_id = target_shipment and i.org_id = shipment.org_id
    ),
    'packing_totals', (
      select jsonb_build_object(
        'packages', coalesce(sum(p.package_count), 0),
        'gross_weight_kg', coalesce(sum(p.gross_weight_kg), 0),
        'net_weight_kg', coalesce(sum(p.net_weight_kg), 0),
        'volume_m3', coalesce(sum(p.volume_m3), 0)
      )
      from public.shipment_packages p
      where p.shipment_id = target_shipment and p.org_id = shipment.org_id
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

/**
 * Regenerated so the product lookup is scoped by the shipment's organization and an
 * archived catalog entry cannot be added to a new shipment.
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
  where p.id = target_product and p.org_id = shipment.org_id and p.archived_at is null;
  if product.id is null then
    raise exception 'That catalog entry is not available.' using errcode = '42501';
  end if;
  if line_quantity is null or line_quantity <= 0 then
    raise exception 'Enter a quantity greater than zero.' using errcode = 'check_violation';
  end if;

  select coalesce(max(i.position), 0) + 1 into next_position
  from public.shipment_items i
  where i.shipment_id = target_shipment and i.org_id = shipment.org_id;

  insert into public.shipment_items (
    org_id, shipment_id, product_id, position, description, hs_code, country_of_origin,
    quantity, unit, unit_price, net_weight_kg, gross_weight_kg, package_kind
  )
  values (
    shipment.org_id, target_shipment, product.id, next_position, product.description,
    product.hs_code, product.country_of_origin, line_quantity, product.unit,
    product.unit_price,
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

do $$
declare routine text;
begin
  foreach routine in array array[
    'public.generate_document(uuid, text)',
    'public.add_product_to_shipment(uuid, uuid, numeric)'
  ] loop
    execute format('revoke execute on function %s from public, anon', routine);
    execute format('grant execute on function %s to authenticated', routine);
  end loop;
end;
$$;

revoke execute on function private.currency_minor_units(text) from public, anon, authenticated;

commit;
