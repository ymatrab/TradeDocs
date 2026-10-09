-- Public REST API v1 (D-025): organization API keys and the routines /api/v1 runs through.
--
-- What changes:
--   * public.api_keys: one row per key. The key itself is never stored: only its
--     HMAC-SHA-256 under the server pepper (API_KEY_PEPPER), computed by the application, and
--     a short visible prefix ("tdk_" + 8 characters) so people can tell keys apart.
--   * public.api_idempotency: the stored response of a POST made with an Idempotency-Key, per
--     key, kept 24 hours, so a retried request is answered from the record instead of being
--     executed twice.
--   * private.api_entitled: the plans of feature `api` in src/lib/billing/plans.ts (Team).
--   * create_api_key / revoke_api_key: owners and administrators, audited.
--   * api_authenticate and the api_* operation routines: service_role only. Each one resolves
--     the key from its hash itself, so the organization a request acts on always comes from
--     the database, never from the request.
--
-- Who a key acts as. A key belongs to an organization and is created by one of its owners or
-- administrators. It works only while that person is still an owner or administrator of the
-- organization and the organization is entitled to the API; removing or demoting the creator
-- turns their keys off. Generation reuses public.generate_document unchanged: the wrapper
-- sets the transaction's JWT subject to the creator, so the routine's own membership check,
-- numbering, snapshot and audit run exactly as they do in the app, with the creator as actor.
--
-- Access decisions:
--   public.api_keys
--     select    owners and admins of the organization, every column except key_hash
--               (column grant). Members, other organizations and anon: nothing.
--     insert/update/delete   nobody directly; create_api_key and revoke_api_key only.
--   public.api_idempotency   nobody but the definer routines (no grants at all).
--   create_api_key, revoke_api_key   authenticated; the routines check the role.
--   api_authenticate, api_list_shipments, api_get_shipment, api_create_shipment,
--   api_list_documents, api_get_document, api_generate_document   service_role only.
--
-- Rollback: drop the routines below, then public.api_idempotency and public.api_keys. No
-- existing table or routine is changed, so nothing else needs restoring. Audit rows written
-- with action api_key.* stay (they are evidence).

begin;

-- ---------------------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------------------

create table public.api_keys (
  id uuid primary key default extensions.gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  prefix text not null check (prefix ~ '^tdk_[A-Za-z0-9]{8}$'),
  key_hash text not null unique check (key_hash ~ '^[0-9a-f]{64}$'),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at timestamptz,
  revoked_by uuid references auth.users (id) on delete set null
);
create index api_keys_org_created_idx on public.api_keys (org_id, created_at desc);

alter table public.api_keys enable row level security;
revoke all on public.api_keys from public, anon, authenticated;

create policy api_keys_read on public.api_keys
  for select to authenticated using (private.has_org_role(org_id, array['owner', 'admin']));

-- Column grant: the hash never reaches a client, not even an owner's.
grant select (id, org_id, name, prefix, created_by, created_at, last_used_at, revoked_at, revoked_by)
  on public.api_keys to authenticated;

create table public.api_idempotency (
  key_id uuid not null references public.api_keys (id) on delete cascade,
  idempotency_key text not null check (idempotency_key ~ '^[A-Za-z0-9._:-]{1,255}$'),
  request_hash text not null check (request_hash ~ '^[0-9a-f]{64}$'),
  response jsonb,
  created_at timestamptz not null default now(),
  primary key (key_id, idempotency_key)
);

alter table public.api_idempotency enable row level security;
revoke all on public.api_idempotency from public, anon, authenticated, service_role;

-- ---------------------------------------------------------------------------------------
-- Entitlement
-- ---------------------------------------------------------------------------------------

/** The plans of feature `api` in src/lib/billing/plans.ts. */
create or replace function private.api_entitled(target_org uuid) returns boolean
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select private.org_entitled(target_org, array['team']);
$$;

-- ---------------------------------------------------------------------------------------
-- Managing keys (signed-in owners and administrators)
-- ---------------------------------------------------------------------------------------

/**
 * Records a new key. The application generates the key, shows it once and sends only its
 * hash and prefix. At most 20 active keys per organization.
 */
