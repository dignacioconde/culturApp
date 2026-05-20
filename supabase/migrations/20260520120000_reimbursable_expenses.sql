alter table public.incomes enable row level security;
alter table public.expenses enable row level security;

drop policy if exists "incomes: usuario propio" on public.incomes;
create policy "incomes: usuario propio" on public.incomes
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "expenses: usuario propio" on public.expenses;
create policy "expenses: usuario propio" on public.expenses
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.expenses
  add column if not exists expense_kind text not null default 'internal',
  add column if not exists reimbursed_by_income_id uuid references public.incomes(id) on delete set null;

alter table public.expenses
  drop constraint if exists expenses_expense_kind_check,
  add constraint expenses_expense_kind_check
    check (expense_kind in ('internal', 'reimbursable'));

alter table public.expenses
  drop constraint if exists expenses_reimbursement_link_check,
  add constraint expenses_reimbursement_link_check
    check (expense_kind = 'reimbursable' or reimbursed_by_income_id is null);

create index if not exists expenses_reimbursed_by_income_id_idx
  on public.expenses(reimbursed_by_income_id)
  where reimbursed_by_income_id is not null;

create index if not exists expenses_user_kind_idx
  on public.expenses(user_id, expense_kind);

create or replace function public.validate_expense_reimbursement_link()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  linked_income record;
begin
  if new.reimbursed_by_income_id is null then
    return new;
  end if;

  if new.expense_kind <> 'reimbursable' then
    raise exception 'A reimbursed income can only be linked from a reimbursable expense.';
  end if;

  select user_id, project_id, event_id
    into linked_income
    from public.incomes
    where id = new.reimbursed_by_income_id;

  if not found then
    raise exception 'Linked income does not exist or is not visible for this user.';
  end if;

  if linked_income.user_id is distinct from new.user_id then
    raise exception 'Expense and linked income must belong to the same user.';
  end if;

  if linked_income.project_id is distinct from new.project_id
    or linked_income.event_id is distinct from new.event_id then
    raise exception 'Expense and linked income must belong to the same project/event scope.';
  end if;

  return new;
end;
$$;

drop trigger if exists expenses_validate_reimbursement_link on public.expenses;
create trigger expenses_validate_reimbursement_link
  before insert or update of user_id, project_id, event_id, expense_kind, reimbursed_by_income_id
  on public.expenses
  for each row
  execute function public.validate_expense_reimbursement_link();
