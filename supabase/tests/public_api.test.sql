-- Public REST API v1 (D-025): api_keys row security, key management routines, and the
-- service_role routines /api/v1 runs through, proving one organization's key never reaches
-- another organization's rows.

create extension if not exists pgtap;

begin;
select plan(49);

-- Fixtures, created as the migration owner before any role switch.
--   Org A: Team, current.   Org B: Team, current.   Org C: free (no entitlement).
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'a1a1a1a1-0000-4000-8000-00000000a1a1', 'authenticated', 'authenticated', 'owner.a@api.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'a2a2a2a2-0000-4000-8000-00000000a2a2', 'authenticated', 'authenticated', 'member.a@api.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'b1b1b1b1-0000-4000-8000-00000000b1b1', 'authenticated', 'authenticated', 'owner.b@api.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'c1c1c1c1-0000-4000-8000-00000000c1c1', 'authenticated', 'authenticated', 'owner.c@api.test', '', now(), now(), now());

insert into public.organizations (id, name) values
  ('aaaaaaaa-0000-4000-8000-0000000000aa', 'API Org A'),
  ('bbbbbbbb-0000-4000-8000-0000000000bb', 'API Org B'),
  ('cccccccc-0000-4000-8000-0000000000cc', 'API Org C');
insert into public.memberships (org_id, user_id, role) values
  ('aaaaaaaa-0000-4000-8000-0000000000aa', 'a1a1a1a1-0000-4000-8000-00000000a1a1', 'owner'),
  ('aaaaaaaa-0000-4000-8000-0000000000aa', 'a2a2a2a2-0000-4000-8000-00000000a2a2', 'member'),
  ('bbbbbbbb-0000-4000-8000-0000000000bb', 'b1b1b1b1-0000-4000-8000-00000000b1b1', 'owner'),
  ('cccccccc-0000-4000-8000-0000000000cc', 'c1c1c1c1-0000-4000-8000-00000000c1c1', 'owner');

insert into public.entitlements (org_id, plan, status, customer_ref, subscription_ref, checkout_ref, paid_through)
values
  ('aaaaaaaa-0000-4000-8000-0000000000aa', 'team', 'active', 'cus_ApiA', 'sub_ApiA', 'cs_test_ApiA', now() + interval '30 days'),
  ('bbbbbbbb-0000-4000-8000-0000000000bb', 'team', 'active', 'cus_ApiB', 'sub_ApiB', 'cs_test_ApiB', now() + interval '30 days');

insert into public.companies (id, org_id, kind, name) values
  ('bbbbbbbb-4444-4000-8000-0000000000bb', 'bbbbbbbb-0000-4000-8000-0000000000bb', 'own', 'B Exports Ltd');
insert into public.shipments (id, org_id, reference, currency) values
  ('aaaaaaaa-5555-4000-8000-0000000000aa', 'aaaaaaaa-0000-4000-8000-0000000000aa', 'API-A1', 'EUR'),
  ('bbbbbbbb-5555-4000-8000-0000000000bb', 'bbbbbbbb-0000-4000-8000-0000000000bb', 'API-B1', 'USD');
insert into public.shipment_items (org_id, shipment_id, position, description, quantity, unit_price) values
  ('aaaaaaaa-0000-4000-8000-0000000000aa', 'aaaaaaaa-5555-4000-8000-0000000000aa', 1, 'A widget', 10, 2.5),
  ('bbbbbbbb-0000-4000-8000-0000000000bb', 'bbbbbbbb-5555-4000-8000-0000000000bb', 1, 'B widget', 4, 1);

