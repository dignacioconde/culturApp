alter table public.profiles
  add column if not exists role text not null default 'user';

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_valid'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_valid
      check (role in ('user', 'admin'));
  end if;
end;
$$;

create or replace function public.prevent_beta_invite_profile_changes()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is not null and old.beta_invite_id is distinct from new.beta_invite_id then
    raise exception 'beta_invite_id_is_immutable';
  end if;

  if auth.uid() is not null and old.role is distinct from new.role then
    raise exception 'profile_role_is_immutable';
  end if;

  return new;
end;
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.list_beta_invites()
returns table (
  id uuid,
  label text,
  max_redemptions integer,
  redeemed_count integer,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  redemption_count bigint,
  last_redeemed_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.current_user_is_admin() then
    raise exception 'admin_required'
      using errcode = 'P0001',
            hint = 'Necesitas permisos de administrador.';
  end if;

  return query
  select
    bi.id,
    bi.label,
    bi.max_redemptions,
    bi.redeemed_count,
    bi.expires_at,
    bi.revoked_at,
    bi.created_at,
    bi.updated_at,
    count(bir.id) as redemption_count,
    max(bir.redeemed_at) as last_redeemed_at
  from public.beta_invites bi
  left join public.beta_invite_redemptions bir on bir.invite_id = bi.id
  group by bi.id
  order by bi.created_at desc;
end;
$$;

create or replace function public.create_beta_invite(
  invite_label text default null,
  invite_max_redemptions integer default 1,
  invite_expires_at timestamptz default null
)
returns table (
  id uuid,
  code text,
  label text,
  max_redemptions integer,
  redeemed_count integer,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  generated_code text;
  inserted_invite public.beta_invites%rowtype;
begin
  if not public.current_user_is_admin() then
    raise exception 'admin_required'
      using errcode = 'P0001',
            hint = 'Necesitas permisos de administrador.';
  end if;

  if invite_max_redemptions is null or invite_max_redemptions < 1 or invite_max_redemptions > 100 then
    raise exception 'invalid_invite_max_redemptions'
      using errcode = 'P0001',
            hint = 'max_redemptions debe estar entre 1 y 100.';
  end if;

  generated_code := 'CACHES-BETA-' || upper(encode(gen_random_bytes(6), 'hex'));

  insert into public.beta_invites (code_hash, label, max_redemptions, expires_at)
  values (
    encode(digest(lower(trim(generated_code)), 'sha256'), 'hex'),
    nullif(trim(invite_label), ''),
    invite_max_redemptions,
    invite_expires_at
  )
  returning * into inserted_invite;

  id := inserted_invite.id;
  code := generated_code;
  label := inserted_invite.label;
  max_redemptions := inserted_invite.max_redemptions;
  redeemed_count := inserted_invite.redeemed_count;
  expires_at := inserted_invite.expires_at;
  revoked_at := inserted_invite.revoked_at;
  created_at := inserted_invite.created_at;
  updated_at := inserted_invite.updated_at;

  return next;
end;
$$;

create or replace function public.revoke_beta_invite(target_invite_id uuid)
returns table (
  id uuid,
  label text,
  max_redemptions integer,
  redeemed_count integer,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.current_user_is_admin() then
    raise exception 'admin_required'
      using errcode = 'P0001',
            hint = 'Necesitas permisos de administrador.';
  end if;

  return query
  update public.beta_invites bi
  set revoked_at = coalesce(bi.revoked_at, now())
  where bi.id = target_invite_id
  returning
    bi.id,
    bi.label,
    bi.max_redemptions,
    bi.redeemed_count,
    bi.expires_at,
    bi.revoked_at,
    bi.created_at,
    bi.updated_at;
end;
$$;

revoke all on function public.current_user_is_admin() from public;
revoke all on function public.list_beta_invites() from public;
revoke all on function public.create_beta_invite(text, integer, timestamptz) from public;
revoke all on function public.revoke_beta_invite(uuid) from public;

grant execute on function public.current_user_is_admin() to authenticated;
grant execute on function public.list_beta_invites() to authenticated;
grant execute on function public.create_beta_invite(text, integer, timestamptz) to authenticated;
grant execute on function public.revoke_beta_invite(uuid) to authenticated;