create or replace function public.create_api_key(
  target_org uuid,
  key_name text,
  key_prefix text,
  key_hash text
) returns uuid
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  created uuid;
begin
  if actor is null or not private.has_org_role(target_org, array['owner', 'admin']) then
    raise exception 'Only an owner or administrator can manage API keys.' using errcode = '42501';
  end if;
  if not private.api_entitled(target_org) then
    raise exception 'API access is part of the Team plan.' using errcode = '42501';
  end if;
  if (
    select count(*) from public.api_keys k where k.org_id = target_org and k.revoked_at is null
  ) >= 20 then
    raise exception 'An organization can hold at most 20 active API keys.'
      using errcode = 'check_violation';
  end if;

  insert into public.api_keys (org_id, name, prefix, key_hash, created_by)
  values (target_org, btrim(key_name), key_prefix, key_hash, actor)
  returning id into created;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    target_org, actor, 'api_key.created', 'api_key', created::text,
    jsonb_build_object('name', btrim(key_name), 'prefix', key_prefix)
  );
  return created;
end;
$$;

/** Revokes a key at once. Needs no plan, so a lapsed organization can still turn keys off. */
create or replace function public.revoke_api_key(target_key uuid) returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  principal public.api_keys;
begin
  select * into principal from public.api_keys k where k.id = target_key;
  if principal.id is null or actor is null
    or not private.has_org_role(principal.org_id, array['owner', 'admin']) then
    raise exception 'Only an owner or administrator can manage API keys.' using errcode = '42501';
  end if;
  if principal.revoked_at is not null then
    return;
  end if;

  update public.api_keys k set revoked_at = now(), revoked_by = actor where k.id = target_key;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    principal.org_id, actor, 'api_key.revoked', 'api_key', principal.id::text,
    jsonb_build_object('name', principal.name, 'prefix', principal.prefix)
  );
end;
$$;

revoke execute on function public.create_api_key(uuid, text, text, text) from public, anon;
revoke execute on function public.revoke_api_key(uuid) from public, anon;
grant execute on function public.create_api_key(uuid, text, text, text) to authenticated;
grant execute on function public.revoke_api_key(uuid) to authenticated;

-- ---------------------------------------------------------------------------------------
-- Resolving a key (service_role)
-- ---------------------------------------------------------------------------------------

/**
 * Why a key cannot be used right now, or null when it can: 'revoked', 'creator_not_admin'
 * (the person who created it left or was demoted) or 'not_entitled' (no Team plan).
 */
create or replace function private.api_key_refusal(principal public.api_keys) returns text
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select case
    when principal.revoked_at is not null then 'revoked'
    when principal.created_by is null or not exists (
      select 1 from public.memberships m
      where m.org_id = principal.org_id and m.user_id = principal.created_by
        and m.role in ('owner', 'admin')
    ) then 'creator_not_admin'
    when not private.api_entitled(principal.org_id) then 'not_entitled'
    else null
  end;
$$;

/**
 * The key a request presents, checked. Every operation routine starts here, inside its own
 * transaction, so a key revoked a moment ago stops working on its next request.
 */
create or replace function private.api_principal(p_key_hash text) returns public.api_keys
  language plpgsql
  stable
  security definer
  set search_path = ''
as $$
declare
  principal public.api_keys;
begin
  select * into principal from public.api_keys k where k.key_hash = p_key_hash;
  if principal.id is null or private.api_key_refusal(principal) is not null then
    raise exception 'invalid_api_key' using errcode = '28000';
  end if;
  return principal;
end;
$$;

/**
 * Authenticates a request: {"status":"ok","key_id","org_id"}, {"status":"not_entitled"} or
 * {"status":"invalid"}. A refused key that exists is audited as api_key.use_failed, at most
 * once per key every five minutes so a misconfigured client cannot flood the log. Touches
 * last_used_at at most once a minute.
 */
create or replace function public.api_authenticate(p_key_hash text) returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  principal public.api_keys;
  refusal text;
