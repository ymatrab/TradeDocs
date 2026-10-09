-- E-signature through Dropbox Sign (D-025): a finalized document sent to signers, the
-- provider's request and signer status, and the signed PDF kept as a new linked artifact.
--
-- What changes:
--   * public.esign_requests: one row per request sent for a finalized document. It records
--     the exact bytes sent (original_sha256), the provider request id, whether it was a
--     test request, the overall status, each signer's status, and, once complete, the signed
--     PDF stored as a separate object (signed_*). The original document row is never touched:
--     documents stay immutable and the signed copy points back at it (lineage).
--   * private.esign_events: the ledger of callback events already applied, so a redelivered
--     or replayed event changes nothing.
--   * storage bucket esign-signed: private, PDF only, 25 MiB per object. Objects are named
--     org/<org id>/esign/<request id>/<sha-256>.pdf and written only by the service role.
--   * Routines executable by service_role only: esign_create_request, esign_mark_sent,
--     esign_mark_failed, esign_event_recorded, esign_apply_event, esign_attach_signed and
--     esign_record_download. Each writes its own audit event.
--
-- Access decisions:
--   public.esign_requests   members of the organization read; no API role writes directly
--                           (service_role reads, and writes only through the routines).
--   private.esign_events    no API role can reach it.
--   storage.objects (bucket esign-signed)
--     select   members of the organization named in the path (for short-lived signed URLs).
--     insert/update/delete   nobody but the service role (which bypasses policies).
--     anon     nothing.
--   esign_* routines        service_role only.
--
-- Paid gate in SQL: esign_create_request refuses an organization without a current Pro or
-- Team entitlement (private.org_entitled, the rule of src/lib/billing/entitlements.ts).
--
-- Rollback: drop the seven routines, the storage policy esign_signed_select, the table
-- public.esign_requests and private.esign_events. Leave the bucket and its objects: signed
-- copies are customer records; delete them only under the retention policy.

begin;

-- ---------------------------------------------------------------------------------------
-- Requests
-- ---------------------------------------------------------------------------------------

create table public.esign_requests (
  id uuid primary key default extensions.gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  document_id uuid not null,
  -- Copied for display and lineage; the document's own number never changes.
  document_number text not null check (char_length(document_number) between 1 and 60),
  -- SHA-256 of the exact PDF bytes sent for signature.
  original_sha256 text not null check (original_sha256 ~ '^[0-9a-f]{64}$'),
  provider text not null default 'dropbox_sign' check (provider = 'dropbox_sign'),
  provider_request_id text unique check (provider_request_id ~ '^[A-Za-z0-9]{10,64}$'),
  -- A test request is not legally binding. Every non-production deployment sends test only.
  test_mode boolean not null,
  status text not null default 'sending' check (
    status in ('sending', 'sent', 'signed', 'declined', 'cancelled', 'expired', 'error', 'failed')
  ),
  -- [{ "email": ..., "name": ..., "status": ..., "signed_at": ... }], 1 to 5 signers.
  signers jsonb not null check (
    jsonb_typeof(signers) = 'array'
    and jsonb_array_length(signers) between 1 and 5
    and octet_length(signers::text) <= 8000
  ),
  message text check (char_length(message) <= 2000),
  failure_reason text check (char_length(failure_reason) <= 100),
  last_event_type text check (char_length(last_event_type) <= 100),
  last_event_at timestamptz,
  -- The signed copy: a new artifact, written once.
  signed_object_path text,
  signed_sha256 text check (signed_sha256 ~ '^[0-9a-f]{64}$'),
  signed_byte_size integer check (signed_byte_size between 1 and 26214400),
  signed_stored_at timestamptz,
  requested_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (org_id, document_id) references public.documents (org_id, id) on delete cascade,
  check (
    (signed_object_path is null and signed_sha256 is null and signed_byte_size is null
      and signed_stored_at is null)
    or (signed_object_path is not null and signed_sha256 is not null
      and signed_byte_size is not null and signed_stored_at is not null)
  ),
  check (
    signed_object_path is null
    or signed_object_path = 'org/' || org_id::text || '/esign/' || id::text || '/'
      || signed_sha256 || '.pdf'
  )
);

