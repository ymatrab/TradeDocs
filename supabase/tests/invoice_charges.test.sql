-- Invoice charges, discounts and EORI (D-029): tenant isolation of public.shipment_charges,
-- the revision bump, snapshot schema 8 on invoices only, totals worked by hand, the discount
-- refusal, and the EORI in the party snapshot only when set.

create extension if not exists pgtap;

begin;
select plan(15);

-- Fixtures, created as the migration owner before any role switch.
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'c4a1c4a1-0000-4000-8000-0000000c4a11', 'authenticated', 'authenticated', 'owner.a@charges.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'c4b1c4b1-0000-4000-8000-0000000c4b11', 'authenticated', 'authenticated', 'owner.b@charges.test', '', now(), now(), now());

insert into public.organizations (id, name) values
  ('c4aaaaaa-0000-4000-8000-0000000000aa', 'Charges Org A'),
  ('c4bbbbbb-0000-4000-8000-0000000000bb', 'Charges Org B');
insert into public.memberships (org_id, user_id, role) values
  ('c4aaaaaa-0000-4000-8000-0000000000aa', 'c4a1c4a1-0000-4000-8000-0000000c4a11', 'owner'),
  ('c4bbbbbb-0000-4000-8000-0000000000bb', 'c4b1c4b1-0000-4000-8000-0000000c4b11', 'owner');

insert into public.companies (id, org_id, kind, name, country_code, eori_number)
values ('c4aaaaaa-4444-4000-8000-0000000000aa', 'c4aaaaaa-0000-4000-8000-0000000000aa', 'own',
        'Charges Exports Ltd', 'GB', 'GB123456789000');
insert into public.shipments (id, org_id, reference, currency, exporter_id)
values ('c4aaaaaa-5555-4000-8000-0000000000aa', 'c4aaaaaa-0000-4000-8000-0000000000aa', 'CH-1', 'EUR',
        'c4aaaaaa-4444-4000-8000-0000000000aa');
-- 100 x 12.50 = 1,250.00
insert into public.shipment_items (org_id, shipment_id, position, description, quantity, unit_price)
values ('c4aaaaaa-0000-4000-8000-0000000000aa', 'c4aaaaaa-5555-4000-8000-0000000000aa', 1,
        'Charged widget', 100, 12.5);

-- ---------------------------------------------------------------------------------------
-- Access
-- ---------------------------------------------------------------------------------------

set local role authenticated;
set local request.jwt.claims = '{"sub":"c4a1c4a1-0000-4000-8000-0000000c4a11","role":"authenticated"}';

select set_config('tests.revision_before',
  (select revision::text from public.shipments where id = 'c4aaaaaa-5555-4000-8000-0000000000aa'), true);

select lives_ok(
  $$ insert into public.shipment_charges (org_id, shipment_id, position, kind, amount, included_in_price)
     values ('c4aaaaaa-0000-4000-8000-0000000000aa', 'c4aaaaaa-5555-4000-8000-0000000000aa', 1, 'freight', 180, false),
            ('c4aaaaaa-0000-4000-8000-0000000000aa', 'c4aaaaaa-5555-4000-8000-0000000000aa', 2, 'insurance', 12.345, false),
            ('c4aaaaaa-0000-4000-8000-0000000000aa', 'c4aaaaaa-5555-4000-8000-0000000000aa', 3, 'packing', 40, true),
            ('c4aaaaaa-0000-4000-8000-0000000000aa', 'c4aaaaaa-5555-4000-8000-0000000000aa', 4, 'discount', 50, false) $$,
  'a member adds charges and a discount to their own shipment'
);
select ok(
  (select revision from public.shipments where id = 'c4aaaaaa-5555-4000-8000-0000000000aa')
    > current_setting('tests.revision_before')::integer,
  'adding a charge advances the shipment revision'
);
select throws_ok(
  $$ insert into public.shipment_charges (org_id, shipment_id, position, kind, amount)
     values ('c4aaaaaa-0000-4000-8000-0000000000aa', 'c4aaaaaa-5555-4000-8000-0000000000aa', 5, 'other', 10) $$,
  '23514',
  null,
  'an "other" charge needs a label'
);
select throws_ok(
  $$ insert into public.shipment_charges (org_id, shipment_id, position, kind, amount)
     values ('c4aaaaaa-0000-4000-8000-0000000000aa', 'c4aaaaaa-5555-4000-8000-0000000000aa', 5, 'freight', 0) $$,
  '23514',
  null,
  'an amount must be above zero'
);
select throws_ok(
  $$ update public.companies set eori_number = 'not an eori'
     where id = 'c4aaaaaa-4444-4000-8000-0000000000aa' $$,
  '23514',
  null,
  'an EORI must be a country code and up to 15 letters or digits'
);
reset role;

