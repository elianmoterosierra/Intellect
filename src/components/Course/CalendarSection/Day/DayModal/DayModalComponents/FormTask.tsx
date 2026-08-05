import { useRef } from 'react';

import type { TaskForm } from "../DayModal";

type FormAddTaskProps = {
    form: TaskForm;
    setForm: React.Dispatch<React.SetStateAction<TaskForm>>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    setShowForm: (value: boolean) => void;
};

export function FormAddTask({ form, setForm, handleSubmit, setShowForm }: FormAddTaskProps) {
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 animate-fadeIn" style={{ animationDuration: '0.22s' }}>
            <input
                autoFocus
                type="text"
                placeholder="Título de la tarea…"
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d0d2e8] text-sm text-[#191b23] bg-[#f8f9ff]
                           placeholder-[#9496a8] focus:outline-none focus:ring-2 focus:ring-[#5c6bc0]/30 focus:border-[#5c6bc0] transition-all"
            />
            <textarea
                ref={descriptionRef}
                placeholder="Descripción de la tarea…"
                value={form.description}
                onChange={(e) => {
                    setForm(f => ({ ...f, description: e.target.value }));
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d0d2e8] text-sm text-[#191b23] bg-[#f8f9ff]
                           placeholder-[#9496a8] focus:outline-none focus:ring-2 focus:ring-[#5c6bc0]/30 focus:border-[#5c6bc0]
                           transition-all resize-none max-h-[160px] overflow-y-auto"
                rows={2}
            />

            {form.description.length > 0 && (
                <div className="flex justify-between items-center">
                    <span className={`text-xs transition-all ${
                        form.description.length > 2000
                            ? 'text-red-500 font-semibold'
                            : 'text-[#9496a8]'
                    }`}>
                        {form.description.length}/2000 caracteres
                    </span>
                    {form.description.length > 2000 && (
                        <span className="text-xs text-red-500">
                            Te has excedido por {form.description.length - 2000} caracteres
                        </span>
                    )}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2 rounded-xl border border-[#d0d2e8] text-sm text-[#424754]
                               hover:bg-[#f0f1fb] transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={form.description.length > 2000}
                    className={`flex-1 py-2 rounded-xl text-sm text-white font-semibold transition-all ${
                        form.description.length > 2000
                            ? 'bg-gray-400 opacity-50 cursor-not-allowed'
                            : 'bg-[#0058be] hover:bg-[#0041a8] active:scale-95'
                    }`}
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}