-- PDF branding (D-021): the private org-branding bucket's policies, the branding_assets
-- table, the paid gate in SQL (fail closed) and snapshot schema 5.

create extension if not exists pgtap;

begin;
select plan(35);

-- Fixtures, created as the migration owner before any role switch.
--   Org A: Pro, current.   Org B: Team, current.   Org C: free (no entitlement).
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'a1a1a1a1-0000-4000-8000-00000000a1a1', 'authenticated', 'authenticated', 'owner.a@branding.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'a2a2a2a2-0000-4000-8000-00000000a2a2', 'authenticated', 'authenticated', 'member.a@branding.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'b1b1b1b1-0000-4000-8000-00000000b1b1', 'authenticated', 'authenticated', 'owner.b@branding.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'c1c1c1c1-0000-4000-8000-00000000c1c1', 'authenticated', 'authenticated', 'owner.c@branding.test', '', now(), now(), now());

insert into public.organizations (id, name) values
  ('aaaaaaaa-0000-4000-8000-0000000000aa', 'Branding Org A'),
  ('bbbbbbbb-0000-4000-8000-0000000000bb', 'Branding Org B'),
  ('cccccccc-0000-4000-8000-0000000000cc', 'Branding Org C');
insert into public.memberships (org_id, user_id, role) values
  ('aaaaaaaa-0000-4000-8000-0000000000aa', 'a1a1a1a1-0000-4000-8000-00000000a1a1', 'owner'),
  ('aaaaaaaa-0000-4000-8000-0000000000aa', 'a2a2a2a2-0000-4000-8000-00000000a2a2', 'member'),
  ('bbbbbbbb-0000-4000-8000-0000000000bb', 'b1b1b1b1-0000-4000-8000-00000000b1b1', 'owner'),
  ('cccccccc-0000-4000-8000-0000000000cc', 'c1c1c1c1-0000-4000-8000-00000000c1c1', 'owner');

insert into public.entitlements (org_id, plan, status, customer_ref, subscription_ref, checkout_ref, paid_through)
values
  ('aaaaaaaa-0000-4000-8000-0000000000aa', 'pro', 'active', 'cus_BrandA', 'sub_BrandA', 'cs_test_BrandA', now() + interval '30 days'),
  ('bbbbbbbb-0000-4000-8000-0000000000bb', 'team', 'active', 'cus_BrandB', 'sub_BrandB', 'cs_test_BrandB', now() + interval '30 days');

insert into public.companies (id, org_id, kind, name)
values ('aaaaaaaa-4444-4000-8000-0000000000aa', 'aaaaaaaa-0000-4000-8000-0000000000aa', 'own', 'Branded Exports Ltd');
insert into public.shipments (id, org_id, reference, currency, exporter_id)
values ('aaaaaaaa-5555-4000-8000-0000000000aa', 'aaaaaaaa-0000-4000-8000-0000000000aa', 'BR-1', 'EUR',
        'aaaaaaaa-4444-4000-8000-0000000000aa');
insert into public.shipment_items (org_id, shipment_id, position, description, quantity, unit_price)
values ('aaaaaaaa-0000-4000-8000-0000000000aa', 'aaaaaaaa-5555-4000-8000-0000000000aa', 1,
        'Branded widget', 10, 2.5);

select set_config('tests.sha', repeat('a', 64), true);
select set_config('tests.path_a', 'org/aaaaaaaa-0000-4000-8000-0000000000aa/assets/' || repeat('a', 64) || '.png', true);
select set_config('tests.path_b', 'org/bbbbbbbb-0000-4000-8000-0000000000bb/assets/' || repeat('b', 64) || '.png', true);
select set_config('tests.path_c', 'org/cccccccc-0000-4000-8000-0000000000cc/assets/' || repeat('c', 64) || '.png', true);

-- ---------------------------------------------------------------------------------------
-- The bucket
-- ---------------------------------------------------------------------------------------

select is(
  (select public from storage.buckets where id = 'org-branding'),
  false,
  'the branding bucket is private'
);
select is(
  (select file_size_limit from storage.buckets where id = 'org-branding'),
  1048576::bigint,
  'the bucket refuses objects over 1 MiB'
);
select is(
  (select allowed_mime_types from storage.buckets where id = 'org-branding'),
  array['image/png', 'image/jpeg'],
  'the bucket accepts PNG and JPEG only'
);
select is(
  (select count(*)::int from pg_policies
   where schemaname = 'storage' and tablename = 'objects' and policyname like 'org_branding%'
     and roles <> array['authenticated']::name[]),
  0,
  'no branding policy reaches anon or any role but authenticated'
);
select is(
  (select count(*)::int from pg_policies
   where schemaname = 'storage' and tablename = 'objects' and policyname like 'org_branding%'
     and cmd = 'UPDATE'),
  0,
  'no policy lets anyone overwrite a stored image'
);

-- ---------------------------------------------------------------------------------------
-- Writing objects
-- ---------------------------------------------------------------------------------------

