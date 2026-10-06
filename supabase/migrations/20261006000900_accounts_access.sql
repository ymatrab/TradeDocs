-- Accounts and access under real conditions (D-020).
--
-- 1. Account purge: accounts whose 30-day deletion grace has passed are removed by
--    public.purge_due_accounts(), callable by service_role only. It is NOT scheduled here:
--    scheduling (Vercel Cron or pg_cron) is an owner decision recorded in RUNBOOK.md.
-- 2. Member management through audited routines: rename an organization, change a role,
--    remove a member, revoke and reissue an invitation. Admins may remove plain members
--    only; owners may remove anyone; anyone may leave. The last-owner trigger still holds.
-- 3. Platform-admin helpers (service_role only): email search over auth.users without the
--    query entering a URL, session revocation for a disabled account, forced deletion.
-- 4. peek_rate_limit: reads a quota counter without consuming it, so sign-in can require a
--    bot challenge after repeated failures without counting the check itself as a failure.
--
-- Rollback: drop the functions created below, restore memberships_delete_admin_or_self
-- from 20260907000200, restore private.protect_last_owner, and re-add NOT NULL to
-- invitations.invited_by (only possible while no purged inviter left a NULL behind).
-- No data is destroyed by applying this migration.

begin;

-- Purge bookkeeping, so the admin panel can show why an account is still here.
alter table public.account_deletion_requests
  add column last_purge_attempt_at timestamptz,
  add column last_purge_outcome text check (
    last_purge_outcome is null or last_purge_outcome in ('blocked_sole_owner')
  );

-- An invitation outlives the account that sent or accepted it. The organization keeps the
-- record; the person's identity is detached when their account is purged.
alter table public.invitations alter column invited_by drop not null;
alter table public.invitations drop constraint if exists invitations_invited_by_fkey;
alter table public.invitations
  add constraint invitations_invited_by_fkey
  foreign key (invited_by) references auth.users (id) on delete set null;
alter table public.invitations drop constraint if exists invitations_accepted_by_fkey;
alter table public.invitations
  add constraint invitations_accepted_by_fkey
  foreign key (accepted_by) references auth.users (id) on delete set null;

-- The original pairing check would refuse that detachment, so it becomes one-directional:
-- an accepter implies an acceptance, never the reverse.
do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.invitations'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%accepted_by IS NULL%'
  loop
    execute format('alter table public.invitations drop constraint %I', c.conname);
  end loop;
end;
$$;
alter table public.invitations
  add constraint invitations_accepter_implies_acceptance
  check (accepted_by is null or accepted_at is not null);

-- A deleted organization needs no owner: the purge soft-deletes an organization whose only
-- member is the account being removed, and then removes that membership.
create or replace function private.protect_last_owner() returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  remaining integer;
begin
  if tg_op = 'DELETE' then
    if old.role <> 'owner' then
      return old;
    end if;
  elsif old.role <> 'owner' or new.role = 'owner' then
    return new;
  end if;

  if exists (
    select 1 from public.organizations o where o.id = old.org_id and o.deleted_at is not null
  ) then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  select count(*) into remaining
  from public.memberships m
  where m.org_id = old.org_id and m.role = 'owner' and m.user_id <> old.user_id;

  if remaining = 0 then
    raise exception 'An organization must keep at least one owner.'
      using errcode = 'check_violation';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

-- An administrator may remove plain members, never another administrator or an owner.
drop policy memberships_delete_admin_or_self on public.memberships;
create policy memberships_delete_scoped on public.memberships
  for delete to authenticated
  using (
    user_id = (select auth.uid())
    or private.has_org_role(org_id, array['owner'])
    or (role = 'member' and private.has_org_role(org_id, array['admin']))
  );

-- Organization routines ------------------------------------------------------------------

create or replace function public.rename_organization(target_org uuid, new_name text)
returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  cleaned text := btrim(coalesce(new_name, ''));
begin
  if actor is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;
  if not private.has_org_role(target_org, array['owner', 'admin']) then
    raise exception 'You do not have access to this organization.' using errcode = '42501';
  end if;
  if char_length(cleaned) not between 1 and 160 then
    raise exception 'Use between 1 and 160 characters.' using errcode = 'check_violation';
  end if;

  update public.organizations set name = cleaned
  where id = target_org and deleted_at is null;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id)
  values (target_org, actor, 'organization.renamed', 'organization', target_org::text);
end;
$$;

