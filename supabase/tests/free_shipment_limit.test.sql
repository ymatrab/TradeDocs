-- Free plan saved-shipment limit (D-027): off until the server sets it, a monthly ledger that
-- deletion cannot rewind, Pro and Team exempt, usage readable by members only, and the limit
-- writable by the service role only.

create extension if not exists pgtap;

begin;
select plan(16);

-- Fixtures, created as the migration owner before any role switch.
--   Org F: free.   Org P: Pro, current.   Org L: Pro, lapsed.
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'f1f1f1f1-0000-4000-8000-00000000f1f1', 'authenticated', 'authenticated', 'owner.f@limit.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'e1e1e1e1-0000-4000-8000-00000000e1e1', 'authenticated', 'authenticated', 'owner.p@limit.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'd1d1d1d1-0000-4000-8000-00000000d1d1', 'authenticated', 'authenticated', 'owner.l@limit.test', '', now(), now(), now());

insert into public.organizations (id, name) values
  ('ffffffff-0000-4000-8000-0000000000ff', 'Limit Org F'),
  ('eeeeeeee-0000-4000-8000-0000000000ee', 'Limit Org P'),
  ('dddddddd-0000-4000-8000-0000000000dd', 'Limit Org L');
insert into public.memberships (org_id, user_id, role) values
  ('ffffffff-0000-4000-8000-0000000000ff', 'f1f1f1f1-0000-4000-8000-00000000f1f1', 'owner'),
  ('eeeeeeee-0000-4000-8000-0000000000ee', 'e1e1e1e1-0000-4000-8000-00000000e1e1', 'owner'),
  ('dddddddd-0000-4000-8000-0000000000dd', 'd1d1d1d1-0000-4000-8000-00000000d1d1', 'owner');
insert into public.entitlements (org_id, plan, status, customer_ref, subscription_ref, checkout_ref, paid_through)
values
  ('eeeeeeee-0000-4000-8000-0000000000ee', 'pro', 'active', 'cus_LimitP', 'sub_LimitP', 'cs_test_LimitP', now() + interval '30 days'),
  ('dddddddd-0000-4000-8000-0000000000dd', 'pro', 'cancelled', 'cus_LimitL', 'sub_LimitL', 'cs_test_LimitL', now() - interval '1 day');

-- ---------------------------------------------------------------------------------------
-- Off by default
-- ---------------------------------------------------------------------------------------

select is(
  (select free_shipments_per_month from private.plan_limits),
  null::integer,
  'the limit starts off'
);

set local role authenticated;
set local request.jwt.claims = '{"sub":"f1f1f1f1-0000-4000-8000-00000000f1f1","role":"authenticated"}';
insert into public.shipments (org_id, reference, currency) values
  ('ffffffff-0000-4000-8000-0000000000ff', 'F-1', 'EUR'),
  ('ffffffff-0000-4000-8000-0000000000ff', 'F-2', 'EUR'),
  ('ffffffff-0000-4000-8000-0000000000ff', 'F-3', 'EUR');
select is(
  (select count(*)::integer from public.shipments where org_id = 'ffffffff-0000-4000-8000-0000000000ff'),
  3,
  'with the limit off, a free organization saves shipments freely'
);
select throws_ok(
  $$ select public.sync_free_plan_limits(3) $$,
  '42501',
  null,
  'a member cannot turn the limit on or off'
);
reset role;

-- ---------------------------------------------------------------------------------------
-- On: 3 a month
-- ---------------------------------------------------------------------------------------

set local role service_role;
select lives_ok($$ select public.sync_free_plan_limits(3) $$, 'the service role sets the limit');
reset role;
select is((select free_shipments_per_month from private.plan_limits), 3, 'the limit is 3');

set local role authenticated;
set local request.jwt.claims = '{"sub":"f1f1f1f1-0000-4000-8000-00000000f1f1","role":"authenticated"}';
select throws_ok(
  $$ insert into public.shipments (org_id, reference, currency)
     values ('ffffffff-0000-4000-8000-0000000000ff', 'F-4', 'EUR') $$,
  '54000',
  'The Free plan includes 3 new shipments a month.',
  'a free organization cannot create a 4th shipment this month'
);
select results_eq(
  $$ select used, quota, entitled from public.free_shipment_usage('ffffffff-0000-4000-8000-0000000000ff') $$,
  $$ values (3, 3, false) $$,
  'usage reports 3 of 3 for the free organization'
);
select throws_ok(
  $$ select * from public.free_shipment_usage('eeeeeeee-0000-4000-8000-0000000000ee') $$,
  '42501',
  null,
  'a member cannot read another organization''s usage'
);

