import { useTaskStore } from "../../../../store/taskStorage";
import { useAuthStore } from "../../../../store/AuthStore";
import { getTaskStatusConfig } from "../../../../utils/taskStatus";
import { useState, useMemo } from "react";
import { DeleteTask } from "../DeleteTaskButton/DeleteTask";
import { DetailsModal } from "../../Common/DetailsModal/DetailsModal";
import { useMediaQuery } from "../../../../Hooks/useMediaQuery";
import type { TaskWithCompleted } from "../../../../types";

type TaskListProps = {
    courseId: number;
};

export function TaskList({ courseId }: TaskListProps) {
    const tasksByCourse = useTaskStore((state) => state.tasksByCourse);
    const user = useAuthStore((state) => state.user);
    const [selectedTask, setSelectedTask] = useState<TaskWithCompleted | null>(null);
    const isMobile = useMediaQuery('(max-width: 767px)');
    const maxTitle = isMobile ? 5 : 20;
    const maxSubtitle = isMobile ? 10 : 30;

    const tasks = useMemo<TaskWithCompleted[]>(() => {
        const rawTasks = tasksByCourse?.[courseId] ?? [];
        return rawTasks.map((task) => ({
            ...task,
            completed:
                user?.taskStatusByCourse?.[courseId]?.[task.id]
                    ?.completed ?? false,
        }));
    }, [tasksByCourse, courseId, user]);


    return (
        <>
            <ul className="list-none p-0 m-0">
                {tasks.length === 0 ? (
                    <li className="px-4 py-6 text-center text-sm text-[#424754]">
                        Todavía no hay tareas en este curso.
                    </li>
                ) : (
                    tasks.map((task) => {
                        const status = getTaskStatusConfig(task.dueDate);
                        const isOverdue = status.status === 'overdue';
                        const dateLabel = task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                            })
                            : '—';

                        return (
                            <li
                                key={task.id}
                                className={`relative pl-4 pr-4 py-2.5 flex items-center gap-3 border-t first:border-t-0 transition-colors duration-200 group cursor-pointer ${isOverdue
                                    ? 'bg-[#ba1a1a] border-[#ba1a1a] text-white hover:bg-[#991313]'
                                    : 'border-[#c2c6d6] hover:bg-[#f2f3fd]'
                                    }`}
                                onClick={() => setSelectedTask(task)}
                            >
                                <p className={`absolute left-0 right-0 top-2.5 px-24 text-center text-lg leading-5 font-semibold overflow-hidden text-ellipsis whitespace-nowrap pointer-events-none ${isOverdue ? 'text-white' : 'text-[#191b23]'}`}>
                                    {task.title.length > maxTitle ? task.title.slice(0, maxTitle) + '…' : task.title}
                                </p>
                                <div className="flex-1 min-w-0 pt-5">
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <span className={`flex items-center gap-1 text-[11px] leading-4 tracking-wide font-semibold ${isOverdue ? 'text-white/85' : 'text-[#424754]'
                                            }`}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>
                                                school
                                            </span>
                                            {task.subtitle.length > maxSubtitle ? task.subtitle.slice(0, maxSubtitle) + '…' : task.subtitle}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <span className={`inline-flex items-center rounded-full leading-4 tracking-wide font-semibold ${isMobile
                                        ? 'px-1.5 py-0.5 text-[11px]'
                                        : 'px-2 py-0.5 text-[14px]'
                                        } ${isOverdue
                                        ? 'bg-white/15 text-white border border-white/30'
                                        : 'bg-[#e1e2ec] text-[#424754]'
                                        }`}>
                                        {isOverdue ? 'Vencida' : dateLabel}
                                    </span>
                                </div>

                                <div onClick={(e) => e.stopPropagation()}>
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
        </>
    )
}