-- Keys, by hash. The application stores HMAC-SHA-256 hex; any 64 hex digits stand in here.
insert into public.api_keys (id, org_id, name, prefix, key_hash, created_by, revoked_at) values
  ('aaaaaaaa-6666-4000-8000-0000000000a1', 'aaaaaaaa-0000-4000-8000-0000000000aa', 'A live', 'tdk_AAAAAAAA', repeat('a', 64), 'a1a1a1a1-0000-4000-8000-00000000a1a1', null),
  ('aaaaaaaa-6666-4000-8000-0000000000a2', 'aaaaaaaa-0000-4000-8000-0000000000aa', 'A revoked', 'tdk_AAAAAAAB', repeat('b', 64), 'a1a1a1a1-0000-4000-8000-00000000a1a1', now()),
  ('aaaaaaaa-6666-4000-8000-0000000000a3', 'aaaaaaaa-0000-4000-8000-0000000000aa', 'A by member', 'tdk_AAAAAAAC', repeat('c', 64), 'a2a2a2a2-0000-4000-8000-00000000a2a2', null),
  ('bbbbbbbb-6666-4000-8000-0000000000b1', 'bbbbbbbb-0000-4000-8000-0000000000bb', 'B live', 'tdk_BBBBBBBB', repeat('d', 64), 'b1b1b1b1-0000-4000-8000-00000000b1b1', null),
  ('cccccccc-6666-4000-8000-0000000000c1', 'cccccccc-0000-4000-8000-0000000000cc', 'C free', 'tdk_CCCCCCCC', repeat('e', 64), 'c1c1c1c1-0000-4000-8000-00000000c1c1', null);

-- A document in org B, generated the ordinary way by its owner.
set local role authenticated;
set local request.jwt.claims = '{"sub":"b1b1b1b1-0000-4000-8000-00000000b1b1","role":"authenticated"}';
select set_config(
  'tests.document_b',
  public.generate_document('bbbbbbbb-5555-4000-8000-0000000000bb', 'commercial_invoice')::text,
  true
);
reset role;

-- ---------------------------------------------------------------------------------------
-- api_keys row security
-- ---------------------------------------------------------------------------------------

set local role authenticated;
set local request.jwt.claims = '{"sub":"a1a1a1a1-0000-4000-8000-00000000a1a1","role":"authenticated"}';
select is(
  (select count(*)::int from public.api_keys),
  3,
  'an owner sees their own organization''s keys and no other'
);
select is(
  (select count(*)::int from public.api_keys where org_id <> 'aaaaaaaa-0000-4000-8000-0000000000aa'),
  0,
  'no key of another organization is visible to an owner'
);
select throws_ok(
  $$select key_hash from public.api_keys$$,
  '42501',
  null,
  'not even an owner can read a key hash'
);
select throws_ok(
  $$insert into public.api_keys (org_id, name, prefix, key_hash)
    values ('aaaaaaaa-0000-4000-8000-0000000000aa', 'x', 'tdk_XXXXXXXX', repeat('9', 64))$$,
  '42501',
  null,
  'a key cannot be inserted directly'
);
select throws_ok(
  $$update public.api_keys set revoked_at = null$$,
  '42501',
  null,
  'a key cannot be updated directly'
);
select throws_ok(
  $$delete from public.api_keys$$,
  '42501',
  null,
  'a key cannot be deleted directly'
);

set local request.jwt.claims = '{"sub":"a2a2a2a2-0000-4000-8000-00000000a2a2","role":"authenticated"}';
select is(
  (select count(*)::int from public.api_keys),
  0,
  'a plain member sees no keys'
);

set local request.jwt.claims = '{"sub":"b1b1b1b1-0000-4000-8000-00000000b1b1","role":"authenticated"}';
select is(
  (select array_agg(name order by name) from public.api_keys),
  array['B live'],
  'another organization''s owner sees only their own key'
);

set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok(
  $$select id from public.api_keys$$,
  '42501',
  null,
  'anon cannot read keys'
);

-- ---------------------------------------------------------------------------------------
-- create_api_key and revoke_api_key
-- ---------------------------------------------------------------------------------------