create index esign_requests_org_created_idx on public.esign_requests (org_id, created_at desc);
create index esign_requests_document_idx on public.esign_requests (document_id, created_at desc);

create trigger esign_requests_touch_updated_at before update on public.esign_requests
  for each row execute function private.touch_updated_at();

/**
 * What a request is never allowed to change: its organization, document, the bytes it sent,
 * its mode and requester. The provider id and the signed copy are written once. A request
 * that reached an end state (signed, declined, cancelled, expired) stays there.
 */
create or replace function private.freeze_esign_request() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
begin
  if new.org_id is distinct from old.org_id
    or new.document_id is distinct from old.document_id
    or new.document_number is distinct from old.document_number
    or new.original_sha256 is distinct from old.original_sha256
    or new.provider is distinct from old.provider
    or new.test_mode is distinct from old.test_mode
    or new.created_at is distinct from old.created_at
    or (new.requested_by is distinct from old.requested_by and new.requested_by is not null)
    or (old.provider_request_id is not null
        and new.provider_request_id is distinct from old.provider_request_id)
    or (old.signed_object_path is not null and (
        new.signed_object_path is distinct from old.signed_object_path
        or new.signed_sha256 is distinct from old.signed_sha256
        or new.signed_byte_size is distinct from old.signed_byte_size
        or new.signed_stored_at is distinct from old.signed_stored_at))
  then
    raise exception 'A signature request cannot be rewritten.' using errcode = 'check_violation';
  end if;
  if old.status in ('signed', 'declined', 'cancelled', 'expired')
    and new.status is distinct from old.status
  then
    raise exception 'A finished signature request keeps its status.'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger esign_requests_are_frozen before update on public.esign_requests
  for each row execute function private.freeze_esign_request();

create table private.esign_events (
  event_key text primary key check (event_key ~ '^[0-9a-f]{64}$'),
  event_type text not null check (char_length(event_type) between 1 and 100),
  request_id uuid,
  outcome text not null check (outcome in ('applied', 'ignored', 'unmatched')),
  received_at timestamptz not null default now()
);
create index esign_events_received_idx on private.esign_events (received_at);

alter table public.esign_requests enable row level security;
alter table private.esign_events enable row level security;
revoke all on public.esign_requests from public, anon, authenticated, service_role;
revoke all on private.esign_events from public, anon, authenticated, service_role;

create policy esign_requests_select_member on public.esign_requests
  for select to authenticated
  using (private.is_member(org_id));

grant select on public.esign_requests to authenticated;
grant select on public.esign_requests to service_role;

-- ---------------------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('esign-signed', 'esign-signed', false, 26214400, array['application/pdf'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

/** The organization a signed copy belongs to, or null when the name is not well formed. */
create or replace function private.esign_object_org(object_name text) returns uuid
  language sql
  immutable
  set search_path = ''
as $$
  select case
    when object_name ~ '^org/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/esign/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{64}\.pdf$'
    then split_part(object_name, '/', 2)::uuid
  end;
$$;

create policy esign_signed_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'esign-signed'
    and private.is_member(private.esign_object_org(name))
  );

-- ---------------------------------------------------------------------------------------
-- Routines (service_role only)
-- ---------------------------------------------------------------------------------------

/**
 * Records a request about to be sent. The caller (the server action) has already checked
 * the session; this checks everything again from the data: the actor is a member, the
 * organization holds Pro or Team now, and the document is final, not a preview, and still
 * matches its shipment's current revision.
 */
create or replace function public.esign_create_request(
  p_org uuid,
  p_document uuid,
  p_actor uuid,
  p_signers jsonb,
  p_message text,
  p_test_mode boolean,
  p_original_sha256 text
)
returns uuid
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  document public.documents;
  current_revision integer;
  created uuid;
begin
  if not exists (
    select 1 from public.memberships m where m.org_id = p_org and m.user_id = p_actor
  ) then
    raise exception 'That document is not available.' using errcode = '42501';
  end if;
  if not private.org_entitled(p_org, array['pro', 'team']) then
    raise exception 'E-signature is part of Pro and Team.' using errcode = '42501';
  end if;

  select * into document from public.documents d
  where d.id = p_document and d.org_id = p_org;
  if document.id is null then
    raise exception 'That document is not available.' using errcode = '42501';
  end if;
  if document.status <> 'final' or document.snapshot ? 'preview' then
    raise exception 'Only a final document can be sent for signature.'
      using errcode = 'check_violation';
  end if;
  select s.revision into current_revision from public.shipments s
  where s.id = document.shipment_id and s.org_id = p_org;
  if current_revision is distinct from document.shipment_revision then
    raise exception 'The shipment changed after this document was generated. Regenerate it first.'
      using errcode = 'check_violation';
  end if;

  insert into public.esign_requests (
    org_id, document_id, document_number, original_sha256, test_mode, signers, message,
    requested_by
  )
  values (
    p_org, p_document, document.number, p_original_sha256, p_test_mode, p_signers,
    nullif(btrim(coalesce(p_message, '')), ''), p_actor
  )
  returning id into created;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    p_org, p_actor, 'esign.requested', 'esign_request', created::text,
    jsonb_build_object(
      'document_id', p_document, 'number', document.number, 'provider', 'dropbox_sign',
      'signers', jsonb_array_length(p_signers), 'test_mode', p_test_mode,
      'original_sha256', p_original_sha256
    )
  );
  return created;
