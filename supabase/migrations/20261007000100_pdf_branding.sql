-- PDF branding (D-021): an organization's logo and signature or stamp image on its documents,
-- for Pro and Team only.
--
-- What changes:
--   * storage bucket org-branding: private, PNG/JPEG only, 1 MiB per object. Objects are
--     content-addressed, org/<org id>/assets/<sha-256>.<png|jpg>, and never overwritten.
--   * public.branding_assets: which stored image is the organization's current logo and
--     current signature/stamp (one row per slot), with its hash, format and pixel size.
--   * private.org_entitled / private.branding_entitled: the entitlement rule of
--     src/lib/billing/entitlements.ts (entitlementGrants) in SQL, so the database itself
--     refuses branding to an organization without a current paid plan. Fail closed: no row,
--     a revoked row, an unknown status or a lapsed paid_through all answer false.
--   * Snapshot schema 5 (renderer tradedocs-pdf/5): private.document_snapshot adds
--     `branding` (object path + SHA-256 + format + size per image) and schema_version 5, but
--     only when the organization is entitled at that moment and has at least one image.
--     Every other snapshot stays schema 4, byte for byte as before.
--   * generate_document takes a share lock on the organization's branding rows, so an image
--     cannot be removed (and its object deleted) between being recorded in a snapshot and
--     that document being committed.
--   * public.branding_asset_in_use: whether any document of the organization, in any status,
--     or either slot still refers to an image, so replacing or removing one deletes the
--     object only when nothing can need it again.
--
-- Access decisions:
--   storage.objects (bucket org-branding)
--     select   members of the organization named in the path.
--     insert   owners and admins of that organization, while it is entitled, and only under
--              a well-formed content-addressed name.
--     update   nobody: an object is immutable once written.
--     delete   owners and admins of that organization (entitled or not, so a lapsed plan
--              can still remove its images).
--     anon     nothing. The bucket is not public; images are shown through signed URLs.
--   public.branding_assets
--     select   members. insert/update owners and admins while entitled. delete owners and
--              admins.
--   branding_asset_in_use   authenticated; answers only for an organization the caller is
--                           a member of.
--
-- Rollback: re-create private.document_snapshot and public.generate_document from
-- 20261006000300_document_lineage.sql, drop public.branding_asset_in_use,
-- private.branding_entitled, private.org_entitled, private.branding_object_org, the four
-- storage policies and public.branding_assets. Leave the bucket and its objects: documents
-- generated meanwhile are schema 5 and need both their images and the schema 5 renderer.

begin;

-- ---------------------------------------------------------------------------------------
-- Entitlement, in SQL
-- ---------------------------------------------------------------------------------------

/**
 * Whether an organization holds a current, unrevoked paid plan among `plans`. The same rule
 * as entitlementGrants in src/lib/billing/entitlements.ts; tests on both sides pin it.
 */
create or replace function private.org_entitled(target_org uuid, plans text[]) returns boolean
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select coalesce((
    select e.revoked_at is null
      and e.status in ('active', 'past_due', 'cancelled')
      and e.plan = any (plans)
      and e.paid_through is not null
      and now() < e.paid_through
    from public.entitlements e
    where e.org_id = target_org
  ), false);
$$;

/** The plans of feature `pdf_branding` in src/lib/billing/plans.ts. */
create or replace function private.branding_entitled(target_org uuid) returns boolean
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select private.org_entitled(target_org, array['pro', 'team']);
$$;