set local role authenticated;
set local request.jwt.claims = '{"sub":"a1a1a1a1-0000-4000-8000-00000000a1a1","role":"authenticated"}';
select lives_ok(
  $$insert into storage.objects (bucket_id, name) values ('org-branding', current_setting('tests.path_a'))$$,
  'an owner of an entitled organization can store an image under its own path'
);
select throws_ok(
  $$insert into storage.objects (bucket_id, name) values ('org-branding', current_setting('tests.path_b'))$$,
  '42501',
  null,
  'an owner cannot store an image under another organization''s path'
);
select throws_ok(
  $$insert into storage.objects (bucket_id, name)
    values ('org-branding', 'org/aaaaaaaa-0000-4000-8000-0000000000aa/logo.png')$$,
  '42501',
  null,
  'a name that is not content-addressed is refused'
);
select throws_ok(
  $$insert into storage.objects (bucket_id, name)
    values ('org-branding', 'org/aaaaaaaa-0000-4000-8000-0000000000aa/assets/../' || repeat('a', 64) || '.png')$$,
  '42501',
  null,
  'a traversal-shaped name is refused'
);

set local request.jwt.claims = '{"sub":"a2a2a2a2-0000-4000-8000-00000000a2a2","role":"authenticated"}';
select throws_ok(
  $$insert into storage.objects (bucket_id, name)
    values ('org-branding', 'org/aaaaaaaa-0000-4000-8000-0000000000aa/assets/' || repeat('d', 64) || '.png')$$,
  '42501',
  null,
  'a plain member cannot store an image'
);

set local request.jwt.claims = '{"sub":"c1c1c1c1-0000-4000-8000-00000000c1c1","role":"authenticated"}';
select throws_ok(
  $$insert into storage.objects (bucket_id, name) values ('org-branding', current_setting('tests.path_c'))$$,
  '42501',
  null,
  'an owner of an organization without Pro or Team cannot store an image (paid gate)'
);

-- ---------------------------------------------------------------------------------------
-- Reading objects
-- ---------------------------------------------------------------------------------------

set local request.jwt.claims = '{"sub":"a2a2a2a2-0000-4000-8000-00000000a2a2","role":"authenticated"}';
select is(
  (select count(*)::int from storage.objects where bucket_id = 'org-branding'),
  1,
  'a member reads their own organization''s image'
);
set local request.jwt.claims = '{"sub":"b1b1b1b1-0000-4000-8000-00000000b1b1","role":"authenticated"}';
select is(
  (select count(*)::int from storage.objects where bucket_id = 'org-branding'),
  0,
  'another organization''s image cannot be read'
);

-- An update affects nothing: there is no policy for it.
set local request.jwt.claims = '{"sub":"a1a1a1a1-0000-4000-8000-00000000a1a1","role":"authenticated"}';
update storage.objects set metadata = '{"tampered":true}'::jsonb
where bucket_id = 'org-branding' and name = current_setting('tests.path_a');
reset role;
select is(
  (select metadata from storage.objects
   where bucket_id = 'org-branding' and name = current_setting('tests.path_a')),
  null::jsonb,
  'even an owner cannot rewrite a stored image'
);

-- Delete authority, as the delete policy decides it (evaluated for each caller).
select matches(
  (select qual from pg_policies
   where schemaname = 'storage' and tablename = 'objects' and policyname = 'org_branding_delete'),
  'has_org_role\(private\.branding_object_org\(name\)',
  'deletion is decided by the caller''s role in the organization named in the path'
);
set local request.jwt.claims = '{"sub":"a1a1a1a1-0000-4000-8000-00000000a1a1","role":"authenticated"}';
select ok(
  private.has_org_role(private.branding_object_org(current_setting('tests.path_a')), array['owner', 'admin']),
  'an owner may delete their organization''s image'
);
set local request.jwt.claims = '{"sub":"a2a2a2a2-0000-4000-8000-00000000a2a2","role":"authenticated"}';
select ok(
  not coalesce(private.has_org_role(private.branding_object_org(current_setting('tests.path_a')), array['owner', 'admin']), false),
  'a plain member may not delete an image'
);
set local request.jwt.claims = '{"sub":"b1b1b1b1-0000-4000-8000-00000000b1b1","role":"authenticated"}';
select ok(
  not coalesce(private.has_org_role(private.branding_object_org(current_setting('tests.path_a')), array['owner', 'admin']), false),
  'another organization''s owner may not delete an image'
);
select is(
  private.branding_object_org('org/not-a-uuid/assets/' || repeat('a', 64) || '.png'),
  null::uuid,
  'a malformed name belongs to no organization'
);

-- ---------------------------------------------------------------------------------------
-- The paid gate in SQL
-- ---------------------------------------------------------------------------------------

select ok(private.branding_entitled('aaaaaaaa-0000-4000-8000-0000000000aa'), 'Pro is entitled to branding');
select ok(private.branding_entitled('bbbbbbbb-0000-4000-8000-0000000000bb'), 'Team is entitled to branding');
select ok(not private.branding_entitled('cccccccc-0000-4000-8000-0000000000cc'), 'no entitlement row means no branding');

