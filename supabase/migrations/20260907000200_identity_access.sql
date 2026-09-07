-- Task 04 — access policies, role helpers and identity lifecycle routines.
--
-- Authorization lives here, in the database, so it holds for every caller regardless of
-- which application code reaches the table. Membership lookups run through security-definer
-- helpers: a policy on memberships that queried memberships would recurse.

begin;

create or replace function private.current_user_id() returns uuid
  language sql stable
  set search_path = ''
as $$
  select auth.uid();
$$;

create or replace function private.is_member(target_org uuid) returns boolean
  language sql stable
  security definer
  set search_path = ''
as $$
  select exists (
    select 1 from public.memberships m
    where m.org_id = target_org and m.user_id = (select auth.uid())
  );
$$;

create or replace function private.has_org_role(target_org uuid, allowed text[]) returns boolean
  language sql stable
  security definer
  set search_path = ''
as $$
  select exists (
    select 1 from public.memberships m
    where m.org_id = target_org
      and m.user_id = (select auth.uid())
      and m.role = any (allowed)
  );
$$;

create or replace function private.shares_org_with(other_user uuid) returns boolean
  language sql stable
  security definer
  set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships mine
    join public.memberships theirs on theirs.org_id = mine.org_id
    where mine.user_id = (select auth.uid()) and theirs.user_id = other_user
  );
$$;

-- An organization that loses its last owner cannot be administered by anyone, so the
-- database refuses the removal or demotion rather than trusting callers to check.
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

create trigger memberships_protect_last_owner
  before update or delete on public.memberships
  for each row execute function private.protect_last_owner();

-- Row policies -------------------------------------------------------------------------

create policy profiles_select_self_or_colleague on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or private.shares_org_with(id));

create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy organizations_select_member on public.organizations
  for select to authenticated
  using (deleted_at is null and private.is_member(id));

create policy organizations_update_admin on public.organizations
  for update to authenticated
  using (deleted_at is null and private.has_org_role(id, array['owner', 'admin']))
  with check (private.has_org_role(id, array['owner', 'admin']));

create policy memberships_select_member on public.memberships
  for select to authenticated
  using (private.is_member(org_id));

create policy memberships_update_owner on public.memberships
  for update to authenticated
  using (private.has_org_role(org_id, array['owner']))
  with check (private.has_org_role(org_id, array['owner']));

-- An administrator may remove a member, and any member may remove themselves. The
-- last-owner trigger still refuses either when it would orphan the organization.
create policy memberships_delete_admin_or_self on public.memberships
  for delete to authenticated
  using (
    private.has_org_role(org_id, array['owner', 'admin']) or user_id = (select auth.uid())
  );

create policy invitations_select_admin on public.invitations
  for select to authenticated
  using (private.has_org_role(org_id, array['owner', 'admin']));

create policy invitations_update_admin on public.invitations
  for update to authenticated
  using (private.has_org_role(org_id, array['owner', 'admin']))
  with check (private.has_org_role(org_id, array['owner', 'admin']));

create policy audit_events_select_admin on public.audit_events
  for select to authenticated
  using (org_id is not null and private.has_org_role(org_id, array['owner', 'admin']));

create policy deletion_requests_select_self on public.account_deletion_requests
  for select to authenticated
  using (user_id = (select auth.uid()));

-- Grants. No table takes a direct insert: every write that must stay consistent across
-- more than one row goes through a routine below.
grant select, update on public.profiles to authenticated;
grant select, update on public.organizations to authenticated;
grant select, update, delete on public.memberships to authenticated;
grant select, update on public.invitations to authenticated;
grant select on public.audit_events to authenticated;
grant select on public.account_deletion_requests to authenticated;

commit;