set local role authenticated;
set local request.jwt.claims = '{"sub":"c4b1c4b1-0000-4000-8000-0000000c4b11","role":"authenticated"}';
select is(
  (select count(*)::integer from public.shipment_charges
   where shipment_id = 'c4aaaaaa-5555-4000-8000-0000000000aa'),
  0,
  'another organization cannot read the charges'
);
select throws_ok(
  $$ insert into public.shipment_charges (org_id, shipment_id, position, kind, amount)
     values ('c4aaaaaa-0000-4000-8000-0000000000aa', 'c4aaaaaa-5555-4000-8000-0000000000aa', 9, 'freight', 1) $$,
  '42501',
  null,
  'another organization cannot add a charge to it'
);
select throws_ok(
  $$ insert into public.shipment_charges (org_id, shipment_id, position, kind, amount)
     values ('c4bbbbbb-0000-4000-8000-0000000000bb', 'c4aaaaaa-5555-4000-8000-0000000000aa', 9, 'freight', 1) $$,
  '23503',
  null,
  'nor attach one to it under its own organization'
);
select is_empty(
  $$ delete from public.shipment_charges where shipment_id = 'c4aaaaaa-5555-4000-8000-0000000000aa'
     returning id $$,
  'another organization cannot delete the charges'
);
reset role;

set local role anon;
select throws_ok(
  $$ select 1 from public.shipment_charges $$,
  '42501',
  null,
  'anonymous visitors hold no grant on charges'
);
reset role;

-- ---------------------------------------------------------------------------------------
-- Snapshot schema 8
-- ---------------------------------------------------------------------------------------
--   Goods            100 x 12.50          = 1,250.00
--   Freight                               +   180.00
--   Insurance        12.345 -> 12.35      +    12.35
--   Packing          40.00, in the prices      (shown, not added)
--   Discount                              -    50.00
--   Total                                 = 1,392.35

set local role authenticated;
set local request.jwt.claims = '{"sub":"c4a1c4a1-0000-4000-8000-0000000c4a11","role":"authenticated"}';
select set_config('tests.invoice',
  public.preview_document('c4aaaaaa-5555-4000-8000-0000000000aa', 'commercial_invoice')::text, true);
select set_config('tests.packing',
  public.preview_document('c4aaaaaa-5555-4000-8000-0000000000aa', 'packing_list')::text, true);
reset role;

select is(
  (current_setting('tests.invoice')::jsonb ->> 'schema_version')::integer,
  8,
  'an invoice of a shipment with charges is schema 8'
);
select is(
  current_setting('tests.invoice')::jsonb -> 'invoice_totals',
  '{"goods": 1250.00, "charges": 192.35, "discounts": 50.00, "total": 1392.35}'::jsonb,
  'the invoice totals match the hand calculation'
);
select is(
  jsonb_array_length(current_setting('tests.invoice')::jsonb -> 'charges'),
  4,
  'every charge is itemized, the one in the prices too'
);
select ok(
  not (current_setting('tests.packing')::jsonb ? 'charges'),
  'a packing list carries no charges'
);
select is(
  current_setting('tests.invoice')::jsonb -> 'exporter' ->> 'eori_number',
  'GB123456789000',
  'the exporter''s EORI is in the snapshot'
);

select * from finish();
rollback;
