import { memo, useMemo, useState } from 'react';
import { getTaskStatusConfig } from '../../../../../utils/taskStatus';
import { DayModal } from '../DayModal/DayModal';
import { EMPTY_TASKS } from '../../../../../Hooks/useMonthDay';
import { useTaskStore } from '../../../../../store/taskStorage';
import { useAuthStore } from '../../../../../store/AuthStore';
import { DetailsModal } from '../../../Common/DetailsModal/DetailsModal';
import { SUBJECT_TIME_SLOTS, TIME_SLOTS, fromDatabaseTime, isSameLocalDay } from '../../../../../utils/taskSchedule';
import { useTaskScheduleStore } from '../../../../../store/taskScheduleStorage';
import { EMPTY_SUBJECTS, useSubjectStore } from '../../../../../store/subjectStorage';
import { getSubjectWeekday } from '../../../../../utils/subjectSchedule';

import type { CalendarDay, Subject, SubjectColor, SubjectSchedule, TaskWithCompleted } from '../../../../../types';

const EMPTY_SCHEDULES: Readonly<Record<string, { startTime: string; endTime: string }>> = Object.freeze({});
const RANDOM_COLORS = ['weekly-task-pink', 'weekly-task-purple', 'weekly-task-blue', 'weekly-task-gray', 'weekly-task-blue-2', 'weekly-task-yellow-2'] as const;
type SubjectScheduleSegment = {
    originalSchedule: SubjectSchedule;
    startTime: string;
    endTime: string;
    index: number;
};

function getScheduleSegments(schedule: SubjectSchedule): SubjectScheduleSegment[] {
    return [{
        originalSchedule: schedule,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        index: 0,
    }];
}

function getSlotIndex(startTime: string, endTime: string): number {
    return TIME_SLOTS.findIndex((slot) => slot.start === startTime && slot.end === endTime);
}

function getSubjectSlotIndex(startTime: string, endTime: string, showNoonSlot: boolean): number {
    const slots = showNoonSlot ? SUBJECT_TIME_SLOTS : TIME_SLOTS;
    return slots.findIndex((slot) => slot.start === startTime && slot.end === endTime);
}

function getCalendarTaskSlotIndex(startTime: string, endTime: string, showNoonSlot: boolean): number {
    const slotIndex = getSlotIndex(startTime, endTime);
    if (showNoonSlot && slotIndex >= 3) return slotIndex + 1;
    return slotIndex;
}

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
    dataVersion: string;
    showNoonSlot?: boolean;
};

function getDayStart(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}

