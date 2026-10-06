-- Billing: one entitlement per organization, written only from verified Stripe events.
--
-- src/app/api/billing/stripe/webhook/route.ts verifies the Stripe-Signature, reads the live
-- Stripe object, then calls POST /rest/v1/rpc/apply_billing_event with the service-role key.
-- That routine records the event id and applies the change in one transaction, so a
-- redelivered event is a no-op and a failed write leaves no trace to block the retry.
--
-- Access decisions:
--   public.entitlements      members read their own organization's row (provider references
--                            excluded by column grant); the service role reads; nobody but
--                            the routine writes.
--   private.billing_events   no API role can reach it.
--   apply_billing_event      service_role only.
--
-- Access rules the data encodes:
--   paid_through only moves forward, and only while Stripe reports the subscription active.
--   A cancelled or past-due subscription keeps access until that date and no longer.
--   A full refund or a dispute sets revoked_at, which ends access at once and is not undone
--   by later subscription events; only a new checkout grants again.
--
-- Rollback: drop function public.apply_billing_event(text, text, jsonb); drop table
-- private.billing_events; drop table public.entitlements. No other object depends on them,
-- and with them gone every paid check answers false (src/lib/billing/server.ts).

begin;

create table public.entitlements (
  org_id uuid primary key references public.organizations (id) on delete cascade,
  plan text not null check (plan in ('pro', 'team')),
  status text not null check (status in ('active', 'past_due', 'cancelled', 'inactive', 'revoked')),
  provider text not null default 'stripe' check (provider = 'stripe'),
  customer_ref text not null check (customer_ref ~ '^cus_[A-Za-z0-9_]{1,255}$'),
  subscription_ref text not null unique check (subscription_ref ~ '^sub_[A-Za-z0-9_]{1,255}$'),
  checkout_ref text not null check (checkout_ref ~ '^cs_[A-Za-z0-9_]{1,255}$'),
  paid_through timestamptz,
  cancel_at_period_end boolean not null default false,
  revoked_at timestamptz,
  revoke_reason text check (revoke_reason in ('refund', 'dispute')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'revoked') = (revoked_at is not null)),
  check ((revoked_at is null) = (revoke_reason is null))
);
create index entitlements_customer_idx on public.entitlements (customer_ref);

create trigger entitlements_touch_updated_at before update on public.entitlements
  for each row execute function private.touch_updated_at();

create table private.billing_events (
  event_id text primary key check (event_id ~ '^evt_[A-Za-z0-9_]{1,255}$'),
  event_type text not null check (char_length(event_type) between 1 and 100),
  outcome text not null check (outcome in ('applied', 'ignored', 'unmatched')),
  org_id uuid,
  received_at timestamptz not null default now()
);
create index billing_events_received_idx on private.billing_events (received_at);

alter table public.entitlements enable row level security;
alter table private.billing_events enable row level security;
revoke all on public.entitlements from public, anon, authenticated;
revoke all on private.billing_events from public, anon, authenticated;

create policy entitlements_select_member on public.entitlements
  for select to authenticated
  using (private.is_member(org_id));

-- Column grant: members see the plan and its dates, not the Stripe references.
grant select (
  org_id, plan, status, paid_through, cancel_at_period_end, revoked_at, revoke_reason, updated_at
) on public.entitlements to authenticated;
-- The service role reads for reconciliation and writes only through the routine below (which
-- runs as its owner), so every change to an entitlement has a ledger entry.
revoke all on public.entitlements from service_role;
revoke all on private.billing_events from service_role;
grant select on public.entitlements to service_role;

create or replace function public.apply_billing_event(
  p_event_id text,
  p_event_type text,
  p_action jsonb
)
returns text
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  kind text;
  target_org uuid;
  next_status text;
  period_end timestamptz;
  affected integer := 0;
  result text;