-- ---------------------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('org-branding', 'org-branding', false, 1048576, array['image/png', 'image/jpeg'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

/**
 * The organization a branding object belongs to, read from its name, or null when the name
 * is not exactly org/<uuid>/assets/<sha-256>.<png|jpg>. Policies use it so a malformed name
 * is refused rather than cast.
 */
create or replace function private.branding_object_org(object_name text) returns uuid
  language sql
  immutable
  set search_path = ''
as $$
  select case
    when object_name ~ '^org/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/assets/[0-9a-f]{64}\.(png|jpg)$'
    then split_part(object_name, '/', 2)::uuid
  end;
$$;

create policy org_branding_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'org-branding'
    and private.is_member(private.branding_object_org(name))
  );

create policy org_branding_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'org-branding'
    and private.has_org_role(private.branding_object_org(name), array['owner', 'admin'])
    and private.branding_entitled(private.branding_object_org(name))
  );

create policy org_branding_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'org-branding'
    and private.has_org_role(private.branding_object_org(name), array['owner', 'admin'])
  );

-- ---------------------------------------------------------------------------------------
-- Current branding
-- ---------------------------------------------------------------------------------------

create table public.branding_assets (
  org_id uuid not null references public.organizations (id) on delete cascade,
  slot text not null check (slot in ('logo', 'signature')),
  sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
  format text not null check (format in ('png', 'jpeg')),
  object_path text not null,
  width integer not null check (width between 1 and 2000),
  height integer not null check (height between 1 and 2000),
  byte_size integer not null check (byte_size between 1 and 1048576),
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (org_id, slot),
  -- The row can only point at this organization's own content-addressed object.
  check (
    object_path = 'org/' || org_id::text || '/assets/' || sha256
      || case format when 'png' then '.png' else '.jpg' end
  )
);

create trigger branding_assets_touch_updated_at before update on public.branding_assets
  for each row execute function private.touch_updated_at();

alter table public.branding_assets enable row level security;
revoke all on public.branding_assets from public, anon, authenticated;

create policy branding_assets_read on public.branding_assets
  for select to authenticated using (private.is_member(org_id));
create policy branding_assets_insert on public.branding_assets
  for insert to authenticated
  with check (
    private.has_org_role(org_id, array['owner', 'admin']) and private.branding_entitled(org_id)
  );
create policy branding_assets_update on public.branding_assets
  for update to authenticated
  using (private.has_org_role(org_id, array['owner', 'admin']))
  with check (
    private.has_org_role(org_id, array['owner', 'admin']) and private.branding_entitled(org_id)
  );
create policy branding_assets_delete on public.branding_assets
  for delete to authenticated using (private.has_org_role(org_id, array['owner', 'admin']));

grant select, insert, update, delete on public.branding_assets to authenticated;

/**
 * Whether an image is still needed: by either slot, or by any document of the organization
 * whatever its status (a superseded or voided document is still downloadable). Answers
 * true, so nothing is deleted, for an organization the caller is not a member of.
 */
create or replace function public.branding_asset_in_use(target_org uuid, asset_sha256 text)
returns boolean
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select not private.is_member(target_org)
    or exists (
      select 1 from public.branding_assets a
      where a.org_id = target_org and a.sha256 = asset_sha256
    )
    or exists (
      select 1 from public.documents d
      where d.org_id = target_org
        and (
          d.snapshot -> 'branding' -> 'logo' ->> 'sha256' = asset_sha256
          or d.snapshot -> 'branding' -> 'signature' ->> 'sha256' = asset_sha256
        )
    );
$$;

revoke execute on function public.branding_asset_in_use(uuid, text) from public, anon;
grant execute on function public.branding_asset_in_use(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------------------
-- Snapshot schema 5
-- ---------------------------------------------------------------------------------------

/**
 * Schema 4 as before; schema 5 with `branding` when the organization is entitled to PDF
 * branding right now and has an image. Shared by generation and preview, so a preview shows
 * exactly the branding the document would be issued with.
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

  return snapshot;
end;
$$;

/**
 * As in 20261006000300_document_lineage.sql, plus a share lock on the organization's
 * branding rows before the snapshot is taken. Removing or replacing an image updates those
 * rows, so it waits for this transaction; by the time it checks whether the old image is
 * still referenced, this document is committed and counted.
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

commit;
