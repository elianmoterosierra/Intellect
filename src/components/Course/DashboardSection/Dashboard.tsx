import { HeaderDashboard } from './Header/HeaderDashboard';
import { TaskSummary } from './TaskSummary/TaskSummary';
import { UpcomingTasks } from './UpcomingTasks/UpcomingTasks';
import { DashboardCalendar } from './DashboardCalendar/DashboardCalendar';
import { useTaskStore } from '../../../store/taskStorage';
import { useAuthStore } from '../../../store/AuthStore';
import { useMemo } from 'react';
import type { Course, Task, TaskWithCompleted } from '../../../types';

const EMPTY_TASKS: Task[] = [];

type DashboardProps = {
    course: Course;
    canManageTasks: boolean;
};

export default function Dashboard({ course, canManageTasks }: DashboardProps) {
    const sharedTasks = useTaskStore(
        (state) => state.tasksByCourse[course.id] ?? EMPTY_TASKS
    );

    const user = useAuthStore((state) => state.user);

    const tasks = useMemo<TaskWithCompleted[]>(
        () =>
            sharedTasks.map((task) => ({
                ...task,
                completed:
                    user?.taskStatusByCourse?.[course.id]?.[task.id]
                        ?.completed ?? false,
            })),
        [sharedTasks, user, course.id]
    );

    return (
        <div className="p-4 md:p-10">
            <HeaderDashboard />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 auto-rows-min">
                <div className="order-2 flex flex-col gap-4 md:order-1 md:col-span-8">
                    <UpcomingTasks tasks={tasks} courseId={course.id} canManageCourse={canManageTasks} />
                    <DashboardCalendar courseId={course.id} />
                </div>
                <TaskSummary tasks={tasks} />
            </div>
        </div>
    );
}
