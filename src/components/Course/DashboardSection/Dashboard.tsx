import { HeaderDashboard } from './Header/HeaderDashboard';
import { Notification } from './Notification/Notification';
import { TaskSummary } from './TaskSummary/TaskSummary';
import { UpcomingTasks } from './UpcomingTasks/UpcomingTasks';
import { useTaskStore } from '../../../store/taskStorage';
import { useAuthStore } from '../../../store/AuthStore';
import { useMemo } from 'react';
import type { Course, Task, TaskWithCompleted } from '../../../types';

const EMPTY_TASKS: Task[] = [];

type DashboardProps = {
    course: Course;
};

export default function Dashboard({ course }: DashboardProps) {
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-min">
                <Notification tasks={tasks} />
                <TaskSummary tasks={tasks} />
                <UpcomingTasks tasks={tasks} courseId={course.id} />
            </div>
        </div>
    );
}