begin
  if p_key_hash is null or p_key_hash !~ '^[0-9a-f]{64}$' then
    return jsonb_build_object('status', 'invalid');
  end if;
  select * into principal from public.api_keys k where k.key_hash = p_key_hash;
  if principal.id is null then
    return jsonb_build_object('status', 'invalid');
  end if;

  refusal := private.api_key_refusal(principal);
  if refusal is not null then
    if not exists (
      select 1 from public.audit_events a
      where a.org_id = principal.org_id and a.action = 'api_key.use_failed'
        and a.target_id = principal.id::text and a.created_at > now() - interval '5 minutes'
    ) then
      insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
      values (
        principal.org_id, null, 'api_key.use_failed', 'api_key', principal.id::text,
        jsonb_build_object('reason', refusal, 'prefix', principal.prefix)
      );
    end if;
    return jsonb_build_object(
      'status', case when refusal = 'not_entitled' then 'not_entitled' else 'invalid' end
    );
  end if;

  update public.api_keys k set last_used_at = now()
  where k.id = principal.id and (k.last_used_at is null or k.last_used_at < now() - interval '1 minute');

  return jsonb_build_object('status', 'ok', 'key_id', principal.id, 'org_id', principal.org_id);
end;
$$;

-- ---------------------------------------------------------------------------------------
-- Representations
-- ---------------------------------------------------------------------------------------

/** A shipment as the API returns it. Decimals are strings so no digit is lost to floats. */
create or replace function private.api_shipment_json(s public.shipments, with_items boolean)
returns jsonb
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select jsonb_build_object(
    'id', s.id,
    'reference', s.reference,
    'status', s.status,
    'currency', s.currency,
    'incoterm', s.incoterm,
    'incoterm_place', s.incoterm_place,
    'port_of_loading', s.port_of_loading,
    'port_of_discharge', s.port_of_discharge,
    'country_of_origin', s.country_of_origin,
    'country_of_destination', s.country_of_destination,
    'shipped_on', s.shipped_on,
    'buyer_reference', s.buyer_reference,
    'proforma_valid_until', s.proforma_valid_until,
    'marks_and_numbers', s.marks_and_numbers,
    'exporter_id', s.exporter_id,
    'consignee_id', s.consignee_id,
    'notify_id', s.notify_id,
    'revision', s.revision,
    'created_at', s.created_at,
    'updated_at', s.updated_at
  ) || case when with_items then jsonb_build_object('items', coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', i.id,
      'position', i.position,
      'description', i.description,
      'hs_code', i.hs_code,
      'country_of_origin', i.country_of_origin,
      'quantity', i.quantity::text,
      'unit', i.unit,
      'unit_price', i.unit_price::text,
      'net_weight_kg', i.net_weight_kg::text,
      'gross_weight_kg', i.gross_weight_kg::text,
      'package_count', i.package_count
    ) order by i.position)
    from public.shipment_items i
    where i.shipment_id = s.id and i.org_id = s.org_id
  ), '[]'::jsonb)) else '{}'::jsonb end;
$$;

create or replace function private.api_document_json(d public.documents) returns jsonb
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select jsonb_build_object(
    'id', d.id,
    'shipment_id', d.shipment_id,
    'kind', d.kind,
    'number', d.number,
    'status', d.status,
    'status_reason', d.status_reason,
    'shipment_revision', d.shipment_revision,
    'supersedes_id', d.supersedes_id,
    'created_at', d.created_at
  );
$$;

-- ---------------------------------------------------------------------------------------
-- Idempotency
-- ---------------------------------------------------------------------------------------

/**
 * Claims an Idempotency-Key for this request. Null means "go ahead" (the claim is held until
 * the transaction ends, so a concurrent duplicate waits and then sees the stored response).
 * Otherwise {"replay": <stored response>} or {"conflict": true} when the same key was used
 * with a different request.
 */
create or replace function private.api_idempotency_claim(
  p_key_id uuid,
  p_idempotency_key text,
  p_request_hash text
) returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  existing public.api_idempotency;
begin
  if p_idempotency_key is null then
    return null;
  end if;
  delete from public.api_idempotency r
  where r.key_id = p_key_id and r.created_at < now() - interval '24 hours';

  insert into public.api_idempotency (key_id, idempotency_key, request_hash)
  values (p_key_id, p_idempotency_key, p_request_hash)
  on conflict do nothing;
  if found then
    return null;
  end if;

  select * into existing from public.api_idempotency r
  where r.key_id = p_key_id and r.idempotency_key = p_idempotency_key;
  if existing.request_hash <> p_request_hash or existing.response is null then
    return jsonb_build_object('conflict', true);
  end if;
  return jsonb_build_object('replay', existing.response);
