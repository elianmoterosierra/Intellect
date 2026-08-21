import { memo, useMemo, useState } from 'react';
import { getTaskStatusConfig } from '../../../../../utils/taskStatus';
import { DayModal } from '../DayModal/DayModal';
import { EMPTY_TASKS } from '../../../../../Hooks/useMonthDay';
import { useTaskStore } from '../../../../../store/taskStorage';
import { useAuthStore } from '../../../../../store/AuthStore';
import { DetailsModal } from '../../../Common/DetailsModal/DetailsModal';
import { TIME_OPTIONS, TIME_SLOTS, isSameLocalDay } from '../../../../../utils/taskSchedule';
import { useTaskScheduleStore } from '../../../../../store/taskScheduleStorage';

import type { CalendarDay, TaskWithCompleted } from '../../../../../types';

const EMPTY_SCHEDULES: Readonly<Record<string, { startTime: string; endTime: string }>> = Object.freeze({});
const RANDOM_COLORS = ['weekly-task-pink', 'weekly-task-purple', 'weekly-task-blue', 'weekly-task-gray'] as const;

const typeStyles: Record<CalendarDay['type'], string> = {
    past: 'opacity-60 bg-muted border-line',
    today: 'bg-gradient-to-b from-amber-50 to-surface shadow-[0_2px_10px_-3px_rgba(251,191,36,0.35)]',
    tomorrow: 'bg-gradient-to-b from-blue-50 to-surface shadow-[0_2px_10px_-3px_rgba(0,88,190,0.2)]',
    future: 'bg-surface hover:border-brand-ring',
    weekend: 'bg-gradient-to-b from-green-50 to-surface',
};

type DayCardProps = {
    day: CalendarDay;
    year: number;
    month: number;
    courseId: number;
    weekly?: boolean;
};

function getDayStart(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}

