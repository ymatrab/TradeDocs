-- Task 04 — identity routines.
--
-- Operations that must not half-apply live in one transaction each: creating an
-- organization also creates its first owner, and accepting an invitation also consumes it.
-- Every routine is denied to anon and to PUBLIC, then granted to authenticated only.

begin;

create or replace function public.create_organization(organization_name text) returns uuid
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  created uuid;
begin
  if actor is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;
  if btrim(coalesce(organization_name, '')) = '' then
    raise exception 'Enter an organization name.' using errcode = 'check_violation';
  end if;

  insert into public.organizations (name, created_by)
  values (btrim(organization_name), actor)
  returning id into created;

  insert into public.memberships (org_id, user_id, role) values (created, actor, 'owner');

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id)
  values (created, actor, 'organization.created', 'organization', created::text);

  return created;
end;
$$;

-- Returns the single-use token exactly once. Only its digest is stored, so an invitation
-- link cannot be reconstructed from the database afterwards.
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
  if position('@' in normalized) = 0 then
    raise exception 'Enter a valid email address.' using errcode = 'check_violation';
  end if;
  if valid_for <= interval '0' or valid_for > interval '30 days' then
    raise exception 'An invitation may last up to 30 days.' using errcode = 'check_violation';
  end if;

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

create or replace function public.accept_invitation(token text) returns uuid
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  actor_email text;
  invitation public.invitations;
begin
  if actor is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;
  select lower(btrim(u.email)) into actor_email from auth.users u where u.id = actor;

  -- Locking the row makes a replayed token wait and then fail the consumed check rather
  -- than racing a concurrent acceptance.
  select * into invitation
  from public.invitations i
  where i.token_hash = encode(extensions.digest(coalesce(token, ''), 'sha256'), 'hex')
  for update;

  if invitation.id is null
    or invitation.accepted_at is not null
    or invitation.revoked_at is not null
    or invitation.expires_at <= now()
  then
    raise exception 'This invitation is no longer valid.' using errcode = '42501';
  end if;
  if invitation.email <> actor_email then
    raise exception 'This invitation was issued to a different address.' using errcode = '42501';
  end if;

  insert into public.memberships (org_id, user_id, role)
  values (invitation.org_id, actor, invitation.role)
  on conflict (org_id, user_id) do nothing;

  update public.invitations
  set accepted_at = now(), accepted_by = actor
  where id = invitation.id;

  insert into public.audit_events (org_id, actor_id, action, target_type, target_id)
  values (invitation.org_id, actor, 'invitation.accepted', 'invitation', invitation.id::text);

  return invitation.org_id;
end;
$$;

-- Export returns only the caller's own data, and never another member's profile.
create or replace function public.export_account_data() returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
begin
  if actor is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  insert into public.audit_events (actor_id, action, target_type, target_id)
  values (actor, 'account.exported', 'account', actor::text);

  return jsonb_build_object(
    'exported_at', now(),
    'profile', (select to_jsonb(p) from public.profiles p where p.id = actor),
    'memberships', coalesce(
      (
        select jsonb_agg(jsonb_build_object('organization', o.name, 'role', m.role, 'joined_at', m.created_at))
        from public.memberships m
        join public.organizations o on o.id = m.org_id
        where m.user_id = actor
      ),
      '[]'::jsonb
    )
  );
end;
$$;

create or replace function public.request_account_deletion(grace interval default interval '30 days')
returns timestamptz
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  scheduled timestamptz;
begin
  if actor is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;
  if grace < interval '1 day' or grace > interval '90 days' then
    raise exception 'The grace period must be between 1 and 90 days.' using errcode = 'check_violation';
  end if;
  scheduled := now() + grace;

  insert into public.account_deletion_requests (user_id, requested_at, purge_after)
  values (actor, now(), scheduled)
  on conflict (user_id) do update
    set requested_at = now(), purge_after = scheduled, cancelled_at = null;

  insert into public.audit_events (actor_id, action, target_type, target_id, metadata)
  values (
    actor, 'account.deletion_requested', 'account', actor::text,
    jsonb_build_object('purge_after', scheduled)
  );

  return scheduled;
end;
$$;

create or replace function public.cancel_account_deletion() returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  affected integer;
begin
  if actor is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  update public.account_deletion_requests
  set cancelled_at = now()
  where user_id = actor and cancelled_at is null and purge_after > now();
  get diagnostics affected = row_count;

  if affected = 0 then
    raise exception 'There is no deletion request to withdraw.' using errcode = 'no_data_found';
  end if;

  insert into public.audit_events (actor_id, action, target_type, target_id)
  values (actor, 'account.deletion_cancelled', 'account', actor::text);
end;
$$;

do $$
declare routine text;
begin
  foreach routine in array array[
    'public.create_organization(text)',
    'public.create_invitation(uuid, text, text, interval)',
    'public.accept_invitation(text)',
    'public.export_account_data()',
    'public.request_account_deletion(interval)',
    'public.cancel_account_deletion()'
  ] loop
    execute format('revoke execute on function %s from public, anon', routine);
    execute format('grant execute on function %s to authenticated', routine);
  end loop;
end;
$$;

commit;
