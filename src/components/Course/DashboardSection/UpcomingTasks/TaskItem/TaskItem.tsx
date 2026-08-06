import { useAuthStore } from '../../../../../store/AuthStore';
import { getDaysDifference } from '../../../../../utils/taskStatus';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { DetailsModal } from '../../../Common/DetailsModal/DetailsModal';
import { useMediaQuery } from '../../../../../Hooks/useMediaQuery';
import type { TaskWithCompleted } from '../../../../../types';

const badgeStyles = {
    danger: 'bg-red-600 text-white',
    warning: 'bg-yellow-200 text-yellow-900',
    neutral: 'bg-muted-strong text-ink-soft',
    success: 'bg-green-100 text-green-700',
};
function getBadgeClass(dueDate: string): 'danger' | 'warning' | 'neutral' {
    if (!dueDate) return 'neutral';
    const diffHours = (new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60);
    if (diffHours < 24) return 'danger';
    if (diffHours < 48) return 'warning';
    return 'neutral';
}

type TaskItemProps = {
    task: TaskWithCompleted;
    courseId: number;
};

export function TaskItem({ task, courseId }: TaskItemProps) {
    const toggleTaskStatus = useAuthStore((state) => state.toggleTaskStatus);
    const [showDetails, setShowDetails] = useState(false);
    const isMobile = useMediaQuery('(max-width: 767px)');
    const maxTitle = isMobile ? 15 : 20;
    const maxSubtitle = isMobile ? 10 : 30;
    const done = task.completed;
    const daysDiff = getDaysDifference(task.dueDate);
    const isOverdue = !done && daysDiff !== null && daysDiff < 0;

    const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        toggleTaskStatus(courseId, task.id);
    };
    const badgeVariant = done ? 'success' : getBadgeClass(task.dueDate);



    return (
        <>
            <li
                className={`px-6 py-4 flex items-center gap-6 border-t first:border-t-0 transition-colors duration-200 group cursor-pointer ${
                    isOverdue
                        ? 'bg-danger border-danger hover:bg-danger text-white'
                        : 'border-line hover:bg-muted'
                }`}
                onClick={() => setShowDetails(true)}
            >
                {/* Checkbox */}
                <button
                    onClick={handleToggle}
                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 bg-transparent
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
                <div className="flex-1 min-w-0">
                    <p className={`text-base leading-6 font-semibold overflow-hidden text-ellipsis whitespace-nowrap ${done ? 'text-ink-faint line-through' : isOverdue ? 'text-white' : 'text-ink'}`}>{task.title.length > maxTitle ? task.title.slice(0, maxTitle) + '…' : task.title}</p>
                    <div className="flex items-center gap-4 mt-1">
                        <span className={`flex items-center gap-1 text-xs leading-4 tracking-wide font-semibold ${isOverdue ? 'text-white/85' : 'text-ink-soft'}`}>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>school</span>
                            {task.subtitle.length > maxSubtitle ? task.subtitle.slice(0, maxSubtitle) + '…' : task.subtitle}
                        </span>
                    </div>
                </div>

                {/* Badge */}
                <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs leading-4 tracking-wide font-semibold ${
                        isOverdue ? 'bg-white/15 text-white border border-white/30' : badgeStyles[badgeVariant]
                    }`}>
                        {isOverdue ? 'Vencida' : task.hour}
                    </span>
                </div>
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