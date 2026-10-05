-- Distributed rate limiting.
--
-- src/lib/security/rate-limit.ts calls POST /rest/v1/rpc/consume_rate_limit with the
-- service-role key and expects exactly one row of (allowed, remaining, retry_after_seconds).
-- The application never sends an identity: keys arrive as an HMAC-SHA-256 digest, so this
-- table holds no IP address or user id.
--
-- Fixed windows aligned to the epoch. One upsert per call, so two concurrent requests
-- serialise on the counter row and cannot both take the last slot.
--
-- Rollback: drop function public.consume_rate_limit(text, integer, integer) and table
-- private.rate_limit_counters. Callers then fail closed with a retryable 503.

begin;

create table private.rate_limit_counters (
  key_hash text not null check (key_hash ~ '^[a-f0-9]{64}$'),
  window_seconds integer not null check (window_seconds between 1 and 86400),
  window_started_at timestamptz not null,
  request_count integer not null check (request_count >= 0),
  primary key (key_hash, window_seconds, window_started_at)
);
create index rate_limit_counters_expiry_idx on private.rate_limit_counters (window_started_at);

alter table private.rate_limit_counters enable row level security;
revoke all on private.rate_limit_counters from public, anon, authenticated;

create or replace function public.consume_rate_limit(
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns table (allowed boolean, remaining integer, retry_after_seconds integer)
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  window_start timestamptz;
  window_end timestamptz;
  used integer;
begin
  if p_key_hash is null or p_key_hash !~ '^[a-f0-9]{64}$'
    or p_limit is null or p_limit not between 1 and 10000
    or p_window_seconds is null or p_window_seconds not between 1 and 86400
  then
    raise exception 'Invalid rate limit request.' using errcode = '22023';
  end if;

  window_start := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );
  window_end := window_start + make_interval(secs => p_window_seconds);

  insert into private.rate_limit_counters as c
    (key_hash, window_seconds, window_started_at, request_count)
  values (p_key_hash, p_window_seconds, window_start, 1)
  on conflict (key_hash, window_seconds, window_started_at)
    do update set request_count = least(c.request_count + 1, 2147483000)
  returning c.request_count into used;

  -- Expired windows are removed opportunistically. The longest window is one day, so
  -- anything older than two has no reader left.
  if random() < 0.01 then
    delete from private.rate_limit_counters r
    where r.window_started_at < now() - interval '2 days';
  end if;

  allowed := used <= p_limit;
  remaining := greatest(p_limit - used, 0);
  retry_after_seconds := case
    when used <= p_limit then 0
    else least(greatest(1, ceil(extract(epoch from (window_end - now())))::integer), 86400)
  end;
  return next;
end;
$$;

revoke execute on function public.consume_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;

commit;
