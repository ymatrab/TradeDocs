-- Product logic review 2026-10-06: document lineage, voiding, settings, snapshot schema 4,
-- previews, allocation limits, shipment reuse and the import that reports every bad row.
-- docs/delivery/product-review-2026-10-06.md maps each assertion to its finding.

create extension if not exists pgtap;

begin;
select plan(49);

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'e1e1e1e1-e1e1-4e1e-8e1e-e1e1e1e1e1e1', 'authenticated', 'authenticated', 'olga@owner.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'e2e2e2e2-e2e2-4e2e-8e2e-e2e2e2e2e2e2', 'authenticated', 'authenticated', 'mo@member.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'e3e3e3e3-e3e3-4e3e-8e3e-e3e3e3e3e3e3', 'authenticated', 'authenticated', 'rita@rival.test', '', now(), now(), now());

set local role authenticated;
set local request.jwt.claims = '{"sub":"e1e1e1e1-e1e1-4e1e-8e1e-e1e1e1e1e1e1","role":"authenticated"}';
select set_config('tests.org', public.create_organization('Kestrel Exports')::text, true);
set local request.jwt.claims = '{"sub":"e3e3e3e3-e3e3-4e3e-8e3e-e3e3e3e3e3e3","role":"authenticated"}';
select set_config('tests.rival_org', public.create_organization('Rival Freight')::text, true);

-- A plain member of the first organization.
reset role;
insert into public.memberships (org_id, user_id, role)
values (current_setting('tests.org')::uuid, 'e2e2e2e2-e2e2-4e2e-8e2e-e2e2e2e2e2e2', 'member');
set local role authenticated;

-- ---------------------------------------------------------------------------------------
-- Organization document settings
-- ---------------------------------------------------------------------------------------
set local request.jwt.claims = '{"sub":"e2e2e2e2-e2e2-4e2e-8e2e-e2e2e2e2e2e2","role":"authenticated"}';
select throws_ok(
  $$insert into public.organization_settings (org_id, number_prefix)
    values (current_setting('tests.org')::uuid, 'MO')$$,
  '42501',
  null,
  'a member cannot write document settings'
);

set local request.jwt.claims = '{"sub":"e1e1e1e1-e1e1-4e1e-8e1e-e1e1e1e1e1e1","role":"authenticated"}';
select lives_ok(
  $$insert into public.organization_settings
      (org_id, number_prefix, payment_terms, bank_details, signatory_name, default_currency)
    values (current_setting('tests.org')::uuid, 'KES', '30 days net', 'IBAN GB00 TEST 0000',
            'Olga Owner', 'GBP')$$,
  'an owner can write document settings'
);
select throws_ok(
  $$update public.organization_settings set number_prefix = 'kes-1'
    where org_id = current_setting('tests.org')::uuid$$,
  '23514',
  null,
  'a number prefix is capitals and digits only'
);

set local request.jwt.claims = '{"sub":"e2e2e2e2-e2e2-4e2e-8e2e-e2e2e2e2e2e2","role":"authenticated"}';
select is(
  (select payment_terms from public.organization_settings where org_id = current_setting('tests.org')::uuid),
  '30 days net',
  'a member reads the settings their documents print'
);
with attempted as (
  update public.organization_settings set payment_terms = 'Cash only'
  where org_id = current_setting('tests.org')::uuid
  returning 1
)
select is((select count(*)::int from attempted), 0, 'a member cannot change document settings');

set local request.jwt.claims = '{"sub":"e3e3e3e3-e3e3-4e3e-8e3e-e3e3e3e3e3e3","role":"authenticated"}';
select is(
  (select count(*)::int from public.organization_settings where org_id = current_setting('tests.org')::uuid),
  0,
  'another tenant reads no document settings'
);

