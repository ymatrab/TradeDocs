-- Accounting integrations (D-025): tokens are unreachable from any client role, connection
-- status reaches members only, and the import is owner/admin, paid, connected, tenant-bound,
-- deduplicated by provider id and never overwrites an edit made in TradeDocs.

create extension if not exists pgtap;

begin;
select plan(33);

-- Org A: Pro, owner + member, QuickBooks connected.  Org B: free, owner, QuickBooks connected.
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'a1a1a1a1-0000-4000-8000-0000000071a1', 'authenticated', 'authenticated', 'owner.a@integrations.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'a2a2a2a2-0000-4000-8000-0000000072a2', 'authenticated', 'authenticated', 'member.a@integrations.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'b1b1b1b1-0000-4000-8000-0000000071b1', 'authenticated', 'authenticated', 'owner.b@integrations.test', '', now(), now(), now());

insert into public.organizations (id, name) values
  ('aaaaaaaa-0000-4000-8000-0000000070aa', 'Integrations Org A'),
  ('bbbbbbbb-0000-4000-8000-0000000070bb', 'Integrations Org B');
insert into public.memberships (org_id, user_id, role) values
  ('aaaaaaaa-0000-4000-8000-0000000070aa', 'a1a1a1a1-0000-4000-8000-0000000071a1', 'owner'),
  ('aaaaaaaa-0000-4000-8000-0000000070aa', 'a2a2a2a2-0000-4000-8000-0000000072a2', 'member'),
  ('bbbbbbbb-0000-4000-8000-0000000070bb', 'b1b1b1b1-0000-4000-8000-0000000071b1', 'owner');

insert into public.entitlements (org_id, plan, status, customer_ref, subscription_ref, checkout_ref, paid_through)
values ('aaaaaaaa-0000-4000-8000-0000000070aa', 'pro', 'active', 'cus_IntA', 'sub_IntA', 'cs_test_IntA', now() + interval '30 days');

insert into public.integration_connections (
  org_id, provider, external_tenant_id, tenant_name, scopes, access_token_ciphertext,
  refresh_token_ciphertext, access_expires_at, connected_by
)
values
  ('aaaaaaaa-0000-4000-8000-0000000070aa', 'quickbooks', '9130000000000001', 'Sandbox Company A',
   'com.intuit.quickbooks.accounting', 'v1.sealed-access-a', 'v1.sealed-refresh-a', now() + interval '1 hour',
   'a1a1a1a1-0000-4000-8000-0000000071a1'),
  ('bbbbbbbb-0000-4000-8000-0000000070bb', 'quickbooks', '9130000000000002', 'Sandbox Company B',
   'com.intuit.quickbooks.accounting', 'v1.sealed-access-b', 'v1.sealed-refresh-b', now() + interval '1 hour',
   'b1b1b1b1-0000-4000-8000-0000000071b1');

insert into public.products (org_id, sku, description)
values ('aaaaaaaa-0000-4000-8000-0000000070aa', 'EXIST-1', 'Already in the catalog');

select set_config('tests.customers', $json$[
  {"external_id": "1", "line": 1, "values": {"name": "Harbour Imports Ltd", "email": "orders@harbour.example", "city": "Rotterdam", "country_code": "NL"}},
  {"external_id": "2", "line": 2, "values": {"name": "Quayside Trading", "country_code": "DE"}}
]$json$, true);

-- ---------------------------------------------------------------------------------------
-- No client role reaches a token or a state
-- ---------------------------------------------------------------------------------------

select is(
  (select count(*)::int from pg_policies
   where schemaname = 'public' and tablename in ('integration_connections', 'integration_oauth_states')),
  0,
  'connections and OAuth states have no row policy for any client role'
);
select ok(
  not has_table_privilege('authenticated', 'public.integration_connections', 'select'),
  'authenticated holds no select grant on connections'
);
select ok(
  not has_table_privilege('anon', 'public.integration_connections', 'select'),
  'anon holds no select grant on connections'
);
select ok(
  not has_table_privilege('authenticated', 'public.integration_oauth_states', 'select')
    and not has_table_privilege('authenticated', 'public.integration_oauth_states', 'insert'),
  'authenticated can neither read nor write OAuth states'
);
select ok(
  has_table_privilege('service_role', 'public.integration_connections', 'select')
    and has_table_privilege('service_role', 'public.integration_connections', 'update'),
  'the service role reads and writes connections'
);
select ok(
  not has_table_privilege('authenticated', 'public.integration_records', 'insert')
    and not has_table_privilege('authenticated', 'public.integration_records', 'update'),
  'no client writes provider id mappings directly'
);
select throws_ok(
  $$insert into public.integration_oauth_states (nonce_hash, org_id, provider, user_id, expires_at)
    values (repeat('a', 64), 'aaaaaaaa-0000-4000-8000-0000000070aa', 'xero',
            'a1a1a1a1-0000-4000-8000-0000000071a1', now() + interval '1 day')$$,
  '23514',
  null,
  'a state cannot live longer than fifteen minutes'
);

