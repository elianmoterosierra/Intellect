import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTaskStore } from '../store/taskStorage';
import { useUIStore } from '../store/uiStore';

function getTodayInputValue() {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function useAddTaskForm(courseId: number, onClose: () => void) {
    const addTask = useTaskStore((state) => state.addTask);
    const isModalOpen = useUIStore((state) => state.isAddTaskModalOpen);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');
    const today = getTodayInputValue();

    const [wasModalOpen, setWasModalOpen] = useState(isModalOpen);
    if (wasModalOpen && !isModalOpen) {
        setWasModalOpen(false);
        setError('');
    }
    if (!wasModalOpen && isModalOpen) setWasModalOpen(true);

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (!courseId) return;

        if (subtitle.length > 2000) {
            setError(`Te has excedido por ${subtitle.length - 2000} caracteres: ${subtitle.length}/2000`);
            return;
        }

        if (!title.trim() || !dueDate) {
            setError('Escribe un título y selecciona una fecha de entrega.');
            return;
        }

        const date = new Date(`${dueDate}T23:59:00`);
        addTask(courseId, {
            id: crypto.randomUUID(),
            title: title.trim(),
            subtitle: subtitle.trim() || 'Sin descripción',
            dueDate: date.toISOString(),
            hour: date.toLocaleDateString('es-DO', { day: 'numeric', month: 'short' }),
        });

        setTitle('');
        setSubtitle('');
        setDueDate('');
        onClose();
    };

    return { title, setTitle, subtitle, setSubtitle, dueDate, setDueDate, today, error, handleSubmit };
}