-- Deleting and rewriting created_at give nothing back.
delete from public.shipments where org_id = 'ffffffff-0000-4000-8000-0000000000ff' and reference = 'F-3';
update public.shipments set created_at = now() - interval '90 days'
  where org_id = 'ffffffff-0000-4000-8000-0000000000ff';
select throws_ok(
  $$ insert into public.shipments (org_id, reference, currency)
     values ('ffffffff-0000-4000-8000-0000000000ff', 'F-5', 'EUR') $$,
  '54000',
  null,
  'deleting a shipment or back-dating it does not free a slot'
);
select throws_ok(
  $$ select public.duplicate_shipment(
       (select id from public.shipments where org_id = 'ffffffff-0000-4000-8000-0000000000ff' and reference = 'F-1'),
       'F-1 copy') $$,
  '54000',
  null,
  'reusing a shipment counts against the limit too'
);
reset role;

-- A slot from last month does not count this month.
update private.shipment_creations set created_at = now() - interval '40 days'
  where org_id = 'ffffffff-0000-4000-8000-0000000000ff';
set local role authenticated;
set local request.jwt.claims = '{"sub":"f1f1f1f1-0000-4000-8000-00000000f1f1","role":"authenticated"}';
select lives_ok(
  $$ insert into public.shipments (org_id, reference, currency)
     values ('ffffffff-0000-4000-8000-0000000000ff', 'F-6', 'EUR') $$,
  'last month''s shipments do not count this month'
);
reset role;

-- ---------------------------------------------------------------------------------------
-- Paid plans
-- ---------------------------------------------------------------------------------------

set local role authenticated;
set local request.jwt.claims = '{"sub":"e1e1e1e1-0000-4000-8000-00000000e1e1","role":"authenticated"}';
insert into public.shipments (org_id, reference, currency) values
  ('eeeeeeee-0000-4000-8000-0000000000ee', 'P-1', 'EUR'),
  ('eeeeeeee-0000-4000-8000-0000000000ee', 'P-2', 'EUR'),
  ('eeeeeeee-0000-4000-8000-0000000000ee', 'P-3', 'EUR'),
  ('eeeeeeee-0000-4000-8000-0000000000ee', 'P-4', 'EUR');
select is(
  (select count(*)::integer from public.shipments where org_id = 'eeeeeeee-0000-4000-8000-0000000000ee'),
  4,
  'a current Pro organization is not limited'
);
select results_eq(
  $$ select used, entitled from public.free_shipment_usage('eeeeeeee-0000-4000-8000-0000000000ee') $$,
  $$ values (4, true) $$,
  'usage reports the Pro organization as entitled'
);

set local request.jwt.claims = '{"sub":"d1d1d1d1-0000-4000-8000-00000000d1d1","role":"authenticated"}';
insert into public.shipments (org_id, reference, currency) values
  ('dddddddd-0000-4000-8000-0000000000dd', 'L-1', 'EUR'),
  ('dddddddd-0000-4000-8000-0000000000dd', 'L-2', 'EUR'),
  ('dddddddd-0000-4000-8000-0000000000dd', 'L-3', 'EUR');
select throws_ok(
  $$ insert into public.shipments (org_id, reference, currency)
     values ('dddddddd-0000-4000-8000-0000000000dd', 'L-4', 'EUR') $$,
  '54000',
  null,
  'a lapsed Pro organization is back on the Free limit'
);
reset role;

-- ---------------------------------------------------------------------------------------
-- Off again
-- ---------------------------------------------------------------------------------------

set local role service_role;
select public.sync_free_plan_limits(0);
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"d1d1d1d1-0000-4000-8000-00000000d1d1","role":"authenticated"}';
select lives_ok(
  $$ insert into public.shipments (org_id, reference, currency)
     values ('dddddddd-0000-4000-8000-0000000000dd', 'L-4', 'EUR') $$,
  'with payments closed again the limit lifts'
);
reset role;

select is(
  (select count(*)::integer from private.shipment_creations where org_id = 'dddddddd-0000-4000-8000-0000000000dd'),
  4,
  'the ledger records every shipment created, limit on or off'
);

select * from finish();
rollback;