begin
  if p_event_id is null or p_event_id !~ '^evt_[A-Za-z0-9_]{1,255}$'
    or p_event_type is null or char_length(p_event_type) not between 1 and 100
    or p_action is null or jsonb_typeof(p_action) <> 'object'
  then
    raise exception 'Invalid billing event.' using errcode = '22023';
  end if;

  -- The ledger row is the idempotency key. A second delivery stops here.
  insert into private.billing_events (event_id, event_type, outcome)
  values (p_event_id, p_event_type, 'ignored')
  on conflict (event_id) do nothing;
  if not found then
    return 'duplicate';
  end if;

  kind := p_action->>'kind';

  if kind in ('grant', 'subscription') then
    next_status := p_action->>'status';
    if next_status is null or next_status not in ('active', 'past_due', 'cancelled', 'inactive') then
      raise exception 'Invalid subscription status.' using errcode = '22023';
    end if;
    if jsonb_typeof(p_action->'current_period_end') = 'number' then
      period_end := to_timestamp((p_action->>'current_period_end')::bigint);
    end if;
  end if;

  if kind = 'grant' then
    if coalesce(p_action->>'org_id', '') !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
      raise exception 'Invalid organization reference.' using errcode = '22023';
    end if;
    target_org := (p_action->>'org_id')::uuid;
    if not exists (
      select 1 from public.organizations o where o.id = target_org and o.deleted_at is null
    ) then
      result := 'unmatched';
    else
      insert into public.entitlements as e (
        org_id, plan, status, customer_ref, subscription_ref, checkout_ref,
        paid_through, cancel_at_period_end
      )
      values (
        target_org,
        p_action->>'plan',
        next_status,
        p_action->>'customer_ref',
        p_action->>'subscription_ref',
        p_action->>'checkout_ref',
        case when next_status = 'active' then period_end end,
        coalesce((p_action->>'cancel_at_period_end')::boolean, false)
      )
      on conflict (org_id) do update set
        plan = excluded.plan,
        status = excluded.status,
        customer_ref = excluded.customer_ref,
        subscription_ref = excluded.subscription_ref,
        checkout_ref = excluded.checkout_ref,
        paid_through = excluded.paid_through,
        cancel_at_period_end = excluded.cancel_at_period_end,
        revoked_at = null,
        revoke_reason = null
      -- A checkout already revoked (refunded or disputed) is never granted again by a late
      -- or replayed copy of itself.
      where not (e.checkout_ref = excluded.checkout_ref and e.revoked_at is not null);
      get diagnostics affected = row_count;
      result := case when affected > 0 then 'applied' else 'ignored' end;
    end if;

  elsif kind = 'subscription' then
    update public.entitlements e set
      status = next_status,
      paid_through = case
        when next_status = 'active' and period_end is not null
          then greatest(coalesce(e.paid_through, period_end), period_end)
        else e.paid_through
      end,
      cancel_at_period_end = coalesce((p_action->>'cancel_at_period_end')::boolean, false)
    where e.subscription_ref = p_action->>'subscription_ref'
      and e.revoked_at is null
    returning e.org_id into target_org;
    get diagnostics affected = row_count;
    result := case when affected > 0 then 'applied' else 'unmatched' end;

  elsif kind = 'revoke' then
    if coalesce(p_action->>'reason', '') not in ('refund', 'dispute') then
      raise exception 'Invalid revocation reason.' using errcode = '22023';
    end if;
    update public.entitlements e set
      status = 'revoked',
      revoked_at = now(),
      revoke_reason = p_action->>'reason'
    where e.customer_ref = p_action->>'customer_ref'
      and e.revoked_at is null;
    get diagnostics affected = row_count;
    result := case when affected > 0 then 'applied' else 'unmatched' end;

  elsif kind = 'ignore' then
    result := 'ignored';

  else
    raise exception 'Unknown billing action.' using errcode = '22023';
  end if;

  update private.billing_events
  set outcome = result, org_id = target_org
  where event_id = p_event_id;
  return result;
end;
$$;

revoke execute on function public.apply_billing_event(text, text, jsonb)
  from public, anon, authenticated;
grant execute on function public.apply_billing_event(text, text, jsonb) to service_role;

commit;