end;
$$;

/** The provider accepted the request. Idempotent for the same provider id. */
create or replace function public.esign_mark_sent(
  p_request uuid,
  p_provider_request_id text,
  p_signers jsonb
)
returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  request public.esign_requests;
begin
  select * into request from public.esign_requests r where r.id = p_request for update;
  if request.id is null then
    raise exception 'Unknown signature request.' using errcode = 'no_data_found';
  end if;
  if request.provider_request_id is not distinct from p_provider_request_id
    and request.status <> 'sending'
  then
    return;
  end if;

  update public.esign_requests r set
    provider_request_id = p_provider_request_id,
    status = case when r.status in ('sending', 'failed') then 'sent' else r.status end,
    signers = coalesce(nullif(p_signers, '[]'::jsonb), r.signers),
    failure_reason = null
  where r.id = p_request;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    request.org_id, request.requested_by, 'esign.sent', 'esign_request', request.id::text,
    jsonb_build_object('number', request.document_number, 'test_mode', request.test_mode)
  );
end;
$$;

/** Sending failed before the provider confirmed anything. */
create or replace function public.esign_mark_failed(p_request uuid, p_reason text)
returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  request public.esign_requests;
begin
  select * into request from public.esign_requests r where r.id = p_request for update;
  if request.id is null or request.status <> 'sending' then
    return;
  end if;
  update public.esign_requests r set
    status = 'failed',
    failure_reason = left(coalesce(p_reason, 'unknown'), 100)
  where r.id = p_request;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    request.org_id, request.requested_by, 'esign.failed', 'esign_request', request.id::text,
    jsonb_build_object('number', request.document_number, 'reason', left(coalesce(p_reason, 'unknown'), 100))
  );
end;
$$;

/** Whether a callback event was applied before. */
create or replace function public.esign_event_recorded(p_event_key text)
returns boolean
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select exists (select 1 from private.esign_events e where e.event_key = p_event_key);
$$;

/**
 * Applies the provider's live state after a verified callback, in one transaction with the
 * ledger entry. A redelivered event answers 'duplicate'. An end state is never left; a later
 * event for a finished request is recorded and changes nothing. A request whose provider id
 * was never recorded (the send succeeded but the confirming write failed) is matched by its
 * own id, which the provider returns in the request metadata.
 */
create or replace function public.esign_apply_event(
  p_event_key text,
  p_event_type text,
  p_request uuid,
  p_provider_request_id text,
  p_status text,
  p_signers jsonb
)
returns text
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  request public.esign_requests;
  outcome text := 'applied';
