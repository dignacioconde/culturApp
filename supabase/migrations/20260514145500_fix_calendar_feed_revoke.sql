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

  update public.calendar_feeds as cf
  set revoked_at = coalesce(cf.revoked_at, now())
  where cf.id = feed_id
    and cf.user_id = current_user_id
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

revoke all on function public.revoke_calendar_feed(uuid) from public;
grant execute on function public.revoke_calendar_feed(uuid) to authenticated;

notify pgrst, 'reload schema';
