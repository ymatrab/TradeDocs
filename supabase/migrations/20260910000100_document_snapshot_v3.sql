-- Workspace documents follow snapshot schema 3.
--
-- The renderer (tradedocs-pdf/3) and the free tool moved to schema 3: an invoice prints a
-- per-line Origin column when its lines state one, a net or gross weight total that no line
-- states is omitted instead of printed as zero, and the terms caption reads
-- "Incoterms® 2020". The renderer applies each change only from the schema that introduced
-- it, so the workspace kept issuing schema 2 documents until this routine changed.
--
-- Snapshot changes from schema 2:
--   * schema_version is 3.
--   * totals.net_weight_kg and totals.gross_weight_kg are null when no line states one
--     (sum() over nulls), where schema 2 coalesced them to zero.
--   * items[].country_of_origin was already carried; schema 3 is what lets the renderer
--     print it per line.
-- packing_totals keep their schema 2 shape: the renderer reads them as non-null figures and
-- prefers them only when packages were described.
--
-- Existing documents are not touched. Their snapshots keep the schema_version they were
-- issued with and re-render byte-identically; freeze_document refuses any rewrite.
--
-- Every lookup stays scoped to the shipment's organization exactly as in
-- 20260909000100_tenant_integrity.sql; only the snapshot's version and the two weight
-- totals differ from that definition.
--
-- Rollback: re-run the generate_document definition from 20260909000100_tenant_integrity.sql.
-- Documents generated meanwhile stay schema 3 and keep rendering as issued.

begin;

/**
 * Regenerated to stamp schema 3: weight totals are stated-or-absent rather than zero.
 * Every lookup remains scoped to the shipment's organization.
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
    'schema_version', 3,
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
        -- Null when no line states one (schema 3): a total of zero would be a false figure.
        'net_weight_kg', sum(i.net_weight_kg),
        'gross_weight_kg', sum(i.gross_weight_kg),
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

revoke execute on function public.generate_document(uuid, text) from public, anon;
grant execute on function public.generate_document(uuid, text) to authenticated;

commit;
