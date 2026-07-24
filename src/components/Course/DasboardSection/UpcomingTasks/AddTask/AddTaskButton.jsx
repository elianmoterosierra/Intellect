import { useEffect, useRef, useState } from 'react';
import { useTaskStore } from '../../../../../store/taskStorage';
import { AddTaskModal } from '../AddTaskModal/TaskModal';

function getTodayInputValue() {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function AddTaskButton({ courseId }) {
    const addTask = useTaskStore((state) => state.addTask);
    const titleInputRef = useRef(null);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');
    const today = getTodayInputValue();

    const closeModal = () => {
        setShowForm(false);
        setError('');
    };

    useEffect(() => {
        if (!showForm) return undefined;

        titleInputRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') closeModal();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showForm]);

    const handleSubmit = (event) => {
        event.preventDefault();

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
        closeModal();
    };

    return (
        <>
            <button
                type="button"
                className="flex items-center justify-center gap-2 py-4 bg-transparent  border-[2px] border-[#0058be] rounded-lg w-48 h-12 text-[#0058be] text-sm font-semibold cursor-pointer transition-all duration-200 hover:scale-110 hover:border-[3px] "
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
