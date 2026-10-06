-- Billing entitlements: tenant isolation, write authority, idempotency and the access rules
-- (cancelled keeps access to period end; refund or dispute revokes; revocation is sticky).

create extension if not exists pgtap;

begin;
select plan(27);

-- Fixtures, created before any role switch.
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'a1111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'ana.billing@example.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'b2222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'ben.billing@example.test', '', now(), now(), now());

insert into public.organizations (id, name) values
  ('0a000000-0000-4000-8000-00000000000a', 'Billing Org A'),
  ('0b000000-0000-4000-8000-00000000000b', 'Billing Org B');
insert into public.memberships (org_id, user_id, role) values
  ('0a000000-0000-4000-8000-00000000000a', 'a1111111-1111-1111-1111-111111111111', 'owner'),
  ('0b000000-0000-4000-8000-00000000000b', 'b2222222-2222-2222-2222-222222222222', 'owner');

-- Writes arrive only through the service role.
set local role service_role;
set local request.jwt.claims = '{"role":"service_role"}';

select is(
  public.apply_billing_event('evt_grant_a', 'checkout.session.completed', jsonb_build_object(
    'kind', 'grant', 'org_id', '0a000000-0000-4000-8000-00000000000a', 'plan', 'pro',
    'customer_ref', 'cus_A', 'subscription_ref', 'sub_A', 'checkout_ref', 'cs_test_A',
    'status', 'active', 'current_period_end', extract(epoch from now() + interval '30 days')::bigint,
    'cancel_at_period_end', false
  )),
  'applied',
  'a verified checkout grants the organization its plan'
);
select is(
  public.apply_billing_event('evt_grant_a', 'checkout.session.completed', '{"kind":"ignore","reason":"replay"}'::jsonb),
  'duplicate',
  'a redelivered event id is recognised and changes nothing'
);
select is(
  (select count(*)::int from public.entitlements where org_id = '0a000000-0000-4000-8000-00000000000a' and status = 'active'),
  1,
  'the duplicate left the entitlement as it was'
);
select is(
  public.apply_billing_event('evt_grant_b', 'checkout.session.completed', jsonb_build_object(
    'kind', 'grant', 'org_id', '0b000000-0000-4000-8000-00000000000b', 'plan', 'team',
    'customer_ref', 'cus_B', 'subscription_ref', 'sub_B', 'checkout_ref', 'cs_test_B',
    'status', 'active', 'current_period_end', extract(epoch from now() + interval '30 days')::bigint,
    'cancel_at_period_end', false
  )),
  'applied',
  'a second tenant has its own entitlement'
);
select is(
  public.apply_billing_event('evt_grant_ghost', 'checkout.session.completed', jsonb_build_object(
    'kind', 'grant', 'org_id', '0c000000-0000-4000-8000-00000000000c', 'plan', 'pro',
    'customer_ref', 'cus_C', 'subscription_ref', 'sub_C', 'checkout_ref', 'cs_test_C',
    'status', 'active', 'current_period_end', extract(epoch from now() + interval '30 days')::bigint
  )),
  'unmatched',
  'a checkout naming no organization grants nothing'
);
select throws_ok(
  $$update public.entitlements set paid_through = now() + interval '10 years'$$,
  '42501',
  null,
  'even the service role changes entitlements only through the ledgered routine'
);
select throws_ok(
  $$select public.apply_billing_event('evt_bad', 'x', '{"kind":"grant","org_id":"not-a-uuid","status":"active"}'::jsonb)$$,
  '22023',
  null,
  'a malformed action is refused'
);
-- Read as the migration owner, so this check does not depend on any API role's schema grants.
reset role;
select is(
  (select count(*)::int from private.billing_events where event_id = 'evt_bad'),
  0,
  'a refused event leaves no ledger entry, so its retry is not mistaken for a duplicate'
);

