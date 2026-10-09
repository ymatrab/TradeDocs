-- Accounting integrations (D-025): import customers into the company directory and items into
-- the product catalog from QuickBooks Online and Xero, for Pro and Team.
--
-- What changes:
--   * public.integration_connections: one OAuth connection per organization and provider.
--     The access and refresh tokens are stored only as AES-256-GCM ciphertext, sealed by the
--     application (src/lib/integrations/crypto.ts) with INTEGRATION_TOKEN_KEY, which the
--     database never sees.
--   * public.integration_oauth_states: the server half of the OAuth `state`. The browser
--     carries a signed, expiring token; the row (keyed by the SHA-256 of its nonce) makes it
--     single-use, and holds the sealed PKCE code verifier where the provider supports PKCE.
--   * public.integration_records: which local company or product each provider record became,
--     with fingerprints of the provider values and of the local row at the last import, so a
--     later import updates only what nobody edited in TradeDocs and reports the rest.
--   * public.integration_status: what members may see of a connection (never a token).
--   * public.import_integration_records: the import, dry run or applied, owners and admins of
--     an entitled organization with an active connection; every record's problem, conflict or
--     skip is reported against its position; the applied import is audited.
--   * private.integrations_entitled: the plans of features integrations.quickbooks and
--     integrations.xero in src/lib/billing/plans.ts (Pro and Team), fail closed.
--
-- Access decisions:
--   integration_connections   anon/authenticated: nothing (no policy, no grant). The service
--                             role reads and writes it from server code only.
--   integration_oauth_states  anon/authenticated: nothing. Service role only.
--   integration_records       select: members of the organization. No direct writes; only
--                             import_integration_records (security definer) writes.
--   integration_status        authenticated; answers only for an organization the caller is
--                             a member of, and returns no token or tenant identifier.
--   import_integration_records authenticated; owner/admin, entitled, connected; otherwise 42501.
--
-- Rollback: drop the two functions, private.integrations_entitled, private.import_fingerprint
-- and the three tables. Imported companies and products stay; they are ordinary rows.

begin;

-- ---------------------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------------------

create table public.integration_connections (
  id uuid primary key default extensions.gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  provider text not null check (provider in ('quickbooks', 'xero')),
  -- QuickBooks realmId or Xero tenantId: which company file the tokens reach.
  external_tenant_id text not null check (char_length(btrim(external_tenant_id)) between 1 and 100),
  tenant_name text check (char_length(tenant_name) <= 300),
  scopes text not null check (char_length(scopes) <= 1000),
  access_token_ciphertext text not null check (char_length(access_token_ciphertext) between 1 and 20000),
  refresh_token_ciphertext text not null check (char_length(refresh_token_ciphertext) between 1 and 20000),
  access_expires_at timestamptz not null,
  refresh_expires_at timestamptz,
  status text not null default 'active' check (status in ('active', 'needs_reconnect')),
  connected_by uuid references auth.users (id) on delete set null,
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, provider)
);

create trigger integration_connections_touch_updated_at before update on public.integration_connections
  for each row execute function private.touch_updated_at();

create table public.integration_oauth_states (
  nonce_hash text primary key check (nonce_hash ~ '^[0-9a-f]{64}$'),
  org_id uuid not null references public.organizations (id) on delete cascade,
  provider text not null check (provider in ('quickbooks', 'xero')),
  user_id uuid not null references auth.users (id) on delete cascade,
  code_verifier_ciphertext text check (char_length(code_verifier_ciphertext) <= 1000),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  check (expires_at > created_at and expires_at <= created_at + interval '15 minutes')
);

create index integration_oauth_states_expiry_idx on public.integration_oauth_states (expires_at);

