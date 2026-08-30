import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useTaskStore } from '../store/taskStorage';
import { useUIStore } from '../store/uiStore';
import { EMPTY_SUBJECTS, useSubjectStore } from '../store/subjectStorage';
import { getSubjectDateOptions } from '../utils/subjectSchedule';

export function useAddTaskForm(courseId: number, onClose: () => void) {
    const addTask = useTaskStore((state) => state.addTask);
    const isModalOpen = useUIStore((state) => state.isAddTaskModalOpen);
    const subjects = useSubjectStore((state) => state.subjectsByCourse[String(courseId)] ?? EMPTY_SUBJECTS);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const selectedSubject = subjects.find((subject) => subject.id === subjectId) ?? null;
    const availableDates = useMemo(() => getSubjectDateOptions(selectedSubject), [selectedSubject]);

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

        if (!title.trim() || !subtitle.trim() || !subjectId || !dueDate) {
            setError('Completa el título, la descripción, la materia y el día de entrega.');
            return;
        }

        const date = new Date(`${dueDate}T23:59:00`);
        const taskId = crypto.randomUUID();
        setIsSubmitting(true);
        const saved = await addTask(courseId, {
            id: taskId,
            title: title.trim(),
            subtitle: subtitle.trim(),
            subjectId,
            dueDate: date.toISOString(),
            hour: date.toLocaleDateString('es-DO', { day: 'numeric', month: 'short' }),
        });
        setIsSubmitting(false);

        if (!saved) {
            setError('No se pudo guardar la tarea. Inténtalo de nuevo.');
            return;
        }

        setTitle('');
        setSubtitle('');
        setSubjectId('');
        setDueDate('');
        onClose();
    };

    return { title, setTitle, subtitle, setSubtitle, subjectId, setSubjectId, subjects, availableDates, dueDate, setDueDate, error, handleSubmit };
}
