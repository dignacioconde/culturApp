create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  source text not null check (source in ('widget', 'email', 'telegram', 'other')),
  severity text check (severity in ('low', 'medium', 'high')),
  area text,
  message text not null check (char_length(message) between 1 and 4000),
  user_agent text,
  consent_given boolean not null default false
);

alter table public.feedback enable row level security;

drop policy if exists feedback_insert_with_consent on public.feedback;
create policy feedback_insert_with_consent on public.feedback
  for insert to anon, authenticated
  with check (consent_given = true);

comment on table public.feedback is
  'Beta feedback captured with explicit consent. No anon/authenticated SELECT policy by design.';
