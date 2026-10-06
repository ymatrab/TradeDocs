-- Contact form messages (D-018).
--
-- Written only by the server: the /contact action validates, rate-limits and inserts with the
-- service-role key, and the platform admin inbox reads and marks rows through the same key
-- after an allowlist check. No API role holds any grant and no policy exists, so anon and
-- authenticated callers can neither read, write nor enumerate the table, whatever the
-- client sends.
--
-- The bounds repeat src/lib/contact/schema.ts so a caller that skipped the action still could
-- not store an oversized or malformed row.
--
-- Rollback: drop table public.contact_messages. Nothing references it; the contact action
-- then reports the form as unavailable and points at the published address.

begin;

create table public.contact_messages (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null check (
    char_length(btrim(name)) between 1 and 120 and name !~ '[\r\n]'
  ),
  email text not null check (
    char_length(email) between 3 and 254 and email = lower(btrim(email)) and position('@' in email) > 1
  ),
  topic text not null check (topic in ('question', 'account', 'problem', 'privacy', 'other')),
  message text not null check (char_length(btrim(message)) between 10 and 5000),
  -- Whether the owner was emailed. A failure is recorded by reason code only, never by
  -- provider response body.
  notification_status text not null default 'pending' check (
    notification_status in ('pending', 'sent', 'not_sent', 'failed')
  ),
  notification_detail text check (char_length(notification_detail) <= 100),
  handled_at timestamptz,
  handled_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  check (handled_by is null or handled_at is not null)
);

create index contact_messages_created_idx on public.contact_messages (created_at desc, id);
create index contact_messages_open_idx on public.contact_messages (created_at desc)
  where handled_at is null;

alter table public.contact_messages enable row level security;
revoke all on public.contact_messages from public, anon, authenticated;
-- service_role bypasses row level security; it is granted only what the server does.
grant select, insert, update on public.contact_messages to service_role;

-- The platform admin pages (src/app/admin) read these through the service role and record
-- every admin action in audit_events. Supabase's default privileges already cover them;
-- they are stated so the dependency is visible here rather than implied.
grant select on public.organizations, public.memberships, public.profiles, public.shipments,
  public.documents to service_role;
grant select, insert on public.audit_events to service_role;

commit;
