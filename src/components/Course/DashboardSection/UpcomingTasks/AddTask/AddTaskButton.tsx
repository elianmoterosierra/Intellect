import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useTaskStore } from '../../../../../store/taskStorage';
import { AddTaskModal } from '../AddTaskModal/TaskModal';

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

        const date = new Date(`${dueDate}T23:59:00`);
        setIsSubmitting(true);
        const saved = await addTask(courseId, {
            id: crypto.randomUUID(),
            title: title.trim(),
            subtitle: subtitle.trim(),
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
        setDueDate('');
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
                <AddTaskModal closeModal={closeModal} handleSubmit={handleSubmit} titleInputRef={titleInputRef} title={title} setTitle={setTitle} subtitle={subtitle} setSubtitle={setSubtitle} dueDate={dueDate} setDueDate={setDueDate} today={today} error={error} />
            )}
        </>
    );
}
