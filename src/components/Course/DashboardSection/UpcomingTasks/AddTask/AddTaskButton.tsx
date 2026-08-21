import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useTaskStore } from '../../../../../store/taskStorage';
import { AddTaskModal } from '../AddTaskModal/TaskModal';
import { useTaskScheduleStore } from '../../../../../store/taskScheduleStorage';
import { getTimeOptionsAfter } from '../../../../../utils/taskSchedule';
import { isSameLocalDay, rangesOverlap } from '../../../../../utils/taskSchedule';
import type { Task } from '../../../../../types';

const EMPTY_TASKS: Task[] = [];
const EMPTY_SCHEDULES: Readonly<Record<string, { startTime: string; endTime: string }>> = Object.freeze({});

function getTodayInputValue() {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

type AddTaskButtonProps = {
    courseId: number;
};

export function AddTaskButton({ courseId }: AddTaskButtonProps) {
    const addTask = useTaskStore((state) => state.addTask);
    const titleInputRef = useRef<HTMLInputElement | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const setTaskSchedule = useTaskScheduleStore((state) => state.setTaskSchedule);
    const courseTasks = useTaskStore((state) => state.tasksByCourse[String(courseId)] ?? EMPTY_TASKS);
    const schedules = useTaskScheduleStore((state) => state.schedulesByCourse[String(courseId)] ?? EMPTY_SCHEDULES);
    const today = getTodayInputValue();

    const closeModal = () => {
        setShowForm(false);
        setError('');
    };

    useEffect(() => {
        if (!showForm) return undefined;

        titleInputRef.current?.focus();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeModal();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showForm]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return;

        if (subtitle.length > 2000) {
            setError(`Te has excedido por ${subtitle.length - 2000} caracteres: ${subtitle.length}/2000`);
            return;
        }

        if (!title.trim() || !subtitle.trim() || !dueDate) {
            setError('Completa el título, la descripción y la fecha de entrega.');
            return;
        }
        if (!startTime || !endTime || !getTimeOptionsAfter(startTime).includes(endTime)) {
            setError('Selecciona un rango horario válido.');
            return;
        }
        const requestedSchedule = { startTime, endTime };
        const requestedDate = new Date(`${dueDate}T12:00:00`);
        const hasConflict = courseTasks.some((task) => {
            const taskSchedule = schedules[task.id];
            if (!taskSchedule) return false;
            return isSameLocalDay(new Date(task.dueDate), requestedDate)
                && rangesOverlap(requestedSchedule, taskSchedule);
        });
        if (hasConflict) {
            setError('Ese horario ya está ocupado por otra tarea de ese día.');
            return;
        }

        const taskId = crypto.randomUUID();
        const date = new Date(`${dueDate}T23:59:00`);
        setIsSubmitting(true);
        const saved = await addTask(courseId, {
            id: taskId,
            title: title.trim(),
            subtitle: subtitle.trim(),
            dueDate: date.toISOString(),
            hour: date.toLocaleDateString('es-DO', { day: 'numeric', month: 'short' }),
            startTime,
            endTime,
        });

        setIsSubmitting(false);

        if (!saved) {
            setError('No se pudo guardar la tarea. Inténtalo de nuevo.');
            return;
        }

        setTaskSchedule(courseId, taskId, { startTime, endTime });

        setTitle('');
        setSubtitle('');
        setDueDate('');
        setStartTime('');
        setEndTime('');
        closeModal();
    };



    return (
        <>
            <button
                type="button"
                className="flex items-center justify-center gap-2 py-4 bg-transparent  border-[2px] border-brand rounded-lg w-48 h-12 text-brand text-sm font-semibold cursor-pointer transition-all duration-200 hover:scale-110 hover:border-[3px] "
                onClick={() => setShowForm(true)}
            >
                <span className="material-symbols-outlined text-lg">add</span>
                Nueva tarea
            </button>

            {showForm && (
                <AddTaskModal closeModal={closeModal} handleSubmit={handleSubmit} titleInputRef={titleInputRef} title={title} setTitle={setTitle} subtitle={subtitle} setSubtitle={setSubtitle} dueDate={dueDate} setDueDate={setDueDate} today={today} error={error} startTime={startTime} endTime={endTime} setStartTime={setStartTime} setEndTime={setEndTime} />
            )}
        </>
    );
}