export const DayCard = memo(function DayCard({ day, year, month, courseId, weekly = false }: DayCardProps) {
    const { number, type } = day;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailsTask, setDetailsTask] = useState<TaskWithCompleted | null>(null);
    const [colorSeed] = useState(() => Math.random());
    const courseTasks = useTaskStore((state) => state.tasksByCourse[courseId] ?? EMPTY_TASKS);
    const addTask = useTaskStore((state) => state.addTask);
    const user = useAuthStore((state) => state.user);
    const toggleTaskStatus = useAuthStore((state) => state.toggleTaskStatus);
    const schedules = useTaskScheduleStore((state) => state.schedulesByCourse[String(courseId)] ?? EMPTY_SCHEDULES);
    const cardDate = new Date(year, month, number);

    const tasks = useMemo(
        () => courseTasks
            .filter((task) => {
                const date = new Date(task.dueDate);
                const sameDay = date.getFullYear() === year && date.getMonth() === month && date.getDate() === number;
                if (!sameDay) return false;
                if (!weekly) return true;
                return getDayStart(date).getTime() >= getDayStart(new Date()).getTime();
            })
            .map((task) => ({
                ...task,
                completed: user?.taskStatusByCourse?.[courseId]?.[task.id]?.completed ?? false,
            })),
        [courseTasks, courseId, month, number, user, weekly, year],
    );

    const isTomorrow = type === 'tomorrow';
    const isToday = type === 'today';
    const isWeekend = type === 'weekend';
    const displayedTasks = tasks.slice(0, 3);
    const hasMore = tasks.length > 3;

    function getRandomColor(taskId: string): string {
        const hash = [...taskId].reduce((total, character) => total + character.charCodeAt(0), 0);
        return RANDOM_COLORS[Math.floor((hash + colorSeed * 1000) % RANDOM_COLORS.length)] ?? RANDOM_COLORS[0];
    }

    function getTaskColor(task: TaskWithCompleted): string {
        if (task.completed) return 'weekly-task-green';
        if (isSameLocalDay(new Date(task.dueDate), new Date())) return 'weekly-task-red';
        if (getTaskStatusConfig(new Date(task.dueDate)).status === 'tomorrow') return 'weekly-task-yellow';
        return getRandomColor(task.id);
    }

    const weeklyTasks = tasks.filter((task) => {
        const schedule = schedules[task.id];
        if (!schedule) return false;
        return TIME_OPTIONS.includes(schedule.startTime as typeof TIME_OPTIONS[number])
            && TIME_OPTIONS.includes(schedule.endTime as typeof TIME_OPTIONS[number]);
    });

    const weeklyCard = (
        <div
            className={`weekly-day-card ${type === 'today' ? 'weekly-day-card-today' : ''}`}
            onClick={() => setIsModalOpen(true)}
            data-today={isToday ? '' : undefined}
        >
            {TIME_SLOTS.map((slot, index) => (
                <div
                    key={slot.start}
                    className="weekly-slot"
                    style={{ gridRow: index + 1 }}
                    aria-hidden="true"
                />
            ))}
            {weeklyTasks.map((task) => {
                const schedule = schedules[task.id];
                if (!schedule) return null;
                const startRow = TIME_OPTIONS.indexOf(schedule.startTime as typeof TIME_OPTIONS[number]);
                const endRow = TIME_OPTIONS.indexOf(schedule.endTime as typeof TIME_OPTIONS[number]);
                if (startRow < 0 || endRow <= startRow) return null;
                return (
                    <button
                        type="button"
                        key={task.id}
                        className={`weekly-task-block ${getTaskColor(task)}`}
                        style={{ gridRow: `${startRow + 1} / ${endRow + 1}` }}
                        onClick={(event) => {
                            event.stopPropagation();
                            setDetailsTask(task);
                        }}
                        title={`${task.title} · ${schedule.startTime} – ${schedule.endTime}`}
                    >
                        <span className="weekly-task-time">{schedule.startTime} – {schedule.endTime}</span>
                        <span>{task.title.length > 30 ? `${task.title.slice(0, 30)}…` : task.title}</span>
                    </button>
                );
            })}
        </div>
    );

    const regularCard = (
        <div
            className={`relative rounded-xl border p-3 flex flex-col gap-1.5 cursor-pointer transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 aspect-square md:aspect-auto ${typeStyles[type] ?? typeStyles.future} ${type === 'past' || type === 'future' ? 'border-line' : ''}`}
            onClick={() => setIsModalOpen(true)}
            data-today={isToday ? '' : undefined}
        >
            <div className={`flex justify-end items-center rounded-t-[10px] -mx-3 -mt-3 px-3 pt-3 pb-1.5 ${isToday ? 'bg-gradient-to-br from-amber-500 to-amber-600' : isTomorrow ? 'bg-gradient-to-br from-[#0058be] to-[#0041a8]' : isWeekend ? 'bg-gradient-to-br from-green-500 to-green-600' : ''}`}>
                <span className={`text-lg font-bold leading-tight ${isToday || isTomorrow || isWeekend ? 'text-white' : type === 'past' ? 'text-ink-faint' : 'text-ink'}`}>{number}</span>
            </div>
            <div className="flex flex-col gap-1 mt-0.5">
                {displayedTasks.map((task) => {
                    const status = getTaskStatusConfig(new Date(task.dueDate ?? cardDate));
                    return <div key={task.id} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold leading-tight transition-colors duration-150 group-hover:shadow-sm ${task.completed ? 'bg-gray-100 text-gray-400 line-through' : status.pillBg}`}>
                        {status.icon && !task.completed && <span className="material-symbols-outlined text-[12px] leading-none">{status.icon}</span>}
                        {task.title.length > 20 ? `${task.title.slice(0, 20)}…` : task.title}
                    </div>;
                })}
                {hasMore && <div className="text-center text-[10px] font-semibold text-ink-soft tracking-wider">···</div>}
            </div>
            <div className="text-[10px] text-ink-faint mt-auto hidden md:block">Click para ver detalles</div>
        </div>
    );

    return (
        <>
            {weekly ? weeklyCard : regularCard}
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
            {detailsTask && <DetailsModal task={detailsTask} courseId={courseId} onClose={() => setDetailsTask(null)} />}
        </>
    );
});