set local role authenticated;
set local request.jwt.claims = '{"sub":"a1a1a1a1-0000-4000-8000-00000000a1a1","role":"authenticated"}';
select lives_ok(
  $$select public.create_api_key('aaaaaaaa-0000-4000-8000-0000000000aa', 'Ops', 'tdk_AAAAAAAD', repeat('1', 64))$$,
  'an owner of a Team organization creates a key'
);
select throws_ok(
  $$select public.create_api_key('aaaaaaaa-0000-4000-8000-0000000000aa', 'Bad', 'tdk_AAAAAAAE', repeat('a', 63) || 'g')$$,
  '23514',
  null,
  'a malformed hash is refused'
);

set local request.jwt.claims = '{"sub":"a2a2a2a2-0000-4000-8000-00000000a2a2","role":"authenticated"}';
select throws_ok(
  $$select public.create_api_key('aaaaaaaa-0000-4000-8000-0000000000aa', 'Mine', 'tdk_AAAAAAAF', repeat('2', 64))$$,
  '42501',
  null,
  'a plain member cannot create a key'
);
select throws_ok(
  $$select public.revoke_api_key('aaaaaaaa-6666-4000-8000-0000000000a1')$$,
  '42501',
  null,
  'a plain member cannot revoke a key'
);

set local request.jwt.claims = '{"sub":"b1b1b1b1-0000-4000-8000-00000000b1b1","role":"authenticated"}';
select throws_ok(
  $$select public.create_api_key('aaaaaaaa-0000-4000-8000-0000000000aa', 'Theirs', 'tdk_AAAAAAAG', repeat('3', 64))$$,
  '42501',
  null,
  'an owner of another organization cannot create a key for it'
);
select throws_ok(
  $$select public.revoke_api_key('aaaaaaaa-6666-4000-8000-0000000000a1')$$,
  '42501',
  null,
  'an owner of another organization cannot revoke its key'
);

set local request.jwt.claims = '{"sub":"c1c1c1c1-0000-4000-8000-00000000c1c1","role":"authenticated"}';
select throws_ok(
  $$select public.create_api_key('cccccccc-0000-4000-8000-0000000000cc', 'Free', 'tdk_CCCCCCCD', repeat('4', 64))$$,
  '42501',
  'API access is part of the Team plan.',
  'an organization without the Team plan cannot create a key (fail closed)'
);
reset role;

select is(
  (select count(*)::int from public.audit_events
   where org_id = 'aaaaaaaa-0000-4000-8000-0000000000aa' and action = 'api_key.created'
     and metadata ->> 'prefix' = 'tdk_AAAAAAAD' and actor_id = 'a1a1a1a1-0000-4000-8000-00000000a1a1'),
  1,
  'creating a key is audited with its prefix, never its hash'
);
select is(
  (select revoked_at from public.api_keys where id = 'aaaaaaaa-6666-4000-8000-0000000000a1'),
  null,
  'refused revocations changed nothing'
);

-- ---------------------------------------------------------------------------------------
-- Who may call the API routines
-- ---------------------------------------------------------------------------------------

select is(
  (select count(*)::int
   from (values ('anon'), ('authenticated')) as r(role)
   cross join (values
     ('public.api_authenticate(text)'),
     ('public.api_list_shipments(text, integer, timestamptz, uuid)'),
     ('public.api_get_shipment(text, uuid)'),
     ('public.api_create_shipment(text, text, text, jsonb, jsonb)'),
     ('public.api_list_documents(text, uuid, integer, timestamptz, uuid)'),
     ('public.api_get_document(text, uuid)'),
     ('public.api_generate_document(text, text, text, uuid, text)')
   ) as f(fn)
   where has_function_privilege(r.role, f.fn, 'execute')),
  0,
  'neither anon nor authenticated can execute any API routine'
);
select is(
  (select count(*)::int
   from (values
     ('public.api_authenticate(text)'),
     ('public.api_list_shipments(text, integer, timestamptz, uuid)'),
     ('public.api_get_shipment(text, uuid)'),
     ('public.api_create_shipment(text, text, text, jsonb, jsonb)'),
     ('public.api_list_documents(text, uuid, integer, timestamptz, uuid)'),
     ('public.api_get_document(text, uuid)'),
     ('public.api_generate_document(text, text, text, uuid, text)')
   ) as f(fn)
   where has_function_privilege('service_role', f.fn, 'execute')),
  7,
  'service_role can execute every API routine'
);