create table public.integration_records (
  id uuid primary key default extensions.gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  provider text not null check (provider in ('quickbooks', 'xero')),
  entity text not null check (entity in ('company', 'product')),
  external_id text not null check (char_length(external_id) between 1 and 100),
  -- Null once the local row is deleted: the import then leaves it deleted, never re-creates it.
  company_id uuid references public.companies (id) on delete set null,
  product_id uuid references public.products (id) on delete set null,
  source_hash text not null check (source_hash ~ '^[0-9a-f]{32}$'),
  local_hash text not null check (local_hash ~ '^[0-9a-f]{32}$'),
  first_imported_at timestamptz not null default now(),
  last_imported_at timestamptz not null default now(),
  unique (org_id, provider, entity, external_id),
  check (
    (entity = 'company' and product_id is null) or (entity = 'product' and company_id is null)
  )
);

create index integration_records_company_idx on public.integration_records (company_id);
create index integration_records_product_idx on public.integration_records (product_id);

alter table public.integration_connections enable row level security;
alter table public.integration_oauth_states enable row level security;
alter table public.integration_records enable row level security;

revoke all on public.integration_connections from public, anon, authenticated;
revoke all on public.integration_oauth_states from public, anon, authenticated;
revoke all on public.integration_records from public, anon, authenticated;

-- service_role bypasses row level security; it is granted only what the server does.
revoke all on public.integration_connections from service_role;
revoke all on public.integration_oauth_states from service_role;
revoke all on public.integration_records from service_role;
grant select, insert, update, delete on public.integration_connections to service_role;
grant select, insert, update, delete on public.integration_oauth_states to service_role;

create policy integration_records_read on public.integration_records
  for select to authenticated using (private.is_member(org_id));
grant select on public.integration_records to authenticated;

-- ---------------------------------------------------------------------------------------
-- Entitlement and status
-- ---------------------------------------------------------------------------------------

/** The plans of features integrations.quickbooks and integrations.xero in plans.ts. */
create or replace function private.integrations_entitled(target_org uuid) returns boolean
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select private.org_entitled(target_org, array['pro', 'team']);
$$;

/**
 * What a member may know about the organization's connections: provider, the company file's
 * display name, status and when. Never a token, a scope or the provider's tenant id.
 */
create or replace function public.integration_status(target_org uuid)
returns table (provider text, tenant_name text, status text, connected_at timestamptz)
  language plpgsql
  stable
  security definer
  set search_path = ''
as $$
begin
  if not private.is_member(target_org) then
    raise exception 'That organization is not available.' using errcode = '42501';
  end if;
  return query
    select c.provider, c.tenant_name, c.status, c.connected_at
    from public.integration_connections c
    where c.org_id = target_org
    order by c.provider;
end;
$$;

-- ---------------------------------------------------------------------------------------
-- Import
-- ---------------------------------------------------------------------------------------

/**
 * A fingerprint of the fields an import writes, from either the cleaned provider values or a
 * local row's to_jsonb. Prices are scale-trimmed so 2.4 and 2.4000 agree.
 */
create or replace function private.import_fingerprint(entity text, v jsonb) returns text
  language sql
  immutable
  set search_path = ''
as $$
  select md5(case entity
    when 'company' then jsonb_build_object(
      'kind', v -> 'kind', 'name', v -> 'name', 'legal_name', v -> 'legal_name',
      'contact_name', v -> 'contact_name', 'tax_number', v -> 'tax_number',
      'registration_number', v -> 'registration_number', 'email', v -> 'email',
      'phone', v -> 'phone', 'address_line1', v -> 'address_line1',
      'address_line2', v -> 'address_line2', 'city', v -> 'city', 'region', v -> 'region',
      'postal_code', v -> 'postal_code', 'country_code', v -> 'country_code'
    )
    else jsonb_build_object(
      'sku', v -> 'sku', 'description', v -> 'description', 'unit', v -> 'unit',
      'unit_price', to_jsonb(trim_scale(coalesce((v ->> 'unit_price')::numeric, 0)))
    )
  end::text);
$$;

