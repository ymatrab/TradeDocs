-- E-signature (D-025): tenant isolation of public.esign_requests, the private esign-signed
-- bucket, service-role-only routines, the paid gate in SQL, final-document-only sends,
-- idempotent callback events, end states that never move, and the write-once signed copy.

create extension if not exists pgtap;

begin;
select plan(41);

-- Fixtures, created as the migration owner before any role switch.
--   Org A: Pro, current.   Org B: Team, current.   Org C: free (no entitlement).
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'e1a1a1a1-0000-4000-8000-00000000a1a1', 'authenticated', 'authenticated', 'owner.a@esign.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'e2a2a2a2-0000-4000-8000-00000000a2a2', 'authenticated', 'authenticated', 'member.a@esign.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'e1b1b1b1-0000-4000-8000-00000000b1b1', 'authenticated', 'authenticated', 'owner.b@esign.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'e1c1c1c1-0000-4000-8000-00000000c1c1', 'authenticated', 'authenticated', 'owner.c@esign.test', '', now(), now(), now());

insert into public.organizations (id, name) values
  ('eaaaaaaa-0000-4000-8000-0000000000aa', 'Esign Org A'),
  ('ebbbbbbb-0000-4000-8000-0000000000bb', 'Esign Org B'),
  ('eccccccc-0000-4000-8000-0000000000cc', 'Esign Org C');
insert into public.memberships (org_id, user_id, role) values
  ('eaaaaaaa-0000-4000-8000-0000000000aa', 'e1a1a1a1-0000-4000-8000-00000000a1a1', 'owner'),
  ('eaaaaaaa-0000-4000-8000-0000000000aa', 'e2a2a2a2-0000-4000-8000-00000000a2a2', 'member'),
  ('ebbbbbbb-0000-4000-8000-0000000000bb', 'e1b1b1b1-0000-4000-8000-00000000b1b1', 'owner'),
  ('eccccccc-0000-4000-8000-0000000000cc', 'e1c1c1c1-0000-4000-8000-00000000c1c1', 'owner');

insert into public.entitlements (org_id, plan, status, customer_ref, subscription_ref, checkout_ref, paid_through)
values
  ('eaaaaaaa-0000-4000-8000-0000000000aa', 'pro', 'active', 'cus_EsignA', 'sub_EsignA', 'cs_test_EsignA', now() + interval '30 days'),
  ('ebbbbbbb-0000-4000-8000-0000000000bb', 'team', 'active', 'cus_EsignB', 'sub_EsignB', 'cs_test_EsignB', now() + interval '30 days');

insert into public.companies (id, org_id, kind, name) values
  ('eaaaaaaa-4444-4000-8000-0000000000aa', 'eaaaaaaa-0000-4000-8000-0000000000aa', 'own', 'Esign Exports A'),
  ('ebbbbbbb-4444-4000-8000-0000000000bb', 'ebbbbbbb-0000-4000-8000-0000000000bb', 'own', 'Esign Exports B'),
  ('eccccccc-4444-4000-8000-0000000000cc', 'eccccccc-0000-4000-8000-0000000000cc', 'own', 'Esign Exports C');
insert into public.shipments (id, org_id, reference, currency, exporter_id) values
  ('eaaaaaaa-5555-4000-8000-0000000000aa', 'eaaaaaaa-0000-4000-8000-0000000000aa', 'ES-A', 'EUR', 'eaaaaaaa-4444-4000-8000-0000000000aa'),
  ('ebbbbbbb-5555-4000-8000-0000000000bb', 'ebbbbbbb-0000-4000-8000-0000000000bb', 'ES-B', 'EUR', 'ebbbbbbb-4444-4000-8000-0000000000bb'),
  ('eccccccc-5555-4000-8000-0000000000cc', 'eccccccc-0000-4000-8000-0000000000cc', 'ES-C', 'EUR', 'eccccccc-4444-4000-8000-0000000000cc');

