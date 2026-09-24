import { useAuthStore } from '../../../../../store/AuthStore';
import { getTaskStatusConfig } from '../../../../../utils/taskStatus';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { DetailsModal } from '../../../Common/DetailsModal/DetailsModal';
import { useMediaQuery } from '../../../../../Hooks/useMediaQuery';
import { DeleteTask } from '../../../AddTaskSection/DeleteTaskButton/DeleteTask';
import type { TaskWithCompleted } from '../../../../../types';
import type { TaskStatusConfig } from '../../../../../types';

const badgeStyles = {
    danger: 'bg-red-600 text-white',
    warning: 'bg-yellow-200 text-yellow-900',
    neutral: 'bg-muted-strong text-ink-soft',
    success: 'bg-green-100 text-green-700',
};

function getBadgeVariant(statusCfg: TaskStatusConfig): 'danger' | 'warning' | 'neutral' {
    if (statusCfg.status === 'overdue' || statusCfg.diff === 0) return 'danger';
    if (statusCfg.status === 'tomorrow') return 'warning';
    return 'neutral';
}

type TaskItemProps = {
    task: TaskWithCompleted;
    courseId: number;
    canManageCourse: boolean;
    compact?: boolean;
};

export function TaskItem({ task, courseId, canManageCourse, compact = false }: TaskItemProps) {
    const toggleTaskStatus = useAuthStore((state) => state.toggleTaskStatus);
    const [showDetails, setShowDetails] = useState(false);
    const isMobile = useMediaQuery('(max-width: 767px)');
    const maxTitle = isMobile ? 15 : 30;
    const done = task.completed;
    const statusCfg = getTaskStatusConfig(task.dueDate);
    const isOverdue = !done && statusCfg.status === 'overdue';

    const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        toggleTaskStatus(courseId, task.id);
    };
    const badgeVariant = done ? 'success' : getBadgeVariant(statusCfg);



    return (
        <>
            <li
                className={`${compact ? 'mx-4 my-2 rounded-lg border border-line-soft px-3 py-3' : 'px-6 py-4 border-t first:border-t-0'} flex items-center ${compact ? 'gap-3' : 'gap-6'} transition-colors duration-200 group cursor-pointer ${
                    isOverdue
                        ? 'bg-danger border-danger hover:bg-danger text-white'
                        : 'bg-muted/45 border-line hover:bg-muted'
                }`}
                onClick={() => setShowDetails(true)}
            >
                {/* Checkbox */}
                <button
                    onClick={handleToggle}
                    className={`flex-shrink-0 ${compact ? 'h-7 w-7' : 'h-8 w-8'} rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 bg-transparent
                        ${done
                            ? 'border-green-600 bg-green-600'
                            : isOverdue
                                ? 'border-white bg-white/10'
                                : 'border-line group-hover:border-brand'
                        }`}
                >
                    <span className={`material-symbols-outlined flex items-center justify-center text-m transition-colors duration-200 ${done ? 'text-green-600' : isOverdue ? 'text-white' : 'text-transparent group-hover:text-brand'}`}>
                        check
                    </span>
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0 text-left">
                    <p className={`${compact ? 'text-xs md:text-base' : 'text-base'} leading-6 font-semibold overflow-hidden text-ellipsis whitespace-nowrap ${done ? 'text-ink-faint line-through' : isOverdue ? 'text-white' : 'text-ink'}`}>{task.title.length > maxTitle ? task.title.slice(0, maxTitle) + '…' : task.title}</p>
                </div>

                {/* Badge */}
                <div className="flex-shrink-0">
                    <span className={`inline-flex items-center rounded-full leading-4 tracking-wide font-semibold ${compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-0.5 text-xs'} ${
                        isOverdue ? 'bg-white/15 text-white border border-white/30' : badgeStyles[badgeVariant]
                    }`}>
                        {isOverdue ? 'Vencida' : task.hour}
                    </span>
                </div>

                {canManageCourse && (
                    <DeleteTask courseId={courseId} taskId={task.id} isOverdue={isOverdue} compact={compact} />
                )}
            </li>

            {showDetails && (
                <DetailsModal
                    task={task}
                    courseId={courseId}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </>
    )
}