end;
$$;

create or replace function private.api_idempotency_store(
  p_key_id uuid,
  p_idempotency_key text,
  p_response jsonb
) returns void
  language sql
  security definer
  set search_path = ''
as $$
  update public.api_idempotency r set response = p_response
  where r.key_id = p_key_id and r.idempotency_key = p_idempotency_key;
$$;

-- ---------------------------------------------------------------------------------------
-- Operations (service_role)
-- ---------------------------------------------------------------------------------------

/**
 * Shipments of the key's organization, newest first, keyset-paginated on (created_at, id).
 * Returns up to p_limit + 1 rows so the caller can tell whether another page exists.
 */
create or replace function public.api_list_shipments(
  p_key_hash text,
  p_limit integer,
  p_after_created timestamptz default null,
  p_after_id uuid default null
) returns jsonb
  language plpgsql
  stable
  security definer
  set search_path = ''
as $$
declare
  principal public.api_keys := private.api_principal(p_key_hash);
begin
  if p_limit is null or p_limit < 1 or p_limit > 100 then
    raise exception 'invalid_limit' using errcode = '22023';
  end if;
  return coalesce((
    select jsonb_agg(
      private.api_shipment_json(page.shipment, false)
      order by (page.shipment).created_at desc, (page.shipment).id desc
    )
    from (
      select s as shipment from public.shipments s
      where s.org_id = principal.org_id
        and (
          p_after_created is null
          or (s.created_at, s.id) < (p_after_created, coalesce(p_after_id, 'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid))
        )
      order by s.created_at desc, s.id desc
      limit p_limit + 1
    ) page
  ), '[]'::jsonb);
end;
$$;

/** One shipment with its lines, or null when it is not the key's organization's. */
create or replace function public.api_get_shipment(p_key_hash text, p_shipment uuid)
returns jsonb
  language plpgsql
  stable
  security definer
  set search_path = ''
as $$
declare
  principal public.api_keys := private.api_principal(p_key_hash);
  shipment public.shipments;
begin
  select * into shipment from public.shipments s
  where s.id = p_shipment and s.org_id = principal.org_id;
  if shipment.id is null then
    return null;
  end if;
  return private.api_shipment_json(shipment, true);
end;
$$;

/**
 * Creates a shipment, with optional lines, in the key's organization. p_shipment carries the
 * validated fields (src/lib/api/schemas.ts); org_id, status, revision and created_by are
 * never read from it. Without a currency the organization's default applies, as in the app.
 * Returns {"status": 201 | 200, "body": shipment} or {"conflict": true}.
 */
create or replace function public.api_create_shipment(
  p_key_hash text,
  p_idempotency_key text,
  p_request_hash text,
  p_shipment jsonb,
  p_items jsonb
) returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  principal public.api_keys := private.api_principal(p_key_hash);
  claim jsonb;
  currency text;
  created public.shipments;
  item jsonb;
  ordinal integer := 0;
  body jsonb;
begin
  claim := private.api_idempotency_claim(principal.id, p_idempotency_key, p_request_hash);
  if claim ? 'conflict' then
    return claim;
  end if;
  if claim ? 'replay' then
    return jsonb_build_object('status', 200, 'body', claim -> 'replay', 'replayed', true);
  end if;

  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) > 999 then
    raise exception 'invalid_items' using errcode = '22023';
  end if;

  currency := nullif(p_shipment ->> 'currency', '');
  if currency is null then
    select st.default_currency into currency
    from public.organization_settings st where st.org_id = principal.org_id;
  end if;

  insert into public.shipments (
    org_id, reference, currency, incoterm, incoterm_place, port_of_loading, port_of_discharge,
    country_of_origin, country_of_destination, shipped_on, buyer_reference,
    proforma_valid_until, marks_and_numbers, exporter_id, consignee_id, notify_id, created_by
  ) values (
    principal.org_id,
    p_shipment ->> 'reference',
    coalesce(currency, 'EUR'),
    p_shipment ->> 'incoterm',
    p_shipment ->> 'incoterm_place',
    p_shipment ->> 'port_of_loading',
    p_shipment ->> 'port_of_discharge',
    p_shipment ->> 'country_of_origin',
    p_shipment ->> 'country_of_destination',
    (p_shipment ->> 'shipped_on')::date,
    p_shipment ->> 'buyer_reference',
    (p_shipment ->> 'proforma_valid_until')::date,
    p_shipment ->> 'marks_and_numbers',
    (p_shipment ->> 'exporter_id')::uuid,
    (p_shipment ->> 'consignee_id')::uuid,
    (p_shipment ->> 'notify_id')::uuid,
    principal.created_by
  )
  returning * into created;

  for item in select value from jsonb_array_elements(p_items) loop
    ordinal := ordinal + 1;
    insert into public.shipment_items (
      org_id, shipment_id, position, description, hs_code, country_of_origin, quantity, unit,
      unit_price, net_weight_kg, gross_weight_kg, package_count
    ) values (
      principal.org_id,
      created.id,
      ordinal,
      item ->> 'description',
      item ->> 'hs_code',
      item ->> 'country_of_origin',
      (item ->> 'quantity')::numeric,
      coalesce(item ->> 'unit', 'pcs'),
      coalesce((item ->> 'unit_price')::numeric, 0),
      (item ->> 'net_weight_kg')::numeric,
      (item ->> 'gross_weight_kg')::numeric,
      (item ->> 'package_count')::integer
    );
  end loop;

  select * into created from public.shipments s where s.id = created.id;
  body := private.api_shipment_json(created, true);
  perform private.api_idempotency_store(principal.id, p_idempotency_key, body);

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    principal.org_id, principal.created_by, 'api.shipment_created', 'shipment', created.id::text,
    jsonb_build_object('key_id', principal.id, 'prefix', principal.prefix, 'lines', ordinal)
  );
  return jsonb_build_object('status', 201, 'body', body);
