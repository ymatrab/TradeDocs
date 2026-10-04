-- Master data, packing and cross-tenant references.
--
-- trade_core.test.sql proves a tenant cannot read another's rows. This file proves the
-- harder half: a tenant cannot make its own rows point at another's, and the definer
-- routines that copy data between tables never copy across that line.

create extension if not exists pgtap;

begin;
select plan(40);

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'authenticated', 'authenticated', 'ana@meridian.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'authenticated', 'authenticated', 'ben@rival.test', '', now(), now(), now());

set local role authenticated;
set local request.jwt.claims = '{"sub":"cccccccc-cccc-cccc-cccc-cccccccccccc","role":"authenticated"}';
select set_config('tests.org_a', public.create_organization('Meridian Components')::text, true);

set local request.jwt.claims = '{"sub":"dddddddd-dddd-dddd-dddd-dddddddddddd","role":"authenticated"}';
select set_config('tests.org_b', public.create_organization('Rival Trading')::text, true);

-- The rival's own records, whose ids the first tenant will then try to borrow.
with created as (
  insert into public.companies (org_id, kind, name)
  values (current_setting('tests.org_b')::uuid, 'customer', 'Rival Buyer')
  returning id
)
select set_config('tests.company_b', id::text, true) from created;
with created as (
  insert into public.products (org_id, sku, description, unit_price)
  values (current_setting('tests.org_b')::uuid, 'RIV-1', 'Rival widget', 2.5)
  returning id
)
select set_config('tests.product_b', id::text, true) from created;
with created as (
  insert into public.shipments (org_id, reference)
  values (current_setting('tests.org_b')::uuid, 'RIV-0001')
  returning id
)
select set_config('tests.shipment_b', id::text, true) from created;
with created as (
  insert into public.shipment_items (org_id, shipment_id, description, quantity)
  values (current_setting('tests.org_b')::uuid, current_setting('tests.shipment_b')::uuid, 'Rival line', 1)
  returning id
)
select set_config('tests.item_b', id::text, true) from created;
with created as (
  insert into public.shipment_packages (org_id, shipment_id)
  values (current_setting('tests.org_b')::uuid, current_setting('tests.shipment_b')::uuid)
  returning id
)
select set_config('tests.package_b', id::text, true) from created;

-- The first tenant's records.
set local request.jwt.claims = '{"sub":"cccccccc-cccc-cccc-cccc-cccccccccccc","role":"authenticated"}';
with created as (
  insert into public.companies (org_id, kind, name)
  values (current_setting('tests.org_a')::uuid, 'own', 'Meridian Components Ltd')
  returning id
)
select set_config('tests.company_a', id::text, true) from created;
with created as (
  insert into public.shipments (org_id, reference)
  values (current_setting('tests.org_a')::uuid, 'SHP-1')
  returning id
)
select set_config('tests.shipment_a', id::text, true) from created;
with created as (
  insert into public.shipments (org_id, reference)
  values (current_setting('tests.org_a')::uuid, 'SHP-2')
  returning id
)
select set_config('tests.shipment_a2', id::text, true) from created;

-- Products.
select lives_ok(
  $$insert into public.products (org_id, sku, description, unit_price, net_weight_kg)
    values (current_setting('tests.org_a')::uuid, 'MC-100', 'Bearing housing', 15.5, 3.65)$$,
  'a member can add a catalog entry'
);
select is((select count(*)::int from public.products), 1, 'a member reads only their own catalog');

set local request.jwt.claims = '{"sub":"dddddddd-dddd-dddd-dddd-dddddddddddd","role":"authenticated"}';
select is(
  (select count(*)::int from public.products where org_id = current_setting('tests.org_a')::uuid),
  0,
  'another tenant reads no catalog entry'
);
select throws_ok(
  $$insert into public.products (org_id, description)
    values (current_setting('tests.org_a')::uuid, 'Planted entry')$$,
  '42501',
  null,
  'another tenant cannot write into a catalog'
);
with attempted as (
  update public.products set unit_price = 0
  where org_id = current_setting('tests.org_a')::uuid
  returning 1
)
select is((select count(*)::int from attempted), 0, 'another tenant cannot change a catalog entry');
with attempted as (
  delete from public.products where org_id = current_setting('tests.org_a')::uuid returning 1
)
select is((select count(*)::int from attempted), 0, 'another tenant cannot delete a catalog entry');

-- Catalog import.
set local request.jwt.claims = '{"sub":"cccccccc-cccc-cccc-cccc-cccccccccccc","role":"authenticated"}';
select is(
  public.import_products(
    current_setting('tests.org_a')::uuid,
    '[{"sku":"MC-200","description":"Seal kit","unit_price":"26.75"},
      {"sku":"mc-100","description":"Bearing housing, revised","unit_price":"16","net_weight_kg":"3.65"}]'::jsonb
  ),
  '{"inserted":1,"updated":1}'::jsonb,
  'an import adds new articles and corrects known ones by SKU'
);
select throws_ok(
  $$select public.import_products(current_setting('tests.org_a')::uuid, '[{"description":""}]'::jsonb)$$,
  '23514',
  null,
  'an import with an invalid row is rejected whole'
);

