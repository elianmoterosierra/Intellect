import { TaskItem } from './TaskItem/TaskItem';
import { AddTaskButton } from './AddTask/AddTaskButton';
import { useMemo } from 'react';
import { getDaysDifference } from '../../../../utils/taskStatus';
import type { TaskWithCompleted } from '../../../../types';
import { PendingTasksModal } from '../PendingTasksModal/PendingTasksModal';
import { RemainingTasks } from './RemainingTasks/RemainingTasks';
import { useState } from 'react';


type UpcomingTasksProps = {
    tasks: TaskWithCompleted[];
    courseId: number;
    canManageCourse: boolean;
};

export function UpcomingTasks({ tasks, courseId, canManageCourse }: UpcomingTasksProps) {
    const canManageCourseBool = canManageCourse;
    const [showAllTasks, setShowAllTasks] = useState(false);
    const pendingTasks = useMemo(() => {
        const byDueDate = (a: TaskWithCompleted, b: TaskWithCompleted) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

        return tasks
            .filter((task) => {
                if (task.completed) return false;
                const diff = getDaysDifference(task.dueDate);
                return diff !== null && diff >= 0;
            })
            .sort(byDueDate);
    }, [tasks]);
    const visibleTasks = pendingTasks.slice(0, 4);
    const remainingTasks = pendingTasks.length - visibleTasks.length;

    return (
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-line flex justify-between items-center bg-muted/50">
                <h3 className="text-2xl leading-8 font-semibold tracking-tight text-ink">Próximas Tareas</h3>
                <button
                    type="button"
                    onClick={() => setShowAllTasks(true)}
                    className="flex items-center gap-2 border-none bg-transparent text-xs font-semibold leading-4 tracking-widest text-brand cursor-pointer hover:text-brand-hover hover:underline"
                >
                    Ver todas las tareas pendientes
                    <RemainingTasks count={remainingTasks} />
                </button>
            </div>

            {/* Task list */}
            <ul className="list-none p-0 m-0">
                {visibleTasks.length === 0 ? (
                    <li className="px-6 py-8 text-center text-ink-soft">
                        Todavía no tienes tareas.
                    </li>
                ) : (
                    visibleTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            courseId={courseId}
                            canManageCourse={canManageCourseBool}
                        />
                    ))
                )}
            </ul>


            {/* Add button */}
            <div className="flex justify-center my-4">
                {canManageCourseBool && <AddTaskButton courseId={courseId} />}
            </div>

            {showAllTasks && (
                <PendingTasksModal
                    tasks={tasks}
                    courseId={courseId}
                    canManageCourse={canManageCourseBool}
                    onClose={() => setShowAllTasks(false)}
                />
            )}
        </div>
    )
}