-- ---------------------------------------------------------------------------------------
-- A shipment with packing
-- ---------------------------------------------------------------------------------------
set local request.jwt.claims = '{"sub":"e1e1e1e1-e1e1-4e1e-8e1e-e1e1e1e1e1e1","role":"authenticated"}';
with created as (
  insert into public.companies (org_id, kind, name, notes)
  values (current_setting('tests.org')::uuid, 'own', 'Kestrel Exports Ltd', 'Internal: slow payer history')
  returning id
)
select set_config('tests.exporter', id::text, true) from created;
with created as (
  insert into public.companies (org_id, kind, name, city, country_code)
  values (current_setting('tests.org')::uuid, 'customer', 'Haugland AS', 'Bergen', 'NO')
  returning id
)
select set_config('tests.consignee', id::text, true) from created;
with created as (
  insert into public.shipments (org_id, reference, currency, incoterm, incoterm_place, exporter_id, consignee_id)
  values (current_setting('tests.org')::uuid, 'KES-1', 'GBP', 'FCA', 'Felixstowe',
          current_setting('tests.exporter')::uuid, current_setting('tests.consignee')::uuid)
  returning id
)
select set_config('tests.shipment', id::text, true) from created;
with created as (
  insert into public.shipment_items (org_id, shipment_id, position, description, quantity, unit_price, net_weight_kg)
  values (current_setting('tests.org')::uuid, current_setting('tests.shipment')::uuid, 1,
          'Stainless hinge', 100, 2.5, 40)
  returning id
)
select set_config('tests.item', id::text, true) from created;
with created as (
  insert into public.shipment_packages
    (org_id, shipment_id, position, kind, package_count, length_cm, width_cm, height_cm, net_weight_kg, gross_weight_kg)
  values (current_setting('tests.org')::uuid, current_setting('tests.shipment')::uuid, 1,
          'carton', 4, 50, 40, 30, 10, 12.5)
  returning id
)
select set_config('tests.package', id::text, true) from created;
with created as (
  insert into public.shipment_packages (org_id, shipment_id, position, kind, package_count)
  values (current_setting('tests.org')::uuid, current_setting('tests.shipment')::uuid, 2, 'pallet', 1)
  returning id
)
select set_config('tests.package2', id::text, true) from created;

-- Allocation limits.
select lives_ok(
  $$insert into public.package_contents (org_id, package_id, item_id, quantity)
    values (current_setting('tests.org')::uuid, current_setting('tests.package')::uuid,
            current_setting('tests.item')::uuid, 80)$$,
  'a line can be allocated up to what it holds'
);
select throws_ok(
  $$insert into public.package_contents (org_id, package_id, item_id, quantity)
    values (current_setting('tests.org')::uuid, current_setting('tests.package2')::uuid,
            current_setting('tests.item')::uuid, 21)$$,
  '23514',
  'That allocation packs more than the line holds.',
  'an allocation across packages cannot exceed the line'
);
select lives_ok(
  $$insert into public.package_contents (org_id, package_id, item_id, quantity)
    values (current_setting('tests.org')::uuid, current_setting('tests.package')::uuid,
            current_setting('tests.item')::uuid, 100)
    on conflict (package_id, item_id) do update set quantity = excluded.quantity$$,
  'replacing a package''s own amount counts only the other packages'
);

-- A save that changes nothing is not an edit.
select set_config('tests.revision', (select revision::text from public.shipments where id = current_setting('tests.shipment')::uuid), true);
update public.shipments set incoterm = 'FCA' where id = current_setting('tests.shipment')::uuid;
select is(
  (select revision from public.shipments where id = current_setting('tests.shipment')::uuid),
  current_setting('tests.revision')::integer,
  'an update that changes nothing leaves the revision where it was'
);
update public.shipments set port_of_loading = 'Felixstowe' where id = current_setting('tests.shipment')::uuid;
select is(
  (select revision from public.shipments where id = current_setting('tests.shipment')::uuid),
  current_setting('tests.revision')::integer + 1,
  'an update that changes a field advances the revision'
);

-- ---------------------------------------------------------------------------------------
-- Preview, generation, lineage
-- ---------------------------------------------------------------------------------------
select is(
  (public.preview_document(current_setting('tests.shipment')::uuid, 'packing_list') ->> 'number'),
  'PREVIEW',
  'a preview carries no allocated number'
);
select is(
  (select count(*)::int from public.documents where shipment_id = current_setting('tests.shipment')::uuid),
  0,
  'a preview stores nothing'
);

set local request.jwt.claims = '{"sub":"e3e3e3e3-e3e3-4e3e-8e3e-e3e3e3e3e3e3","role":"authenticated"}';
select throws_ok(
  $$select public.preview_document(current_setting('tests.shipment')::uuid, 'packing_list')$$,
  '42501',
  null,
  'another tenant cannot preview a shipment it cannot see'
);

