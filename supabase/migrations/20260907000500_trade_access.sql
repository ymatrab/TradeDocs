-- Trade core access, numbering and document generation.

begin;

create policy companies_read on public.companies
  for select to authenticated using (private.is_member(org_id));
create policy companies_write on public.companies
  for insert to authenticated with check (private.is_member(org_id));
create policy companies_update on public.companies
  for update to authenticated using (private.is_member(org_id)) with check (private.is_member(org_id));
create policy companies_delete on public.companies
  for delete to authenticated using (private.has_org_role(org_id, array['owner', 'admin']));

create policy shipments_read on public.shipments
  for select to authenticated using (private.is_member(org_id));
create policy shipments_write on public.shipments
  for insert to authenticated with check (private.is_member(org_id));
create policy shipments_update on public.shipments
  for update to authenticated using (private.is_member(org_id)) with check (private.is_member(org_id));
create policy shipments_delete on public.shipments
  for delete to authenticated using (private.has_org_role(org_id, array['owner', 'admin']));

create policy shipment_items_read on public.shipment_items
  for select to authenticated using (private.is_member(org_id));
create policy shipment_items_write on public.shipment_items
  for insert to authenticated with check (private.is_member(org_id));
create policy shipment_items_update on public.shipment_items
  for update to authenticated using (private.is_member(org_id)) with check (private.is_member(org_id));
create policy shipment_items_delete on public.shipment_items
  for delete to authenticated using (private.is_member(org_id));

create policy documents_read on public.documents
  for select to authenticated using (private.is_member(org_id));
-- Documents are never written directly: generate_document composes the snapshot and
-- allocates the number in one transaction. Only voiding is a direct update.
create policy documents_void on public.documents
  for update to authenticated using (private.is_member(org_id)) with check (private.is_member(org_id));

grant select, insert, update, delete on public.companies to authenticated;
grant select, insert, update, delete on public.shipments to authenticated;
grant select, insert, update, delete on public.shipment_items to authenticated;
grant select, update on public.documents to authenticated;

/**
 * Allocates the next number in an organization's sequence for a scope and period.
 * The upsert is a single statement, so two concurrent callers serialise on the row and
 * cannot receive the same number.
 */
create or replace function private.allocate_number(target_org uuid, target_scope text, prefix text)
returns text
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  period text := to_char(now(), 'YYYY');
  allocated integer;
begin
  insert into public.numbering_sequences (org_id, scope, period, next_value)
  values (target_org, target_scope, period, 2)
  on conflict (org_id, scope, period)
    do update set next_value = public.numbering_sequences.next_value + 1
  returning case when xmax = 0 then 1 else public.numbering_sequences.next_value - 1 end
  into allocated;

  return prefix || '-' || period || '-' || lpad(allocated::text, 4, '0');
end;
$$;

/**
 * Renders a document from the shipment as it stands right now and stores the result as an
 * immutable snapshot. Totals are computed here, in the database, from the same rows every
 * document type reads, which is what makes two documents in a set unable to disagree.
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
    'totals', (
      select jsonb_build_object(
        'quantity', coalesce(sum(i.quantity), 0),
        'net_weight_kg', coalesce(sum(i.net_weight_kg), 0),
        'gross_weight_kg', coalesce(sum(i.gross_weight_kg), 0),
        'packages', coalesce(sum(i.package_count), 0),
        'value', coalesce(sum(round(i.quantity * i.unit_price, 2)), 0)
      )
      from public.shipment_items i where i.shipment_id = target_shipment
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
  foreach routine in array array['public.generate_document(uuid, text)'] loop
    execute format('revoke execute on function %s from public, anon', routine);
    execute format('grant execute on function %s to authenticated', routine);
  end loop;
end;
$$;

commit;