-- ---------------------------------------------------------------------------------------
-- branding_assets
-- ---------------------------------------------------------------------------------------

set local role authenticated;
set local request.jwt.claims = '{"sub":"a1a1a1a1-0000-4000-8000-00000000a1a1","role":"authenticated"}';
select lives_ok(
  $$insert into public.branding_assets (org_id, slot, sha256, format, object_path, width, height, byte_size)
    values ('aaaaaaaa-0000-4000-8000-0000000000aa', 'logo', repeat('a', 64), 'png',
            current_setting('tests.path_a'), 600, 160, 2048)$$,
  'an owner of an entitled organization sets its logo'
);
select throws_ok(
  $$insert into public.branding_assets (org_id, slot, sha256, format, object_path, width, height, byte_size)
    values ('aaaaaaaa-0000-4000-8000-0000000000aa', 'signature', repeat('b', 64), 'png',
            current_setting('tests.path_b'), 600, 160, 2048)$$,
  '23514',
  null,
  'a branding row cannot point at another organization''s object'
);

set local request.jwt.claims = '{"sub":"a2a2a2a2-0000-4000-8000-00000000a2a2","role":"authenticated"}';
select throws_ok(
  $$insert into public.branding_assets (org_id, slot, sha256, format, object_path, width, height, byte_size)
    values ('aaaaaaaa-0000-4000-8000-0000000000aa', 'signature', repeat('a', 64), 'png',
            current_setting('tests.path_a'), 600, 160, 2048)$$,
  '42501',
  null,
  'a plain member cannot set branding'
);
select is(
  (select count(*)::int from public.branding_assets),
  1,
  'a member reads their organization''s branding'
);

set local request.jwt.claims = '{"sub":"c1c1c1c1-0000-4000-8000-00000000c1c1","role":"authenticated"}';
select throws_ok(
  $$insert into public.branding_assets (org_id, slot, sha256, format, object_path, width, height, byte_size)
    values ('cccccccc-0000-4000-8000-0000000000cc', 'logo', repeat('c', 64), 'png',
            current_setting('tests.path_c'), 600, 160, 2048)$$,
  '42501',
  null,
  'an organization without Pro or Team cannot set branding (paid gate)'
);

set local request.jwt.claims = '{"sub":"b1b1b1b1-0000-4000-8000-00000000b1b1","role":"authenticated"}';
select is(
  (select count(*)::int from public.branding_assets),
  0,
  'another organization''s branding cannot be read'
);

-- ---------------------------------------------------------------------------------------
-- Snapshot schema 5
-- ---------------------------------------------------------------------------------------

set local request.jwt.claims = '{"sub":"a2a2a2a2-0000-4000-8000-00000000a2a2","role":"authenticated"}';
select is(
  (select public.preview_document('aaaaaaaa-5555-4000-8000-0000000000aa', 'commercial_invoice') -> 'branding' -> 'logo' ->> 'sha256'),
  repeat('a', 64),
  'a preview carries the current logo'
);

set local request.jwt.claims = '{"sub":"a1a1a1a1-0000-4000-8000-00000000a1a1","role":"authenticated"}';
select set_config(
  'tests.document',
  public.generate_document('aaaaaaaa-5555-4000-8000-0000000000aa', 'commercial_invoice')::text,
  true
);
select is(
  (select snapshot ->> 'schema_version' from public.documents where id = current_setting('tests.document')::uuid),
  '5',
  'an entitled organization''s new document follows schema 5'
);
select is(
  (select snapshot -> 'branding' -> 'logo' ->> 'object_path' from public.documents
   where id = current_setting('tests.document')::uuid),
  current_setting('tests.path_a'),
  'the document records the exact object it was issued with'
);
select ok(
  public.branding_asset_in_use('aaaaaaaa-0000-4000-8000-0000000000aa', repeat('a', 64)),
  'an image a document refers to is in use'
);
select ok(
  not public.branding_asset_in_use('aaaaaaaa-0000-4000-8000-0000000000aa', repeat('e', 64)),
  'an image nothing refers to is not in use'
);
set local request.jwt.claims = '{"sub":"b1b1b1b1-0000-4000-8000-00000000b1b1","role":"authenticated"}';
select ok(
  public.branding_asset_in_use('aaaaaaaa-0000-4000-8000-0000000000aa', repeat('e', 64)),
  'a non-member is told every image is in use, so nothing of theirs can be deleted'
);

-- The plan lapses: new documents fall back to schema 4 without branding (fail closed).
reset role;
update public.entitlements set status = 'cancelled', paid_through = now() - interval '1 day'
where org_id = 'aaaaaaaa-0000-4000-8000-0000000000aa';
set local role authenticated;
set local request.jwt.claims = '{"sub":"a1a1a1a1-0000-4000-8000-00000000a1a1","role":"authenticated"}';
select is(
  (select public.preview_document('aaaaaaaa-5555-4000-8000-0000000000aa', 'commercial_invoice') ->> 'schema_version'),
  '4',
  'after the paid period ends, a new document has no branding'
);

select * from finish();
rollback;
