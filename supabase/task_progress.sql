-- Devuelve el progreso de una tarea únicamente a admins y managers del curso.
-- La función evita exponer task_status o perfiles ajenos directamente al cliente.

create or replace function public.get_task_progress(
    p_course_id bigint,
    p_task_id text
)
returns table (
    user_id uuid,
    name text,
    completed boolean
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
        raise exception 'Not authorized to view task progress'
            using errcode = '42501';
    end if;

    return query
    select
        cm.user_id,
        coalesce(u.name, 'Usuario')::text as name,
        coalesce(
            (
                u.task_status -> p_course_id::text -> p_task_id ->> 'completed'
            )::boolean,
            false
        ) as completed
    from public.course_members cm
    left join public.usuarios u on u.id = cm.user_id
    where cm.course_id = p_course_id
    order by coalesce(u.name, 'Usuario'), cm.user_id;
end;
$$;

revoke execute on function public.get_task_progress(bigint, text) from public, anon;
grant execute on function public.get_task_progress(bigint, text) to authenticated;
