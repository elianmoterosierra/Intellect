import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTaskStore } from '../store/taskStorage';
import { useUIStore } from '../store/uiStore';
import { useTaskScheduleStore } from '../store/taskScheduleStorage';
import { getTimeOptionsAfter } from '../utils/taskSchedule';
import { isSameLocalDay, rangesOverlap } from '../utils/taskSchedule';
import type { Task } from '../types';

const EMPTY_TASKS: Task[] = [];
const EMPTY_SCHEDULES: Readonly<Record<string, { startTime: string; endTime: string }>> = Object.freeze({});

function getTodayInputValue() {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function useAddTaskForm(courseId: number, onClose: () => void) {
    const addTask = useTaskStore((state) => state.addTask);
    const isModalOpen = useUIStore((state) => state.isAddTaskModalOpen);
    const setTaskSchedule = useTaskScheduleStore((state) => state.setTaskSchedule);
    const courseTasks = useTaskStore((state) => state.tasksByCourse[String(courseId)] ?? EMPTY_TASKS);
    const schedules = useTaskScheduleStore((state) => state.schedulesByCourse[String(courseId)] ?? EMPTY_SCHEDULES);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const today = getTodayInputValue();

    const [wasModalOpen, setWasModalOpen] = useState(isModalOpen);
    if (wasModalOpen && !isModalOpen) {
        setWasModalOpen(false);
        setError('');
    }
    if (!wasModalOpen && isModalOpen) setWasModalOpen(true);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (isSubmitting) return;

        if (!courseId) return;

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

        const date = new Date(`${dueDate}T23:59:00`);
        const taskId = crypto.randomUUID();
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
        onClose();
    };

    return { title, setTitle, subtitle, setSubtitle, dueDate, setDueDate, startTime, endTime, setStartTime, setEndTime, today, error, handleSubmit };
}
