-- Invoice charges, discounts and EORI (D-029): the fields 19 CFR 141.86 and EU invoice rules
-- ask for that TradeDocs did not have (docs/research/document-requirements-2026-10-29.md).
--
-- What changes:
--   * public.companies.eori_number: an EORI number (two-letter country code and up to 15
--     letters or digits), separate from tax_number, so a document can show both.
--     private.party_snapshot adds `eori_number` only when a company has one, so every
--     existing party snapshot stays exactly as it was.
--   * public.shipment_charges: up to 20 named charges per shipment: freight, insurance,
--     packing, commission, other (with a label) and discount, each an amount in the
--     shipment's currency and whether it is already included in the line prices. A change
--     advances the shipment's revision like a line change, so earlier invoices go stale.
--   * Snapshot schema 8 (renderer tradedocs-pdf/8): for a commercial or proforma invoice of
--     a shipment with charges, `charges` and `invoice_totals` (goods, charges, discounts,
--     total). Every other snapshot is exactly what 20261009000100 produced. A discount
--     larger than the invoice is refused.
--
-- Access decisions:
--   public.shipment_charges   members of the organization read, insert, update and delete
--                             (as public.shipment_items); the composite foreign key keeps a
--                             charge in its shipment's organization. anon: nothing.
--   companies.eori_number     under the existing companies policies.
--   document_snapshot, party_snapshot keep their privileges (create or replace).
--
-- Rollback: re-create private.document_snapshot from 20261009000100 and
-- private.party_snapshot from 20261006000300, then drop public.shipment_charges and the
-- eori_number column. Documents already generated keep their snapshots and still render.

begin;

alter table public.companies
  add column eori_number text check (eori_number ~ '^[A-Z]{2}[A-Z0-9]{1,15}$');
comment on column public.companies.eori_number is
  'Economic Operators Registration and Identification number, as issued: country code and up to 15 characters.';

create table public.shipment_charges (
  id uuid primary key default extensions.gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  shipment_id uuid not null,
  position integer not null check (position between 1 and 20),
  kind text not null check (
    kind in ('freight', 'insurance', 'packing', 'commission', 'other', 'discount')
  ),
  label text check (char_length(btrim(label)) between 1 and 80),
  amount numeric(14, 3) not null check (amount > 0 and amount < 100000000000),
  included_in_price boolean not null default false,
  created_at timestamptz not null default now(),
  foreign key (org_id, shipment_id) references public.shipments (org_id, id) on delete cascade,
  unique (shipment_id, position),
  -- "Other" says what it is; the named kinds print their own name.
  check (kind <> 'other' or label is not null)
);
create index shipment_charges_shipment_idx on public.shipment_charges (shipment_id, position);

alter table public.shipment_charges enable row level security;
create policy shipment_charges_read on public.shipment_charges
  for select to authenticated using (private.is_member(org_id));
create policy shipment_charges_write on public.shipment_charges
  for insert to authenticated with check (private.is_member(org_id));
create policy shipment_charges_update on public.shipment_charges
  for update to authenticated using (private.is_member(org_id)) with check (private.is_member(org_id));
create policy shipment_charges_delete on public.shipment_charges
  for delete to authenticated using (private.is_member(org_id));
revoke all on public.shipment_charges from anon;
grant select, insert, update, delete on public.shipment_charges to authenticated;

create trigger shipment_charges_bump_revision
  after insert or update or delete on public.shipment_charges
  for each row execute function private.bump_shipment_revision();

/** As in 20261006000300_document_lineage.sql, plus `eori_number` when the company has one. */
create or replace function private.party_snapshot(target_org uuid, target_company uuid)
returns jsonb
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select jsonb_build_object(
    'id', c.id,
    'kind', c.kind,
    'name', c.name,
    'legal_name', c.legal_name,
    'contact_name', c.contact_name,
    'tax_number', c.tax_number,
    'registration_number', c.registration_number,
    'email', c.email,
    'phone', c.phone,
    'address_line1', c.address_line1,
    'address_line2', c.address_line2,
    'city', c.city,
    'region', c.region,
    'postal_code', c.postal_code,
    'country_code', c.country_code
  ) || case
    when c.eori_number is null then '{}'::jsonb
    else jsonb_build_object('eori_number', c.eori_number)
  end
  from public.companies c
  where c.id = target_company and c.org_id = target_org;
$$;

/**
 * As in 20261009000100_sales_and_shipping_documents.sql (schema 4 to 7), plus schema 8: an
 * invoice's charges, discounts and totals, only when the shipment has charges.
 */
create or replace function private.document_snapshot(
  shipment public.shipments,
  document_kind text,
  document_number text,
  supersedes_number text
)
returns jsonb
  language plpgsql
  stable
  security definer
  set search_path = ''
as $$
declare
  places integer := private.currency_minor_units(shipment.currency);
  settings public.organization_settings;
  snapshot jsonb;
  branding jsonb;
  charge_rows jsonb;
  added numeric;
  deducted numeric;
  goods numeric;
