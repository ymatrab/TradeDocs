-- Sales and shipping documents (D-025): seven more document kinds from the same shipment
-- record, and the container and VGM fields three of them need.
--
-- What changes:
--   * public.documents.kind accepts quotation, purchase_order, sales_confirmation,
--     sales_contract, bill_of_lading_draft, shipper_letter_of_instruction and
--     vgm_declaration, besides the five it accepted before.
--   * public.shipments gains container_number (ISO 6346 shape: four capital letters and seven
--     digits), container_type, seal_number, booking_number, vessel_voyage, vgm_method (1 or
--     2, the two SOLAS VI/2 methods, MSC.1/Circ.1475 paragraph 5.1), vgm_kg (the verified
--     gross mass), vgm_weighed_on and vgm_signatory (the person authorized by the shipper who
--     signs the VGM declaration, MSC.1/Circ.1475 paragraph 6.2). All nullable; existing rows
--     are untouched. duplicate_shipment does not carry them over: a new shipment has its own
--     container, booking and weighing.
--   * private.document_kind_known: the one list of kinds generate_document and
--     preview_document accept. Whether a kind is offered (certificate of origin behind
--     ENABLE_REGULATED_DOCUMENTS) stays decided in the application, as before.
--   * private.document_prefix: number prefixes QT, PO, SC, CT, BL, SLI and VGM.
--   * Snapshot schema 7 (renderer tradedocs-pdf/7): private.document_snapshot adds the nine
--     container and VGM fields to `shipment`, and schema_version 7, only when the shipment
--     states at least one of them. Every other snapshot is exactly what
--     20261007000200_document_commercial_terms.sql produced (schema 4, 5 or 6).
--   * generate_document refuses a VGM declaration until the shipment states the container
--     number, the weighing method, the verified gross mass and the signatory.
--
-- Access decisions: no new table, view or grant. The new columns fall under the existing
-- public.shipments policies and grants (members read and update; an update bumps the
-- revision through shipments_bump_revision). private.document_kind_known is private and
-- revoked from every client role. generate_document, preview_document, document_snapshot
-- and document_prefix keep their existing privileges (create or replace).
--
-- Rollback: re-create private.document_snapshot from 20261007000200, generate_document from
-- 20261007000100, preview_document and private.document_prefix from 20261006000300, restore
-- the five-kind check, then drop private.document_kind_known and the nine columns. Documents
-- of the new kinds must be removed first (the restored check refuses them); their snapshots
-- carry everything they print.

begin;

alter table public.documents drop constraint if exists documents_kind_check;
alter table public.documents add constraint documents_kind_check check (
  kind in (
    'commercial_invoice',
    'proforma_invoice',
    'packing_list',
    'delivery_note',
    'certificate_of_origin',
    'quotation',
    'purchase_order',
    'sales_confirmation',
    'sales_contract',
    'bill_of_lading_draft',
    'shipper_letter_of_instruction',
    'vgm_declaration'
  )
);

alter table public.shipments
  add column container_number text check (container_number ~ '^[A-Z]{4}[0-9]{7}$'),
  add column container_type text check (char_length(btrim(container_type)) between 1 and 12),
  add column seal_number text check (char_length(btrim(seal_number)) between 1 and 40),
  add column booking_number text check (char_length(btrim(booking_number)) between 1 and 40),
  add column vessel_voyage text check (char_length(btrim(vessel_voyage)) between 1 and 80),
  add column vgm_method smallint check (vgm_method in (1, 2)),
  add column vgm_kg numeric(12, 3) check (vgm_kg > 0 and vgm_kg < 1000000),
  add column vgm_weighed_on date,
  add column vgm_signatory text check (char_length(btrim(vgm_signatory)) between 1 and 80);

comment on column public.shipments.container_number is
  'ISO 6346 container number: owner code, category letter, six-digit serial and check digit.';
comment on column public.shipments.vgm_method is
  'SOLAS VI/2 weighing method: 1 weighs the packed container, 2 adds the weighed contents to the tare.';
comment on column public.shipments.vgm_kg is
  'The verified gross mass of the packed container, in kilograms, as the shipper declares it.';
comment on column public.shipments.vgm_signatory is
  'The person authorized by the shipper who signs the VGM declaration.';

/** The document kinds the database generates and previews. */
create or replace function private.document_kind_known(document_kind text) returns boolean
  language sql
  immutable
  set search_path = ''
as $$
  select coalesce(document_kind in (
    'commercial_invoice', 'proforma_invoice', 'packing_list', 'delivery_note',
    'certificate_of_origin', 'quotation', 'purchase_order', 'sales_confirmation',
    'sales_contract', 'bill_of_lading_draft', 'shipper_letter_of_instruction',
    'vgm_declaration'
  ), false);
$$;
revoke execute on function private.document_kind_known(text) from public, anon, authenticated;

