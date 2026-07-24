import { useTaskStore } from "../../../../store/taskStorage";
import { getTaskStatusConfig } from "../../../../utils/taskStatus";

import { DeleteTask } from "../DeleteTaskButton/DeleteTask";

export function TaskList({ courseId }) {
    const tasksByCourse = useTaskStore((state) => state.tasksByCourse);

    const tasks = tasksByCourse?.[courseId] ?? [];
    console.log('[AddTaskSection] mounted with courseId =', courseId, 'tasks =', tasks);


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
                                className={`relative pl-4 pr-4 py-2.5 flex items-center gap-3 border-t first:border-t-0 transition-colors duration-200 group ${isOverdue
                                    ? 'bg-[#ba1a1a] border-[#ba1a1a] text-white'
                                    : 'border-[#c2c6d6] hover:bg-[#f2f3fd]'
                                    }`}
                            >
                                <p className={`absolute left-0 right-0 top-2.5 px-24 text-center text-lg leading-5 font-semibold overflow-hidden text-ellipsis whitespace-nowrap pointer-events-none ${isOverdue ? 'text-white' : 'text-[#191b23]'}`}>
                                    {task.title}
                                </p>
                                <div className="flex-1 min-w-0 pt-5">
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <span className={`flex items-center gap-1 text-[11px] leading-4 tracking-wide font-semibold ${isOverdue ? 'text-white/85' : 'text-[#424754]'
                                            }`}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>
                                                school
                                            </span>
                                            {task.subtitle}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[14px] leading-4 tracking-wide font-semibold ${isOverdue
                                        ? 'bg-white/15 text-white border border-white/30'
                                        : 'bg-[#e1e2ec] text-[#424754]'
                                        }`}>
                                        {isOverdue ? 'Vencida' : dateLabel}
                                    </span>
                                </div>

                                <DeleteTask courseId={courseId} taskId={task.id} isOverdue={isOverdue} />
                            </li>
                        );
                    })
                )}
            </ul>

        </>
    )
}