/**
 * Imports provider records into the company directory (entity 'company') or the product
 * catalog (entity 'product'), or with dry_run reports what it would do and writes nothing.
 *
 * Each row is {external_id, line, values}. Records are matched by provider id only:
 *   * new id: inserted, unless (products) a live product already uses its code, which is
 *     reported as a conflict and left alone rather than overwritten or silently linked;
 *   * known id, provider values unchanged since the last import: unchanged;
 *   * known id, local row edited in TradeDocs since the last import: conflict, kept as is;
 *   * known id, local row deleted or archived: skipped, never re-created or restored;
 *   * otherwise: updated.
 * A record with a problem is skipped and reported; the rest are imported. Nothing is ever
 * overwritten without being counted.
 */
create or replace function public.import_integration_records(
  target_org uuid,
  source text,
  record_kind text,
  rows jsonb,
  dry_run boolean default true
)
returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  item jsonb;
  v jsonb;
  position_in_list integer := 0;
  line integer;
  ext text;
  label text;
  issues text[];
  problems jsonb := '[]'::jsonb;
  conflicts jsonb := '[]'::jsonb;
  skipped jsonb := '[]'::jsonb;
  seen jsonb := '{}'::jsonb;
  seen_sku jsonb := '{}'::jsonb;
  inserted integer := 0;
  updated integer := 0;
  unchanged integer := 0;
  clean jsonb;
  fingerprint text;
  rec public.integration_records;
  local_company public.companies;
  local_product public.products;
  new_id uuid;
  raw text;
  price numeric;
  provider_label text;
  number_pattern constant text := '^[0-9]+(\.[0-9]+)?$';
