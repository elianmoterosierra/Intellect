// Single source of truth for the sections rendered in Course.jsx.
// All navigators (SideNav, BottomNav) and the Course page must use these keys
// so that activeSection matches and the corresponding branch is rendered.

export const COURSE_SECTIONS = {
    DASHBOARD: 'dashboard',
    CALENDAR: 'calendar',
    ADD_TASKS: 'Agregar Tareas',
} as const;

export type SectionKey = (typeof COURSE_SECTIONS)[keyof typeof COURSE_SECTIONS];