create or replace function public.change_member_role(
  target_org uuid,
  target_user uuid,
  new_role text
) returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  previous text;
begin
  if actor is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;
  if not private.has_org_role(target_org, array['owner']) then
    raise exception 'Only an owner can change roles.' using errcode = '42501';
  end if;
  if new_role not in ('owner', 'admin', 'member') then
    raise exception 'Choose owner, admin or member.' using errcode = 'check_violation';
  end if;

  select m.role into previous from public.memberships m
  where m.org_id = target_org and m.user_id = target_user
  for update;
  if previous is null then
    raise exception 'That person is not a member.' using errcode = 'no_data_found';
  end if;
  if previous = new_role then
    return;
  end if;

  -- The last-owner trigger refuses a demotion that would orphan the organization.
  update public.memberships set role = new_role
  where org_id = target_org and user_id = target_user;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    target_org, actor, 'membership.role_changed', 'membership', target_user::text,
    jsonb_build_object('from', previous, 'to', new_role)
  );
end;
$$;

create or replace function public.remove_member(target_org uuid, target_user uuid)
returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  target_role text;
begin
  if actor is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  select m.role into target_role from public.memberships m
  where m.org_id = target_org and m.user_id = target_user
  for update;
  -- The same refusal whether or not the person exists, for a caller outside the org.
  if target_role is null and not private.is_member(target_org) then
    raise exception 'You do not have access to this organization.' using errcode = '42501';
  end if;
  if target_role is null then
    raise exception 'That person is not a member.' using errcode = 'no_data_found';
  end if;

  if not (
    target_user = actor
    or private.has_org_role(target_org, array['owner'])
    or (target_role = 'member' and private.has_org_role(target_org, array['admin']))
  ) then
    raise exception 'You cannot remove this member.' using errcode = '42501';
  end if;

  delete from public.memberships where org_id = target_org and user_id = target_user;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    target_org, actor,
    case when target_user = actor then 'membership.left' else 'membership.removed' end,
    'membership', target_user::text,
    jsonb_build_object('role', target_role)
  );
end;
$$;

-- Invitations ----------------------------------------------------------------------------

-- Replaces the Task 04 routine: an address that already belongs to the organization is
-- refused, and a fresh invitation supersedes any still-pending one to the same address,
-- so at most one live link exists per person.
create or replace function public.create_invitation(
  target_org uuid,
  invitee_email text,
  invitee_role text,
  valid_for interval default interval '7 days'
) returns text
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  normalized text := lower(btrim(coalesce(invitee_email, '')));
  token text;
begin
  if not private.has_org_role(target_org, array['owner', 'admin']) then
    raise exception 'You do not have access to this organization.' using errcode = '42501';
  end if;
  if invitee_role not in ('admin', 'member') then
    raise exception 'Choose the admin or member role.' using errcode = 'check_violation';
  end if;
  if position('@' in normalized) = 0 or char_length(normalized) > 254 then
    raise exception 'Enter a valid email address.' using errcode = 'check_violation';
  end if;
  if valid_for <= interval '0' or valid_for > interval '30 days' then
    raise exception 'An invitation may last up to 30 days.' using errcode = 'check_violation';
  end if;
  if exists (
    select 1 from public.memberships m
    join auth.users u on u.id = m.user_id
    where m.org_id = target_org and lower(btrim(u.email)) = normalized
  ) then
    raise exception 'That address already belongs to this organization.'
      using errcode = 'unique_violation';
  end if;

  update public.invitations
  set revoked_at = now()
  where org_id = target_org and email = normalized
    and accepted_at is null and revoked_at is null;

  token := encode(extensions.gen_random_bytes(32), 'hex');

  insert into public.invitations (org_id, email, role, token_hash, invited_by, expires_at)
  values (
    target_org,
    normalized,
    invitee_role,
    encode(extensions.digest(token, 'sha256'), 'hex'),
    actor,
    now() + valid_for
  );

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id, metadata)
  values (
    target_org, actor, 'invitation.created', 'invitation', normalized,
    jsonb_build_object('role', invitee_role)
  );

  return token;
end;
$$;

create or replace function public.revoke_invitation(target_invitation uuid) returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  invitation public.invitations;
begin
  if actor is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;
  select * into invitation from public.invitations i where i.id = target_invitation for update;
  if invitation.id is null or not private.has_org_role(invitation.org_id, array['owner', 'admin']) then
    raise exception 'That invitation was not found.' using errcode = '42501';
  end if;
  -- Revoking twice, or revoking a used invitation, changes nothing and records nothing.
  if invitation.accepted_at is not null or invitation.revoked_at is not null then
    return;
  end if;

  update public.invitations set revoked_at = now() where id = invitation.id;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id)
  values (invitation.org_id, actor, 'invitation.revoked', 'invitation', invitation.id::text);
end;
$$;

-- A pending (or expired, unrevoked) invitation gets a new token and a fresh expiry. The old
-- link stops working at once, because only one digest is stored. Returns the new token once.
create or replace function public.reissue_invitation(target_invitation uuid) returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  invitation public.invitations;
  token text;
  expires timestamptz := now() + interval '7 days';