export const DayCard = memo(function DayCard({ day, year, month, courseId, weekly = false, dataVersion, showNoonSlot = false }: DayCardProps) {
    const { number, type } = day;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<{ subject: Subject; schedule: SubjectSchedule } | null>(null);
    const [detailsTask, setDetailsTask] = useState<TaskWithCompleted | null>(null);
    const [colorSeed] = useState(() => Math.random());
    const courseTasks = useTaskStore((state) => state.tasksByCourse[courseId] ?? EMPTY_TASKS);
    const addTask = useTaskStore((state) => state.addTask);
    const user = useAuthStore((state) => state.user);
    const toggleTaskStatus = useAuthStore((state) => state.toggleTaskStatus);
    const schedules = useTaskScheduleStore((state) => state.schedulesByCourse[String(courseId)] ?? EMPTY_SCHEDULES);
    const subjects = useSubjectStore((state) => state.subjectsByCourse[String(courseId)] ?? EMPTY_SUBJECTS);
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
        if (getTaskStatusConfig(new Date(task.dueDate)).status === 'overdue') return 'weekly-task-overdue';
        if (isSameLocalDay(new Date(task.dueDate), new Date())) return 'weekly-task-red';
        if (getTaskStatusConfig(new Date(task.dueDate)).status === 'tomorrow') return 'weekly-task-yellow';
        return getRandomColor(task.id);
    }

    function getTaskSchedule(task: TaskWithCompleted) {
        const inMemorySchedule = schedules[task.id];
        if (inMemorySchedule) return inMemorySchedule;
        if (!task.startTime || !task.endTime) return null;

        return {
            startTime: fromDatabaseTime(task.startTime),
            endTime: fromDatabaseTime(task.endTime),
        };
    }

    const weeklyTasks = tasks.filter((task) => {
        const schedule = getTaskSchedule(task);
        if (!schedule) return false;
        return getSlotIndex(schedule.startTime, schedule.endTime) >= 0;
    });

    const weekday = getSubjectWeekday(cardDate);
    const daySubjects = subjects.flatMap((subject) => subject.schedules
        .filter((schedule) => schedule.weekday === weekday)
        .flatMap((schedule) => getScheduleSegments(schedule)
            .map((segment) => ({ subject, segment }))));
    const modalTasks = selectedSubject
        ? tasks.filter((task) => task.subjectId === selectedSubject.subject.id)
        : tasks;

    function openDayModal() {
        setSelectedSubject(null);
        setIsModalOpen(true);
    }

    const weeklyCard = (
        <div
            className={`weekly-day-card ${showNoonSlot ? 'weekly-day-card-with-noon' : ''} ${type === 'today' ? 'weekly-day-card-today' : ''}`}
            data-version={dataVersion}
            data-today={isToday ? '' : undefined}
        >
            {(showNoonSlot ? SUBJECT_TIME_SLOTS : TIME_SLOTS).map((slot, index) => (
                <div
                    key={slot.start}
                    className="weekly-slot"
                    style={{ gridRow: index + 1 }}
                    aria-hidden="true"
                />
            ))}
            {daySubjects.map(({ subject, segment }) => {
                const slotIndex = getSubjectSlotIndex(segment.startTime, segment.endTime, showNoonSlot);
                if (slotIndex < 0) return null;
                const subjectTasks = segment.index === 0
                    ? tasks.filter((task) => task.subjectId === subject.id)
                    : [];
                const pendingCount = subjectTasks.filter((task) => !task.completed).length;

                return (
                    <div
                        key={`${subject.id}-${segment.originalSchedule.id}-${segment.index}`}
                        className={`weekly-subject-block subject-${subject.color as SubjectColor}`}
                        style={{ gridRow: slotIndex + 1 }}
                        onClick={(event) => {
                            event.stopPropagation();
                            setSelectedSubject({ subject, schedule: segment.originalSchedule });
                            setIsModalOpen(true);
                        }}
                        title={`${subject.name} · ${segment.startTime} – ${segment.endTime}`}
                    >
                        {segment.index === 0 && (
                            <div className="weekly-subject-heading">
                                <strong>{subject.name}</strong>
                                {pendingCount > 0 && <span className="weekly-subject-count">{pendingCount}</span>}
                            </div>
                        )}

                        {segment.index === 0 && subjectTasks.length > 0 && (
                            <>
                                <span className="weekly-subject-tasks-label">Tareas</span>
                                {subjectTasks.map((task) => (
                                    <span key={task.id} className={`weekly-subject-task ${task.completed ? 'weekly-subject-task-completed' : ''}`}>
                                        {task.title}
                                    </span>
                                ))}
                            </>
                        )}
                    </div>
                );
            })}
            {weeklyTasks.map((task) => {
                const schedule = getTaskSchedule(task);
                if (!schedule) return null;
                const slotIndex = getCalendarTaskSlotIndex(schedule.startTime, schedule.endTime, showNoonSlot);
                if (slotIndex < 0) return null;
                return (
                    <button
                        type="button"
                        key={task.id}
                        className={`weekly-task-block ${getTaskColor(task)}`}
                        style={{ gridRow: slotIndex + 1 }}
                        onClick={(event) => {
                            event.stopPropagation();
                            setSelectedSubject(null);
                            setDetailsTask(task);
                        }}
                        title={`${task.title} · ${schedule.startTime} – ${schedule.endTime}`}
                    >

                        <span>{task.title.length > 30 ? `${task.title.slice(0, 30)}…` : task.title}</span>
                    </button>
                );
            })}
        </div>
    );

    const regularCard = (
        <div
            className={`relative rounded-xl border p-3 flex flex-col gap-1.5 ${tasks.length > 0 ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0' : 'cursor-default'} transition-all duration-200 ease-out aspect-square md:aspect-auto ${typeStyles[type] ?? typeStyles.future} ${type === 'past' || type === 'future' ? 'border-line' : ''}`}
            onClick={tasks.length > 0 ? openDayModal : undefined}
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
                    subject={selectedSubject?.subject ?? null}
                    schedule={selectedSubject?.schedule ?? null}
                    tasks={modalTasks}
                    courseId={courseId}
                    year={year}
                    month={month}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedSubject(null);
                    }}
                    onAddTask={addTask}
                    onToggleTask={toggleTaskStatus}
                    onTaskClick={(task) => {
                        setIsModalOpen(false);
                        setSelectedSubject(null);
                        setDetailsTask(task);
                    }}
                />
            )}
            {detailsTask && <DetailsModal task={detailsTask} courseId={courseId} onClose={() => setDetailsTask(null)} />}
        </>
    );
});
