-- Sales and shipping documents (20261009000100_sales_and_shipping_documents.sql): the seven
-- new kinds generate with their own number prefixes, the container and VGM fields are
-- validated and recorded only when stated (schema 7), a VGM declaration needs its SOLAS
-- facts, and the new columns follow the shipments policies across tenants.

create extension if not exists pgtap;

begin;
select plan(20);

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'c7c7c7c7-0000-4000-8000-00000000c7c7', 'authenticated', 'authenticated', 'cleo@owner.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'd7d7d7d7-0000-4000-8000-00000000d7d7', 'authenticated', 'authenticated', 'dov@rival.test', '', now(), now(), now());

set local role authenticated;
set local request.jwt.claims = '{"sub":"c7c7c7c7-0000-4000-8000-00000000c7c7","role":"authenticated"}';
select set_config('tests.org', public.create_organization('Cormorant Trading')::text, true);
set local request.jwt.claims = '{"sub":"d7d7d7d7-0000-4000-8000-00000000d7d7","role":"authenticated"}';
select set_config('tests.rival_org', public.create_organization('Rival Lines')::text, true);

set local request.jwt.claims = '{"sub":"c7c7c7c7-0000-4000-8000-00000000c7c7","role":"authenticated"}';
with created as (
  insert into public.shipments (org_id, reference, currency)
  values (current_setting('tests.org')::uuid, 'CRM-1', 'EUR')
  returning id
)
select set_config('tests.shipment', id::text, true) from created;
insert into public.shipment_items (org_id, shipment_id, position, description, quantity, unit_price)
values (current_setting('tests.org')::uuid, current_setting('tests.shipment')::uuid, 1, 'Brass valve', 10, 3);

-- Without container or VGM fields the snapshot keeps its schema and carries none of the keys.
select is(
  (select public.preview_document(current_setting('tests.shipment')::uuid, 'quotation') ->> 'schema_version'),
  '4',
  'a shipment without container or VGM fields keeps snapshot schema 4 for a new kind'
);
select ok(
  not ((public.preview_document(current_setting('tests.shipment')::uuid, 'commercial_invoice') -> 'shipment') ? 'container_number'),
  'a schema 4 snapshot carries no container_number key at all'
);

-- Each new kind generates under its own prefix.
select matches(
  (select number from public.documents where id = public.generate_document(current_setting('tests.shipment')::uuid, 'quotation')),
  '^QT-', 'a quotation is numbered QT-');
select matches(
  (select number from public.documents where id = public.generate_document(current_setting('tests.shipment')::uuid, 'purchase_order')),
  '^PO-', 'a purchase order is numbered PO-');
select matches(
  (select number from public.documents where id = public.generate_document(current_setting('tests.shipment')::uuid, 'sales_confirmation')),
  '^SC-', 'a sales confirmation is numbered SC-');
select matches(
  (select number from public.documents where id = public.generate_document(current_setting('tests.shipment')::uuid, 'sales_contract')),
  '^CT-', 'a sales contract draft is numbered CT-');
select matches(
  (select number from public.documents where id = public.generate_document(current_setting('tests.shipment')::uuid, 'bill_of_lading_draft')),
  '^BL-', 'a bill of lading draft is numbered BL-');
select matches(
  (select number from public.documents where id = public.generate_document(current_setting('tests.shipment')::uuid, 'shipper_letter_of_instruction')),
  '^SLI-', 'a shipper''s letter of instruction is numbered SLI-');

select throws_ok(
  $$select public.generate_document(current_setting('tests.shipment')::uuid, 'vgm_declaration')$$,
  '23514',
  null,
  'a VGM declaration is refused while the shipment states no container, method, mass or signatory'
);
select throws_ok(
  $$select public.generate_document(current_setting('tests.shipment')::uuid, 'dangerous_goods_declaration')$$,
  '23514',
  null,
  'an unknown kind is still refused'
);

-- Validation of the new columns.
select throws_ok(
  $$update public.shipments set container_number = 'MSCU123456'
    where id = current_setting('tests.shipment')::uuid$$,
  '23514', null, 'a container number must be four letters and seven digits');
select throws_ok(
  $$update public.shipments set vgm_method = 3
    where id = current_setting('tests.shipment')::uuid$$,
  '23514', null, 'the VGM method is 1 or 2');
select throws_ok(
  $$update public.shipments set vgm_kg = 0
    where id = current_setting('tests.shipment')::uuid$$,
  '23514', null, 'a verified gross mass is positive');
select throws_ok(
  $$update public.shipments set vgm_signatory = '  '
    where id = current_setting('tests.shipment')::uuid$$,
  '23514', null, 'a blank signatory is refused; absent is null');

update public.shipments
set container_number = 'MSCU1234566', container_type = '40HC', seal_number = 'SL-889',
    booking_number = 'BK-77', vgm_method = 1, vgm_kg = 18250.5, vgm_weighed_on = '2026-10-08',
    vgm_signatory = 'CLEO OWNER'
where id = current_setting('tests.shipment')::uuid;

select is(
  (select public.preview_document(current_setting('tests.shipment')::uuid, 'vgm_declaration') ->> 'schema_version'),
  '7',
  'a shipment that states container or VGM fields follows schema 7'
);
select set_config(
  'tests.vgm',
  public.generate_document(current_setting('tests.shipment')::uuid, 'vgm_declaration')::text,
  true
);
select is(
  (select number from public.documents where id = current_setting('tests.vgm')::uuid) ~ '^VGM-',
  true,
  'a VGM declaration is numbered VGM-'
);
select is(
  (select (snapshot -> 'shipment' ->> 'vgm_kg')::numeric from public.documents
   where id = current_setting('tests.vgm')::uuid),
  18250.5::numeric,
  'the VGM declaration records the verified gross mass'
);
select is(
  (select snapshot -> 'shipment' ->> 'container_number' from public.documents
   where id = current_setting('tests.vgm')::uuid),
  'MSCU1234566',
  'the VGM declaration records the container number'
);

-- Another tenant can neither read nor set the new fields.
set local request.jwt.claims = '{"sub":"d7d7d7d7-0000-4000-8000-00000000d7d7","role":"authenticated"}';
select is(
  (select count(*)::int from public.shipments
   where id = current_setting('tests.shipment')::uuid and container_number is not null),
  0,
  'another tenant does not see the container number'
);
with attempted as (
  update public.shipments set vgm_kg = 1
  where id = current_setting('tests.shipment')::uuid
  returning 1
)
select is((select count(*)::int from attempted), 0, 'another tenant cannot change the verified gross mass');

select * from finish();
rollback;