set local request.jwt.claims = '{"sub":"e2e2e2e2-e2e2-4e2e-8e2e-e2e2e2e2e2e2","role":"authenticated"}';
select set_config(
  'tests.pl1',
  public.generate_document(current_setting('tests.shipment')::uuid, 'packing_list')::text,
  true
);
select matches(
  (select number from public.documents where id = current_setting('tests.pl1')::uuid),
  '^KES-PL-[0-9]{4}-0001$',
  'a document number carries the organization''s prefix'
);
select is(
  (select snapshot ->> 'schema_version' from public.documents where id = current_setting('tests.pl1')::uuid),
  '4',
  'a new document follows snapshot schema 4'
);
select is(
  (select (snapshot -> 'packing_totals' ->> 'gross_weight_kg')::numeric
   from public.documents where id = current_setting('tests.pl1')::uuid),
  50.000::numeric,
  'packing gross weight is count x per-package weight'
);
select is(
  (select (snapshot -> 'packages' -> 0 ->> 'net_weight_total_kg')::numeric
   from public.documents where id = current_setting('tests.pl1')::uuid),
  40.000::numeric,
  'a package row states its own total weight'
);
select is(
  (select (snapshot -> 'packing_totals' ->> 'net_weight_kg')::numeric
   from public.documents where id = current_setting('tests.pl1')::uuid),
  40.000::numeric,
  'packing net weight totals only the packages that state one'
);
select is(
  (select (snapshot -> 'packing_totals' ->> 'volume_m3')::numeric
   from public.documents where id = current_setting('tests.pl1')::uuid),
  0.2400::numeric,
  'packing volume is the sum of row volumes'
);
select ok(
  (select not (snapshot -> 'exporter' ? 'notes') and not (snapshot -> 'exporter' ? 'org_id')
   from public.documents where id = current_setting('tests.pl1')::uuid),
  'a party snapshot leaves internal notes and bookkeeping out'
);
select is(
  (select snapshot -> 'issuer' ->> 'payment_terms' from public.documents where id = current_setting('tests.pl1')::uuid),
  '30 days net',
  'the issuer''s settings are carried into the snapshot'
);
select is(
  (select snapshot -> 'supersedes' from public.documents where id = current_setting('tests.pl1')::uuid),
  'null'::jsonb,
  'a first document replaces nothing'
);

-- Re-issue after a change.
update public.shipment_items set quantity = 90 where id = current_setting('tests.item')::uuid;
select set_config(
  'tests.pl2',
  public.generate_document(current_setting('tests.shipment')::uuid, 'packing_list')::text,
  true
);
select is(
  (select status from public.documents where id = current_setting('tests.pl1')::uuid),
  'superseded',
  'generating again supersedes the earlier final document of that kind'
);
select is(
  (select status_reason from public.documents where id = current_setting('tests.pl1')::uuid),
  'Replaced by ' || (select number from public.documents where id = current_setting('tests.pl2')::uuid),
  'the superseded document says what replaced it'
);
select is(
  (select supersedes_id::text from public.documents where id = current_setting('tests.pl2')::uuid),
  current_setting('tests.pl1'),
  'the new document records the lineage'
);
select is(
  (select snapshot ->> 'supersedes' from public.documents where id = current_setting('tests.pl2')::uuid),
  (select number from public.documents where id = current_setting('tests.pl1')::uuid),
  'the new document states the number it replaces'
);
select is(
  (select count(*)::int from public.documents
   where shipment_id = current_setting('tests.shipment')::uuid and kind = 'packing_list' and status = 'final'),
  1,
  'a shipment holds one final document per kind'
);
select is(
  (select (snapshot -> 'items' -> 0 ->> 'quantity')::numeric from public.documents where id = current_setting('tests.pl1')::uuid),
  100::numeric,
  'the superseded document still says what it said'
);

-- Direct writes are closed.
select throws_ok(
  $$update public.documents set status = 'voided' where id = current_setting('tests.pl2')::uuid$$,
  '42501',
  null,
  'no API role can change a document directly'
);

-- ---------------------------------------------------------------------------------------
-- Voiding
-- ---------------------------------------------------------------------------------------
select throws_ok(
  $$select public.void_document(current_setting('tests.pl2')::uuid, 'Issued in error')$$,
  '42501',
  'Only an owner or administrator can void a document.',
  'a member cannot void a document'
);

set local request.jwt.claims = '{"sub":"e1e1e1e1-e1e1-4e1e-8e1e-e1e1e1e1e1e1","role":"authenticated"}';
select throws_ok(
  $$select public.void_document(current_setting('tests.pl2')::uuid, ' x ')$$,
  '23514',
  null,
  'voiding needs a reason'
);
select lives_ok(
  $$select public.void_document(current_setting('tests.pl2')::uuid, 'Buyer cancelled the order')$$,
  'an owner can void a final document with a reason'
);
select is(
  (select status || ': ' || status_reason from public.documents where id = current_setting('tests.pl2')::uuid),
  'voided: Buyer cancelled the order',
  'the void and its reason are recorded on the document'
);
select is(
  (select count(*)::int from public.audit_events
   where action = 'document.voided' and target_id = current_setting('tests.pl2')),
  1,
  'voiding is audited'
);
select throws_ok(
  $$select public.void_document(current_setting('tests.pl1')::uuid, 'Not again')$$,
  '23514',
  'Only a final document can be voided.',
  'a superseded document cannot be voided'
);