-- Documents inserted directly as the owner: A final, A voided, B final, C final.
insert into public.documents (id, org_id, shipment_id, kind, number, shipment_revision, snapshot, status) values
  ('eaaaaaaa-6666-4000-8000-0000000000a1', 'eaaaaaaa-0000-4000-8000-0000000000aa', 'eaaaaaaa-5555-4000-8000-0000000000aa', 'commercial_invoice', 'ES-CI-A-1', 1, '{"schema_version":4}', 'final'),
  ('eaaaaaaa-6666-4000-8000-0000000000a2', 'eaaaaaaa-0000-4000-8000-0000000000aa', 'eaaaaaaa-5555-4000-8000-0000000000aa', 'packing_list', 'ES-PL-A-1', 1, '{"schema_version":4}', 'voided'),
  ('ebbbbbbb-6666-4000-8000-0000000000b1', 'ebbbbbbb-0000-4000-8000-0000000000bb', 'ebbbbbbb-5555-4000-8000-0000000000bb', 'commercial_invoice', 'ES-CI-B-1', 1, '{"schema_version":4}', 'final'),
  ('eccccccc-6666-4000-8000-0000000000c1', 'eccccccc-0000-4000-8000-0000000000cc', 'eccccccc-5555-4000-8000-0000000000cc', 'commercial_invoice', 'ES-CI-C-1', 1, '{"schema_version":4}', 'final');

select set_config('tests.signers', '[{"email":"buyer@example.test","name":"Buyer","status":"awaiting_signature","signed_at":null}]', true);
select set_config('tests.sha', repeat('a', 64), true);

-- ---------------------------------------------------------------------------------------
-- Shape and grants
-- ---------------------------------------------------------------------------------------

select is(
  (select public from storage.buckets where id = 'esign-signed'),
  false,
  'the signed-copy bucket is private'
);
select is(
  (select allowed_mime_types from storage.buckets where id = 'esign-signed'),
  array['application/pdf'],
  'the signed-copy bucket accepts PDF only'
);
select is(
  (select count(*)::int from pg_policies
   where schemaname = 'storage' and tablename = 'objects' and policyname like 'esign_signed%'
     and cmd <> 'SELECT'),
  0,
  'no policy lets an API role write, overwrite or delete a signed copy'
);
select ok(
  not has_table_privilege('authenticated', 'public.esign_requests', 'INSERT')
  and not has_table_privilege('authenticated', 'public.esign_requests', 'UPDATE')
  and not has_table_privilege('authenticated', 'public.esign_requests', 'DELETE'),
  'members cannot write signature requests directly'
);
select ok(
  not has_table_privilege('anon', 'public.esign_requests', 'SELECT'),
  'anon cannot read signature requests'
);
select ok(
  not has_table_privilege('service_role', 'public.esign_requests', 'INSERT')
  and not has_table_privilege('service_role', 'public.esign_requests', 'UPDATE'),
  'the service role writes only through the routines'
);
select ok(
  not has_function_privilege('authenticated', 'public.esign_create_request(uuid, uuid, uuid, jsonb, text, boolean, text)', 'EXECUTE')
  and not has_function_privilege('anon', 'public.esign_create_request(uuid, uuid, uuid, jsonb, text, boolean, text)', 'EXECUTE'),
  'members and anon cannot create requests through the routine'
);
select ok(
  not has_function_privilege('authenticated', 'public.esign_apply_event(text, text, uuid, text, text, jsonb)', 'EXECUTE')
  and not has_function_privilege('authenticated', 'public.esign_attach_signed(uuid, text, text, integer)', 'EXECUTE')
  and not has_function_privilege('authenticated', 'public.esign_mark_sent(uuid, text, jsonb)', 'EXECUTE')
  and not has_function_privilege('authenticated', 'public.esign_record_download(uuid, uuid)', 'EXECUTE'),
  'members cannot apply events, attach copies, mark sends or forge downloads'
);
select ok(
  has_function_privilege('service_role', 'public.esign_apply_event(text, text, uuid, text, text, jsonb)', 'EXECUTE'),
  'the service role applies callback events'
);

-- ---------------------------------------------------------------------------------------
-- Creating requests (service role, as the server action does)
-- ---------------------------------------------------------------------------------------

set local role service_role;
set local request.jwt.claims = '{"role":"service_role"}';

