-- Commercial terms on the shipment: the buyer's reference (purchase order number) and how
-- long a proforma's offer stands.
--
-- What changes:
--   * public.shipments gains buyer_reference (text, 1 to 60 characters) and
--     proforma_valid_until (date). Both nullable; existing rows are untouched. A shipment
--     duplicated with duplicate_shipment does not carry them over: a new order has its own
--     purchase order and its own offer.
--   * Snapshot schema 6 (renderer tradedocs-pdf/6): private.document_snapshot adds
--     shipment.buyer_reference and shipment.proforma_valid_until, and schema_version 6, but
--     only when the shipment states at least one of them. Every other snapshot is exactly
--     what 20261007000100_pdf_branding.sql produced (schema 4, or 5 with branding). Branding
--     is carried as before; the renderer draws it from schema 5 onwards.
--   * The renderer prints the buyer reference on commercial and proforma invoices and the
--     validity date on proforma invoices, from schema 6 only, so every document issued
--     before this migration re-renders byte for byte.
--
-- Access decisions: no new table, view, function or grant. The two columns fall under the
-- existing public.shipments policies and grants (members read and update; an update bumps
-- the shipment revision through shipments_bump_revision). private.document_snapshot stays
-- private: create or replace keeps its revoked execute privileges.
--
-- Rollback: re-create private.document_snapshot from 20261007000100_pdf_branding.sql, then
-- drop the two columns. Documents generated meanwhile are schema 6 and need the schema 6
-- renderer; their snapshots carry the values, so dropping the columns loses nothing they print.

begin;

alter table public.shipments
  add column buyer_reference text check (char_length(btrim(buyer_reference)) between 1 and 60),
  add column proforma_valid_until date;

comment on column public.shipments.buyer_reference is
  'The buyer''s own reference for the order, usually its purchase order number.';
comment on column public.shipments.proforma_valid_until is
  'The last day a proforma invoice''s offer stands.';

/**
 * As in 20261007000100_pdf_branding.sql (schema 4, or 5 with branding), plus schema 6: the
 * shipment's buyer reference and proforma validity date, only when it states one of them.
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

  return snapshot;
end;
$$;

commit;