begin
  if actor is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;
  select * into invitation from public.invitations i where i.id = target_invitation for update;
  if invitation.id is null or not private.has_org_role(invitation.org_id, array['owner', 'admin']) then
    raise exception 'That invitation was not found.' using errcode = '42501';
  end if;
  if invitation.accepted_at is not null or invitation.revoked_at is not null then
    raise exception 'That invitation has already been used or revoked.'
      using errcode = 'check_violation';
  end if;

  token := encode(extensions.gen_random_bytes(32), 'hex');
  update public.invitations
  set token_hash = encode(extensions.digest(token, 'sha256'), 'hex'),
      expires_at = expires,
      invited_by = actor
  where id = invitation.id;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id)
  values (invitation.org_id, actor, 'invitation.reissued', 'invitation', invitation.id::text);

  return jsonb_build_object(
    'token', token,
    'email', invitation.email,
    'role', invitation.role,
    'org_id', invitation.org_id,
    'expires_at', expires
  );
end;
$$;

do $$
declare routine text;
begin
  foreach routine in array array[
    'public.rename_organization(uuid, text)',
    'public.change_member_role(uuid, uuid, text)',
    'public.remove_member(uuid, uuid)',
    'public.create_invitation(uuid, text, text, interval)',
    'public.revoke_invitation(uuid)',
    'public.reissue_invitation(uuid)'
  ] loop
    execute format('revoke execute on function %s from public, anon', routine);
    execute format('grant execute on function %s to authenticated', routine);
  end loop;
end;
$$;

-- Account purge --------------------------------------------------------------------------

-- Removes one account. Never called by an API role directly.
--
-- Refuses ('blocked_sole_owner') while the account is the only owner of an organization that
-- still has other members: deleting it would leave colleagues in an organization nobody can
-- administer. Organizations whose only member is this account are soft-deleted (their
-- records stay, as the audit trail references them). Pending invitations it sent are
-- revoked. Then the auth user is deleted, which cascades to the profile, sessions and the
-- deletion request, and detaches every created_by/actor reference (on delete set null).
create or replace function private.purge_account(target uuid, purge_source text) returns text
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  previous_outcome text;
begin
  if not exists (select 1 from auth.users u where u.id = target) then
    return 'not_found';
  end if;

  if exists (
    select 1
    from public.memberships m
    join public.organizations o on o.id = m.org_id and o.deleted_at is null
    where m.user_id = target
      and m.role = 'owner'
      and not exists (
        select 1 from public.memberships x
        where x.org_id = m.org_id and x.role = 'owner' and x.user_id <> target
      )
      and exists (
        select 1 from public.memberships x where x.org_id = m.org_id and x.user_id <> target
      )
  ) then
    select d.last_purge_outcome into previous_outcome
    from public.account_deletion_requests d where d.user_id = target;
    update public.account_deletion_requests
    set last_purge_attempt_at = now(), last_purge_outcome = 'blocked_sole_owner'
    where user_id = target;
    -- Recorded once per blocked request, not on every run.
    if previous_outcome is distinct from 'blocked_sole_owner' then
      insert into public.audit_events (action, target_type, target_id, metadata)
      values (
        'account.purge_blocked', 'account', target::text,
        jsonb_build_object('reason', 'sole_owner_with_members', 'source', purge_source)
      );
    end if;
    return 'blocked_sole_owner';
  end if;

  with solo as (
    update public.organizations o
    set deleted_at = now()
    where o.deleted_at is null
      and exists (select 1 from public.memberships m where m.org_id = o.id and m.user_id = target)
      and not exists (
        select 1 from public.memberships x where x.org_id = o.id and x.user_id <> target
      )
    returning o.id
  )
  insert into public.audit_events (org_id, action, target_type, target_id, metadata)
  select solo.id, 'organization.deleted', 'organization', solo.id::text,
    jsonb_build_object('reason', 'owner_account_purged')
  from solo;

  delete from public.memberships where user_id = target;

  update public.invitations
  set revoked_at = now()
  where invited_by = target and accepted_at is null and revoked_at is null;

  insert into public.audit_events (action, target_type, target_id, metadata)
  values ('account.purged', 'account', target::text, jsonb_build_object('source', purge_source));

  delete from auth.users where id = target;
  return 'purged';
end;
$$;
revoke all on function private.purge_account(uuid, text) from public, anon, authenticated;

-- The purge job. Idempotent: an account already removed has no request row left, a
-- withdrawn request is skipped, and a blocked account is retried on the next run without a
-- duplicate audit record. SKIP LOCKED lets two overlapping runs share the work safely.
create or replace function public.purge_due_accounts(p_limit integer default 25) returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  due record;
  outcome text;
  purged integer := 0;
  blocked integer := 0;
  results jsonb := '[]'::jsonb;
