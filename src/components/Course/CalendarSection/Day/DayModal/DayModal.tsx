import { useState } from "react";
import { AddTask } from "./DayModalComponents/AddTask";
import { TaskList } from "./DayModalComponents/TaskList/TaskList";
import { canManageCourse } from "../../../../../utils/permission";
import type { CalendarDay, Subject, SubjectSchedule, Task, TaskWithCompleted } from "../../../../../types";
import { useAuthStore } from "../../../../../store/AuthStore";
import { useTaskScheduleStore } from "../../../../../store/taskScheduleStorage";
import { rangesOverlap, TIME_SLOTS } from "../../../../../utils/taskSchedule";
import { isGoogleMeetUrl } from "../../../../../utils/meetingLink";
import { GoogleMeet } from "../../../../../components/Form/GoogleMeet";
import { useModalAnimation } from "../../../../../Hooks/useModalAnimation";

export type TaskForm = { title: string; description: string; startTime: string; endTime: string };

const getMonthName = (year: number, month: number) =>
    new Date(year, month).toLocaleString('es-ES', { month: 'long' })
        .replace(/^\w/, c => c.toUpperCase());

type DayModalProps = {
    day: CalendarDay;
    subject: Subject | null;
    schedule: SubjectSchedule | null;
    tasks: TaskWithCompleted[];
    courseId: number;
    year: number;
    month: number;
    onClose: () => void;
    onAddTask: (courseId: number | string, task: Task) => Promise<boolean>;
    onToggleTask: (courseId: number, taskId: string) => void;
    onTaskClick: (task: TaskWithCompleted) => void;
};

