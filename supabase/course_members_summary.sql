-- Agrega una fecha para ordenar las membresías por incorporación al curso.
alter table public.course_members
    add column if not exists created_at timestamptz not null default now();

create index if not exists course_members_course_created_idx
    on public.course_members (course_id, created_at desc);

-- Devuelve el resumen académico de los miembros de un curso únicamente a
-- admins universales y managers del curso solicitado.
create or replace function public.get_course_members_summary(
    p_course_id bigint
)
returns table (
    user_id uuid,
    name text,
    email text,
    completed_tasks bigint,
    overdue_tasks bigint,
    joined_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
    if not exists (
        select 1
        from public.usuarios u
        where u.id = (select auth.uid())
          and (
              u.is_admin = true
              or exists (
                  select 1
                  from public.course_members cm
                  where cm.user_id = (select auth.uid())
                    and cm.course_id = p_course_id
                    and cm.role = 'manager'
              )
          )
    ) then
        raise exception 'Not authorized to view course members'
            using errcode = '42501';
    end if;

    return query
    select
        cm.user_id,
        coalesce(u.name, 'Usuario')::text as name,
        coalesce(u.gmail, '')::text as email,
        count(*) filter (
            where coalesce(
                (
                    u.task_status
                        -> p_course_id::text
                        -> t.id::text
                        ->> 'completed'
                )::boolean,
                false
            )
        )::bigint as completed_tasks,
        count(*) filter (
            where t.due_date is not null
              and t.due_date < now()
              and not coalesce(
                  (
                      u.task_status
                          -> p_course_id::text
                          -> t.id::text
                          ->> 'completed'
                  )::boolean,
                  false
              )
        )::bigint as overdue_tasks,
        cm.created_at as joined_at
    from public.course_members cm
    left join public.usuarios u on u.id = cm.user_id
    left join public.tasks t on t.course_id = p_course_id
    where cm.course_id = p_course_id
    group by cm.user_id, u.name, u.gmail, cm.created_at
    order by cm.created_at desc, coalesce(u.name, 'Usuario'), cm.user_id;
end;
$$;

revoke execute on function public.get_course_members_summary(bigint) from public, anon;
grant execute on function public.get_course_members_summary(bigint) to authenticated;
