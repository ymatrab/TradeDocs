-- Task 04 — identity and organization core.
--
-- Promotes the identity subset of supabase/drafts/202609060001_core_schema.sql into an
-- executable migration. The remaining draft tables stay quarantined until Task 11.
--
-- This migration creates structure only and leaves every table fail-closed: row level
-- security is enabled with no policy, and the API roles hold no grant. Migration
-- 20260907000200 opens the specific access each role is entitled to.

begin;

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Every security-definer routine pins an empty search_path so a caller cannot shadow a
-- referenced object with one of their own.
create or replace function private.touch_updated_at() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 160),
  locale text not null default 'en' check (char_length(locale) <= 35),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.memberships (
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete restrict,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index memberships_user_org_idx on public.memberships (user_id, org_id);

create table public.invitations (
  id uuid primary key default extensions.gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  email text not null check (email = lower(btrim(email)) and char_length(email) <= 254),
  role text not null check (role in ('admin', 'member')),
  -- Only the digest is stored: a database leak must not yield usable invitation links.
  token_hash text not null unique check (char_length(token_hash) = 64),
  invited_by uuid not null references auth.users (id),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  accepted_by uuid references auth.users (id),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  check ((accepted_at is null) = (accepted_by is null))
);
create index invitations_org_email_idx on public.invitations (org_id, email);

create table public.audit_events (
  id uuid primary key default extensions.gen_random_uuid(),
  org_id uuid references public.organizations (id) on delete restrict,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null check (char_length(action) between 1 and 100),
  target_type text not null,
  target_id text,
  correlation_id uuid not null default extensions.gen_random_uuid(),
  metadata jsonb not null default '{}' check (
    jsonb_typeof(metadata) = 'object' and octet_length(metadata::text) <= 8000
  ),
  created_at timestamptz not null default now()
);
create index audit_events_org_created_idx on public.audit_events (org_id, created_at desc, id);

-- Deletion is queued and revocable for a grace period before anything is destroyed, so an
-- accidental or hostile request can still be withdrawn by its owner.
create table public.account_deletion_requests (
  user_id uuid primary key references auth.users (id) on delete cascade,
  requested_at timestamptz not null default now(),
  purge_after timestamptz not null,
  cancelled_at timestamptz,
  check (purge_after > requested_at)
);

create trigger profiles_touch_updated_at before update on public.profiles
  for each row execute function private.touch_updated_at();
create trigger organizations_touch_updated_at before update on public.organizations
  for each row execute function private.touch_updated_at();

-- A profile row is the application's stable identity for an account. Creating it from the
-- auth trigger means no signed-in user can ever exist without one.
create or replace function private.handle_new_user() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(btrim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function private.handle_new_user();

-- Fail closed. Every table denies the API roles until the access migration grants it.
do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
    execute format('revoke all on public.%I from anon, authenticated', t.tablename);
  end loop;
end;
$$;

commit;