select lives_ok(
  $$select set_config('tests.req_a', public.esign_create_request(
      'eaaaaaaa-0000-4000-8000-0000000000aa', 'eaaaaaaa-6666-4000-8000-0000000000a1',
      'e2a2a2a2-0000-4000-8000-00000000a2a2', current_setting('tests.signers')::jsonb,
      'Please sign', true, current_setting('tests.sha'))::text, true)$$,
  'a plain member of a Pro organization can request a signature on a final document'
);
select lives_ok(
  $$select set_config('tests.req_b', public.esign_create_request(
      'ebbbbbbb-0000-4000-8000-0000000000bb', 'ebbbbbbb-6666-4000-8000-0000000000b1',
      'e1b1b1b1-0000-4000-8000-00000000b1b1', current_setting('tests.signers')::jsonb,
      null, true, current_setting('tests.sha'))::text, true)$$,
  'a Team organization can request a signature'
);
select throws_ok(
  $$select public.esign_create_request(
      'eccccccc-0000-4000-8000-0000000000cc', 'eccccccc-6666-4000-8000-0000000000c1',
      'e1c1c1c1-0000-4000-8000-00000000c1c1', current_setting('tests.signers')::jsonb,
      null, true, current_setting('tests.sha'))$$,
  '42501',
  null,
  'a free organization is refused by the database (paid gate, fail closed)'
);
select throws_ok(
  $$select public.esign_create_request(
      'eaaaaaaa-0000-4000-8000-0000000000aa', 'eaaaaaaa-6666-4000-8000-0000000000a2',
      'e1a1a1a1-0000-4000-8000-00000000a1a1', current_setting('tests.signers')::jsonb,
      null, true, current_setting('tests.sha'))$$,
  '23514',
  null,
  'a voided document cannot be sent for signature'
);
select throws_ok(
  $$select public.esign_create_request(
      'eaaaaaaa-0000-4000-8000-0000000000aa', 'ebbbbbbb-6666-4000-8000-0000000000b1',
      'e1a1a1a1-0000-4000-8000-00000000a1a1', current_setting('tests.signers')::jsonb,
      null, true, current_setting('tests.sha'))$$,
  '42501',
  null,
  'another organization''s document cannot be sent under this organization'
);
select throws_ok(
  $$select public.esign_create_request(
      'eaaaaaaa-0000-4000-8000-0000000000aa', 'eaaaaaaa-6666-4000-8000-0000000000a1',
      'e1b1b1b1-0000-4000-8000-00000000b1b1', current_setting('tests.signers')::jsonb,
      null, true, current_setting('tests.sha'))$$,
  '42501',
  null,
  'a user who is not a member cannot send the organization''s document'
);
select throws_ok(
  $$select public.esign_create_request(
      'eaaaaaaa-0000-4000-8000-0000000000aa', 'eaaaaaaa-6666-4000-8000-0000000000a1',
      'e1a1a1a1-0000-4000-8000-00000000a1a1', '[]'::jsonb,
      null, true, current_setting('tests.sha'))$$,
  '23514',
  null,
  'a request needs at least one signer'
);
-- Mark A sent; B stays sending.
select lives_ok(
  $$select public.esign_mark_sent(current_setting('tests.req_a')::uuid, 'fa5c9a166732164420acd5b1ae5d4a8fe31dbfa0', null)$$,
  'a request is marked sent with the provider id'
);
select is(
  (select status from public.esign_requests where id = current_setting('tests.req_a')::uuid),
  'sent',
  'the request is sent'
);

-- ---------------------------------------------------------------------------------------
-- Tenant isolation (as members)
-- ---------------------------------------------------------------------------------------

set local role authenticated;
set local request.jwt.claims = '{"sub":"e2a2a2a2-0000-4000-8000-00000000a2a2","role":"authenticated"}';
select is(
  (select count(*)::int from public.esign_requests),
  1,
  'a member of A sees only A''s request'
);
select is(
  (select count(*)::int from public.esign_requests where org_id = 'ebbbbbbb-0000-4000-8000-0000000000bb'),
  0,
  'a member of A cannot see B''s request'
);
select throws_ok(
  $$update public.esign_requests set status = 'signed' where id = current_setting('tests.req_a')::uuid$$,
  '42501',
  null,
  'a member cannot change a request''s status directly'
);
select throws_ok(
  $$insert into public.esign_requests (org_id, document_id, document_number, original_sha256, test_mode, signers)
    values ('eaaaaaaa-0000-4000-8000-0000000000aa', 'eaaaaaaa-6666-4000-8000-0000000000a1', 'X', current_setting('tests.sha'), false, current_setting('tests.signers')::jsonb)$$,
  '42501',
  null,
  'a member cannot insert a request directly'
);
select throws_ok(
  $$select public.esign_apply_event(repeat('1', 64), 'signature_request_all_signed', current_setting('tests.req_a')::uuid, 'fa5c9a166732164420acd5b1ae5d4a8fe31dbfa0', 'signed', null)$$,
  '42501',
  null,
  'a member cannot apply a callback event'
);

set local request.jwt.claims = '{"sub":"e1c1c1c1-0000-4000-8000-00000000c1c1","role":"authenticated"}';
select is(
  (select count(*)::int from public.esign_requests),
  0,
  'a member of C sees no other organization''s requests'
);

