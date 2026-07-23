import { useState } from 'react';
const badgeStyles = {
    danger: 'bg-red-600 text-white',
    warning: 'bg-yellow-200 text-yellow-900',
    neutral: 'bg-[#e1e2ec] text-[#424754]',
    success: 'bg-green-100 text-green-700',
};
function getBadgeClass(dueDate) {
    if (!dueDate) return 'neutral';
    const diffHours = (dueDate - new Date()) / (1000 * 60 * 60);
    if (diffHours < 24) return 'danger';
    if (diffHours < 48) return 'warning';
    return 'neutral';
}

function getStorageKey(courseId, taskId) {
    return `completed-${courseId}-${taskId}`;
}

export function TaskItem({ title, subtitle, hour, dueDate, taskId, courseId }) {
    const [done, setDone] = useState(() => {
        try {
            return localStorage.getItem(getStorageKey(courseId, taskId)) === 'true';
        } catch {
            return false;
        }
    });

    const badgeVariant = done ? 'success' : getBadgeClass(dueDate);

    const handleToggle = () => {
        const next = !done;
        setDone(next);
        try {
            localStorage.setItem(getStorageKey(courseId, taskId), next);
            window.dispatchEvent(new CustomEvent('taskUpdate'));
        } catch (_) { _; }
    };

    return (
        <li className="px-6 py-4 flex items-center gap-6 border-t border-[#c2c6d6] first:border-t-0 transition-colors duration-200 hover:bg-[#f2f3fd] group">
            {/* Checkbox */}
            <button
                onClick={handleToggle}
                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 bg-transparent
                    ${done
                        ? 'border-green-600 bg-green-600'
                        : 'border-[#c2c6d6] group-hover:border-[#0058be]'
                    }`}
            >
                <span className={`material-symbols-outlined flex items-center justify-center text-m transition-colors duration-200 ${done ? 'text-green-600' : 'text-transparent group-hover:text-[#0058be]'}`}>
                    check
                </span>
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className={`text-base leading-6 font-semibold overflow-hidden text-ellipsis whitespace-nowrap ${done ? 'text-[#9496a8] line-through' : 'text-[#191b23]'}`}>{title}</p>
                <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1 text-xs leading-4 tracking-wide font-semibold text-[#424754]">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>school</span>
                        {subtitle}
                    </span>
                </div>
            </div>

            {/* Badge */}
            <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs leading-4 tracking-wide font-semibold ${badgeStyles[badgeVariant]}`}>
                    {hour}
                </span>
            </div>
        </li>
    )
}
