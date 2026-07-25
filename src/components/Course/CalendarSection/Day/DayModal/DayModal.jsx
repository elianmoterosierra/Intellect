import { useState } from "react";
import { AddTask } from "./DayModalComponents/AddTask";
import { TaskList } from "./DayModalComponents/TaskList/TaskList";

const getMonthName = (year, month) =>
    new Date(year, month).toLocaleString('es-ES', { month: 'long' })
        .replace(/^\w/, c => c.toUpperCase());

export function DayModal({ day, tasks, courseId, year, month, onClose, onAddTask, onToggleTask, onTaskClick }) {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', description: '' });
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
        setTimeout(onClose, 260);
    };

    const handleOverlay = (e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) handleClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
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
    const isPast = day.type === 'past';

    // Date object for this day (used by TaskList for per-task status)
    const dayDate = new Date(year, month, day.number);

    const handleToggle = (taskId) => {
        onToggleTask(courseId, taskId);
    };

    return (
        <div
            className={`fixed inset-0 z-[200] flex items-center justify-center p-4
                        bg-black/50 backdrop-blur-sm
                        ${closing ? 'animate-overlayOut' : 'animate-overlayIn'}`}
            onClick={handleOverlay}
            style={{ '--tw-bg-opacity': 1 }}
        >
            <div
                className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden
                            bg-white border border-[#e2e3f0]
                            ${closing ? 'animate-modalOut' : 'animate-fadeIn'}`}
                style={{ animationDuration: closing ? '0.26s' : '0.32s' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className={`relative px-6 pt-6 pb-4 ${isTomorrow
                    ? 'bg-gradient-to-br from-[#0058be] to-[#0041a8]'
                    : isToday
                        ? 'bg-gradient-to-br from-amber-500 to-amber-700'
                        : 'bg-gradient-to-br from-[#f4f5fd] to-[#eaebf8]'
                    }`}>
                    {(isTomorrow || isToday) && (
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,#fff,transparent)]" />
                    )}

                    <button
                        onClick={handleClose}
                        className={`absolute top-4 right-4 rounded-full p-1.5 transition-colors ${isTomorrow || isToday
                            ? 'text-white/70 hover:text-white hover:bg-white/20'
                            : 'text-[#424754] hover:bg-[#e2e3f0]'
                            }`}
                    >
                        <span className="material-symbols-outlined text-xl leading-none">close</span>
                    </button>

                    <div className="flex items-end gap-3">
                        <span className={`text-6xl font-black leading-none ${isTomorrow || isToday ? 'text-white' : 'text-[#191b23]'
                            }`}>
                            {day.number}
                        </span>
                        <div className="flex flex-col mb-1">
                            <span className={`text-sm font-semibold tracking-wide ${isTomorrow || isToday ? 'text-white/90' : 'text-[#424754]'
                                }`}>
                                {day.name}
                            </span>
                            <span className={`text-xs ${isTomorrow || isToday ? 'text-white/70' : 'text-[#9496a8]'
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
                        {isPast && (
                            <span className="ml-auto mb-1 text-[10px] font-bold tracking-widest uppercase bg-[#e2e3f0] text-[#9496a8] px-2 py-0.5 rounded-full">
                                Pasado
                            </span>
                        )}
                    </div>

                    {/* Task count pill */}
                    <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${isTomorrow || isToday ? 'bg-white/20 text-white' : 'bg-[#dde0f5] text-[#424754]'
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
                <div className="px-6 pb-6 border-t border-[#f0f1fb] pt-4">
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