set local role authenticated;
set local request.jwt.claims = '{"sub":"a1a1a1a1-0000-4000-8000-0000000071a1","role":"authenticated"}';
select throws_ok(
  $$select access_token_ciphertext from public.integration_connections$$,
  '42501',
  null,
  'an owner cannot read the stored tokens'
);

-- ---------------------------------------------------------------------------------------
-- Status
-- ---------------------------------------------------------------------------------------

select is(
  (select tenant_name from public.integration_status('aaaaaaaa-0000-4000-8000-0000000070aa') where provider = 'quickbooks'),
  'Sandbox Company A',
  'an owner sees the connected company file'
);

set local request.jwt.claims = '{"sub":"a2a2a2a2-0000-4000-8000-0000000072a2","role":"authenticated"}';
select is(
  (select count(*)::int from public.integration_status('aaaaaaaa-0000-4000-8000-0000000070aa')),
  1,
  'a member sees the connection status'
);
select throws_ok(
  $$select public.import_integration_records('aaaaaaaa-0000-4000-8000-0000000070aa', 'quickbooks', 'company',
      current_setting('tests.customers')::jsonb, true)$$,
  '42501',
  null,
  'a plain member cannot import'
);

set local request.jwt.claims = '{"sub":"b1b1b1b1-0000-4000-8000-0000000071b1","role":"authenticated"}';
select throws_ok(
  $$select * from public.integration_status('aaaaaaaa-0000-4000-8000-0000000070aa')$$,
  '42501',
  null,
  'another organization''s owner cannot see its connections'
);
select throws_ok(
  $$select public.import_integration_records('aaaaaaaa-0000-4000-8000-0000000070aa', 'quickbooks', 'company',
      current_setting('tests.customers')::jsonb, false)$$,
  '42501',
  null,
  'another organization''s owner cannot import into it'
);
select throws_ok(
  $$select public.import_integration_records('bbbbbbbb-0000-4000-8000-0000000070bb', 'quickbooks', 'company',
      current_setting('tests.customers')::jsonb, true)$$,
  '42501',
  null,
  'a free organization cannot import, even connected (fail closed)'
);

-- ---------------------------------------------------------------------------------------
-- Import
-- ---------------------------------------------------------------------------------------

set local request.jwt.claims = '{"sub":"a1a1a1a1-0000-4000-8000-0000000071a1","role":"authenticated"}';
select throws_ok(
  $$select public.import_integration_records('aaaaaaaa-0000-4000-8000-0000000070aa', 'xero', 'company',
      current_setting('tests.customers')::jsonb, true)$$,
  '42501',
  null,
  'a provider that is not connected cannot be imported from'
);

select is(
  (public.import_integration_records('aaaaaaaa-0000-4000-8000-0000000070aa', 'quickbooks', 'company',
     current_setting('tests.customers')::jsonb, true) ->> 'inserted')::int,
  2,
  'a dry run counts what it would insert'
);
select is(
  (select count(*)::int from public.companies where org_id = 'aaaaaaaa-0000-4000-8000-0000000070aa'),
  0,
  'a dry run writes nothing'
);

select is(
  (public.import_integration_records('aaaaaaaa-0000-4000-8000-0000000070aa', 'quickbooks', 'company',
     current_setting('tests.customers')::jsonb, false) ->> 'inserted')::int,
  2,
  'the import inserts new customers'
);
select is(
  (select count(*)::int from public.companies where org_id = 'aaaaaaaa-0000-4000-8000-0000000070aa' and kind = 'customer'),
  2,
  'they are in the company directory'
);
select is(
  (public.import_integration_records('aaaaaaaa-0000-4000-8000-0000000070aa', 'quickbooks', 'company',
     current_setting('tests.customers')::jsonb, false) ->> 'unchanged')::int,
  2,
  'importing the same records again changes nothing (deduplicated by provider id)'
);
select is(
  (select count(*)::int from public.companies where org_id = 'aaaaaaaa-0000-4000-8000-0000000070aa'),
  2,
  'and creates no duplicates'
);

select is(
  (public.import_integration_records('aaaaaaaa-0000-4000-8000-0000000070aa', 'quickbooks', 'company',
     '[{"external_id": "1", "line": 1, "values": {"name": "Harbour Imports BV", "country_code": "NL"}}]'::jsonb,
     false) ->> 'updated')::int,
  1,
  'a record changed only at the provider is updated'
);

