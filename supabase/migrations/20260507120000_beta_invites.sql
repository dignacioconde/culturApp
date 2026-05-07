create extension if not exists pgcrypto;

create table if not exists public.beta_invites (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  label text,
  max_redemptions integer not null default 1 check (max_redemptions > 0),
  redeemed_count integer not null default 0 check (redeemed_count >= 0),
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint beta_invites_redeemed_count_lte_max check (redeemed_count <= max_redemptions),
  constraint beta_invites_code_hash_sha256 check (code_hash ~ '^[0-9a-f]{64}$')
);

create table if not exists public.beta_invite_redemptions (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references public.beta_invites(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.beta_invites enable row level security;
alter table public.beta_invite_redemptions enable row level security;

alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists onboarding_completed_at timestamptz,
  add column if not exists usage_consent boolean not null default false,
  add column if not exists usage_consent_at timestamptz,
  add column if not exists usage_consent_version text,
  add column if not exists beta_invite_id uuid;

update public.profiles
set
  onboarding_completed = true,
  onboarding_completed_at = coalesce(onboarding_completed_at, created_at, now())
where beta_invite_id is null
  and onboarding_completed = false;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_beta_invite_id_fkey'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_beta_invite_id_fkey
      foreign key (beta_invite_id) references public.beta_invites(id) on delete set null;
  end if;
end;
$$;

create index if not exists beta_invites_available_idx
  on public.beta_invites (expires_at, revoked_at);

create index if not exists beta_invite_redemptions_invite_id_idx
  on public.beta_invite_redemptions (invite_id);

create index if not exists profiles_beta_invite_id_idx
  on public.profiles (beta_invite_id);

create or replace function public.set_beta_invites_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists beta_invites_set_updated_at on public.beta_invites;
create trigger beta_invites_set_updated_at
  before update on public.beta_invites
  for each row execute function public.set_beta_invites_updated_at();

create or replace function public.prevent_beta_invite_profile_changes()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is not null and old.beta_invite_id is distinct from new.beta_invite_id then
    raise exception 'beta_invite_id_is_immutable';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_prevent_beta_invite_changes on public.profiles;
create trigger profiles_prevent_beta_invite_changes
  before update on public.profiles
  for each row execute function public.prevent_beta_invite_profile_changes();

drop trigger if exists on_auth_user_created on auth.users;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  invite_code text;
  invite_hash text;
  claimed_invite_id uuid;
begin
  invite_code := nullif(lower(trim(new.raw_user_meta_data->>'beta_invite_code')), '');

  if invite_code is null then
    raise exception 'beta_invite_code_required'
      using errcode = 'P0001',
            hint = 'Incluye un codigo de invitacion beta valido para crear la cuenta.';
  end if;

  invite_hash := encode(digest(invite_code, 'sha256'), 'hex');

  update public.beta_invites
  set redeemed_count = redeemed_count + 1
  where code_hash = invite_hash
    and revoked_at is null
    and (expires_at is null or expires_at > now())
    and redeemed_count < max_redemptions
  returning id into claimed_invite_id;

  if claimed_invite_id is null then
    raise exception 'beta_invite_code_invalid_or_redeemed'
      using errcode = 'P0001',
            hint = 'El codigo de invitacion beta no existe, ha caducado o ya se ha consumido.';
  end if;

  insert into public.beta_invite_redemptions (invite_id, user_id)
  values (claimed_invite_id, new.id);

  insert into public.profiles (
    id,
    full_name,
    profession,
    beta_invite_id
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'profession',
    claimed_invite_id
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

comment on table public.beta_invites is
  'Private beta invitation codes stored only as normalized SHA-256 hashes. No anon/authenticated SELECT policy by design.';

comment on table public.beta_invite_redemptions is
  'Audit trail for beta invitation consumption. No anon/authenticated SELECT policy by design.';
