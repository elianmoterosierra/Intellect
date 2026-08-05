import { memo, useMemo, useState } from 'react';
import { getTaskStatusConfig } from '../../../../../utils/taskStatus';
import { DayModal } from '../DayModal/DayModal';
import { EMPTY_TASKS } from '../../../../../Hooks/useMonthDay';
import { useTaskStore } from '../../../../../store/taskStorage';
import { useAuthStore } from '../../../../../store/AuthStore';
import { DetailsModal } from '../../../Common/DetailsModal/DetailsModal';

import type { CalendarDay, TaskWithCompleted } from '../../../../../types';

const typeStyles: Record<CalendarDay['type'], string> = {
    past: 'opacity-60 bg-[#f2f3fd] border-[#d1d5db]',
    today: 'bg-gradient-to-b from-amber-50 to-white shadow-[0_2px_10px_-3px_rgba(251,191,36,0.35)]',
    tomorrow: 'bg-gradient-to-b from-blue-50 to-white shadow-[0_2px_10px_-3px_rgba(0,88,190,0.2)]',
    future: 'bg-white hover:border-[#0058be]/20',
    weekend: 'bg-gradient-to-b from-green-50 to-white',
};

type DayCardProps = {
    day: CalendarDay;
    year: number;
    month: number;
    courseId: number;
};

export const DayCard = memo(function DayCard({ day, year, month, courseId }: DayCardProps) {
    const { name, number, type } = day;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailsTask, setDetailsTask] = useState<TaskWithCompleted | null>(null);
    const courseTasks = useTaskStore((state) => state.tasksByCourse[courseId] ?? EMPTY_TASKS);
    const addTask = useTaskStore((state) => state.addTask);
    const user = useAuthStore((state) => state.user);
    const toggleTaskStatus = useAuthStore((state) => state.toggleTaskStatus);
    const tasks = useMemo(
        () => courseTasks
            .filter((task) => {
                const date = new Date(task.dueDate);
                return date.getFullYear() === year && date.getMonth() === month && date.getDate() === number;
            })
            .map((task) => ({
                ...task,
                completed: user?.taskStatusByCourse?.[courseId]?.[task.id]?.completed ?? false,
            })),
        [courseTasks, courseId, number, user, year, month],
    );

    const isTomorrow = type === 'tomorrow';
    const isToday = type === 'today';
    const isWeekend = type === 'weekend';
    const cardDate = new Date(year, month, number);

    const displayedTasks = tasks.slice(0, 3);
    const hasMore = tasks.length > 3;

    return (
        <>
            <div
                className={`relative rounded-xl border p-3 flex flex-col gap-1.5 cursor-pointer transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 aspect-square md:aspect-auto ${typeStyles[type] ?? typeStyles.future} ${type === 'past' || type === 'future' ? 'border-[#c2c6d6]' : ''}`}
                onClick={() => setIsModalOpen(true)}
                data-today={isToday ? '' : undefined}
            >
                <div className={`flex justify-between items-center rounded-t-[10px] -mx-3 -mt-3 px-3 pt-3 pb-1.5 ${isToday ? 'bg-gradient-to-br from-amber-500 to-amber-600' : isTomorrow ? 'bg-gradient-to-br from-[#0058be] to-[#0041a8]' : isWeekend ? 'bg-gradient-to-br from-green-500 to-green-600' : ''}`}>
                    <span className={`text-[11px] font-medium tracking-wide uppercase ${isToday || isTomorrow || isWeekend ? 'text-white' : 'text-[#6b7280]'}`}>{name}</span>
                    <span className={`text-lg font-bold leading-tight ${isToday || isTomorrow || isWeekend ? 'text-white' : type === 'past' ? 'text-[#9ca3af]' : 'text-[#191b23]'}`}>{number}</span>
                </div>

                <div className="flex flex-col gap-1 mt-0.5">
                    {displayedTasks.map((task) => {
                        const status = getTaskStatusConfig(new Date(task.dueDate ?? cardDate));
                        return (
                            <div key={task.id} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold leading-tight transition-colors duration-150 group-hover:shadow-sm ${task.completed ? 'bg-gray-100 text-gray-400 line-through' : status.pillBg}`}>
                                {status.icon && !task.completed && <span className="material-symbols-outlined text-[12px] leading-none">{status.icon}</span>}
                                {task.title.length > 20 ? task.title.slice(0, 20) + '…' : task.title}
                            </div>
                        );
                    })}
                    {hasMore && (
                        <div className="text-center text-[10px] font-semibold text-[#424754] tracking-wider">···</div>
                    )}
                </div>

                <div className="text-[10px] text-[#6b7280] mt-auto hidden md:block">Click para ver detalles</div>
            </div>

            {isModalOpen && (
                <DayModal
                    day={day}
                    tasks={tasks}
                    courseId={courseId}
                    year={year}
                    month={month}
                    onClose={() => setIsModalOpen(false)}
                    onAddTask={addTask}
                    onToggleTask={toggleTaskStatus}
                    onTaskClick={(task) => {
                        setIsModalOpen(false);
                        setDetailsTask(task);
                    }}
                />
            )}

            {detailsTask && (
                <DetailsModal
                    task={detailsTask}
                    courseId={courseId}
                    onClose={() => setDetailsTask(null)}
                />
            )}
        </>
    );
});