begin
  if p_status not in ('sent', 'signed', 'declined', 'cancelled', 'expired', 'error') then
    raise exception 'Unknown signature status.' using errcode = 'check_violation';
  end if;

  select * into request from public.esign_requests r where r.id = p_request for update;
  if request.id is null
    or (request.provider_request_id is not null
        and request.provider_request_id <> p_provider_request_id)
  then
    insert into private.esign_events (event_key, event_type, request_id, outcome)
    values (p_event_key, p_event_type, null, 'unmatched')
    on conflict (event_key) do nothing;
    return 'unmatched';
  end if;

  insert into private.esign_events (event_key, event_type, request_id, outcome)
  values (p_event_key, p_event_type, request.id,
          case when request.status in ('signed', 'declined', 'cancelled', 'expired')
               then 'ignored' else 'applied' end)
  on conflict (event_key) do nothing;
  if not found then
    return 'duplicate';
  end if;

  if request.status in ('signed', 'declined', 'cancelled', 'expired') then
    outcome := 'ignored';
    update public.esign_requests r set
      last_event_type = p_event_type,
      last_event_at = now()
    where r.id = request.id;
    return outcome;
  end if;

  update public.esign_requests r set
    provider_request_id = coalesce(r.provider_request_id, p_provider_request_id),
    status = p_status,
    signers = coalesce(nullif(p_signers, '[]'::jsonb), r.signers),
    failure_reason = null,
    last_event_type = p_event_type,
    last_event_at = now()
  where r.id = request.id;

  if p_status is distinct from request.status then
    insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
    values (
      request.org_id, null, 'esign.status_changed', 'esign_request', request.id::text,
      jsonb_build_object(
        'number', request.document_number, 'from', request.status, 'to', p_status,
        'event_type', p_event_type
      )
    );
  end if;
  return outcome;
end;
$$;

/**
 * Records the signed copy, a new artifact linked to the original document. Written once:
 * a second call with the same hash answers 'already', a different one is refused.
 */
create or replace function public.esign_attach_signed(
  p_request uuid,
  p_object_path text,
  p_sha256 text,
  p_byte_size integer
)
returns text
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  request public.esign_requests;
begin
  select * into request from public.esign_requests r where r.id = p_request for update;
  if request.id is null then
    raise exception 'Unknown signature request.' using errcode = 'no_data_found';
  end if;
  if request.signed_object_path is not null then
    if request.signed_sha256 = p_sha256 then
      return 'already';
    end if;
    raise exception 'A signed copy is already stored for this request.'
      using errcode = 'check_violation';
  end if;
  if request.status <> 'signed' then
    raise exception 'Only a completed request has a signed copy.'
      using errcode = 'check_violation';
  end if;

  update public.esign_requests r set
    signed_object_path = p_object_path,
    signed_sha256 = p_sha256,
    signed_byte_size = p_byte_size,
    signed_stored_at = now()
  where r.id = p_request;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    request.org_id, null, 'esign.signed_stored', 'esign_request', request.id::text,
    jsonb_build_object(
      'document_id', request.document_id, 'number', request.document_number,
      'original_sha256', request.original_sha256, 'signed_sha256', p_sha256,
      'byte_size', p_byte_size, 'test_mode', request.test_mode
    )
  );
  return 'stored';
end;
$$;

/** A member downloaded the signed copy. */
create or replace function public.esign_record_download(p_request uuid, p_actor uuid)
returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  request public.esign_requests;
begin
  select * into request from public.esign_requests r where r.id = p_request;
  if request.id is null or not exists (
    select 1 from public.memberships m where m.org_id = request.org_id and m.user_id = p_actor
  ) then
    raise exception 'That signed copy is not available.' using errcode = '42501';
  end if;
  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    request.org_id, p_actor, 'esign.signed_downloaded', 'esign_request', request.id::text,
    jsonb_build_object('number', request.document_number, 'signed_sha256', request.signed_sha256)
  );
end;
$$;

do $$
declare routine text;
begin
  foreach routine in array array[
    'public.esign_create_request(uuid, uuid, uuid, jsonb, text, boolean, text)',
    'public.esign_mark_sent(uuid, text, jsonb)',
    'public.esign_mark_failed(uuid, text)',
    'public.esign_event_recorded(text)',
    'public.esign_apply_event(text, text, uuid, text, text, jsonb)',
    'public.esign_attach_signed(uuid, text, text, integer)',
    'public.esign_record_download(uuid, uuid)'
  ] loop
    execute format('revoke execute on function %s from public, anon, authenticated', routine);
    execute format('grant execute on function %s to service_role', routine);
  end loop;
  execute 'revoke execute on function private.freeze_esign_request() from public, anon, authenticated';
end;
$$;

commit;