begin
  if source not in ('quickbooks', 'xero') or record_kind not in ('company', 'product') then
    raise exception 'Unknown import.' using errcode = 'check_violation';
  end if;
  if not private.has_org_role(target_org, array['owner', 'admin']) then
    raise exception 'Only an owner or administrator can import.' using errcode = '42501';
  end if;
  if not private.integrations_entitled(target_org) then
    raise exception 'Imports from accounting software need a paid plan.' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.integration_connections c
    where c.org_id = target_org and c.provider = source and c.status = 'active'
  ) then
    raise exception 'That provider is not connected.' using errcode = '42501';
  end if;
  if rows is null or jsonb_typeof(rows) <> 'array' then
    raise exception 'Provide the records as a list.' using errcode = 'check_violation';
  end if;
  if jsonb_array_length(rows) > 2000 then
    raise exception 'Import at most 2000 records at a time.' using errcode = 'check_violation';
  end if;

  provider_label := case source when 'quickbooks' then 'QuickBooks' else 'Xero' end;

  for item in select * from jsonb_array_elements(rows) loop
    position_in_list := position_in_list + 1;
    line := case when (item ->> 'line') ~ '^[0-9]{1,7}$' then (item ->> 'line')::integer
      else position_in_list end;
    v := coalesce(item -> 'values', '{}'::jsonb);
    if jsonb_typeof(v) <> 'object' then
      v := '{}'::jsonb;
    end if;
    ext := btrim(coalesce(item ->> 'external_id', ''));
    issues := array[]::text[];

    if ext = '' or char_length(ext) > 100 then
      issues := array_append(issues, 'The record has no usable id.'::text);
    elsif seen ? ext then
      issues := array_append(issues, format('The same record also appears at %s.', seen ->> ext));
    else
      seen := seen || jsonb_build_object(ext, line);
    end if;

    if record_kind = 'company' then
      clean := jsonb_build_object(
        'kind', case when v ->> 'kind' = 'supplier' then 'supplier' else 'customer' end,
        'name', nullif(btrim(coalesce(v ->> 'name', '')), ''),
        'legal_name', nullif(btrim(coalesce(v ->> 'legal_name', '')), ''),
        'contact_name', nullif(btrim(coalesce(v ->> 'contact_name', '')), ''),
        'tax_number', nullif(btrim(coalesce(v ->> 'tax_number', '')), ''),
        'registration_number', nullif(btrim(coalesce(v ->> 'registration_number', '')), ''),
        'email', nullif(btrim(coalesce(v ->> 'email', '')), ''),
        'phone', nullif(btrim(coalesce(v ->> 'phone', '')), ''),
        'address_line1', nullif(btrim(coalesce(v ->> 'address_line1', '')), ''),
        'address_line2', nullif(btrim(coalesce(v ->> 'address_line2', '')), ''),
        'city', nullif(btrim(coalesce(v ->> 'city', '')), ''),
        'region', nullif(btrim(coalesce(v ->> 'region', '')), ''),
        'postal_code', nullif(btrim(coalesce(v ->> 'postal_code', '')), ''),
        'country_code', upper(nullif(btrim(coalesce(v ->> 'country_code', '')), ''))
      );
      label := coalesce(clean ->> 'name', ext);
      if clean ->> 'name' is null then
        issues := array_append(issues, 'Name is required.'::text);
      elsif char_length(clean ->> 'name') > 300 then
        issues := array_append(issues, 'Name is longer than 300 characters.'::text);
      end if;
      if char_length(clean ->> 'legal_name') > 300 then
        issues := array_append(issues, 'Legal name is longer than 300 characters.'::text);
      end if;
      if char_length(clean ->> 'contact_name') > 200 then
        issues := array_append(issues, 'Contact name is longer than 200 characters.'::text);
      end if;
      if char_length(clean ->> 'tax_number') > 100 then
        issues := array_append(issues, 'Tax number is longer than 100 characters.'::text);
      end if;
      if char_length(clean ->> 'registration_number') > 100 then
        issues := array_append(issues, 'Registration number is longer than 100 characters.'::text);
      end if;
      if char_length(clean ->> 'email') > 254 then
        issues := array_append(issues, 'Email is longer than 254 characters.'::text);
      end if;
      if char_length(clean ->> 'phone') > 60 then
        issues := array_append(issues, 'Phone is longer than 60 characters.'::text);
      end if;
      if char_length(clean ->> 'address_line1') > 200 or char_length(clean ->> 'address_line2') > 200 then
        issues := array_append(issues, 'An address line is longer than 200 characters.'::text);
      end if;
      if char_length(clean ->> 'city') > 120 or char_length(clean ->> 'region') > 120 then
        issues := array_append(issues, 'City or region is longer than 120 characters.'::text);
      end if;
      if char_length(clean ->> 'postal_code') > 40 then
        issues := array_append(issues, 'Postal code is longer than 40 characters.'::text);
      end if;
      if clean ->> 'country_code' is not null and clean ->> 'country_code' !~ '^[A-Z]{2}$' then
        issues := array_append(issues, 'Country must be a two-letter code.'::text);
      end if;
    else
      price := null;
      raw := nullif(btrim(coalesce(v ->> 'unit_price', '')), '');
      if raw is not null then
        if raw !~ number_pattern then
          issues := array_append(issues, format('Price "%s" is not a number of zero or more.', raw));
        elsif raw::numeric >= 10000000000 then
          issues := array_append(issues, 'Price is too large.'::text);
        else
          price := round(raw::numeric, 4);
        end if;
      end if;
      clean := jsonb_build_object(
        'sku', nullif(btrim(coalesce(v ->> 'sku', '')), ''),
        'description', nullif(btrim(coalesce(v ->> 'description', '')), ''),
        'unit', coalesce(nullif(btrim(coalesce(v ->> 'unit', '')), ''), 'pcs'),
        'unit_price', coalesce(price, 0)
      );
      label := coalesce(clean ->> 'description', ext);
      if clean ->> 'description' is null then
        issues := array_append(issues, 'Description is required.'::text);
      elsif char_length(clean ->> 'description') > 500 then
        issues := array_append(issues, 'Description is longer than 500 characters.'::text);
      end if;
      if char_length(clean ->> 'sku') > 60 then
        issues := array_append(issues, 'Code is longer than 60 characters.'::text);
      end if;
      if char_length(clean ->> 'unit') > 12 then
        issues := array_append(issues, 'Unit is longer than 12 characters.'::text);
      end if;
      if clean ->> 'sku' is not null then
        if seen_sku ? upper(clean ->> 'sku') then
          issues := array_append(issues, format(
            'Code %s is also used at %s.', clean ->> 'sku', seen_sku ->> upper(clean ->> 'sku')
          ));
        else
          seen_sku := seen_sku || jsonb_build_object(upper(clean ->> 'sku'), line);
        end if;
      end if;
    end if;

    if cardinality(issues) > 0 then
      problems := problems || jsonb_build_object(
        'row', line, 'label', label, 'problem', array_to_string(issues, ' ')
      );
      continue;
    end if;

    fingerprint := private.import_fingerprint(record_kind, clean);

    select * into rec from public.integration_records r
    where r.org_id = target_org and r.provider = source and r.entity = record_kind
      and r.external_id = ext;

    if rec.id is not null then
      if (record_kind = 'company' and rec.company_id is null)
        or (record_kind = 'product' and rec.product_id is null) then
        skipped := skipped || jsonb_build_object('row', line, 'label', label,
          'problem', 'Deleted in TradeDocs after an earlier import; not re-created.');
        continue;
      end if;
      if rec.source_hash = fingerprint then
        unchanged := unchanged + 1;
        continue;
      end if;

      if record_kind = 'company' then
        select * into local_company from public.companies c
        where c.id = rec.company_id and c.org_id = target_org for update;
        if local_company.archived_at is not null then
          skipped := skipped || jsonb_build_object('row', line, 'label', label,
            'problem', 'Archived in TradeDocs; left unchanged.');
          continue;
        end if;
        if private.import_fingerprint('company', to_jsonb(local_company)) <> rec.local_hash then
          conflicts := conflicts || jsonb_build_object('row', line, 'label', label,
            'problem', format('Changed in TradeDocs and in %s since the last import. The TradeDocs version was kept.', provider_label));
          continue;
        end if;
        if not dry_run then
          update public.companies set
            kind = clean ->> 'kind', name = clean ->> 'name', legal_name = clean ->> 'legal_name',
            contact_name = clean ->> 'contact_name', tax_number = clean ->> 'tax_number',
            registration_number = clean ->> 'registration_number', email = clean ->> 'email',
            phone = clean ->> 'phone', address_line1 = clean ->> 'address_line1',
            address_line2 = clean ->> 'address_line2', city = clean ->> 'city',
            region = clean ->> 'region', postal_code = clean ->> 'postal_code',
            country_code = clean ->> 'country_code'
          where id = local_company.id
          returning * into local_company;
          update public.integration_records set
            source_hash = fingerprint,
            local_hash = private.import_fingerprint('company', to_jsonb(local_company)),
            last_imported_at = now()
          where id = rec.id;
        end if;
      else
        select * into local_product from public.products p
        where p.id = rec.product_id and p.org_id = target_org for update;
        if local_product.archived_at is not null then
          skipped := skipped || jsonb_build_object('row', line, 'label', label,
            'problem', 'Archived in TradeDocs; left unchanged.');
          continue;
        end if;
        if private.import_fingerprint('product', to_jsonb(local_product)) <> rec.local_hash then
          conflicts := conflicts || jsonb_build_object('row', line, 'label', label,
            'problem', format('Changed in TradeDocs and in %s since the last import. The TradeDocs version was kept.', provider_label));
          continue;
        end if;
        if clean ->> 'sku' is not null and exists (
          select 1 from public.products p
          where p.org_id = target_org and p.archived_at is null and p.id <> local_product.id
            and upper(btrim(p.sku)) = upper(clean ->> 'sku')
        ) then
          conflicts := conflicts || jsonb_build_object('row', line, 'label', label,
            'problem', format('Another product in the catalog already uses code %s. Nothing was changed.', clean ->> 'sku'));
          continue;
        end if;
        if not dry_run then
          update public.products set
            sku = clean ->> 'sku', description = clean ->> 'description',
            unit = clean ->> 'unit', unit_price = (clean ->> 'unit_price')::numeric
          where id = local_product.id
          returning * into local_product;
          update public.integration_records set
            source_hash = fingerprint,
            local_hash = private.import_fingerprint('product', to_jsonb(local_product)),
            last_imported_at = now()
          where id = rec.id;
        end if;
      end if;
      updated := updated + 1;
      continue;
    end if;

    -- A record seen for the first time.
    if record_kind = 'product' and clean ->> 'sku' is not null and exists (
      select 1 from public.products p
      where p.org_id = target_org and p.archived_at is null
        and upper(btrim(p.sku)) = upper(clean ->> 'sku')
    ) then
      conflicts := conflicts || jsonb_build_object('row', line, 'label', label,
        'problem', format('A product with code %s is already in the catalog. It was not changed or linked.', clean ->> 'sku'));
      continue;
    end if;

    if not dry_run then
      if record_kind = 'company' then
        insert into public.companies (
          org_id, kind, name, legal_name, contact_name, tax_number, registration_number, email,
          phone, address_line1, address_line2, city, region, postal_code, country_code
        )
        values (
          target_org, clean ->> 'kind', clean ->> 'name', clean ->> 'legal_name',
          clean ->> 'contact_name', clean ->> 'tax_number', clean ->> 'registration_number',
          clean ->> 'email', clean ->> 'phone', clean ->> 'address_line1',
          clean ->> 'address_line2', clean ->> 'city', clean ->> 'region',
          clean ->> 'postal_code', clean ->> 'country_code'
        )
        returning * into local_company;
        insert into public.integration_records (
          org_id, provider, entity, external_id, company_id, source_hash, local_hash
        )
        values (
          target_org, source, 'company', ext, local_company.id, fingerprint,
          private.import_fingerprint('company', to_jsonb(local_company))
        );
      else
        insert into public.products (org_id, sku, description, unit, unit_price)
        values (
          target_org, clean ->> 'sku', clean ->> 'description', clean ->> 'unit',
          (clean ->> 'unit_price')::numeric
        )
        returning * into local_product;
        insert into public.integration_records (
          org_id, provider, entity, external_id, product_id, source_hash, local_hash
        )
        values (
          target_org, source, 'product', ext, local_product.id, fingerprint,
          private.import_fingerprint('product', to_jsonb(local_product))
        );
      end if;
    end if;
    inserted := inserted + 1;
  end loop;

  if not dry_run then
    insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
    values (
      target_org, actor, 'integration.imported', 'organization', target_org::text,
      jsonb_build_object(
        'provider', source, 'entity', record_kind, 'inserted', inserted, 'updated', updated,
        'unchanged', unchanged, 'conflicts', jsonb_array_length(conflicts),
        'skipped', jsonb_array_length(skipped), 'problems', jsonb_array_length(problems)
      )
    );
  end if;

  return jsonb_build_object(
    'inserted', inserted, 'updated', updated, 'unchanged', unchanged,
    'problems', problems, 'conflicts', conflicts, 'skipped', skipped, 'dry_run', dry_run
  );
end;
$$;

revoke execute on function private.integrations_entitled(uuid) from public, anon, authenticated;
revoke execute on function private.import_fingerprint(text, jsonb) from public, anon, authenticated;

do $$
declare routine text;
begin
  foreach routine in array array[
    'public.integration_status(uuid)',
    'public.import_integration_records(uuid, text, text, jsonb, boolean)'
  ] loop
    execute format('revoke execute on function %s from public, anon', routine);
    execute format('grant execute on function %s to authenticated', routine);
  end loop;
end;
$$;

commit;
