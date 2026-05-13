create table public.contractors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  billing_name text,
  tax_id text,
  email text,
  phone text,
  billing_address text,
  notes text,
  created_at timestamptz default now(),
  constraint contractors_name_not_blank check (btrim(name) <> '')
);

alter table public.projects
  add column contractor_id uuid references public.contractors(id) on delete set null;

alter table public.events
  add column contractor_id uuid references public.contractors(id) on delete set null;

alter table public.contractors
  add constraint contractors_id_user_id_key unique (id, user_id);

alter table public.projects
  add constraint projects_contractor_user_fkey
  foreign key (contractor_id, user_id)
  references public.contractors(id, user_id)
  on delete set null (contractor_id);

alter table public.events
  add constraint events_contractor_user_fkey
  foreign key (contractor_id, user_id)
  references public.contractors(id, user_id)
  on delete set null (contractor_id);

create unique index contractors_user_normalized_name_key
  on public.contractors (
    user_id,
    lower(regexp_replace(btrim(name), '\s+', ' ', 'g'))
  );

create index projects_contractor_id_idx on public.projects(contractor_id);
create index events_contractor_id_idx on public.events(contractor_id);

alter table public.contractors enable row level security;

create policy "contractors: usuario propio" on public.contractors
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

with source_contractors as (
  select
    user_id,
    min(name) as name,
    lower(regexp_replace(btrim(name), '\s+', ' ', 'g')) as normalized_name
  from (
    select user_id, nullif(btrim(client), '') as name
    from public.projects
    where client is not null and btrim(client) <> ''
    union all
    select user_id, nullif(btrim(client), '') as name
    from public.events
    where client is not null and btrim(client) <> ''
  ) source
  where name is not null
  group by user_id, lower(regexp_replace(btrim(name), '\s+', ' ', 'g'))
)
insert into public.contractors (user_id, name)
select user_id, name
from source_contractors
on conflict do nothing;

update public.projects project
set contractor_id = contractor.id
from public.contractors contractor
where project.contractor_id is null
  and project.client is not null
  and btrim(project.client) <> ''
  and project.user_id = contractor.user_id
  and lower(regexp_replace(btrim(project.client), '\s+', ' ', 'g')) =
    lower(regexp_replace(btrim(contractor.name), '\s+', ' ', 'g'));

update public.events event
set contractor_id = project.contractor_id
from public.projects project
where event.contractor_id is null
  and event.project_id = project.id
  and event.user_id = project.user_id
  and project.contractor_id is not null;

update public.events event
set contractor_id = contractor.id
from public.contractors contractor
where event.contractor_id is null
  and event.client is not null
  and btrim(event.client) <> ''
  and event.user_id = contractor.user_id
  and lower(regexp_replace(btrim(event.client), '\s+', ' ', 'g')) =
    lower(regexp_replace(btrim(contractor.name), '\s+', ' ', 'g'));

comment on table public.contractors is
  'Reusable structured contractors for beta 19. Legacy projects.client and events.client remain as fallback text.';
