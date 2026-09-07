-- Trade core: tenant isolation, immutable documents, numbering and staleness.
--
-- The product's claim is that documents in a set cannot disagree. These assertions test the
-- mechanisms that make that true rather than the interface that presents it.

create extension if not exists pgtap;

begin;
select plan(17);

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'authenticated', 'authenticated', 'owner@example.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'authenticated', 'authenticated', 'rival@example.test', '', now(), now(), now());

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';
select set_config('tests.org_a', public.create_organization('Meridian Components')::text, true);

set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select set_config('tests.org_b', public.create_organization('Nordwind Handels')::text, true);

-- Ana builds a shipment with two lines.
set local request.jwt.claims = '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","role":"authenticated"}';
insert into public.companies (org_id, kind, name, country_code)
values (current_setting('tests.org_a')::uuid, 'own', 'Meridian Components Ltd', 'GB');
insert into public.companies (org_id, kind, name, country_code)
values (current_setting('tests.org_a')::uuid, 'customer', 'Nordwind Handels GmbH', 'DE');

insert into public.shipments (org_id, reference, currency, incoterm, exporter_id, consignee_id)
values (
  current_setting('tests.org_a')::uuid, 'SHP-0001', 'EUR', 'FOB',
  (select id from public.companies where kind = 'own'),
  (select id from public.companies where kind = 'customer')
);
select set_config('tests.shipment', (select id::text from public.shipments where reference = 'SHP-0001'), true);

insert into public.shipment_items
  (org_id, shipment_id, position, description, quantity, unit, unit_price, net_weight_kg, package_count)
values
  (current_setting('tests.org_a')::uuid, current_setting('tests.shipment')::uuid, 1,
   'Industrial bearing housing', 1200.000, 'pcs', 15.5000, 4380.000, 60),
  (current_setting('tests.org_a')::uuid, current_setting('tests.shipment')::uuid, 2,
   'Replacement seal kit', 80.000, 'ctn', 26.7500, 96.500, 20);

-- A document cannot be produced from nothing.
insert into public.shipments (org_id, reference) values (current_setting('tests.org_a')::uuid, 'SHP-EMPTY');
select throws_ok(
  format($$select public.generate_document(%L, 'commercial_invoice')$$,
         (select id from public.shipments where reference = 'SHP-EMPTY')),
  '23514',
  null,
  'a document cannot be generated from a shipment with no lines'
);

select lives_ok(
  format($$select set_config('tests.invoice', public.generate_document(%L, 'commercial_invoice')::text, true)$$,
         current_setting('tests.shipment')),
  'an invoice can be generated'
);

-- The figures on the document are computed, not transcribed.
select is(
  (select (snapshot -> 'totals' ->> 'value')::numeric from public.documents where kind = 'commercial_invoice'),
  20740.00::numeric,
  'the invoice total is the sum of its lines'
);
select is(
  (select (snapshot -> 'totals' ->> 'net_weight_kg')::numeric from public.documents where kind = 'commercial_invoice'),
  4476.500::numeric,
  'the net weight total is the sum of its lines'
);
select is(
  (select jsonb_array_length(snapshot -> 'items') from public.documents where kind = 'commercial_invoice'),
  2,
  'every line is carried into the snapshot'
);

-- The whole promise: a second document quotes the same figures as the first.
select lives_ok(
  format($$select public.generate_document(%L, 'packing_list')$$, current_setting('tests.shipment')),
  'a packing list can be generated from the same shipment'
);
select is(
  (select count(distinct snapshot -> 'totals' ->> 'quantity')::int from public.documents),
  1,
  'the invoice and the packing list report one quantity between them'
);

-- Numbering.
select isnt(
  (select number from public.documents where kind = 'commercial_invoice'),
  (select number from public.documents where kind = 'packing_list'),
  'each document takes its own number'
);
select matches(
  (select number from public.documents where kind = 'commercial_invoice'),
  '^CI-[0-9]{4}-0001$',
  'the invoice number carries its type, period and sequence'
);
select lives_ok(
  format($$select public.generate_document(%L, 'commercial_invoice')$$, current_setting('tests.shipment')),
  'a second invoice can be generated'
);
select is(
  (select count(distinct number)::int from public.documents where kind = 'commercial_invoice'),
  2,
  'a repeated allocation never reuses a number'
);

-- A generated document is evidence and cannot be rewritten.
select throws_ok(
  $$update public.documents set snapshot = '{"tampered":true}'::jsonb
    where kind = 'packing_list'$$,
  '23514',
  null,
  'a generated document cannot be rewritten'
);

-- Changing the shipment must not change documents already sent.
select is(
  (select shipment_revision from public.documents where kind = 'packing_list'),
  (select revision from public.shipments where reference = 'SHP-0001'),
  'a fresh document matches the shipment revision it came from'
);
update public.shipment_items set quantity = 1300.000 where position = 1;
select cmp_ok(
  (select shipment_revision from public.documents where kind = 'packing_list'),
  '<',
  (select revision from public.shipments where reference = 'SHP-0001'),
  'editing the shipment leaves the earlier document detectably stale'
);
select is(
  (select (snapshot -> 'totals' ->> 'quantity')::numeric from public.documents where kind = 'packing_list'),
  1280.000::numeric,
  'the earlier document still reports what it was generated with'
);

-- Isolation.
set local request.jwt.claims = '{"sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","role":"authenticated"}';
select is(
  (select count(*)::int from public.shipments) + (select count(*)::int from public.companies)
    + (select count(*)::int from public.documents),
  0,
  'another tenant reads no shipment, company or document'
);
select throws_ok(
  format($$select public.generate_document(%L, 'commercial_invoice')$$, current_setting('tests.shipment')),
  '42501',
  null,
  'another tenant cannot generate a document from a shipment it cannot see'
);

select * from finish();
rollback;