begin
  select * into settings from public.organization_settings o where o.org_id = shipment.org_id;

  select jsonb_build_object(
    'schema_version', 4,
    'money_places', places,
    'kind', document_kind,
    'number', document_number,
    'generated_at', now(),
    'supersedes', supersedes_number,
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
    'exporter', private.party_snapshot(shipment.org_id, shipment.exporter_id),
    'consignee', private.party_snapshot(shipment.org_id, shipment.consignee_id),
    'notify', private.party_snapshot(shipment.org_id, shipment.notify_id),
    'issuer', case when settings.org_id is null then null else jsonb_build_object(
      'payment_terms', settings.payment_terms,
      'bank_details', settings.bank_details,
      'signatory_name', settings.signatory_name,
      'signatory_title', settings.signatory_title,
      'document_notes', settings.document_notes
    ) end,
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
      where i.shipment_id = shipment.id and i.org_id = shipment.org_id
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
          -- Per package, as entered.
          'net_weight_kg', p.net_weight_kg,
          'gross_weight_kg', p.gross_weight_kg,
          -- The row: count x per-package weight, which is what the totals add up.
          'net_weight_total_kg', round(p.package_count * p.net_weight_kg, 3),
          'gross_weight_total_kg', round(p.package_count * p.gross_weight_kg, 3),
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
      where p.shipment_id = shipment.id and p.org_id = shipment.org_id
    ), '[]'::jsonb),
    'totals', (
      select jsonb_build_object(
        'quantity', coalesce(sum(i.quantity), 0),
        'net_weight_kg', sum(i.net_weight_kg),
        'gross_weight_kg', sum(i.gross_weight_kg),
        'packages', coalesce(sum(i.package_count), 0),
        'value', coalesce(sum(round(i.quantity * i.unit_price, places)), 0)
      )
      from public.shipment_items i
      where i.shipment_id = shipment.id and i.org_id = shipment.org_id
    ),
    -- Schema 4: weights are count x per-package weight, and null when no package states
    -- one, exactly as the line totals are.
    'packing_totals', (
      select jsonb_build_object(
        'packages', coalesce(sum(p.package_count), 0),
        'gross_weight_kg', sum(round(p.package_count * p.gross_weight_kg, 3)),
        'net_weight_kg', sum(round(p.package_count * p.net_weight_kg, 3)),
        'volume_m3', coalesce(sum(p.volume_m3), 0)
      )
      from public.shipment_packages p
      where p.shipment_id = shipment.id and p.org_id = shipment.org_id
    )
  ) into snapshot;

  -- Schema 5: branding, for an entitled organization only (paid gate, fail closed).
  if private.branding_entitled(shipment.org_id) then
    select jsonb_object_agg(
      a.slot,
      jsonb_build_object(
        'object_path', a.object_path,
        'sha256', a.sha256,
        'format', a.format,
        'width', a.width,
        'height', a.height
      )
    )
    into branding
    from public.branding_assets a
    where a.org_id = shipment.org_id;

    if branding is not null then
      snapshot := snapshot || jsonb_build_object('schema_version', 5, 'branding', branding);
    end if;
  end if;

  -- Schema 6: the shipment's commercial terms, only when it states one, so a shipment
  -- without them keeps producing exactly the snapshot it did before.
  if shipment.buyer_reference is not null or shipment.proforma_valid_until is not null then
    snapshot := jsonb_set(
      snapshot,
      '{shipment}',
      (snapshot -> 'shipment') || jsonb_build_object(
        'buyer_reference', shipment.buyer_reference,
        'proforma_valid_until', shipment.proforma_valid_until
      )
    ) || jsonb_build_object('schema_version', 6);
  end if;

  -- Schema 7: container and VGM fields, only when the shipment states one, so a shipment
  -- without them keeps producing exactly the snapshot it did before.
  if shipment.container_number is not null or shipment.container_type is not null
    or shipment.seal_number is not null or shipment.booking_number is not null
    or shipment.vessel_voyage is not null or shipment.vgm_method is not null
    or shipment.vgm_kg is not null or shipment.vgm_weighed_on is not null
    or shipment.vgm_signatory is not null then
    snapshot := jsonb_set(
      snapshot,
      '{shipment}',
      (snapshot -> 'shipment') || jsonb_build_object(
        'container_number', shipment.container_number,
        'container_type', shipment.container_type,
        'seal_number', shipment.seal_number,
        'booking_number', shipment.booking_number,
        'vessel_voyage', shipment.vessel_voyage,
        'vgm_method', shipment.vgm_method,
        'vgm_kg', shipment.vgm_kg,
        'vgm_weighed_on', shipment.vgm_weighed_on,
        'vgm_signatory', shipment.vgm_signatory
      )
    ) || jsonb_build_object('schema_version', 7);
  end if;

  -- Schema 8: an invoice's charges and discounts, only when the shipment has any, so every
  -- other snapshot stays exactly what it was. Each amount is rounded once to the currency;
  -- the invoice total is the goods value plus the charges not already in the prices, minus
  -- the discounts not already in them (19 CFR 141.86(a)(8) and (g)).
  if document_kind in ('commercial_invoice', 'proforma_invoice') and exists (
    select 1 from public.shipment_charges c
    where c.shipment_id = shipment.id and c.org_id = shipment.org_id
  ) then
    select
      jsonb_agg(
        jsonb_build_object(
          'position', c.position,
          'kind', c.kind,
          'label', c.label,
          'amount', round(c.amount, places),
          'included_in_price', c.included_in_price
        ) order by c.position, c.created_at
      ),
      coalesce(sum(round(c.amount, places))
        filter (where c.kind <> 'discount' and not c.included_in_price), 0),
      coalesce(sum(round(c.amount, places))
        filter (where c.kind = 'discount' and not c.included_in_price), 0)
    into charge_rows, added, deducted
    from public.shipment_charges c
    where c.shipment_id = shipment.id and c.org_id = shipment.org_id;

    goods := (snapshot -> 'totals' ->> 'value')::numeric;
    if goods + added - deducted < 0 then
      raise exception 'The discounts are larger than the invoice. Check the charges and discounts.'
        using errcode = 'check_violation';
    end if;

    snapshot := snapshot || jsonb_build_object(
      'schema_version', 8,
      'charges', charge_rows,
      'invoice_totals', jsonb_build_object(
        'goods', goods,
        'charges', added,
        'discounts', deducted,
        'total', goods + added - deducted
      )
    );
  end if;

  return snapshot;
end;
$$;

commit;
