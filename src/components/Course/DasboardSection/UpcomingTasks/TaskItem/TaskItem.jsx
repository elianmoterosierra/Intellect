
import { useAuthStore } from '../../../../../store/AuthStore';
import { getDaysDifference } from '../../../../../utils/taskStatus';

const badgeStyles = {
    danger: 'bg-red-600 text-white',
    warning: 'bg-yellow-200 text-yellow-900',
    neutral: 'bg-[#e1e2ec] text-[#424754]',
    success: 'bg-green-100 text-green-700',
};
function getBadgeClass(dueDate) {
    if (!dueDate) return 'neutral';
    const diffHours = (new Date(dueDate) - new Date()) / (1000 * 60 * 60);
    if (diffHours < 24) return 'danger';
    if (diffHours < 48) return 'warning';
    return 'neutral';
}


export function TaskItem({ task, courseId }) {
    const toggleTaskStatus = useAuthStore((state) => state.toggleTaskStatus);
    const done = task.completed;
    const isOverdue = !done && getDaysDifference(task.dueDate) < 0;

    const handleToggle = () => {
        toggleTaskStatus(courseId, task.id);
    };
    const badgeVariant = done ? 'success' : getBadgeClass(task.dueDate);



    return (
        <li className={`px-6 py-4 flex items-center gap-6 border-t first:border-t-0 transition-colors duration-200 group ${
            isOverdue
                ? 'bg-[#ba1a1a] border-[#ba1a1a] hover:bg-[#991313] text-white'
                : 'border-[#c2c6d6] hover:bg-[#f2f3fd]'
        }`}>
            {/* Checkbox */}
            <button
                onClick={handleToggle}
                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 bg-transparent
                    ${done
                        ? 'border-green-600 bg-green-600'
                        : isOverdue
                            ? 'border-white bg-white/10'
                            : 'border-[#c2c6d6] group-hover:border-[#0058be]'
                    }`}
            >
                <span className={`material-symbols-outlined flex items-center justify-center text-m transition-colors duration-200 ${done ? 'text-green-600' : isOverdue ? 'text-white' : 'text-transparent group-hover:text-[#0058be]'}`}>
                    check
                </span>
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className={`text-base leading-6 font-semibold overflow-hidden text-ellipsis whitespace-nowrap ${done ? 'text-[#9496a8] line-through' : isOverdue ? 'text-white' : 'text-[#191b23]'}`}>{task.title}</p>
                <div className="flex items-center gap-4 mt-1">
                    <span className={`flex items-center gap-1 text-xs leading-4 tracking-wide font-semibold ${isOverdue ? 'text-white/85' : 'text-[#424754]'}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>school</span>
                        {task.subtitle}
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
    )
}
