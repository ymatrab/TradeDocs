-- Free plan saved-shipment limit (D-027): an organization without a current Pro or Team plan
-- may create a fixed number of new shipments per calendar month (UTC). The free generators,
-- which store nothing, are not affected.
--
-- What changes:
--   * private.plan_limits: one row holding the Free limit. NULL means no limit. It starts
--     NULL, so nothing changes until the server turns the limit on. The server sets it with
--     sync_free_plan_limits whenever it creates a shipment: the limit (FREE_SHIPMENTS_PER_MONTH
--     in src/lib/limits.ts) while a paid plan can be bought, 0 (stored as NULL) while none
--     can. So no Free organization is ever capped while there is no paid plan to buy.
--   * private.shipment_creations: a ledger row per shipment created, written by the trigger.
--     Usage is counted from the ledger, never from public.shipments, so deleting a shipment
--     or rewriting its created_at gives no quota back.
--   * Trigger shipments_free_limit (before insert on public.shipments): for an organization
--     without a current Pro or Team plan, refuses the insert with SQLSTATE 54000 once the
--     month's ledger count reaches the limit. It locks the organization row first, so two
--     concurrent inserts cannot both take the last slot. Every insert path goes through it:
--     the app, duplicate_shipment, api_create_shipment and direct PostgREST inserts.
--   * public.free_shipment_usage(org): the month's count and the limit, for the workspace.
--
-- Access decisions:
--   private.plan_limits, private.shipment_creations   no API role reads or writes them
--                                                      (private schema, not exposed).
--   sync_free_plan_limits     service_role only.
--   free_shipment_usage       authenticated; answers only for an organization the caller is
--                             a member of, otherwise raises 42501.
--
-- Rollback: drop trigger shipments_free_limit on public.shipments, then drop the functions
-- private.enforce_free_shipment_limit, public.sync_free_plan_limits,
-- public.free_shipment_usage, private.free_shipment_count and the two private tables. No
-- existing row is changed by this migration.

begin;

create table private.plan_limits (
  singleton boolean primary key default true check (singleton),
  free_shipments_per_month integer check (free_shipments_per_month between 1 and 10000),
  updated_at timestamptz not null default now()
);
insert into private.plan_limits (singleton, free_shipments_per_month) values (true, null);

create table private.shipment_creations (
  org_id uuid not null references public.organizations (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index shipment_creations_org_created_idx
  on private.shipment_creations (org_id, created_at);

revoke all on private.plan_limits from public, anon, authenticated, service_role;
revoke all on private.shipment_creations from public, anon, authenticated, service_role;

/** Shipments an organization created since the start of the current UTC month. */
create or replace function private.free_shipment_count(target_org uuid) returns integer
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select count(*)::integer
  from private.shipment_creations c
  where c.org_id = target_org
    and c.created_at >= (date_trunc('month', now() at time zone 'utc') at time zone 'utc');
$$;

create or replace function private.enforce_free_shipment_limit() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  quota integer;
begin
  select l.free_shipments_per_month into quota from private.plan_limits l where l.singleton;

  if quota is not null and not private.org_entitled(new.org_id, array['pro', 'team']) then
    -- Serialize inserts per organization so the last slot is taken once.
    perform 1 from public.organizations o where o.id = new.org_id for update;
    if private.free_shipment_count(new.org_id) >= quota then
      raise exception 'The Free plan includes % new shipments a month.', quota
        using errcode = '54000',
              hint = 'Upgrade to Pro or Team for unlimited shipments, or wait for next month.';
    end if;
  end if;

  insert into private.shipment_creations (org_id) values (new.org_id);
  return new;
end;
$$;

create trigger shipments_free_limit
  before insert on public.shipments
  for each row execute function private.enforce_free_shipment_limit();

/** Called by the server (service role) with the limit, or 0 (no limit) while nothing can be bought. */
create or replace function public.sync_free_plan_limits(p_shipments_per_month integer)
returns void
  language sql
  security definer
  set search_path = ''
as $$
  update private.plan_limits
  set free_shipments_per_month = nullif(p_shipments_per_month, 0), updated_at = now()
  where singleton
    and free_shipments_per_month is distinct from nullif(p_shipments_per_month, 0);
$$;

/** The caller's organization: shipments created this month and the Free limit (NULL: none). */
create or replace function public.free_shipment_usage(target_org uuid)
returns table (used integer, quota integer, entitled boolean)
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
    select
      private.free_shipment_count(target_org),
      (select l.free_shipments_per_month from private.plan_limits l where l.singleton),
      private.org_entitled(target_org, array['pro', 'team']);
end;
$$;

revoke execute on function private.free_shipment_count(uuid) from public, anon, authenticated;
revoke execute on function private.enforce_free_shipment_limit() from public, anon, authenticated;
revoke execute on function public.sync_free_plan_limits(integer) from public, anon, authenticated;
grant execute on function public.sync_free_plan_limits(integer) to service_role;
revoke execute on function public.free_shipment_usage(uuid) from public, anon;
grant execute on function public.free_shipment_usage(uuid) to authenticated;

commit;
