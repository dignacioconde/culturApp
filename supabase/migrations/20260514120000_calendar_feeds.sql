create extension if not exists pgcrypto with schema extensions;

create table public.calendar_feeds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  token_hash text not null unique,
  label text not null,
  provider text not null default 'other',
  scope text not null default 'events',
  revoked_at timestamptz,
  last_accessed_at timestamptz,
  created_at timestamptz default now(),
  constraint calendar_feeds_token_hash_sha256 check (token_hash ~ '^[0-9a-f]{64}$'),
  constraint calendar_feeds_label_not_blank check (btrim(label) <> ''),
  constraint calendar_feeds_provider_known check (provider in ('apple', 'google', 'outlook', 'other')),
  constraint calendar_feeds_scope_events check (scope = 'events')
);

create index calendar_feeds_user_id_idx on public.calendar_feeds(user_id);
create index calendar_feeds_active_idx on public.calendar_feeds(user_id, revoked_at);

alter table public.calendar_feeds enable row level security;

create policy "calendar_feeds: usuario propio lectura" on public.calendar_feeds
  for select
  using (auth.uid() = user_id);

create or replace function public.create_calendar_feed(
  feed_provider text,
  feed_label text default null
)
returns table (
  id uuid,
  label text,
  provider text,
  scope text,
  created_at timestamptz,
  feed_token text
)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_provider text := lower(nullif(btrim(feed_provider), ''));
  generated_token text;
  inserted_feed public.calendar_feeds%rowtype;
begin
  if current_user_id is null then
    raise exception 'auth_required'
      using errcode = 'P0001',
      hint = 'create_calendar_feed requires an authenticated user';
  end if;

  if normalized_provider is null or normalized_provider not in ('apple', 'google', 'outlook', 'other') then
    raise exception 'invalid_provider'
      using errcode = 'P0001',
      hint = 'provider must be apple, google, outlook or other';
  end if;

  generated_token := 'caches_' || encode(extensions.gen_random_bytes(32), 'hex');

  insert into public.calendar_feeds (user_id, token_hash, label, provider, scope)
  values (
    current_user_id,
    encode(extensions.digest(generated_token, 'sha256'), 'hex'),
    coalesce(nullif(btrim(feed_label), ''), 'Calendario Cachés'),
    normalized_provider,
    'events'
  )
  returning * into inserted_feed;

  id := inserted_feed.id;
  label := inserted_feed.label;
  provider := inserted_feed.provider;
  scope := inserted_feed.scope;
  created_at := inserted_feed.created_at;
  feed_token := generated_token;
  return next;
end;
$$;

create or replace function public.revoke_calendar_feed(feed_id uuid)
returns table (
  id uuid,
  revoked_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  updated_feed public.calendar_feeds%rowtype;
begin
  if current_user_id is null then
    raise exception 'auth_required'
      using errcode = 'P0001',
      hint = 'revoke_calendar_feed requires an authenticated user';
  end if;

  update public.calendar_feeds
  set revoked_at = coalesce(revoked_at, now())
  where calendar_feeds.id = feed_id
    and calendar_feeds.user_id = current_user_id
  returning * into updated_feed;

  if not found then
    raise exception 'calendar_feed_not_found'
      using errcode = 'P0001',
      hint = 'No feed found for this authenticated user';
  end if;

  id := updated_feed.id;
  revoked_at := updated_feed.revoked_at;
  return next;
end;
$$;

create or replace function public.get_calendar_feed_events(feed_token_hash text)
returns table (
  feed_id uuid,
  feed_label text,
  event_id uuid,
  event_name text,
  event_status text,
  event_category text,
  start_datetime timestamptz,
  end_datetime timestamptz,
  project_name text
)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  normalized_token_hash text;
  matched_feed public.calendar_feeds%rowtype;
begin
  normalized_token_hash := lower(btrim(coalesce(feed_token_hash, '')));

  if normalized_token_hash !~ '^[0-9a-f]{64}$' then
    return;
  end if;

  select *
  into matched_feed
  from public.calendar_feeds
  where calendar_feeds.token_hash = normalized_token_hash
    and calendar_feeds.revoked_at is null
    and calendar_feeds.scope = 'events'
  limit 1;

  if not found then
    return;
  end if;

  update public.calendar_feeds
  set last_accessed_at = now()
  where calendar_feeds.id = matched_feed.id;

  return query
  select
    matched_feed.id as feed_id,
    matched_feed.label as feed_label,
    events.id as event_id,
    events.name as event_name,
    events.status as event_status,
    events.category as event_category,
    events.start_datetime,
    coalesce(events.end_datetime, events.start_datetime + interval '1 hour') as end_datetime,
    projects.name as project_name
  from (select matched_feed.user_id) feed
  left join public.events
    on events.user_id = feed.user_id
  left join public.projects
    on projects.id = events.project_id
    and projects.user_id = events.user_id
  order by events.start_datetime asc;
end;
$$;

revoke all on function public.create_calendar_feed(text, text) from public;
revoke all on function public.revoke_calendar_feed(uuid) from public;
revoke all on function public.get_calendar_feed_events(text) from public;

grant execute on function public.create_calendar_feed(text, text) to authenticated;
grant execute on function public.revoke_calendar_feed(uuid) to authenticated;
grant execute on function public.get_calendar_feed_events(text) to anon, authenticated;

comment on table public.calendar_feeds is
  'Private revocable calendar subscription feeds. Raw tokens are only returned once and stored as SHA-256 hashes.';