-- An edit in TradeDocs, then a change at the provider: the edit is kept and reported.
update public.companies set phone = '+31 10 000 0000'
where org_id = 'aaaaaaaa-0000-4000-8000-0000000070aa' and name = 'Quayside Trading';
select is(
  jsonb_array_length(public.import_integration_records('aaaaaaaa-0000-4000-8000-0000000070aa', 'quickbooks', 'company',
     '[{"external_id": "2", "line": 2, "values": {"name": "Quayside Trading GmbH", "country_code": "DE"}}]'::jsonb,
     false) -> 'conflicts'),
  1,
  'a record edited in TradeDocs and changed at the provider is reported as a conflict'
);
select is(
  (select name from public.companies
   where org_id = 'aaaaaaaa-0000-4000-8000-0000000070aa' and phone = '+31 10 000 0000'),
  'Quayside Trading',
  'and the TradeDocs version is kept, not overwritten'
);

select is(
  (public.import_integration_records('aaaaaaaa-0000-4000-8000-0000000070aa', 'quickbooks', 'company',
     '[{"external_id": "9", "line": 7, "values": {"country_code": "Netherlands"}}]'::jsonb,
     true) -> 'problems' -> 0 ->> 'row')::int,
  7,
  'a record with a problem is reported against its position'
);

select is(
  jsonb_array_length(public.import_integration_records('aaaaaaaa-0000-4000-8000-0000000070aa', 'quickbooks', 'product',
     '[{"external_id": "I-1", "line": 1, "values": {"sku": "exist-1", "description": "From QuickBooks", "unit_price": "2.5"}}]'::jsonb,
     false) -> 'conflicts'),
  1,
  'an item whose code is already in the catalog is a conflict, not an overwrite'
);
select is(
  (select description from public.products where org_id = 'aaaaaaaa-0000-4000-8000-0000000070aa' and sku = 'EXIST-1'),
  'Already in the catalog',
  'the existing product is unchanged'
);
select is(
  (public.import_integration_records('aaaaaaaa-0000-4000-8000-0000000070aa', 'quickbooks', 'product',
     '[{"external_id": "I-2", "line": 1, "values": {"sku": "NEW-2", "description": "Linen napkin", "unit_price": "2.4"}},
       {"external_id": "I-3", "line": 2, "values": {"description": "Service fee", "unit_price": "abc"}}]'::jsonb,
     false) ->> 'inserted')::int,
  1,
  'items are imported; the record with a bad price is skipped and reported'
);
select is(
  (public.import_integration_records('aaaaaaaa-0000-4000-8000-0000000070aa', 'quickbooks', 'product',
     '[{"external_id": "I-2", "line": 1, "values": {"sku": "NEW-2", "description": "Linen napkin", "unit_price": "2.4000"}}]'::jsonb,
     false) ->> 'unchanged')::int,
  1,
  'a price written with more decimals is the same price'
);

select is(
  (select count(*)::int from public.audit_events
   where org_id = 'aaaaaaaa-0000-4000-8000-0000000070aa' and action = 'integration.imported'),
  7,
  'every applied import is audited, dry runs are not'
);

set local request.jwt.claims = '{"sub":"b1b1b1b1-0000-4000-8000-0000000071b1","role":"authenticated"}';
select is(
  (select count(*)::int from public.integration_records where org_id = 'aaaaaaaa-0000-4000-8000-0000000070aa'),
  0,
  'another organization sees none of the provider id mappings'
);

reset role;

-- A deleted local row is not re-created by a later import.
delete from public.companies
where org_id = 'aaaaaaaa-0000-4000-8000-0000000070aa' and name = 'Harbour Imports BV';

set local role authenticated;
set local request.jwt.claims = '{"sub":"a1a1a1a1-0000-4000-8000-0000000071a1","role":"authenticated"}';
select is(
  jsonb_array_length(public.import_integration_records('aaaaaaaa-0000-4000-8000-0000000070aa', 'quickbooks', 'company',
     '[{"external_id": "1", "line": 1, "values": {"name": "Harbour Imports BV (renamed)"}}]'::jsonb,
     false) -> 'skipped'),
  1,
  'a record deleted in TradeDocs is skipped, not re-created'
);

reset role;
update public.integration_connections set status = 'needs_reconnect'
where org_id = 'aaaaaaaa-0000-4000-8000-0000000070aa';
set local role authenticated;
set local request.jwt.claims = '{"sub":"a1a1a1a1-0000-4000-8000-0000000071a1","role":"authenticated"}';
select throws_ok(
  $$select public.import_integration_records('aaaaaaaa-0000-4000-8000-0000000070aa', 'quickbooks', 'company',
      current_setting('tests.customers')::jsonb, true)$$,
  '42501',
  null,
  'a connection that needs reconnecting cannot be imported from'
);

reset role;
select * from finish();
rollback;
