create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth, extensions
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
set search_path = public, extensions
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

grant execute on function public.create_beta_invite(text, integer, timestamptz) to authenticated;

notify pgrst, 'reload schema';
