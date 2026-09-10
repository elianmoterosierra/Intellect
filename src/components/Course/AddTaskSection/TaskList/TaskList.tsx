import { useTaskStore } from "../../../../store/taskStorage";
import { useAuthStore } from "../../../../store/AuthStore";
import { getTaskStatusConfig } from "../../../../utils/taskStatus";
import { useEffect, useState, useMemo } from "react";
import { DeleteTask } from "../DeleteTaskButton/DeleteTask";
import { TaskEdit } from "../TaskEdit/TaskEdit";
import { DetailsModal } from "../../Common/DetailsModal/DetailsModal";
import { TaskProgressPopover } from './TaskProgressPopover';
import { useTaskProgressStore } from '../../../../store/taskProgressStorage';
import { canManageCourse } from '../../../../utils/permission';
import type { TaskWithCompleted } from "../../../../types";

type TaskListProps = {
    courseId: number;
    sortMode?: TaskSortMode;
};

export type TaskSortMode = 'asc' | 'desc' | 'recent';

export function TaskList({ courseId, sortMode = 'recent' }: TaskListProps) {
    const tasksByCourse = useTaskStore((state) => state.tasksByCourse);
    const user = useAuthStore((state) => state.user);
    const fetchTaskProgress = useTaskProgressStore((state) => state.fetchTaskProgress);
    const [selectedTask, setSelectedTask] = useState<TaskWithCompleted | null>(null);
    const [editingTask, setEditingTask] = useState<TaskWithCompleted | null>(null);
    const canViewProgress = canManageCourse(user, courseId);

    const tasks = useMemo<TaskWithCompleted[]>(() => {
        const rawTasks = tasksByCourse?.[courseId] ?? [];
        return rawTasks.map((task) => ({
            ...task,
            completed:
                user?.taskStatusByCourse?.[courseId]?.[task.id]
                    ?.completed ?? false,
        }));
    }, [tasksByCourse, courseId, user]);

    const orderedTasks = useMemo(() => {
        const sorted = [...tasks];
        if (sortMode === 'asc' || sortMode === 'desc') {
            sorted.sort((a, b) => {
                const result = a.title.localeCompare(b.title, 'es', { sensitivity: 'base' });
                return sortMode === 'asc' ? result : -result;
            });
        } else {
            sorted.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        }
        return sorted;
    }, [sortMode, tasks]);

    useEffect(() => {
        if (!canViewProgress) return;
        void Promise.all(orderedTasks.map((task) => fetchTaskProgress(courseId, task.id)));
    }, [canViewProgress, courseId, fetchTaskProgress, orderedTasks]);


    return (
        <>
            <ul className="list-none p-0 m-0">
                {tasks.length === 0 ? (
                    <li className="px-4 py-6 text-center text-sm text-ink-soft">
                        Todavía no hay tareas en este curso.
                    </li>
                ) : (
                    orderedTasks.map((task) => {
                        const status = getTaskStatusConfig(task.dueDate);
                        const isOverdue = status.status === 'overdue';

                        return (
                            <li
                                key={task.id}
                                className={`grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-t px-4 py-4 transition-colors duration-200 group cursor-pointer first:border-t-0 sm:px-6 ${isOverdue
                                    ? 'bg-danger border-danger text-white hover:bg-danger'
                                    : 'border-line hover:bg-muted'
                                    }`}
                                onClick={() => setSelectedTask(task)}
                            >
                                <p className={`min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-left text-sm font-semibold ${isOverdue ? 'text-white' : 'text-ink'}`}>
                                    {task.title}
                                </p>

                                {canViewProgress ? (
                                    <div className="flex items-center gap-1.5" onClick={(event) => event.stopPropagation()}>
                                        <TaskProgressPopover courseId={courseId} taskId={task.id} kind="completed" />
                                        <TaskProgressPopover courseId={courseId} taskId={task.id} kind="pending" />
                                    </div>
                                ) : <span />}

                                <div className="flex items-center gap-1.5" onClick={(event) => event.stopPropagation()}>
                                    <button
                                        type="button"
                                        onClick={() => setEditingTask(task)}
                                        className={`material-symbols-outlined flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isOverdue ? 'text-white hover:bg-white/15' : 'text-ink-soft hover:bg-brand-tint hover:text-brand'}`}
                                        aria-label={`Editar ${task.title}`}
                                        title="Editar tarea"
                                    >
                                        edit
                                    </button>
                                    <DeleteTask courseId={courseId} taskId={task.id} isOverdue={isOverdue} />
                                </div>
                            </li>
                        );
                    })
                )}
            </ul>

            {selectedTask && (
                <DetailsModal
                    task={selectedTask}
                    courseId={courseId}
                    onClose={() => setSelectedTask(null)}
                />
            )}
            {editingTask && (
                <TaskEdit
                    task={editingTask}
                    courseId={courseId}
                    onClose={() => setEditingTask(null)}
                />
            )}
        </>
    )
}
