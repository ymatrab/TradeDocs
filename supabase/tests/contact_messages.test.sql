-- Contact messages: no public read, no client write, server-only insert.
--
-- The table holds visitors' names, addresses and messages, so the assertions run as the real
-- API roles: an anonymous visitor and a signed-in account must both be refused every
-- operation, while the service role the /contact action uses can insert and the admin inbox
-- can read and mark rows handled.

create extension if not exists pgtap;

begin;
select plan(16);

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'dana@example.test', '', now(), now(), now());

select is(
  (select relrowsecurity from pg_class where oid = 'public.contact_messages'::regclass),
  true,
  'row level security is enabled'
);
select is(
  (select count(*)::int from pg_policies where schemaname = 'public' and tablename = 'contact_messages'),
  0,
  'no policy exists, so no API role is ever admitted'
);
select ok(
  not has_table_privilege('anon', 'public.contact_messages', 'select, insert, update, delete'),
  'anon holds no privilege on the table'
);
select ok(
  not has_table_privilege('authenticated', 'public.contact_messages', 'select, insert, update, delete'),
  'authenticated holds no privilege on the table'
);

-- A fixture written as the server writes it.
set local role service_role;
select lives_ok(
  $$insert into public.contact_messages (name, email, topic, message)
    values ('Dana Synthetic', 'dana@example.test', 'question', 'A synthetic message for the test.')$$,
  'the service role can store a message'
);
select is((select count(*)::int from public.contact_messages), 1, 'the service role can read the inbox');
select lives_ok(
  $$update public.contact_messages
      set handled_at = now(), handled_by = '44444444-4444-4444-4444-444444444444'$$,
  'the service role can mark a message handled'
);
select throws_ok(
  $$insert into public.contact_messages (name, email, topic, message)
    values ('Dana', 'dana@example.test', 'question', repeat('x', 5001))$$,
  '23514',
  null,
  'an oversized message is refused by the table itself'
);
select throws_ok(
  $$insert into public.contact_messages (name, email, topic, message)
    values ('Dana', 'dana@example.test', 'billing', 'A message with an unknown topic.')$$,
  '23514',
  null,
  'an unknown topic is refused'
);
select throws_ok(
  $$insert into public.contact_messages (name, email, topic, message)
    values (E'Dana\r\nBcc: someone@example.test', 'dana@example.test', 'other', 'Header injection attempt.')$$,
  '23514',
  null,
  'a name with a line break is refused'
);
reset role;

-- Anonymous visitors.
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok(
  $$select count(*) from public.contact_messages$$,
  '42501',
  null,
  'an anonymous caller cannot read messages'
);
select throws_ok(
  $$insert into public.contact_messages (name, email, topic, message)
    values ('Mallory', 'mallory@example.test', 'other', 'Writing around the server action.')$$,
  '42501',
  null,
  'an anonymous caller cannot insert directly'
);
reset role;

-- A signed-in account, including one that wrote a message.
set local role authenticated;
set local request.jwt.claims = '{"sub":"44444444-4444-4444-4444-444444444444","role":"authenticated"}';
select throws_ok(
  $$select count(*) from public.contact_messages$$,
  '42501',
  null,
  'a signed-in account cannot read the inbox'
);
select throws_ok(
  $$insert into public.contact_messages (name, email, topic, message)
    values ('Dana', 'dana@example.test', 'other', 'Writing around the server action.')$$,
  '42501',
  null,
  'a signed-in account cannot insert directly'
);
select throws_ok(
  $$update public.contact_messages set handled_at = null$$,
  '42501',
  null,
  'a signed-in account cannot change a message'
);
select throws_ok(
  $$delete from public.contact_messages$$,
  '42501',
  null,
  'a signed-in account cannot delete a message'
);
reset role;

select * from finish();
rollback;
