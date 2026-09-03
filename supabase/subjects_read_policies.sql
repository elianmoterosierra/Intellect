-- Permite que cualquier miembro autenticado del curso vea sus materias
-- y horarios. La creación, edición y eliminación continúan dependiendo de
-- las políticas de escritura existentes para admin/manager.

alter table public.subjects enable row level security;
alter table public.subject_schedules enable row level security;
alter table public.course_members enable row level security;

-- Al seleccionar un curso, el cliente registra la membresía como estudiante.
-- No permite asignarse como manager ni modificar membresías existentes.
drop policy if exists course_members_insert_self_student on public.course_members;
create policy course_members_insert_self_student
on public.course_members
for insert
to authenticated
with check (
    user_id = (select auth.uid())
    and role = 'student'
);

drop policy if exists subjects_select_course_members on public.subjects;
create policy subjects_select_course_members
on public.subjects
for select
to authenticated
using (
    exists (
        select 1
        from public.usuarios u
        where u.id = (select auth.uid())
          and u.is_admin = true
    )
    or exists (
        select 1
        from public.course_members cm
        where cm.user_id = (select auth.uid())
          and cm.course_id = subjects.course_id
    )
);

drop policy if exists subjects_insert_manager_or_admin on public.subjects;
create policy subjects_insert_manager_or_admin
on public.subjects
for insert
to authenticated
with check (
    exists (
        select 1
        from public.usuarios u
        where u.id = (select auth.uid())
          and u.is_admin = true
    )
    or exists (
        select 1
        from public.course_members cm
        where cm.user_id = (select auth.uid())
          and cm.course_id = subjects.course_id
          and cm.role = 'manager'
    )
);

drop policy if exists subjects_delete_manager_or_admin on public.subjects;
create policy subjects_delete_manager_or_admin
on public.subjects
for delete
to authenticated
using (
    exists (
        select 1
        from public.usuarios u
        where u.id = (select auth.uid())
          and u.is_admin = true
    )
    or exists (
        select 1
        from public.course_members cm
        where cm.user_id = (select auth.uid())
          and cm.course_id = subjects.course_id
          and cm.role = 'manager'
    )
);

drop policy if exists subject_schedules_select_course_members on public.subject_schedules;
create policy subject_schedules_select_course_members
on public.subject_schedules
for select
to authenticated
using (
    exists (
        select 1
        from public.subjects s
        where s.id = subject_schedules.subject_id
    )
);

drop policy if exists subject_schedules_insert_manager_or_admin on public.subject_schedules;
create policy subject_schedules_insert_manager_or_admin
on public.subject_schedules
for insert
to authenticated
with check (
    exists (
        select 1
        from public.subjects s
        where s.id = subject_schedules.subject_id
          and (
              exists (
                  select 1
                  from public.usuarios u
                  where u.id = (select auth.uid())
                    and u.is_admin = true
              )
              or exists (
                  select 1
                  from public.course_members cm
                  where cm.user_id = (select auth.uid())
                    and cm.course_id = s.course_id
                    and cm.role = 'manager'
              )
          )
    )
);

drop policy if exists subject_schedules_delete_manager_or_admin on public.subject_schedules;
create policy subject_schedules_delete_manager_or_admin
on public.subject_schedules
for delete
to authenticated
using (
    exists (
        select 1
        from public.subjects s
        where s.id = subject_schedules.subject_id
          and (
              exists (
                  select 1
                  from public.usuarios u
                  where u.id = (select auth.uid())
                    and u.is_admin = true
              )
              or exists (
                  select 1
                  from public.course_members cm
                  where cm.user_id = (select auth.uid())
                    and cm.course_id = s.course_id
                    and cm.role = 'manager'
              )
          )
    )
);