set local role authenticated;
set local request.jwt.claims = '{"sub":"a1a1a1a1-0000-4000-8000-00000000a1a1","role":"authenticated"}';
select throws_ok(
  $$select public.api_list_shipments(repeat('a', 64), 10)$$,
  '42501',
  null,
  'a signed-in owner cannot call an API routine through the Data API'
);
reset role;

-- ---------------------------------------------------------------------------------------
-- Authentication (service_role)
-- ---------------------------------------------------------------------------------------

set local role service_role;
set local request.jwt.claims = '{"role":"service_role"}';

select is(
  (select public.api_authenticate(repeat('a', 64)) ->> 'org_id'),
  'aaaaaaaa-0000-4000-8000-0000000000aa',
  'a live key resolves to its own organization'
);
select is(
  (select public.api_authenticate(repeat('f', 64)) ->> 'status'),
  'invalid',
  'an unknown key is invalid'
);
select is(
  (select public.api_authenticate('not-a-hash') ->> 'status'),
  'invalid',
  'a malformed hash is invalid'
);
select is(
  (select public.api_authenticate(repeat('b', 64)) ->> 'status'),
  'invalid',
  'a revoked key is invalid'
);
select is(
  (select public.api_authenticate(repeat('b', 64)) ->> 'status'),
  'invalid',
  'a revoked key stays invalid on a second try'
);
select is(
  (select public.api_authenticate(repeat('c', 64)) ->> 'status'),
  'invalid',
  'a key whose creator is not an owner or administrator is invalid'
);
select is(
  (select public.api_authenticate(repeat('e', 64)) ->> 'status'),
  'not_entitled',
  'a key of an organization without the Team plan is refused as not entitled'
);
reset role;

select is(
  (select count(*)::int from public.audit_events
   where action = 'api_key.use_failed' and target_id = 'aaaaaaaa-6666-4000-8000-0000000000a2'
     and metadata ->> 'reason' = 'revoked'),
  1,
  'use of a revoked key is audited once, not once per attempt'
);
select isnt(
  (select last_used_at from public.api_keys where id = 'aaaaaaaa-6666-4000-8000-0000000000a1'),
  null,
  'a successful authentication records when the key was last used'
);

-- ---------------------------------------------------------------------------------------
-- Tenant isolation of every operation (service_role)
-- ---------------------------------------------------------------------------------------

set local role service_role;
set local request.jwt.claims = '{"role":"service_role"}';

select is(
  (select array_agg(value ->> 'reference' order by value ->> 'reference')
   from jsonb_array_elements(public.api_list_shipments(repeat('a', 64), 100))),
  array['API-A1'],
  'listing shipments with A''s key returns A''s shipments only'
);
select is(
  public.api_get_shipment(repeat('a', 64), 'bbbbbbbb-5555-4000-8000-0000000000bb'),
  null,
  'A''s key cannot read B''s shipment'
);
select is(
  (select jsonb_array_length(public.api_get_shipment(repeat('a', 64), 'aaaaaaaa-5555-4000-8000-0000000000aa') -> 'items')),
  1,
  'A''s key reads its own shipment with its lines'
);
select is(
  public.api_list_documents(repeat('a', 64), 'bbbbbbbb-5555-4000-8000-0000000000bb', 100),
  null,
  'A''s key cannot list B''s documents'
);
select is(
  public.api_get_document(repeat('a', 64), current_setting('tests.document_b')::uuid),
  null,
  'A''s key cannot fetch B''s document'
);
select is(
  public.api_generate_document(repeat('a', 64), null, repeat('5', 64), 'bbbbbbbb-5555-4000-8000-0000000000bb', 'commercial_invoice'),
  null,
  'A''s key cannot generate a document on B''s shipment'
);
select throws_ok(
  $$select public.api_list_shipments(repeat('b', 64), 10)$$,
  '28000',
  null,
  'a revoked key cannot list shipments'
);
select throws_ok(
  $$select public.api_list_shipments(repeat('e', 64), 10)$$,
  '28000',
  null,
  'a key without the Team plan cannot list shipments'
);
select throws_ok(
  $$select public.api_create_shipment(repeat('a', 64), null, repeat('6', 64),
      '{"reference":"API-X","exporter_id":"bbbbbbbb-4444-4000-8000-0000000000bb"}', '[]')$$,
  '23503',
  null,
  'A''s key cannot point a new shipment at B''s company'
);

