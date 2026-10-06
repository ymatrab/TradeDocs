-- Accounts and access (migration 20261006000900): member routines, invitation lifecycle,
-- the purge job and the platform-admin helpers, each exercised as the real API roles.

create extension if not exists pgtap;

begin;
select plan(41);

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'a1111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'owner@example.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'a2222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'admin@example.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'a3333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'member@example.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'a4444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'outsider@example.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'a5555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'solo@example.test', '', now(), now(), now());

-- An organization with an owner, an admin and a member, built as the owner would.
set local role authenticated;
set local request.jwt.claims = '{"sub":"a1111111-1111-1111-1111-111111111111","role":"authenticated"}';
select set_config('tests.org', public.create_organization('Harbourline Freight')::text, true);
reset role;
insert into public.memberships (org_id, user_id, role) values
  (current_setting('tests.org')::uuid, 'a2222222-2222-2222-2222-222222222222', 'admin'),
  (current_setting('tests.org')::uuid, 'a3333333-3333-3333-3333-333333333333', 'member');

-- Rename -------------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"a2222222-2222-2222-2222-222222222222","role":"authenticated"}';
select lives_ok(
  $$select public.rename_organization(current_setting('tests.org')::uuid, '  Harbourline Freight BV ')$$,
  'an admin can rename the organization'
);
select is(
  (select name from public.organizations where id = current_setting('tests.org')::uuid),
  'Harbourline Freight BV',
  'the new name is stored trimmed'
);
select throws_ok(
  $$select public.rename_organization(current_setting('tests.org')::uuid, '   ')$$,
  '23514', null, 'an empty name is refused'
);

set local request.jwt.claims = '{"sub":"a3333333-3333-3333-3333-333333333333","role":"authenticated"}';
select throws_ok(
  $$select public.rename_organization(current_setting('tests.org')::uuid, 'Seized')$$,
  '42501', null, 'a plain member cannot rename'
);
set local request.jwt.claims = '{"sub":"a4444444-4444-4444-4444-444444444444","role":"authenticated"}';
select throws_ok(
  $$select public.rename_organization(current_setting('tests.org')::uuid, 'Seized')$$,
  '42501', null, 'an outsider cannot rename'
);

-- Roles --------------------------------------------------------------------------------
set local request.jwt.claims = '{"sub":"a2222222-2222-2222-2222-222222222222","role":"authenticated"}';
select throws_ok(
  $$select public.change_member_role(current_setting('tests.org')::uuid, 'a3333333-3333-3333-3333-333333333333', 'admin')$$,
  '42501', null, 'an admin cannot change roles'
);

set local request.jwt.claims = '{"sub":"a1111111-1111-1111-1111-111111111111","role":"authenticated"}';
select throws_ok(
  $$select public.change_member_role(current_setting('tests.org')::uuid, 'a1111111-1111-1111-1111-111111111111', 'member')$$,
  '23514', null, 'the last owner cannot demote themselves'
);
select lives_ok(
  $$select public.change_member_role(current_setting('tests.org')::uuid, 'a3333333-3333-3333-3333-333333333333', 'admin')$$,
  'an owner can promote a member'
);
select is(
  (select role from public.memberships where org_id = current_setting('tests.org')::uuid and user_id = 'a3333333-3333-3333-3333-333333333333'),
  'admin', 'the promotion is stored'
);
select is(
  (select metadata ->> 'to' from public.audit_events where action = 'membership.role_changed' order by created_at desc limit 1),
  'admin', 'the role change is audited'
);
select lives_ok(
  $$select public.change_member_role(current_setting('tests.org')::uuid, 'a3333333-3333-3333-3333-333333333333', 'member')$$,
  'an owner can demote again'
);
select throws_ok(
  $$select public.change_member_role(current_setting('tests.org')::uuid, 'a3333333-3333-3333-3333-333333333333', 'superuser')$$,
  '23514', null, 'an unknown role is refused'
);

-- Removal ------------------------------------------------------------------------------
set local request.jwt.claims = '{"sub":"a2222222-2222-2222-2222-222222222222","role":"authenticated"}';
select throws_ok(
  $$select public.remove_member(current_setting('tests.org')::uuid, 'a1111111-1111-1111-1111-111111111111')$$,
  '42501', null, 'an admin cannot remove an owner'
);
with attempted as (
  delete from public.memberships
  where org_id = current_setting('tests.org')::uuid and user_id = 'a1111111-1111-1111-1111-111111111111'
  returning 1
)
select is((select count(*)::int from attempted), 0, 'nor delete the owner row directly');
select lives_ok(
  $$select public.remove_member(current_setting('tests.org')::uuid, 'a3333333-3333-3333-3333-333333333333')$$,
  'an admin can remove a plain member'
);
select is(
  (select count(*)::int from public.memberships where org_id = current_setting('tests.org')::uuid),
  2, 'the member is gone'
);

set local request.jwt.claims = '{"sub":"a4444444-4444-4444-4444-444444444444","role":"authenticated"}';
select throws_ok(
  $$select public.remove_member(current_setting('tests.org')::uuid, 'a2222222-2222-2222-2222-222222222222')$$,
  '42501', null, 'an outsider cannot remove anyone'
);