set local request.jwt.claims = '{"sub":"dddddddd-dddd-dddd-dddd-dddddddddddd","role":"authenticated"}';
select throws_ok(
  $$select public.import_products(current_setting('tests.org_a')::uuid, '[{"description":"x"}]'::jsonb)$$,
  '42501',
  null,
  'another tenant cannot import into a catalog'
);

-- Adding from the catalog.
set local request.jwt.claims = '{"sub":"cccccccc-cccc-cccc-cccc-cccccccccccc","role":"authenticated"}';
select lives_ok(
  $$select set_config(
      'tests.item_a',
      public.add_product_to_shipment(
        current_setting('tests.shipment_a')::uuid,
        (select id from public.products where sku = 'MC-100'),
        10
      )::text,
      true
    )$$,
  'a catalog entry can be added to a shipment'
);
select is(
  (select net_weight_kg from public.shipment_items where id = current_setting('tests.item_a')::uuid),
  36.500::numeric,
  'a catalog weight is per unit and the line carries the quantity shipped'
);
select throws_ok(
  $$select public.add_product_to_shipment(
      current_setting('tests.shipment_a')::uuid, current_setting('tests.product_b')::uuid, 1)$$,
  '42501',
  null,
  'a shipment cannot take another tenant''s catalog entry'
);

set local request.jwt.claims = '{"sub":"dddddddd-dddd-dddd-dddd-dddddddddddd","role":"authenticated"}';
select throws_ok(
  $$select public.add_product_to_shipment(
      current_setting('tests.shipment_a')::uuid, current_setting('tests.product_b')::uuid, 1)$$,
  '42501',
  null,
  'another tenant cannot add lines to a shipment it cannot see'
);

-- Lines cannot reach across organizations.
select throws_ok(
  $$insert into public.shipment_items (org_id, shipment_id, description, quantity)
    values (current_setting('tests.org_b')::uuid, current_setting('tests.shipment_a')::uuid, 'Smuggled', 1)$$,
  '23503',
  null,
  'a line cannot be attached to another tenant''s shipment'
);

set local request.jwt.claims = '{"sub":"cccccccc-cccc-cccc-cccc-cccccccccccc","role":"authenticated"}';
select throws_ok(
  $$insert into public.shipment_items (org_id, shipment_id, product_id, description, quantity)
    values (current_setting('tests.org_a')::uuid, current_setting('tests.shipment_a')::uuid,
            current_setting('tests.product_b')::uuid, 'Borrowed', 1)$$,
  '23503',
  null,
  'a line cannot claim another tenant''s catalog entry as its source'
);

-- Parties cannot reach across organizations.
select throws_ok(
  $$update public.shipments set consignee_id = current_setting('tests.company_b')::uuid
    where id = current_setting('tests.shipment_a')::uuid$$,
  '23503',
  null,
  'a shipment cannot name another tenant''s company as a party'
);
select lives_ok(
  $$update public.shipments set exporter_id = current_setting('tests.company_a')::uuid
    where id = current_setting('tests.shipment_a')::uuid$$,
  'a shipment can name a company of its own organization'
);

set local request.jwt.claims = '{"sub":"dddddddd-dddd-dddd-dddd-dddddddddddd","role":"authenticated"}';
select throws_ok(
  $$update public.shipments set notify_id = current_setting('tests.company_a')::uuid
    where id = current_setting('tests.shipment_b')::uuid$$,
  '23503',
  null,
  'another tenant cannot point its own shipment at a company it cannot see'
);

-- Packages.
set local request.jwt.claims = '{"sub":"cccccccc-cccc-cccc-cccc-cccccccccccc","role":"authenticated"}';
select lives_ok(
  $$with created as (
      insert into public.shipment_packages
        (org_id, shipment_id, kind, package_count, length_cm, width_cm, height_cm)
      values (current_setting('tests.org_a')::uuid, current_setting('tests.shipment_a')::uuid,
              'carton', 2, 40, 30, 20)
      returning id
    )
    select set_config('tests.package_a', id::text, true) from created$$,
  'a member can describe a package'
);
select is(
  (select volume_m3 from public.shipment_packages where id = current_setting('tests.package_a')::uuid),
  0.0480::numeric,
  'package volume is derived from its dimensions and count'
);

set local request.jwt.claims = '{"sub":"dddddddd-dddd-dddd-dddd-dddddddddddd","role":"authenticated"}';
select is(
  (select count(*)::int from public.shipment_packages where org_id = current_setting('tests.org_a')::uuid),
  0,
  'another tenant reads no package'
);
select throws_ok(
  $$insert into public.shipment_packages (org_id, shipment_id)
    values (current_setting('tests.org_b')::uuid, current_setting('tests.shipment_a')::uuid)$$,
  '23503',
  null,
  'a package cannot be attached to another tenant''s shipment'
);
with attempted as (
  delete from public.shipment_packages where org_id = current_setting('tests.org_a')::uuid returning 1
)
select is((select count(*)::int from attempted), 0, 'another tenant cannot remove a package');