export function DayModal({ day, subject, tasks, courseId, year, month, onClose, onAddTask, onToggleTask, onTaskClick }: DayModalProps) {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<TaskForm>({ title: '', description: '', startTime: '', endTime: '' });
    const [formError, setFormError] = useState('');
    const { user } = useAuthStore();
    const canManage = canManageCourse(user, courseId);
    const setTaskSchedule = useTaskScheduleStore((state) => state.setTaskSchedule);
    const {
        handleClose,
        overlayClass,
        modalClass,
        animationStyle,
    } = useModalAnimation({
        onClose,
        duration: 260,
        enterModalClass: 'animate-fadeIn',
        exitModalClass: 'animate-modalOut',
        enterOverlayClass: 'animate-overlayIn',
        exitOverlayClass: 'animate-overlayOut',
    });
    const meetingUrl = subject?.meetingUrl && isGoogleMeetUrl(subject.meetingUrl)
        ? subject.meetingUrl
        : null;

    const handleOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) handleClose();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.title.trim()) {
            setFormError('Completa el título de la tarea.');
            return;
        }
        if (!form.description.trim()) {
            setFormError('Completa la descripción de la tarea.');
            return;
        }
        if (form.description.length > 2000) {
            setFormError('La descripción no puede superar los 2000 caracteres.');
            return;
        }
        if (!TIME_SLOTS.some((slot) => slot.start === form.startTime && slot.end === form.endTime)) {
            setFormError('Selecciona un rango horario válido.');
            return;
        }
        const requestedSchedule = { startTime: form.startTime, endTime: form.endTime };
        const hasConflict = tasks.some((task) => {
            const taskSchedule = useTaskScheduleStore.getState().schedulesByCourse[String(courseId)]?.[task.id];
            return taskSchedule ? rangesOverlap(requestedSchedule, taskSchedule) : false;
        });
        if (hasConflict) {
            setFormError('Ese horario ya está ocupado por otra tarea de ese día.');
            return;
        }
        const taskId = crypto.randomUUID();
        const dueDate = new Date(year, month, day.number, 23, 59);
        const task: Task = {
            id: taskId,
            title: form.title.trim(),
            subtitle: form.description.trim() || 'Sin descripción',
            description: form.description.trim(),
            dueDate: dueDate.toISOString(),
            hour: dueDate.toLocaleDateString('es-DO', {
                day: 'numeric',
                month: 'short',
            }),
            ...(subject ? { subjectId: subject.id } : {}),
            startTime: form.startTime,
            endTime: form.endTime,
        };

        const wasAdded = await onAddTask(courseId, task);
        if (!wasAdded) {
            setFormError('No se pudo guardar la tarea. Revisa tu conexión o tus permisos.');
            return;
        }
        setTaskSchedule(courseId, taskId, { startTime: form.startTime, endTime: form.endTime });
        setForm({ title: '', description: '', startTime: '', endTime: '' });
        setFormError('');
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
                        ${overlayClass}`}
            onClick={handleOverlay}
            style={{ '--tw-bg-opacity': 1 } as React.CSSProperties}
        >
            <div
                className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden
                            bg-surface border border-line-soft
                            ${modalClass}`}
                style={animationStyle}
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
                        <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_20%,#fff,transparent)]" />
                    )}

                    {subject ? (
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 text-left">
                                <h2 className={`max-w-[280px] break-words text-left text-3xl font-black leading-none ${isHighlighted ? 'text-white' : 'text-ink'}`}>
                                    {subject.name}
                                </h2>
                                {subject.teacher && (
                                    <p className={`mt-2 text-left text-sm font-semibold tracking-wide ${isHighlighted ? 'text-white/90' : 'text-ink-soft'}`}>
                                        {subject.teacher}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className={`shrink-0 rounded-full p-1.5 transition-colors ${isHighlighted
                                    ? 'text-white/70 hover:bg-white/20 hover:text-white'
                                    : 'text-ink-soft hover:bg-muted-strong'
                                    }`}
                                aria-label="Cerrar"
                            >
                                <span className="material-symbols-outlined text-xl leading-none">close</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={handleClose}
                                className={`absolute top-4 right-4 rounded-full p-1.5 cursor-pointer transition-colors ${isHighlighted
                                    ? 'text-white/70 hover:text-white hover:bg-white/20'
                                    : 'text-ink-soft hover:bg-muted-strong'
                                    }`}
                                aria-label="Cerrar"
                            >
                                <span className="material-symbols-outlined text-xl leading-none">close</span>
                            </button>

                            <div className="flex items-end gap-3">
                                <span className={`text-6xl font-black leading-none ${isHighlighted ? 'text-white' : 'text-ink'}`}>
                                    {day.number}
                                </span>
                                <div className="mb-1 flex flex-col">
                                    <span className={`text-sm font-semibold tracking-wide ${isHighlighted ? 'text-white/90' : 'text-ink-soft'}`}>{day.name}</span>
                                    <span className={`text-xs ${isHighlighted ? 'text-white/70' : 'text-ink-faint'}`}>{getMonthName(year, month)} {year}</span>
                                </div>
                                {isTomorrow && <span className="ml-auto mb-1 rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">Mañana</span>}
                                {isToday && <span className="ml-auto mb-1 rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">Hoy</span>}
                                {isWeekend && <span className="ml-auto mb-1 rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">Finde</span>}
                                {isPast && <span className="ml-auto mb-1 rounded-full bg-muted-strong px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-ink-faint">Pasado</span>}
                            </div>
                        </>
                    )}

                    {/* Task count pill */}
                    <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${subject ? 'mx-auto' : ''} ${isHighlighted ? 'bg-white/20 text-white' : 'bg-muted-strong text-ink-soft'
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
                    {meetingUrl && !canManage && (
                        <a
                            href={meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-1.5 text-sm font-semibold text-brand hover:underline"
                        >
                            <GoogleMeet className="h-5 w-6" />
                        </a>
                    )}
                </div>

                {/* ── Add task form ── */}
                <div className="px-6 pb-6 border-t border-line-soft pt-4">
                    {canManage && (
                        <>
                            <AddTask
                                showForm={showForm}
                                setShowForm={setShowForm}
                                form={form}
                                setForm={setForm}
                                handleSubmit={handleSubmit}
                                disabled={isToday || isPast}
                                error={formError}
                            />
                            {meetingUrl && (
                                <a
                                    href={meetingUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-brand hover:underline"
                                >
                                    <GoogleMeet className="h-5 w-6" />
                                </a>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