end;
$$;

/**
 * A shipment's documents, newest first, keyset-paginated; null when the shipment is not the
 * key's organization's.
 */
create or replace function public.api_list_documents(
  p_key_hash text,
  p_shipment uuid,
  p_limit integer,
  p_after_created timestamptz default null,
  p_after_id uuid default null
) returns jsonb
  language plpgsql
  stable
  security definer
  set search_path = ''
as $$
declare
  principal public.api_keys := private.api_principal(p_key_hash);
begin
  if p_limit is null or p_limit < 1 or p_limit > 100 then
    raise exception 'invalid_limit' using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.shipments s where s.id = p_shipment and s.org_id = principal.org_id
  ) then
    return null;
  end if;
  return coalesce((
    select jsonb_agg(
      private.api_document_json(page.document)
      order by (page.document).created_at desc, (page.document).id desc
    )
    from (
      select d as document from public.documents d
      where d.shipment_id = p_shipment and d.org_id = principal.org_id
        and (
          p_after_created is null
          or (d.created_at, d.id) < (p_after_created, coalesce(p_after_id, 'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid))
        )
      order by d.created_at desc, d.id desc
      limit p_limit + 1
    ) page
  ), '[]'::jsonb);
end;
$$;

/**
 * One document of the key's organization with its snapshot, for the server to render as a
 * PDF; null otherwise. The snapshot is not part of the API's JSON responses.
 */
create or replace function public.api_get_document(p_key_hash text, p_document uuid)
returns jsonb
  language plpgsql
  stable
  security definer
  set search_path = ''
as $$
declare
  principal public.api_keys := private.api_principal(p_key_hash);
  document public.documents;
begin
  select * into document from public.documents d
  where d.id = p_document and d.org_id = principal.org_id;
  if document.id is null then
    return null;
  end if;
  return private.api_document_json(document)
    || jsonb_build_object('org_id', document.org_id, 'snapshot', document.snapshot);
end;
$$;

/**
 * Generates a document through public.generate_document, unchanged, acting as the key's
 * creator for this transaction only. Returns {"status": 201 | 200, "body": document},
 * {"conflict": true}, or null when the shipment is not the key's organization's. The
 * routine's own refusals (no lines, unknown kind) are raised as they are in the app.
 */
create or replace function public.api_generate_document(
  p_key_hash text,
  p_idempotency_key text,
  p_request_hash text,
  p_shipment uuid,
  p_kind text
) returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  principal public.api_keys := private.api_principal(p_key_hash);
  claim jsonb;
  previous_claims text := current_setting('request.jwt.claims', true);
  previous_sub text := current_setting('request.jwt.claim.sub', true);
  created uuid;
  document public.documents;
  body jsonb;
begin
  if not exists (
    select 1 from public.shipments s where s.id = p_shipment and s.org_id = principal.org_id
  ) then
    return null;
  end if;

  claim := private.api_idempotency_claim(principal.id, p_idempotency_key, p_request_hash);
  if claim ? 'conflict' then
    return claim;
  end if;
  if claim ? 'replay' then
    return jsonb_build_object('status', 200, 'body', claim -> 'replay', 'replayed', true);
  end if;

  -- Act as the creator (an owner or administrator, checked by api_principal) for the one
  -- call, then put the caller's claims back.
  perform set_config(
    'request.jwt.claims',
    jsonb_build_object('sub', principal.created_by, 'role', 'authenticated')::text,
    true
  );
  perform set_config('request.jwt.claim.sub', principal.created_by::text, true);
  created := public.generate_document(p_shipment, p_kind);
  perform set_config('request.jwt.claims', coalesce(previous_claims, ''), true);
  perform set_config('request.jwt.claim.sub', coalesce(previous_sub, ''), true);

  select * into document from public.documents d where d.id = created and d.org_id = principal.org_id;
  body := private.api_document_json(document);
  perform private.api_idempotency_store(principal.id, p_idempotency_key, body);

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    principal.org_id, principal.created_by, 'api.document_generated', 'document', created::text,
    jsonb_build_object('key_id', principal.id, 'prefix', principal.prefix, 'kind', p_kind)
  );
  return jsonb_build_object('status', 201, 'body', body);
end;
$$;

-- Every API routine: service_role only. Helpers in private are not reachable through the
-- Data API at all; their execute grants are removed for good measure.
revoke execute on function public.api_authenticate(text) from public, anon, authenticated;
revoke execute on function public.api_list_shipments(text, integer, timestamptz, uuid)
  from public, anon, authenticated;
revoke execute on function public.api_get_shipment(text, uuid) from public, anon, authenticated;
revoke execute on function public.api_create_shipment(text, text, text, jsonb, jsonb)
  from public, anon, authenticated;
revoke execute on function public.api_list_documents(text, uuid, integer, timestamptz, uuid)
  from public, anon, authenticated;
revoke execute on function public.api_get_document(text, uuid) from public, anon, authenticated;
revoke execute on function public.api_generate_document(text, text, text, uuid, text)
  from public, anon, authenticated;

grant execute on function public.api_authenticate(text) to service_role;
grant execute on function public.api_list_shipments(text, integer, timestamptz, uuid) to service_role;
grant execute on function public.api_get_shipment(text, uuid) to service_role;
grant execute on function public.api_create_shipment(text, text, text, jsonb, jsonb) to service_role;
grant execute on function public.api_list_documents(text, uuid, integer, timestamptz, uuid) to service_role;
grant execute on function public.api_get_document(text, uuid) to service_role;
grant execute on function public.api_generate_document(text, text, text, uuid, text) to service_role;

revoke execute on function private.api_entitled(uuid) from public, anon, authenticated;
revoke execute on function private.api_key_refusal(public.api_keys) from public, anon, authenticated;
revoke execute on function private.api_principal(text) from public, anon, authenticated;
revoke execute on function private.api_shipment_json(public.shipments, boolean)
  from public, anon, authenticated;
revoke execute on function private.api_document_json(public.documents)
  from public, anon, authenticated;
revoke execute on function private.api_idempotency_claim(uuid, text, text)
  from public, anon, authenticated;
revoke execute on function private.api_idempotency_store(uuid, text, jsonb)
  from public, anon, authenticated;

commit;
