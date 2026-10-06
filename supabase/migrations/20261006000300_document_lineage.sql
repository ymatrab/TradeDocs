-- Document lineage, voiding, organization document settings and snapshot schema 4.
--
-- Defects this fixes (docs/delivery/product-review-2026-10-06.md):
--   * Re-generating a document left the earlier revision "final", so a shipment could hold
--     two current commercial invoices and the ZIP set bundled both.
--   * Any member could void a document by a direct UPDATE, with no reason and no audit row.
--   * Packing totals summed per-package weights without multiplying by the package count,
--     while volume was multiplied: a row of 10 cartons at 12 kg reported 12 kg.
--   * Party snapshots copied the whole company row, internal notes included.
--   * Documents could not state the issuer's payment terms, bank details or signatory.
--
-- What changes:
--   * public.organization_settings: default currency, number prefix, payment terms, bank
--     details, signatory and a document note. Members read; owners and admins write.
--   * documents gain supersedes_id (lineage), status_reason, status_changed_at/_by.
--     freeze_document keeps lineage immutable and lets the status fields move only with a
--     status transition.
--   * Direct UPDATE on documents is revoked. Voiding goes through public.void_document
--     (owner/admin, reason required, audited); superseding happens inside generate_document.
--   * generate_document locks the shipment row, so the snapshot and the revision it records
--     are taken from one consistent state and concurrent generations of the same kind
--     serialise; it supersedes the previous final of that kind and records the lineage.
--   * Snapshot schema 4 (renderer tradedocs-pdf/4): `supersedes` (the number replaced),
--     `issuer` (settings above), per-package row totals and count-weighted packing totals,
--     and party blocks without internal notes or timestamps.
--   * public.preview_document returns the snapshot a document would be generated with now,
--     without allocating a number. The workspace uses it for previews and to state why a
--     document is stale.
--
-- Existing documents are untouched: their snapshots keep their schema version and render
-- exactly as issued.
--
-- Rollback: re-create generate_document and freeze_document from
-- 20261006000100/20260910000100 and 20260909000100, drop void_document, preview_document and
-- private.document_snapshot, re-create policy documents_void and grant update on documents
-- to authenticated, then drop the four new documents columns and organization_settings.
-- Documents generated meanwhile stay schema 4; the schema 4 renderer must stay deployed.

begin;

-- ---------------------------------------------------------------------------------------
-- Organization document settings
-- ---------------------------------------------------------------------------------------

create table public.organization_settings (
  org_id uuid primary key references public.organizations (id) on delete cascade,
  default_currency text not null default 'EUR' check (default_currency ~ '^[A-Z]{3}$'),
  -- Prepended to every number, e.g. ACME-CI-2026-0001. Capitals and digits only, so a
  -- number stays safe in a file name and unambiguous when read aloud.
  number_prefix text check (number_prefix ~ '^[A-Z0-9]{1,10}$'),
  payment_terms text check (char_length(payment_terms) <= 500),
  bank_details text check (char_length(bank_details) <= 1000),
  signatory_name text check (char_length(signatory_name) <= 120),
  signatory_title text check (char_length(signatory_title) <= 120),
  document_notes text check (char_length(document_notes) <= 1000),
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger organization_settings_touch_updated_at before update on public.organization_settings
  for each row execute function private.touch_updated_at();

alter table public.organization_settings enable row level security;
revoke all on public.organization_settings from anon, authenticated;

create policy organization_settings_read on public.organization_settings
  for select to authenticated using (private.is_member(org_id));
create policy organization_settings_insert on public.organization_settings
  for insert to authenticated with check (private.has_org_role(org_id, array['owner', 'admin']));
create policy organization_settings_update on public.organization_settings
  for update to authenticated
  using (private.has_org_role(org_id, array['owner', 'admin']))
  with check (private.has_org_role(org_id, array['owner', 'admin']));

grant select, insert, update on public.organization_settings to authenticated;

-- ---------------------------------------------------------------------------------------
-- Document lineage and status provenance
-- ---------------------------------------------------------------------------------------

alter table public.documents add constraint documents_org_id_id_key unique (org_id, id);
alter table public.documents
  add column supersedes_id uuid,
  add column status_reason text check (char_length(status_reason) <= 500),
  add column status_changed_at timestamptz,
  add column status_changed_by uuid references auth.users (id) on delete set null;
alter table public.documents
  add constraint documents_supersedes_id_fkey foreign key (org_id, supersedes_id)
    references public.documents (org_id, id) on delete no action;
create index documents_shipment_kind_status_idx on public.documents (shipment_id, kind, status);
create index documents_supersedes_idx on public.documents (supersedes_id);

/**
 * Immutability, with lineage. Content, ownership and lineage never change; the status may
 * only move from final to superseded or voided, and the reason/when/who of a status may only
 * be written together with that move.
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
    or new.supersedes_id is distinct from old.supersedes_id
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

  if new.status is not distinct from old.status
    and (
      new.status_reason is distinct from old.status_reason
      or new.status_changed_at is distinct from old.status_changed_at
      or (new.status_changed_by is distinct from old.status_changed_by
          and new.status_changed_by is not null)
    )
  then
    raise exception 'A status reason can only be recorded with a status change.'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

-- Status changes now go through routines that record a reason and an audit row.
drop policy documents_void on public.documents;
revoke update on public.documents from authenticated;

-- ---------------------------------------------------------------------------------------
-- Snapshot schema 4
-- ---------------------------------------------------------------------------------------

/**
 * The printed fields of a party. The company row also holds internal notes and bookkeeping
 * timestamps, which have no business inside a document sent to a counterparty.
 */
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
  )
  from public.companies c
  where c.id = target_company and c.org_id = target_org;
