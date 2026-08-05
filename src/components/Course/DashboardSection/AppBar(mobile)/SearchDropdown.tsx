import { useMemo } from 'react';
import { useTaskStore } from '../../../../store/taskStorage';
import { useAuthStore } from '../../../../store/AuthStore';
import { useSearchFilter } from '../../../../Hooks/useSearchFilter';
import type { TaskWithCompleted } from '../../../../types';

type SearchDropdownProps = {
    courseId: number;
    isOpen?: boolean;
    searchQuery?: string;
    setSelectedTask: (task: TaskWithCompleted) => void;
};

export function SearchDropdown({ courseId, isOpen = false, searchQuery = '', setSelectedTask }: SearchDropdownProps) {
    const tasksByCourse = useTaskStore((state) => state.tasksByCourse);
    const user = useAuthStore((state) => state.user);

    const mergedTasks = useMemo<TaskWithCompleted[]>(() => {
        const raw = tasksByCourse?.[courseId] ?? [];
        return raw.map((task) => ({
            ...task,
            completed:
                user?.taskStatusByCourse?.[courseId]?.[task.id]
                    ?.completed ?? false,
        }));
    }, [tasksByCourse, courseId, user]);

    const results = useSearchFilter(mergedTasks, searchQuery);

    if (!isOpen) return null;

    return (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white rounded-xl border border-[#c2c6d6] shadow-lg overflow-hidden">
            {results.length === 0 && searchQuery.trim() ? (
                <div className="px-4 py-6 text-center text-sm text-[#424754]">
                    <span className="material-symbols-outlined text-3xl mb-2 text-[#c2c6d6]">search_off</span>
                    <p>No se encontraron tareas para "<span className="font-semibold text-[#191b23]">{searchQuery}</span>"</p>
                </div>
            ) : results.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-[#c2c6d6]">
                    <span className="material-symbols-outlined text-3xl mb-2">manage_search</span>
                    <p>Escribe para buscar tareas</p>
                </div>
            ) : (
                <ul className="list-none p-0 m-0 max-h-64 overflow-y-auto">
                    {results.map((task) => (
                        <li
                            key={task.id}
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-[#c2c6d6] last:border-b-0 hover:bg-[#f2f3fd]"
                            onClick={() => setSelectedTask(task)}
                        >
                            <span className="material-symbols-outlined text-[#0058be]">school</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#191b23] truncate">
                                    {task.title}
                                </p>
                                <p className="text-xs text-[#424754] truncate">
                                    {task.subtitle}
                                </p>
                            </div>
                            <span className="text-xs text-[#424754] whitespace-nowrap">
                                {task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: 'short',
                                    })
                                    : '—'}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
