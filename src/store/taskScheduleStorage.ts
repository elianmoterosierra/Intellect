import { create } from 'zustand';
import type { TaskSchedule } from '../utils/taskSchedule';

type SchedulesByCourse = Record<string, Record<string, TaskSchedule>>;

type TaskScheduleStore = {
    schedulesByCourse: SchedulesByCourse;
    setTaskSchedule: (courseId: number | string, taskId: string, schedule: TaskSchedule) => void;
    getTaskSchedule: (courseId: number | string, taskId: string) => TaskSchedule | null;
};

export function toDatabaseTime(time: string): string {
  const [clock, meridiem] = time.split(' ');
  if (!clock) return '00:00:00';
  const [rawHour, minutes] = clock.split(':');

  let hour = Number(rawHour);

  if (meridiem === 'PM' && hour !== 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;

  return `${String(hour).padStart(2, '0')}:${minutes}:00`;
}

export const useTaskScheduleStore = create<TaskScheduleStore>((set, get) => ({
    schedulesByCourse: {},
    setTaskSchedule: (courseId, taskId, schedule) => {
        set((state) => {
            const next = {
                ...state.schedulesByCourse,
                [courseId]: {
                    ...(state.schedulesByCourse[String(courseId)] ?? {}),
                    [taskId]: schedule,
                },
            };
            return { schedulesByCourse: next };
        });
    },
    getTaskSchedule: (courseId, taskId) => get().schedulesByCourse[String(courseId)]?.[taskId] ?? null,
}));