-- Creation, with an Idempotency-Key.
select is(
  (select public.api_create_shipment(repeat('a', 64), 'create-1', repeat('7', 64),
     '{"reference":"API-A2"}', '[{"description":"Gear","quantity":"2.5","unit_price":"3.1"}]') ->> 'status'),
  '201',
  'A''s key creates a shipment'
);
select is(
  (select org_id::text || '/' || created_by::text from public.shipments where reference = 'API-A2'),
  'aaaaaaaa-0000-4000-8000-0000000000aa/a1a1a1a1-0000-4000-8000-00000000a1a1',
  'the shipment belongs to the key''s organization and is credited to the key''s creator'
);
select is(
  (select public.api_create_shipment(repeat('a', 64), 'create-1', repeat('7', 64),
     '{"reference":"API-A2"}', '[{"description":"Gear","quantity":"2.5","unit_price":"3.1"}]') -> 'body' ->> 'id'),
  (select id::text from public.shipments where reference = 'API-A2'),
  'a retried request with the same Idempotency-Key replays the first response'
);
select is(
  (select public.api_create_shipment(repeat('a', 64), 'create-1', repeat('8', 64),
     '{"reference":"API-A3"}', '[]') ->> 'conflict'),
  'true',
  'the same Idempotency-Key with a different request is a conflict'
);
select is(
  (select public.api_create_shipment(repeat('d', 64), 'create-1', repeat('7', 64),
     '{"reference":"API-B2"}', '[]') ->> 'status'),
  '201',
  'Idempotency-Keys are per API key: B''s key is not answered with A''s record'
);

-- Generation through the unchanged routine, acting as the key's creator.
select set_config(
  'tests.generated',
  public.api_generate_document(repeat('a', 64), 'gen-1', repeat('9', 64),
    'aaaaaaaa-5555-4000-8000-0000000000aa', 'commercial_invoice') -> 'body' ->> 'id',
  true
);
select is(
  (select org_id::text || '/' || created_by::text from public.documents
   where id = current_setting('tests.generated')::uuid),
  'aaaaaaaa-0000-4000-8000-0000000000aa/a1a1a1a1-0000-4000-8000-00000000a1a1',
  'a generated document belongs to the key''s organization, issued as the key''s creator'
);
select is(
  current_setting('request.jwt.claims', true),
  '{"role":"service_role"}',
  'the caller''s claims are restored after generation'
);
select is(
  (select public.api_generate_document(repeat('a', 64), 'gen-1', repeat('9', 64),
     'aaaaaaaa-5555-4000-8000-0000000000aa', 'commercial_invoice') -> 'body' ->> 'id'),
  current_setting('tests.generated'),
  'a retried generation replays the first document instead of issuing another'
);
select throws_ok(
  $$select * from public.api_idempotency$$,
  '42501',
  null,
  'stored idempotency records are not readable through the Data API'
);
reset role;

select is(
  (select count(*)::int from public.documents
   where shipment_id = 'aaaaaaaa-5555-4000-8000-0000000000aa'),
  1,
  'exactly one document was issued for the two generation requests'
);

select * from finish();
rollback;