$$;

/**
 * Builds the schema 4 snapshot of a shipment as it stands now. One definition shared by
 * generation and preview, so a preview cannot differ from the document it previews.
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

  return snapshot;
end;
$$;

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
    else 'CO'
  end;
$$;

/**
 * Finalizes a document: an immutable schema 4 snapshot under a newly allocated number.
 *
 * The shipment row is locked first. Every edit to a shipment, its lines or its packing
 * advances the shipment's revision, which needs that row, so the snapshot and the revision
 * it records cannot come from two different states; and two generations of the same kind
 * cannot both believe they replace the same predecessor.
 *
 * The previous final document of the same kind is superseded, and the new one records it.
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
  if document_kind is null or document_kind not in (
    'commercial_invoice', 'proforma_invoice', 'packing_list', 'delivery_note',
    'certificate_of_origin'
  ) then
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
      'shipment_revision', shipment.revision
    )
  );

  return created;
end;
$$;

/**
 * The snapshot a document of this kind would be generated with right now, under the
 * placeholder number PREVIEW. Nothing is allocated or stored.
 */
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
  if document_kind is null or document_kind not in (
    'commercial_invoice', 'proforma_invoice', 'packing_list', 'delivery_note',
    'certificate_of_origin'
  ) then
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

/**
 * Voids a final document. An issuer decision, so owners and administrators only, and it
 * must say why: the reason is shown beside the document and kept in the audit trail.
 */
create or replace function public.void_document(target_document uuid, reason text)
returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  document public.documents;
  clean_reason text := btrim(coalesce(reason, ''));
begin
  select * into document from public.documents d where d.id = target_document for update;
  if document.id is null or not private.is_member(document.org_id) then
    raise exception 'That document is not available.' using errcode = '42501';
  end if;
  if not private.has_org_role(document.org_id, array['owner', 'admin']) then
    raise exception 'Only an owner or administrator can void a document.'
      using errcode = '42501';
  end if;
  if char_length(clean_reason) not between 3 and 500 then
    raise exception 'Give a reason of 3 to 500 characters.' using errcode = 'check_violation';
  end if;
  if document.status <> 'final' then
    raise exception 'Only a final document can be voided.' using errcode = 'check_violation';
  end if;

  update public.documents d set
    status = 'voided',
    status_reason = clean_reason,
    status_changed_at = now(),
    status_changed_by = actor
  where d.id = target_document;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    document.org_id, actor, 'document.voided', 'document', document.id::text,
    jsonb_build_object('kind', document.kind, 'number', document.number)
  );
end;
$$;

do $$
declare routine text;
begin
  foreach routine in array array[
    'public.generate_document(uuid, text)',
    'public.preview_document(uuid, text)',
    'public.void_document(uuid, text)'
  ] loop
    execute format('revoke execute on function %s from public, anon', routine);
    execute format('grant execute on function %s to authenticated', routine);
  end loop;
  foreach routine in array array[
    'private.party_snapshot(uuid, uuid)',
    'private.document_snapshot(public.shipments, text, text, text)',
    'private.document_prefix(uuid, text)'
  ] loop
    execute format('revoke execute on function %s from public, anon, authenticated', routine);
  end loop;
end;
$$;

commit;
