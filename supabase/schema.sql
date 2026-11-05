-- Tasks

create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid()
              references auth.users (id) on delete cascade,
  title       text not null check (char_length(trim(title)) > 0),
  status      text not null default 'todo'
              check (status in ('todo', 'in_progress', 'in_review', 'done')),
  description text,
  priority    text not null default 'normal'
              check (priority in ('low', 'normal', 'high')),
  due_date    date,
  position    double precision not null default extract(epoch from now()),
  created_at  timestamptz not null default now(),
  unique (id, user_id)
);

create index tasks_user_id_idx on public.tasks (user_id);

alter table public.tasks enable row level security;

create policy "Users manage their own tasks"
  on public.tasks for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.tasks to authenticated;


-- Team members

create table public.team_members (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid()
             references auth.users (id) on delete cascade,
  name       text not null check (char_length(trim(name)) > 0),
  color      text,
  created_at timestamptz not null default now(),
  unique (id, user_id)
);

create index team_members_user_id_idx on public.team_members (user_id);

alter table public.team_members enable row level security;

create policy "Users manage their own team members"
  on public.team_members for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.team_members to authenticated;


-- Task assignees (a task can have several)

create table public.task_assignees (
  task_id   uuid not null,
  member_id uuid not null,
  user_id   uuid not null default auth.uid(),
  primary key (task_id, member_id),
  foreign key (task_id, user_id)
    references public.tasks (id, user_id) on delete cascade,
  foreign key (member_id, user_id)
    references public.team_members (id, user_id) on delete cascade
);

create index task_assignees_member_id_idx on public.task_assignees (member_id);
create index task_assignees_user_id_idx on public.task_assignees (user_id);

alter table public.task_assignees enable row level security;

create policy "Users manage their own task assignees"
  on public.task_assignees for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, delete on public.task_assignees to authenticated;


-- Comments

create table public.comments (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null,
  user_id    uuid not null default auth.uid(),
  body       text not null check (char_length(trim(body)) > 0),
  created_at timestamptz not null default now(),
  foreign key (task_id, user_id)
    references public.tasks (id, user_id) on delete cascade
);

create index comments_task_id_created_at_idx on public.comments (task_id, created_at);

alter table public.comments enable row level security;

create policy "Users manage their own comments"
  on public.comments for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.comments to authenticated;


-- Labels

create table public.labels (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid()
             references auth.users (id) on delete cascade,
  name       text not null check (char_length(trim(name)) > 0),
  color      text,
  created_at timestamptz not null default now(),
  unique (id, user_id),
  unique (user_id, name)
);

alter table public.labels enable row level security;

create policy "Users manage their own labels"
  on public.labels for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.labels to authenticated;


-- Task labels (a task can have several)

create table public.task_labels (
  task_id  uuid not null,
  label_id uuid not null,
  user_id  uuid not null default auth.uid(),
  primary key (task_id, label_id),
  foreign key (task_id, user_id)
    references public.tasks (id, user_id) on delete cascade,
  foreign key (label_id, user_id)
    references public.labels (id, user_id) on delete cascade
);

create index task_labels_label_id_idx on public.task_labels (label_id);
create index task_labels_user_id_idx on public.task_labels (user_id);

alter table public.task_labels enable row level security;

create policy "Users manage their own task labels"
  on public.task_labels for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, delete on public.task_labels to authenticated;


-- Task activity log
--
-- Written only by the triggers below, so clients can read it but not forge it.

create table public.task_activity (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null,
  user_id    uuid not null,
  action     text not null
             check (action in ('created', 'status_changed', 'edited', 'assigned', 'unassigned', 'labeled', 'unlabeled')),
  details    jsonb not null default '{}',
  created_at timestamptz not null default now(),
  foreign key (task_id, user_id)
    references public.tasks (id, user_id) on delete cascade
);

create index task_activity_task_id_created_at_idx on public.task_activity (task_id, created_at);

alter table public.task_activity enable row level security;

create policy "Users read their own task activity"
  on public.task_activity for select
  to authenticated
  using ((select auth.uid()) = user_id);

grant select on public.task_activity to authenticated;

-- details: created {status}; status_changed {from, to}; edited {fields, priority,
-- due_date}, where fields names what changed and priority and due_date hold the values
-- after the edit. Reordering a task within a column changes only position and is not
-- logged.
create function public.log_task_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.task_activity (task_id, user_id, action, details)
    values (new.id, new.user_id, 'created', jsonb_build_object('status', new.status));
    return null;
  end if;

  if new.status is distinct from old.status then
    insert into public.task_activity (task_id, user_id, action, details)
    values (new.id, new.user_id, 'status_changed',
            jsonb_build_object('from', old.status, 'to', new.status));
  end if;

  if (new.title, new.description, new.priority, new.due_date)
     is distinct from (old.title, old.description, old.priority, old.due_date) then
    insert into public.task_activity (task_id, user_id, action, details)
    values (new.id, new.user_id, 'edited', jsonb_build_object(
      'fields', array_remove(array[
        case when new.title is distinct from old.title then 'title' end,
        case when new.description is distinct from old.description then 'description' end,
        case when new.priority is distinct from old.priority then 'priority' end,
        case when new.due_date is distinct from old.due_date then 'due_date' end
      ], null),
      'priority', new.priority,
      'due_date', new.due_date
    ));
  end if;

  return null;
end;
$$;

revoke execute on function public.log_task_changes() from public, anon, authenticated;

create trigger log_task_changes
  after insert or update on public.tasks
  for each row execute function public.log_task_changes();

-- details: {member_id, member_name}. The name is copied so that the timeline stays
-- readable after a member is removed. Rows deleted because their task or member was
-- deleted are skipped: a deleted task can't be referenced, and removing a member
-- isn't a change made to the task.
create function public.log_task_assignee_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  assignment public.task_assignees := case when tg_op = 'INSERT' then new else old end;
  member_name text;
begin
  select name into member_name
  from public.team_members
  where id = assignment.member_id;

  if member_name is null
     or not exists (select 1 from public.tasks where id = assignment.task_id) then
    return null;
  end if;

  insert into public.task_activity (task_id, user_id, action, details)
  values (assignment.task_id, assignment.user_id,
          case when tg_op = 'INSERT' then 'assigned' else 'unassigned' end,
          jsonb_build_object('member_id', assignment.member_id, 'member_name', member_name));

  return null;
end;
$$;

revoke execute on function public.log_task_assignee_changes() from public, anon, authenticated;

create trigger log_task_assignee_changes
  after insert or delete on public.task_assignees
  for each row execute function public.log_task_assignee_changes();

-- details: {label_id, label_name}. Follows the same rules as assignees above.
create function public.log_task_label_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  tagging public.task_labels := case when tg_op = 'INSERT' then new else old end;
  label_name text;
begin
  select name into label_name
  from public.labels
  where id = tagging.label_id;

  if label_name is null
     or not exists (select 1 from public.tasks where id = tagging.task_id) then
    return null;
  end if;

  insert into public.task_activity (task_id, user_id, action, details)
  values (tagging.task_id, tagging.user_id,
          case when tg_op = 'INSERT' then 'labeled' else 'unlabeled' end,
          jsonb_build_object('label_id', tagging.label_id, 'label_name', label_name));

  return null;
end;
$$;

revoke execute on function public.log_task_label_changes() from public, anon, authenticated;

create trigger log_task_label_changes
  after insert or delete on public.task_labels
  for each row execute function public.log_task_label_changes();