-- Invitations --------------------------------------------------------------------------
set local request.jwt.claims = '{"sub":"a1111111-1111-1111-1111-111111111111","role":"authenticated"}';
select throws_ok(
  $$select public.create_invitation(current_setting('tests.org')::uuid, 'admin@example.test', 'member')$$,
  '23505', null, 'an existing member cannot be invited again'
);
select lives_ok(
  $$select set_config('tests.t1', public.create_invitation(current_setting('tests.org')::uuid, 'member@example.test', 'member'), true)$$,
  'a former member can be invited'
);
select lives_ok(
  $$select set_config('tests.t2', public.create_invitation(current_setting('tests.org')::uuid, 'member@example.test', 'admin'), true)$$,
  'inviting the same address again supersedes the first link'
);
select is(
  (select count(*)::int from public.invitations where org_id = current_setting('tests.org')::uuid and email = 'member@example.test' and revoked_at is null),
  1, 'only one live invitation per address'
);
select set_config(
  'tests.invite',
  (select id::text from public.invitations where org_id = current_setting('tests.org')::uuid and revoked_at is null and email = 'member@example.test'),
  true
);
select lives_ok(
  $$select set_config('tests.t3', public.reissue_invitation(current_setting('tests.invite')::uuid) ->> 'token', true)$$,
  'an invitation can be reissued'
);

set local request.jwt.claims = '{"sub":"a3333333-3333-3333-3333-333333333333","role":"authenticated"}';
select throws_ok(
  $$select public.accept_invitation(current_setting('tests.t1'))$$,
  '42501', null, 'a superseded link is refused'
);
select throws_ok(
  $$select public.accept_invitation(current_setting('tests.t2'))$$,
  '42501', null, 'the link from before a reissue is refused'
);
select throws_ok(
  $$select public.reissue_invitation(current_setting('tests.invite')::uuid)$$,
  '42501', null, 'the invitee cannot reissue'
);

set local request.jwt.claims = '{"sub":"a1111111-1111-1111-1111-111111111111","role":"authenticated"}';
select lives_ok(
  $$select public.revoke_invitation(current_setting('tests.invite')::uuid)$$,
  'an owner can revoke an invitation'
);
select lives_ok(
  $$select public.revoke_invitation(current_setting('tests.invite')::uuid)$$,
  'revoking twice is a no-op'
);
set local request.jwt.claims = '{"sub":"a3333333-3333-3333-3333-333333333333","role":"authenticated"}';
select throws_ok(
  $$select public.accept_invitation(current_setting('tests.t3'))$$,
  '42501', null, 'a revoked invitation cannot be accepted'
);

-- Service-role-only helpers are closed to API roles -------------------------------------
select throws_ok($$select public.purge_due_accounts(10)$$, '42501', null, 'authenticated cannot run the purge');
select throws_ok($$select public.admin_search_users('owner@', 10)$$, '42501', null, 'authenticated cannot search users');
select throws_ok(
  $$select public.admin_revoke_sessions('a1111111-1111-1111-1111-111111111111')$$,
  '42501', null, 'authenticated cannot revoke sessions'
);
select throws_ok(
  $$select public.peek_rate_limit(repeat('a', 64), 60)$$,
  '42501', null, 'authenticated cannot read quota counters'
);
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok(
  $$select public.admin_force_account_deletion('a1111111-1111-1111-1111-111111111111')$$,
  '42501', null, 'anon cannot force a deletion'
);

-- Admin search -------------------------------------------------------------------------
set local role service_role;
set local request.jwt.claims = '{"role":"service_role"}';
select is(
  (select public.admin_search_users('owner@example.test') -> 0 ->> 'email'),
  'owner@example.test', 'an exact address is found'
);
select is(
  (select jsonb_array_length(public.admin_search_users('o_t'))),
  0, 'an underscore is matched literally, not as a wildcard'
);
select throws_ok($$select public.admin_search_users('ow')$$, '22023', null, 'a query under three characters is refused');

-- Purge --------------------------------------------------------------------------------
reset role;
-- The solo user owns an organization alone; the owner of Harbourline still has colleagues.
set local role authenticated;
set local request.jwt.claims = '{"sub":"a5555555-5555-5555-5555-555555555555","role":"authenticated"}';
select set_config('tests.solo_org', public.create_organization('Solo Exports')::text, true);
reset role;
insert into public.account_deletion_requests (user_id, requested_at, purge_after) values
  ('a5555555-5555-5555-5555-555555555555', now() - interval '31 days', now() - interval '1 day'),
  ('a1111111-1111-1111-1111-111111111111', now() - interval '31 days', now() - interval '1 day'),
  ('a4444444-4444-4444-4444-444444444444', now(), now() + interval '29 days');

set local role service_role;
set local request.jwt.claims = '{"role":"service_role"}';
select is(
  (select (public.purge_due_accounts(25) ->> 'purged')::int),
  1, 'one due account is purged'
);
reset role;
select is(
  (select count(*)::int from auth.users where id = 'a5555555-5555-5555-5555-555555555555'),
  0, 'the purged account no longer exists'
);
select isnt(
  (select deleted_at from public.organizations where id = current_setting('tests.solo_org')::uuid),
  null, 'an organization it owned alone is soft-deleted'
);
select is(
  (select last_purge_outcome from public.account_deletion_requests where user_id = 'a1111111-1111-1111-1111-111111111111'),
  'blocked_sole_owner', 'a sole owner with colleagues is held back, with the reason recorded'
);
select is(
  (select count(*)::int from auth.users where id = 'a4444444-4444-4444-4444-444444444444'),
  1, 'an account still inside its grace period is untouched'
);

select * from finish();
rollback;
