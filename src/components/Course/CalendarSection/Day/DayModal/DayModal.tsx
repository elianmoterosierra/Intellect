import { useState } from "react";
import { AddTask } from "./DayModalComponents/AddTask";
import { TaskList } from "./DayModalComponents/TaskList/TaskList";

import type { CalendarDay, Task, TaskWithCompleted } from "../../../../../types";

export type TaskForm = { title: string; description: string };

const getMonthName = (year: number, month: number) =>
    new Date(year, month).toLocaleString('es-ES', { month: 'long' })
        .replace(/^\w/, c => c.toUpperCase());

type DayModalProps = {
    day: CalendarDay;
    tasks: TaskWithCompleted[];
    courseId: number;
    year: number;
    month: number;
    onClose: () => void;
    onAddTask: (courseId: number | string, task: Task) => void;
    onToggleTask: (courseId: number, taskId: string) => void;
    onTaskClick: (task: TaskWithCompleted) => void;
};

export function DayModal({ day, tasks, courseId, year, month, onClose, onAddTask, onToggleTask, onTaskClick }: DayModalProps) {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<TaskForm>({ title: '', description: '' });
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
        setTimeout(onClose, 260);
    };

    const handleOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) handleClose();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        if (form.description.length > 2000) return;
        const dueDate = new Date(year, month, day.number, 23, 59);
        onAddTask(courseId, {
            id: crypto.randomUUID(),
            title: form.title.trim(),
            subtitle: form.description.trim() || 'Sin descripción',
            description: form.description.trim(),
            dueDate: dueDate.toISOString(),
            hour: dueDate.toLocaleDateString('es-DO', { day: 'numeric', month: 'short' }),
        });
        setForm({ title: '', description: '' });
        setShowForm(false);
    };

    const isToday = day.type === 'today';
    const isTomorrow = day.type === 'tomorrow';
    const isWeekend = day.type === 'weekend';
    const isPast = day.type === 'past';
    const isHighlighted = isToday || isTomorrow || isWeekend;

    // Date object for this day (used by TaskList for per-task status)
    const dayDate = new Date(year, month, day.number);

    const handleToggle = (taskId: string) => {
        onToggleTask(courseId, taskId);
    };

    return (
        <div
            className={`fixed inset-0 z-[200] flex items-center justify-center p-4
                        bg-black/50 backdrop-blur-sm
                        ${closing ? 'animate-overlayOut' : 'animate-overlayIn'}`}
            onClick={handleOverlay}
            style={{ '--tw-bg-opacity': 1 } as React.CSSProperties}
        >
            <div
                className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden
                            bg-surface border border-line-soft
                            ${closing ? 'animate-modalOut' : 'animate-fadeIn'}`}
                style={{ animationDuration: closing ? '0.26s' : '0.32s' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className={`relative px-6 pt-6 pb-4 ${isTomorrow
                    ? 'bg-gradient-to-br from-[#0058be] to-[#0041a8]'
                    : isToday
                        ? 'bg-gradient-to-br from-amber-500 to-amber-700'
                        : isWeekend
                            ? 'bg-gradient-to-br from-green-500 to-green-600'
                            : 'bg-gradient-to-br from-muted to-muted-strong'
                    }`}>
                    {isHighlighted && (
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,#fff,transparent)]" />
                    )}

                    <button
                        onClick={handleClose}
                        onTouchEnd={(e) => { e.preventDefault(); handleClose(); }}
                        className={`absolute top-4 right-4 rounded-full p-1.5 cursor-pointer transition-colors ${isHighlighted
                            ? 'text-white/70 hover:text-white hover:bg-white/20'
                            : 'text-ink-soft hover:bg-muted-strong'
                            }`}
                    >
                        <span className="material-symbols-outlined text-xl leading-none">close</span>
                    </button>

                    <div className="flex items-end gap-3">
                        <span className={`text-6xl font-black leading-none ${isHighlighted ? 'text-white' : 'text-ink'
                            }`}>
                            {day.number}
                        </span>
                        <div className="flex flex-col mb-1">
                            <span className={`text-sm font-semibold tracking-wide ${isHighlighted ? 'text-white/90' : 'text-ink-soft'
                                }`}>
                                {day.name}
                            </span>
                            <span className={`text-xs ${isHighlighted ? 'text-white/70' : 'text-ink-faint'
                                }`}>
                                {getMonthName(year, month)} {year}
                            </span>
                        </div>
                        {isTomorrow && (
                            <span className="ml-auto mb-1 text-[10px] font-bold tracking-widest uppercase bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
                                Mañana
                            </span>
                        )}
                        {isToday && (
                            <span className="ml-auto mb-1 text-[10px] font-bold tracking-widest uppercase bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
                                Hoy
                            </span>
                        )}
                        {isWeekend && (
                            <span className="ml-auto mb-1 text-[10px] font-bold tracking-widest uppercase bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
                                Finde
                            </span>
                        )}
                        {isPast && (
                            <span className="ml-auto mb-1 text-[10px] font-bold tracking-widest uppercase bg-muted-strong text-ink-faint px-2 py-0.5 rounded-full">
                                Pasado
                            </span>
                        )}
                    </div>

                    {/* Task count pill */}
                    <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${isHighlighted ? 'bg-white/20 text-white' : 'bg-muted-strong text-ink-soft'
                        }`}>
                        <span className="material-symbols-outlined text-sm leading-none">task_alt</span>
                        {tasks.length === 0
                            ? 'Sin tareas para este día'
                            : `${tasks.length} tarea${tasks.length > 1 ? 's' : ''}`}
                    </div>
                </div>

                {/* ── Task list ── */}
                <div className="px-6 py-4 max-h-60 overflow-y-auto flex flex-col gap-3">
                    <TaskList tasks={tasks} handleToggle={handleToggle} dayDate={dayDate} onTaskClick={onTaskClick} />
                </div>

                {/* ── Add task form ── */}
                <div className="px-6 pb-6 border-t border-line-soft pt-4">
                    <AddTask
                        showForm={showForm}
                        setShowForm={setShowForm}
                        form={form}
                        setForm={setForm}
                        handleSubmit={handleSubmit}
                        disabled={isToday || isPast}
                    />
                </div>
            </div>
        </div>
    );
}