-- ---------------------------------------------------------------------------------------
-- Reusing the shipment
-- ---------------------------------------------------------------------------------------
update public.companies set archived_at = now() where id = current_setting('tests.consignee')::uuid;
-- The line went down to 90 after packing; bring the allocation back in line before copying.
update public.package_contents set quantity = 90 where item_id = current_setting('tests.item')::uuid;
select set_config(
  'tests.copy',
  public.duplicate_shipment(current_setting('tests.shipment')::uuid, ' KES-2 ')::text,
  true
);
select is(
  (select reference || ' r' || revision from public.shipments where id = current_setting('tests.copy')::uuid),
  'KES-2 r1',
  'a copy is a new draft at revision 1 under the new reference'
);
select is(
  (select count(*)::int from public.shipment_items where shipment_id = current_setting('tests.copy')::uuid),
  1,
  'a copy carries the lines'
);
select is(
  (select count(*)::int from public.shipment_packages where shipment_id = current_setting('tests.copy')::uuid),
  2,
  'a copy carries the packing'
);
select is(
  (select sum(pc.quantity) from public.package_contents pc
   join public.shipment_packages p on p.id = pc.package_id
   where p.shipment_id = current_setting('tests.copy')::uuid),
  90::numeric,
  'a copy carries the allocations, onto its own lines'
);
select ok(
  (select exporter_id = current_setting('tests.exporter')::uuid and consignee_id is null
   from public.shipments where id = current_setting('tests.copy')::uuid),
  'a copy keeps active parties and leaves an archived one empty'
);
select is(
  (select count(*)::int from public.documents where shipment_id = current_setting('tests.copy')::uuid),
  0,
  'a copy has no documents of its own'
);
select is(
  (select count(*)::int from public.documents where shipment_id = current_setting('tests.shipment')::uuid),
  2,
  'the source shipment keeps its documents untouched'
);
select throws_ok(
  $$select public.duplicate_shipment(current_setting('tests.shipment')::uuid, 'KES-2')$$,
  '23505',
  null,
  'a copy cannot reuse a reference'
);

set local request.jwt.claims = '{"sub":"e3e3e3e3-e3e3-4e3e-8e3e-e3e3e3e3e3e3","role":"authenticated"}';
select throws_ok(
  $$select public.duplicate_shipment(current_setting('tests.shipment')::uuid, 'STOLEN-1')$$,
  '42501',
  null,
  'another tenant cannot copy a shipment'
);

-- ---------------------------------------------------------------------------------------
-- Catalog import, version 2
-- ---------------------------------------------------------------------------------------
set local request.jwt.claims = '{"sub":"e1e1e1e1-e1e1-4e1e-8e1e-e1e1e1e1e1e1","role":"authenticated"}';
select is(
  public.import_products(
    current_setting('tests.org')::uuid,
    '[{"line":2,"sku":"H-1","description":"Hinge","unit_price":"2.5"},
      {"line":3,"sku":"H-2","description":"Bracket"}]'::jsonb,
    true
  ),
  '{"inserted":2,"updated":0,"problems":[],"dry_run":true}'::jsonb,
  'a dry run reports what an import would do'
);
select is(
  (select count(*)::int from public.products where org_id = current_setting('tests.org')::uuid),
  0,
  'a dry run writes nothing'
);
select is(
  public.import_products(
    current_setting('tests.org')::uuid,
    '[{"line":2,"sku":"H-1","description":"Hinge","net_weight_kg":"abc"},
      {"line":5,"sku":"h-1","description":"Hinge again","net_weight_kg":"2","gross_weight_kg":"1"}]'::jsonb,
    true
  ) -> 'problems',
  '[{"row":2,"problem":"Net weight \"abc\" is not a number of zero or more."},
    {"row":5,"problem":"SKU h-1 also appears on line 2. Gross weight is less than net weight."}]'::jsonb,
  'every problem is reported against the line in the user''s file'
);
select throws_ok(
  $$select public.import_products(current_setting('tests.org')::uuid,
      '[{"line":7,"description":"Hinge","unit":"thirteen-char"}]'::jsonb)$$,
  '23514',
  'import rejected',
  'a real import with a bad row is rejected whole, with a reason instead of a cast error'
);

select * from finish();
rollback;
