import { getTaskStatusConfig } from "../../../../../../../utils/taskStatus";

import type { TaskWithCompleted } from "../../../../../../../types";

type TaskListProps = {
    tasks: TaskWithCompleted[];
    handleToggle: (taskId: string) => void;
    dayDate: Date;
    onTaskClick: (task: TaskWithCompleted) => void;
};

export function TaskList({ tasks, handleToggle, dayDate, onTaskClick }: TaskListProps) {

    return (
        <div className="flex flex-col gap-3">
            {tasks.length === 0 && (
                <p className="text-sm text-[#9496a8] text-center py-2">
                    Sin tareas para este día
                </p>
            )}
            {tasks.map((task) => {
                const cfg = getTaskStatusConfig(dayDate);

                return (
                    <div
                        key={task.id}
                        className={`flex items-start justify-between gap-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${cfg.bgColor} ${cfg.borderColor}`}
                        onClick={() => onTaskClick(task)}
                    >
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center gap-1.5">
                                {cfg.icon && (
                                    <span className={`material-symbols-outlined text-base leading-none shrink-0 ${cfg.status === 'overdue' ? 'text-white' : 'text-amber-600'}`}>{cfg.icon}</span>
                                )}
                                <span className={`text-sm font-medium truncate ${cfg.textColor} ${task.completed ? 'line-through opacity-50' : ''}`}>
                                    {task.title}
                                </span>
                            </div>
                            {cfg.badgeText && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full w-fit mt-0.5 ${cfg.pillBg}`}>
                                    {cfg.badgeText}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggle(task.id);
                            }}
                            className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                                task.completed
                                    ? 'bg-gray-200 text-gray-500 line-through cursor-default'
                                    : 'bg-[#0058be] text-white hover:bg-[#0041a8]'
                            }`}
                        >
                            {task.completed ? 'Hecho ✓' : 'Completar'}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}