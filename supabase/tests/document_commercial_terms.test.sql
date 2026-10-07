-- Snapshot schema 6 (20261007000200_document_commercial_terms.sql): the buyer reference and
-- the proforma validity date are recorded only when the shipment states one, every other
-- snapshot keeps the schema it had, and the new columns follow the shipments policies.

create extension if not exists pgtap;

begin;
select plan(9);

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'c6c6c6c6-0000-4000-8000-00000000c6c6', 'authenticated', 'authenticated', 'cora@owner.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'd6d6d6d6-0000-4000-8000-00000000d6d6', 'authenticated', 'authenticated', 'dan@rival.test', '', now(), now(), now());

set local role authenticated;
set local request.jwt.claims = '{"sub":"c6c6c6c6-0000-4000-8000-00000000c6c6","role":"authenticated"}';
select set_config('tests.org', public.create_organization('Corvid Trading')::text, true);
set local request.jwt.claims = '{"sub":"d6d6d6d6-0000-4000-8000-00000000d6d6","role":"authenticated"}';
select set_config('tests.rival_org', public.create_organization('Rival Freight')::text, true);

set local request.jwt.claims = '{"sub":"c6c6c6c6-0000-4000-8000-00000000c6c6","role":"authenticated"}';
with created as (
  insert into public.shipments (org_id, reference, currency)
  values (current_setting('tests.org')::uuid, 'COR-1', 'EUR')
  returning id
)
select set_config('tests.shipment', id::text, true) from created;
insert into public.shipment_items (org_id, shipment_id, position, description, quantity, unit_price)
values (current_setting('tests.org')::uuid, current_setting('tests.shipment')::uuid, 1, 'Copper fitting', 10, 3);

select is(
  (select public.preview_document(current_setting('tests.shipment')::uuid, 'proforma_invoice') ->> 'schema_version'),
  '4',
  'a shipment without a buyer reference or validity date keeps snapshot schema 4'
);
select ok(
  not ((public.preview_document(current_setting('tests.shipment')::uuid, 'proforma_invoice') -> 'shipment') ? 'buyer_reference'),
  'a schema 4 snapshot carries no buyer_reference key at all'
);

select throws_ok(
  $$update public.shipments set buyer_reference = '   '
    where id = current_setting('tests.shipment')::uuid$$,
  '23514',
  null,
  'a blank buyer reference is refused; absent is null'
);
select throws_ok(
  $$update public.shipments set buyer_reference = repeat('P', 61)
    where id = current_setting('tests.shipment')::uuid$$,
  '23514',
  null,
  'a buyer reference is at most 60 characters'
);

update public.shipments
set buyer_reference = 'PO-4471', proforma_valid_until = '2026-11-30'
where id = current_setting('tests.shipment')::uuid;

select is(
  (select public.preview_document(current_setting('tests.shipment')::uuid, 'proforma_invoice') ->> 'schema_version'),
  '6',
  'a shipment that states its commercial terms follows schema 6'
);
select is(
  (select public.preview_document(current_setting('tests.shipment')::uuid, 'proforma_invoice') -> 'shipment' ->> 'buyer_reference'),
  'PO-4471',
  'the snapshot records the buyer reference'
);
select set_config(
  'tests.document',
  public.generate_document(current_setting('tests.shipment')::uuid, 'proforma_invoice')::text,
  true
);
select is(
  (select snapshot -> 'shipment' ->> 'proforma_valid_until' from public.documents
   where id = current_setting('tests.document')::uuid),
  '2026-11-30',
  'a generated proforma records its validity date'
);

-- Another tenant can neither read nor set the new fields.
set local request.jwt.claims = '{"sub":"d6d6d6d6-0000-4000-8000-00000000d6d6","role":"authenticated"}';
select is(
  (select count(*)::int from public.shipments
   where id = current_setting('tests.shipment')::uuid and buyer_reference is not null),
  0,
  'another tenant does not see the buyer reference'
);
with attempted as (
  update public.shipments set buyer_reference = 'HIJACK'
  where id = current_setting('tests.shipment')::uuid
  returning 1
)
select is((select count(*)::int from attempted), 0, 'another tenant cannot change the buyer reference');

select * from finish();
rollback;
