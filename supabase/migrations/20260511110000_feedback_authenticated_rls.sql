drop policy if exists feedback_insert_with_consent on public.feedback;
drop policy if exists feedback_insert_authenticated_own_user on public.feedback;

create policy feedback_insert_authenticated_own_user on public.feedback
  for insert to authenticated
  with check (
    consent_given = true
    and user_id = auth.uid()
  );

comment on table public.feedback is
  'Beta feedback captured from authenticated users with explicit consent. No anon/authenticated SELECT policy by design.';
