create table if not exists public.beta_invite_email_deliveries (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid references public.beta_invites(id) on delete set null,
  recipient_email text not null,
  recipient_name text,
  provider text not null default 'brevo',
  provider_message_id text,
  status text not null,
  error_code text,
  error_message text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint beta_invite_email_deliveries_status_valid
    check (status in ('sent', 'failed')),
  constraint beta_invite_email_deliveries_provider_valid
    check (provider in ('brevo'))
);

alter table public.beta_invite_email_deliveries enable row level security;

create index if not exists beta_invite_email_deliveries_invite_id_idx
  on public.beta_invite_email_deliveries (invite_id);

create index if not exists beta_invite_email_deliveries_created_by_idx
  on public.beta_invite_email_deliveries (created_by);

create index if not exists beta_invite_email_deliveries_created_at_idx
  on public.beta_invite_email_deliveries (created_at desc);

create or replace function public.log_beta_invite_email_delivery(
  delivery_invite_id uuid,
  delivery_recipient_email text,
  delivery_recipient_name text default null,
  delivery_provider text default 'brevo',
  delivery_provider_message_id text default null,
  delivery_status text default 'sent',
  delivery_error_code text default null,
  delivery_error_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_delivery_id uuid;
begin
  if not public.current_user_is_admin() then
    raise exception 'admin_required'
      using errcode = 'P0001',
            hint = 'Necesitas permisos de administrador.';
  end if;

  if delivery_provider is distinct from 'brevo' then
    raise exception 'invalid_email_provider'
      using errcode = 'P0001',
            hint = 'Proveedor de email no permitido.';
  end if;

  if delivery_status not in ('sent', 'failed') then
    raise exception 'invalid_email_delivery_status'
      using errcode = 'P0001',
            hint = 'Estado de entrega no permitido.';
  end if;

  insert into public.beta_invite_email_deliveries (
    invite_id,
    recipient_email,
    recipient_name,
    provider,
    provider_message_id,
    status,
    error_code,
    error_message,
    created_by
  )
  values (
    delivery_invite_id,
    lower(trim(delivery_recipient_email)),
    nullif(trim(delivery_recipient_name), ''),
    delivery_provider,
    nullif(trim(delivery_provider_message_id), ''),
    delivery_status,
    nullif(trim(delivery_error_code), ''),
    nullif(trim(delivery_error_message), ''),
    auth.uid()
  )
  returning id into inserted_delivery_id;

  return inserted_delivery_id;
end;
$$;

revoke all on function public.log_beta_invite_email_delivery(uuid, text, text, text, text, text, text, text) from public;
grant execute on function public.log_beta_invite_email_delivery(uuid, text, text, text, text, text, text, text) to authenticated;

comment on table public.beta_invite_email_deliveries is
  'Internal audit of beta invitation transactional email delivery attempts. RLS is enabled and no public read policy is defined.';

notify pgrst, 'reload schema';
