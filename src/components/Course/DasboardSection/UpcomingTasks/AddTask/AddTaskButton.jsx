import { useEffect, useRef, useState } from 'react';
import { useTaskStore } from '../../../../../store/taskStorage';

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
                className="flex items-center justify-center gap-2 w-full py-4 bg-transparent border-none border-t border-[#c2c6d6] text-[#0058be] text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#f2f3fd]"
                onClick={() => setShowForm(true)}
            >
                <span className="material-symbols-outlined text-lg">add</span>
                Nueva tarea
            </button>

            {showForm && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-overlayIn"
                    onClick={closeModal}
                    role="presentation"
                >
                    <form
                        className="w-full max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#e2e3f0] animate-fadeIn"
                        onSubmit={handleSubmit}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div
                            className="relative flex items-center gap-5 px-7 py-7 text-white"
                            style={{ background: 'linear-gradient(135deg, #0058be 0%, #2170e4 100%)' }}
                        >
                            <span className="text-6xl font-black leading-none tracking-tight">+</span>
                            <div className="flex flex-col">
                                <h3 className="text-xl font-bold leading-6">Nueva tarea</h3>
                                <p className="mt-1 text-sm font-medium text-white/80">Organiza tu próximo pendiente</p>
                            </div>
                            <span className="ml-auto rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-bold tracking-wider">PENDIENTE</span>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="absolute right-5 top-5 rounded-full p-1 text-white/75 transition-colors hover:bg-white/15 hover:text-white"
                                aria-label="Cerrar formulario"
                            >
                                <span className="material-symbols-outlined block text-2xl">close</span>
                            </button>
                        </div>

                        <div className="px-7 py-5 border-b border-[#edf0fa]">
                            <p className="text-center text-[15px] text-[#9298af]">Completa los datos para guardar tu tarea</p>
                        </div>

                        <div className="space-y-3 px-7 py-5">
                            <input
                                ref={titleInputRef}
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="Título de la tarea..."
                                className="w-full rounded-xl border border-[#cdd3e9] bg-[#f9faff] px-5 py-3 text-[15px] text-[#191b23] outline-none transition-all placeholder:text-[#989db1] focus:border-[#536fdb] focus:ring-2 focus:ring-[#536fdb]/25"
                                maxLength={100}
                            />

                            <input
                                value={subtitle}
                                onChange={(event) => setSubtitle(event.target.value)}
                                placeholder="Descripción de la tarea..."
                                className="w-full rounded-xl border border-[#cdd3e9] bg-[#f9faff] px-5 py-3 text-[15px] text-[#191b23] outline-none transition-all placeholder:text-[#989db1] focus:border-[#536fdb] focus:ring-2 focus:ring-[#536fdb]/25"
                                maxLength={200}
                            />

                            <div className="relative">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#67708d]">calendar_month</span>
                                <input
                                    type="date"
                                    value={dueDate}
                                    min={today}
                                    onChange={(event) => setDueDate(event.target.value)}
                                    className="w-full rounded-xl border border-[#cdd3e9] bg-[#f9faff] py-3 pl-11 pr-4 text-[15px] text-[#424754] outline-none transition-all focus:border-[#536fdb] focus:ring-2 focus:ring-[#536fdb]/25"
                                />
                            </div>

                            {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
                        </div>

                        <div className="flex gap-2 px-7 pb-7">
                            <button type="button" onClick={closeModal} className="flex-1 rounded-xl border border-[#cdd3e9] py-3 text-[15px] font-medium text-[#424754] transition-colors hover:bg-[#f3f5fc]">
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 rounded-xl py-3 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
                                style={{ backgroundColor: '#0960ca' }}
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