begin
  if p_limit is null or p_limit not between 1 and 200 then
    raise exception 'Choose a batch of 1 to 200 accounts.' using errcode = '22023';
  end if;

  for due in
    select d.user_id
    from public.account_deletion_requests d
    where d.cancelled_at is null and d.purge_after <= now()
    order by d.purge_after, d.user_id
    limit p_limit
    for update skip locked
  loop
    outcome := private.purge_account(due.user_id, 'scheduled');
    if outcome = 'purged' then
      purged := purged + 1;
    elsif outcome = 'blocked_sole_owner' then
      blocked := blocked + 1;
    end if;
    results := results || jsonb_build_object('user_id', due.user_id, 'outcome', outcome);
  end loop;

  return jsonb_build_object(
    'purged', purged,
    'blocked', blocked,
    'results', results,
    'ran_at', now()
  );
end;
$$;

-- A platform admin's "delete now": the request becomes due immediately and is purged in the
-- same call. Returns the outcome of private.purge_account.
create or replace function public.admin_force_account_deletion(p_user uuid) returns text
  language plpgsql
  security definer
  set search_path = ''
as $$
begin
  if not exists (select 1 from auth.users u where u.id = p_user) then
    return 'not_found';
  end if;
  insert into public.account_deletion_requests (user_id, requested_at, purge_after)
  values (p_user, now() - interval '1 second', now())
  on conflict (user_id) do update
    set purge_after = now(),
        requested_at = least(public.account_deletion_requests.requested_at, now() - interval '1 second'),
        cancelled_at = null;
  return private.purge_account(p_user, 'admin');
end;
$$;

-- Platform admin helpers -----------------------------------------------------------------

-- Exact or prefix search on the address. The query arrives in a request body, never a URL.
-- At least three characters, at most 50 rows: this is a lookup, not an export.
create or replace function public.admin_search_users(p_query text, p_limit integer default 25)
returns jsonb
  language plpgsql
  stable
  security definer
  set search_path = ''
as $$
declare
  q text := lower(btrim(coalesce(p_query, '')));
  pattern text;
begin
  if char_length(q) < 3 or char_length(q) > 254 then
    raise exception 'Search with 3 to 254 characters.' using errcode = '22023';
  end if;
  pattern := replace(replace(replace(q, '\', '\\'), '%', '\%'), '_', '\_') || '%';

  return coalesce(
    (
      select jsonb_agg(found.row_data order by found.exact desc, found.email)
      from (
        select
          lower(u.email) = q as exact,
          u.email,
          jsonb_build_object(
            'id', u.id,
            'email', u.email,
            'created_at', u.created_at,
            'last_sign_in_at', u.last_sign_in_at,
            'email_confirmed_at', u.email_confirmed_at,
            'banned_until', u.banned_until,
            'deletion_due', d.purge_after
          ) as row_data
        from auth.users u
        left join public.account_deletion_requests d
          on d.user_id = u.id and d.cancelled_at is null
        where lower(u.email) like pattern escape '\'
        order by lower(u.email) = q desc, u.email
        limit least(greatest(coalesce(p_limit, 25), 1), 50)
      ) found
    ),
    '[]'::jsonb
  );
end;
$$;

-- Ends every session of an account, so disabling sign-in takes effect now rather than when
-- the current access token expires. Returns how many sessions were ended.
create or replace function public.admin_revoke_sessions(p_user uuid) returns integer
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  ended integer;
begin
  delete from auth.sessions where user_id = p_user;
  get diagnostics ended = row_count;
  return ended;
end;
$$;

-- Reads a quota counter without incrementing it. Same key derivation as consume_rate_limit.
create or replace function public.peek_rate_limit(p_key_hash text, p_window_seconds integer)
returns integer
  language plpgsql
  stable
  security definer
  set search_path = ''
as $$
declare
  used integer;
begin
  if p_key_hash is null or p_key_hash !~ '^[a-f0-9]{64}$'
    or p_window_seconds is null or p_window_seconds not between 1 and 86400
  then
    raise exception 'Invalid rate limit request.' using errcode = '22023';
  end if;
  select c.request_count into used
  from private.rate_limit_counters c
  where c.key_hash = p_key_hash
    and c.window_seconds = p_window_seconds
    and c.window_started_at = to_timestamp(
      floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
    );
  return coalesce(used, 0);
end;
$$;

do $$
declare routine text;
begin
  foreach routine in array array[
    'public.purge_due_accounts(integer)',
    'public.admin_force_account_deletion(uuid)',
    'public.admin_search_users(text, integer)',
    'public.admin_revoke_sessions(uuid)',
    'public.peek_rate_limit(text, integer)'
  ] loop
    execute format('revoke execute on function %s from public, anon, authenticated', routine);
    execute format('grant execute on function %s to service_role', routine);
  end loop;
end;
$$;

commit;
