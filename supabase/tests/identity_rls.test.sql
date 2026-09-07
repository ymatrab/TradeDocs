-- Task 04 — tenant isolation, role authority and invitation integrity.
--
-- Cross-tenant access is a stop-ship defect, so these assertions run against the real
-- policies as the real API roles rather than against application code.

create extension if not exists pgtap;

begin;
select plan(21);

-- Fixtures are created before any role switch: inserting an account is not something an
-- API role may do.
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'ana@example.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'ben@example.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'cleo@example.test', '', now(), now(), now());

select is(
  (select count(*)::int from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  1,
  'a new account always has a profile'
);

-- Ana creates her organization.
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select lives_ok(
  $$select public.create_organization('Meridian Components')$$,
  'a signed-in user can create an organization'
);
select is(
  (select role from public.memberships where user_id = '11111111-1111-1111-1111-111111111111'),
  'owner',
  'the creator becomes the owner'
);

-- Ben creates a separate organization.
set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
select lives_ok($$select public.create_organization('Nordwind Handels')$$, 'a second tenant exists');

-- Isolation, read and write.
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select is((select count(*)::int from public.organizations), 1, 'a member reads only their own organization');
select is(
  (select count(*)::int from public.organizations where name = 'Nordwind Handels'),
  0,
  'another tenant''s organization cannot be read'
);
select is((select count(*)::int from public.memberships), 1, 'another tenant''s memberships cannot be enumerated');
select is((select count(*)::int from public.profiles), 1, 'a profile in another tenant cannot be read');

with attempted as (
  update public.organizations set name = 'Seized' where name = 'Nordwind Handels' returning 1
)
select is((select count(*)::int from attempted), 0, 'another tenant''s organization cannot be written');

-- Anonymous callers.
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
-- Stronger than an empty result: the anonymous role holds no grant, so the table is
-- unreachable and row policies are never even consulted.
select throws_ok(
  $$select count(*) from public.organizations$$,
  '42501',
  null,
  'an anonymous caller cannot reach the organizations table at all'
);
select throws_ok(
  $$select public.create_organization('Anonymous Co')$$,
  '42501',
  null,
  'an anonymous caller cannot create an organization'
);

-- Owner authority.
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select throws_ok(
  $$delete from public.memberships where user_id = '11111111-1111-1111-1111-111111111111'$$,
  '23514',
  null,
  'the last owner cannot orphan the organization'
);

-- Invitations. The token is stashed in a transaction-local setting because only its digest
-- is stored and it can never be read back from the table.
select lives_ok(
  $$select set_config(
      'tests.invite_token',
      public.create_invitation(
        (select id from public.organizations where name = 'Meridian Components'),
        'ben@example.test',
        'member',
        interval '1 day'
      ),
      true
    )$$,
  'an owner can invite a colleague'
);

set local request.jwt.claims = '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}';
select throws_ok(
  $$select public.accept_invitation('not-a-real-token')$$,
  '42501',
  null,
  'an unknown token is refused'
);
select throws_ok(
  $$select public.accept_invitation(current_setting('tests.invite_token'))$$,
  '42501',
  null,
  'an invitation cannot be redeemed by a different address'
);

set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
select lives_ok(
  $$select public.accept_invitation(current_setting('tests.invite_token'))$$,
  'the invited address can accept'
);
select throws_ok(
  $$select public.accept_invitation(current_setting('tests.invite_token'))$$,
  '42501',
  null,
  'a redeemed invitation cannot be replayed'
);
select throws_ok(
  $$select public.create_invitation(
      (select id from public.organizations where name = 'Meridian Components'),
      'cleo@example.test',
      'member'
    )$$,
  '42501',
  null,
  'a plain member cannot invite'
);

-- Lifecycle.
select is(
  (select jsonb_array_length(public.export_account_data() -> 'memberships')),
  2,
  'export returns the caller''s own memberships and no other'
);
select lives_ok(
  $$select public.request_account_deletion(interval '30 days')$$,
  'deletion is queued rather than immediate'
);
select lives_ok($$select public.cancel_account_deletion()$$, 'a queued deletion can be withdrawn');

select * from finish();
rollback;