-- Package contents.
set local request.jwt.claims = '{"sub":"cccccccc-cccc-cccc-cccc-cccccccccccc","role":"authenticated"}';
select lives_ok(
  $$insert into public.package_contents (org_id, package_id, item_id, quantity)
    values (current_setting('tests.org_a')::uuid, current_setting('tests.package_a')::uuid,
            current_setting('tests.item_a')::uuid, 10)$$,
  'a package can hold a line of its own shipment'
);

set local request.jwt.claims = '{"sub":"dddddddd-dddd-dddd-dddd-dddddddddddd","role":"authenticated"}';
select is((select count(*)::int from public.package_contents), 0, 'another tenant reads no package contents');
select throws_ok(
  $$insert into public.package_contents (org_id, package_id, item_id, quantity)
    values (current_setting('tests.org_b')::uuid, current_setting('tests.package_b')::uuid,
            current_setting('tests.item_a')::uuid, 1)$$,
  '23514',
  null,
  'a package cannot hold another tenant''s line'
);
select throws_ok(
  $$insert into public.package_contents (org_id, package_id, item_id, quantity)
    values (current_setting('tests.org_b')::uuid, current_setting('tests.package_a')::uuid,
            current_setting('tests.item_b')::uuid, 1)$$,
  '23514',
  null,
  'another tenant''s package cannot be filled'
);

set local request.jwt.claims = '{"sub":"cccccccc-cccc-cccc-cccc-cccccccccccc","role":"authenticated"}';
with created as (
  insert into public.shipment_items (org_id, shipment_id, description, quantity)
  values (current_setting('tests.org_a')::uuid, current_setting('tests.shipment_a2')::uuid, 'Other shipment line', 1)
  returning id
)
select set_config('tests.item_a2', id::text, true) from created;
select throws_ok(
  $$insert into public.package_contents (org_id, package_id, item_id, quantity)
    values (current_setting('tests.org_a')::uuid, current_setting('tests.package_a')::uuid,
            current_setting('tests.item_a2')::uuid, 1)$$,
  '23514',
  null,
  'a package cannot hold a line from a different shipment'
);

-- Documents: provenance and status only move forward.
select lives_ok(
  $$select set_config(
      'tests.document',
      public.generate_document(current_setting('tests.shipment_a')::uuid, 'commercial_invoice')::text,
      true
    )$$,
  'an invoice can be generated'
);
select is(
  (select snapshot ->> 'schema_version' from public.documents where id = current_setting('tests.document')::uuid),
  '2',
  'a new snapshot records the schema it follows'
);
select is(
  (select snapshot -> 'exporter' ->> 'name' from public.documents where id = current_setting('tests.document')::uuid),
  'Meridian Components Ltd',
  'the document carries its own organization''s party'
);
select throws_ok(
  $$update public.documents set org_id = current_setting('tests.org_b')::uuid
    where id = current_setting('tests.document')::uuid$$,
  '23514',
  null,
  'a document cannot be moved to another organization'
);
select lives_ok(
  $$update public.documents set status = 'voided' where id = current_setting('tests.document')::uuid$$,
  'a final document can be voided'
);
select throws_ok(
  $$update public.documents set status = 'final' where id = current_setting('tests.document')::uuid$$,
  '23514',
  null,
  'a voided document cannot be reinstated'
);
select throws_ok(
  $$delete from public.shipments where id = current_setting('tests.shipment_a')::uuid$$,
  '23503',
  null,
  'a shipment with documents cannot be deleted out from under them'
);

set local request.jwt.claims = '{"sub":"dddddddd-dddd-dddd-dddd-dddddddddddd","role":"authenticated"}';
with attempted as (
  update public.documents set status = 'superseded'
  where org_id = current_setting('tests.org_a')::uuid
  returning 1
)
select is((select count(*)::int from attempted), 0, 'another tenant cannot change a document''s status');

-- Rate limiting is a service-role routine only.
select throws_ok(
  $$select * from public.consume_rate_limit(repeat('a', 64), 2, 86400)$$,
  '42501',
  null,
  'an API role cannot consume a rate limit directly'
);

set local role service_role;
select is(
  (select allowed from public.consume_rate_limit(repeat('b', 64), 2, 86400)),
  true,
  'the first call in a window is allowed'
);
select is(
  (select allowed from public.consume_rate_limit(repeat('b', 64), 2, 86400)),
  true,
  'the call that reaches the limit is allowed'
);
select is(
  (select not allowed and remaining = 0 and retry_after_seconds > 0
   from public.consume_rate_limit(repeat('b', 64), 2, 86400)),
  true,
  'the call past the limit is refused with a time to retry'
);

select * from finish();
rollback;