-- Members read their own organization only.
set local role authenticated;
set local request.jwt.claims = '{"sub":"a1111111-1111-1111-1111-111111111111","role":"authenticated"}';
select is(
  (select count(*)::int from public.entitlements),
  1,
  'a member reads only their own organization''s entitlement'
);
select is(
  (select plan from public.entitlements where org_id = '0a000000-0000-4000-8000-00000000000a'),
  'pro',
  'a member reads their plan'
);
select is(
  (select count(*)::int from public.entitlements where org_id = '0b000000-0000-4000-8000-00000000000b'),
  0,
  'another tenant''s entitlement cannot be read'
);
select throws_ok(
  $$select customer_ref from public.entitlements$$,
  '42501',
  null,
  'the Stripe references are not readable by members'
);
select throws_ok(
  $$insert into public.entitlements (org_id, plan, status, customer_ref, subscription_ref, checkout_ref)
    values ('0a000000-0000-4000-8000-00000000000a', 'team', 'active', 'cus_X', 'sub_X', 'cs_X')$$,
  '42501',
  null,
  'a member cannot grant themselves a plan'
);
select throws_ok(
  $$update public.entitlements set paid_through = now() + interval '10 years'$$,
  '42501',
  null,
  'a member cannot extend their own access'
);
select throws_ok(
  $$delete from public.entitlements$$,
  '42501',
  null,
  'a member cannot delete an entitlement'
);
select throws_ok(
  $$select public.apply_billing_event('evt_self', 'checkout.session.completed', '{"kind":"ignore","reason":"x"}'::jsonb)$$,
  '42501',
  null,
  'a member cannot call the webhook routine'
);
select throws_ok(
  $$select count(*) from private.billing_events$$,
  '42501',
  null,
  'the event ledger is unreachable to members'
);

set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok(
  $$select count(*) from public.entitlements$$,
  '42501',
  null,
  'an anonymous caller cannot reach entitlements'
);
select throws_ok(
  $$select public.apply_billing_event('evt_anon', 'checkout.session.completed', '{"kind":"ignore","reason":"x"}'::jsonb)$$,
  '42501',
  null,
  'an anonymous caller cannot call the webhook routine'
);

-- Access rules.
set local role service_role;
set local request.jwt.claims = '{"role":"service_role"}';

select is(
  public.apply_billing_event('evt_cancel_a', 'customer.subscription.deleted', jsonb_build_object(
    'kind', 'subscription', 'subscription_ref', 'sub_A', 'status', 'cancelled',
    'current_period_end', extract(epoch from now() + interval '30 days')::bigint,
    'cancel_at_period_end', false
  )),
  'applied',
  'a cancellation is applied'
);
select ok(
  (select status = 'cancelled' and paid_through > now() and revoked_at is null
   from public.entitlements where org_id = '0a000000-0000-4000-8000-00000000000a'),
  'a cancelled plan keeps access until the paid period ends'
);

select is(
  public.apply_billing_event('evt_pastdue_b', 'customer.subscription.updated', jsonb_build_object(
    'kind', 'subscription', 'subscription_ref', 'sub_B', 'status', 'past_due',
    'current_period_end', extract(epoch from now() + interval '60 days')::bigint
  )),
  'applied',
  'a failed renewal is applied'
);
select ok(
  (select paid_through < now() + interval '31 days'
   from public.entitlements where org_id = '0b000000-0000-4000-8000-00000000000b'),
  'a past-due renewal does not extend access past the period already paid'
);

select is(
  public.apply_billing_event('evt_refund_a', 'charge.refunded', jsonb_build_object(
    'kind', 'revoke', 'reason', 'refund', 'customer_ref', 'cus_A'
  )),
  'applied',
  'a full refund is applied'
);
select ok(
  (select status = 'revoked' and revoked_at is not null and revoke_reason = 'refund'
   from public.entitlements where org_id = '0a000000-0000-4000-8000-00000000000a'),
  'a full refund revokes access immediately'
);
select is(
  public.apply_billing_event('evt_reactivate_a', 'customer.subscription.updated', jsonb_build_object(
    'kind', 'subscription', 'subscription_ref', 'sub_A', 'status', 'active',
    'current_period_end', extract(epoch from now() + interval '90 days')::bigint
  )),
  'unmatched',
  'a later subscription event cannot undo a revocation'
);
select is(
  public.apply_billing_event('evt_grant_a_replay', 'checkout.session.completed', jsonb_build_object(
    'kind', 'grant', 'org_id', '0a000000-0000-4000-8000-00000000000a', 'plan', 'pro',
    'customer_ref', 'cus_A', 'subscription_ref', 'sub_A', 'checkout_ref', 'cs_test_A',
    'status', 'active', 'current_period_end', extract(epoch from now() + interval '30 days')::bigint
  )),
  'ignored',
  'the refunded checkout cannot grant access again'
);

select * from finish();
rollback;