/** The document-kind prefix, after the organization's own prefix when it has one. */
create or replace function private.document_prefix(target_org uuid, document_kind text)
returns text
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select coalesce(
    (select o.number_prefix || '-' from public.organization_settings o
     where o.org_id = target_org and o.number_prefix is not null),
    ''
  ) || case document_kind
    when 'commercial_invoice' then 'CI'
    when 'proforma_invoice' then 'PI'
    when 'packing_list' then 'PL'
    when 'delivery_note' then 'DN'
    when 'quotation' then 'QT'
    when 'purchase_order' then 'PO'
    when 'sales_confirmation' then 'SC'
    when 'sales_contract' then 'CT'
    when 'bill_of_lading_draft' then 'BL'
    when 'shipper_letter_of_instruction' then 'SLI'
    when 'vgm_declaration' then 'VGM'
    else 'CO'
  end;
$$;

/**
 * As in 20261007000200_document_commercial_terms.sql (schema 4, 5 or 6), plus schema 7: the
 * shipment's container and VGM fields, only when it states one of them.
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

  return snapshot;
end;
$$;

/**
 * As in 20261007000100_pdf_branding.sql, with the kind list read from
 * private.document_kind_known, and a VGM declaration refused until the shipment states what
 * SOLAS VI/2 makes it declare: the container, the method, the mass and who signs.
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
  previous public.documents;
  allocated text;
  snapshot jsonb;
  created uuid;
begin
  select * into shipment from public.shipments s where s.id = target_shipment;
  if shipment.id is null or not private.is_member(shipment.org_id) then
    raise exception 'That shipment is not available.' using errcode = '42501';
  end if;
  if not private.document_kind_known(document_kind) then
    raise exception 'That document type is not available.' using errcode = 'check_violation';
  end if;

  -- Re-read under the lock: the row may have moved on while this call waited for it.
  select * into shipment from public.shipments s where s.id = target_shipment for update;

  if not exists (
    select 1 from public.shipment_items i
    where i.shipment_id = target_shipment and i.org_id = shipment.org_id
  ) then
    raise exception 'Add at least one line item before generating a document.'
      using errcode = 'check_violation';
  end if;

  if document_kind = 'vgm_declaration' and (
    shipment.container_number is null or shipment.vgm_method is null
    or shipment.vgm_kg is null or shipment.vgm_signatory is null
  ) then
    raise exception 'A VGM declaration needs the container number, weighing method, verified gross mass and signatory.'
      using errcode = 'check_violation';
  end if;

  perform 1 from public.branding_assets a where a.org_id = shipment.org_id for share;

  select * into previous from public.documents d
  where d.shipment_id = target_shipment and d.org_id = shipment.org_id
    and d.kind = document_kind and d.status = 'final'
  order by d.created_at desc, d.number desc
  limit 1;

  allocated := private.allocate_number(
    shipment.org_id, document_kind, private.document_prefix(shipment.org_id, document_kind)
  );
  snapshot := private.document_snapshot(shipment, document_kind, allocated, previous.number);

  insert into public.documents (
    org_id, shipment_id, kind, number, shipment_revision, snapshot, created_by, supersedes_id
  )
  values (
    shipment.org_id, target_shipment, document_kind, allocated, shipment.revision, snapshot,
    actor, previous.id
  )
  returning id into created;

  -- Every earlier final of this kind, not only the latest: a shipment generated before
  -- this routine superseded anything may hold several.
  update public.documents d set
    status = 'superseded',
    status_reason = 'Replaced by ' || allocated,
    status_changed_at = now(),
    status_changed_by = actor
  where d.shipment_id = target_shipment and d.org_id = shipment.org_id
    and d.kind = document_kind and d.status = 'final' and d.id <> created;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    shipment.org_id, actor, 'document.generated', 'document', created::text,
    jsonb_build_object(
      'kind', document_kind, 'number', allocated, 'supersedes', previous.number,
      'shipment_revision', shipment.revision, 'schema_version', snapshot -> 'schema_version'
    )
  );

  return created;
end;
$$;

/** As in 20261006000300_document_lineage.sql, with the kind list from document_kind_known. */
create or replace function public.preview_document(target_shipment uuid, document_kind text)
returns jsonb
  language plpgsql
  stable
  security definer
  set search_path = ''
as $$
declare
  shipment public.shipments;
  current_number text;
begin
  select * into shipment from public.shipments s where s.id = target_shipment;
  if shipment.id is null or not private.is_member(shipment.org_id) then
    raise exception 'That shipment is not available.' using errcode = '42501';
  end if;
  if not private.document_kind_known(document_kind) then
    raise exception 'That document type is not available.' using errcode = 'check_violation';
  end if;

  select d.number into current_number from public.documents d
  where d.shipment_id = target_shipment and d.org_id = shipment.org_id
    and d.kind = document_kind and d.status = 'final'
  order by d.created_at desc, d.number desc
  limit 1;

  return private.document_snapshot(shipment, document_kind, 'PREVIEW', current_number)
    || jsonb_build_object('preview', true);
end;
$$;

commit;