set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok(
  $$select count(*) from public.esign_requests$$,
  '42501',
  null,
  'anon cannot read requests'
);

-- ---------------------------------------------------------------------------------------
-- Callback events (service role)
-- ---------------------------------------------------------------------------------------

set local role service_role;
set local request.jwt.claims = '{"role":"service_role"}';

select is(
  public.esign_apply_event(repeat('2', 64), 'signature_request_viewed', current_setting('tests.req_a')::uuid, 'fa5c9a166732164420acd5b1ae5d4a8fe31dbfa0', 'sent', null),
  'applied',
  'a verified event is applied'
);
select is(
  public.esign_apply_event(repeat('2', 64), 'signature_request_viewed', current_setting('tests.req_a')::uuid, 'fa5c9a166732164420acd5b1ae5d4a8fe31dbfa0', 'sent', null),
  'duplicate',
  'the same event again is a duplicate and changes nothing'
);
select is(
  public.esign_event_recorded(repeat('2', 64)),
  true,
  'the ledger records the applied event'
);
select is(
  public.esign_apply_event(repeat('3', 64), 'signature_request_all_signed', current_setting('tests.req_a')::uuid, 'ffffffffffffffffffffffffffffffffffffffff', 'signed', null),
  'unmatched',
  'an event whose provider id does not match the request is not applied'
);
select is(
  public.esign_apply_event(repeat('4', 64), 'signature_request_all_signed', current_setting('tests.req_b')::uuid, 'b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0', 'signed', null),
  'applied',
  'a request whose send was never confirmed is matched by its own id and adopts the provider id'
);
select is(
  (select provider_request_id from public.esign_requests where id = current_setting('tests.req_b')::uuid),
  'b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0',
  'the provider id is recorded from the verified live state'
);

select is(
  public.esign_apply_event(repeat('5', 64), 'signature_request_all_signed', current_setting('tests.req_a')::uuid, 'fa5c9a166732164420acd5b1ae5d4a8fe31dbfa0', 'signed', null),
  'applied',
  'the completed state is applied'
);
select is(
  public.esign_apply_event(repeat('6', 64), 'signature_request_declined', current_setting('tests.req_a')::uuid, 'fa5c9a166732164420acd5b1ae5d4a8fe31dbfa0', 'declined', null),
  'ignored',
  'a later event cannot move a signed request out of its end state'
);
select is(
  (select status from public.esign_requests where id = current_setting('tests.req_a')::uuid),
  'signed',
  'the request stays signed'
);

-- ---------------------------------------------------------------------------------------
-- The signed copy (a new artifact; the original is untouched)
-- ---------------------------------------------------------------------------------------

select set_config('tests.signed_path',
  'org/eaaaaaaa-0000-4000-8000-0000000000aa/esign/' || current_setting('tests.req_a') || '/' || repeat('b', 64) || '.pdf', true);

select is(
  public.esign_attach_signed(current_setting('tests.req_a')::uuid, current_setting('tests.signed_path'), repeat('b', 64), 1234),
  'stored',
  'the signed copy is recorded'
);
select is(
  public.esign_attach_signed(current_setting('tests.req_a')::uuid, current_setting('tests.signed_path'), repeat('b', 64), 1234),
  'already',
  'recording the same signed copy again is a no-op'
);
select throws_ok(
  $$select public.esign_attach_signed(current_setting('tests.req_a')::uuid,
      'org/eaaaaaaa-0000-4000-8000-0000000000aa/esign/' || current_setting('tests.req_a') || '/' || repeat('c', 64) || '.pdf',
      repeat('c', 64), 999)$$,
  '23514',
  null,
  'a different signed copy cannot replace the one stored'
);
reset role;

select is(
  (select status || '|' || number from public.documents where id = 'eaaaaaaa-6666-4000-8000-0000000000a1'),
  'final|ES-CI-A-1',
  'the original document is unchanged by signing'
);

select is(
  (select count(*)::int from public.audit_events
   where action = 'esign.requested' and target_id = current_setting('tests.req_a')),
  1,
  'creating a request writes an audit event'
);
select ok(
  (select metadata::text not like '%buyer@example.test%' from public.audit_events
   where action = 'esign.requested' and target_id = current_setting('tests.req_a')),
  'the audit event does not carry signer email addresses'
);

select is(
  (select count(*)::int from public.audit_events
   where action = 'esign.signed_stored' and target_id = current_setting('tests.req_a')),
  1,
  'storing the signed copy writes one audit event with its lineage'
);

select * from finish();
rollback;
