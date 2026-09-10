import { useRef } from 'react';
import { TIME_SLOTS } from '../../../../../../utils/taskSchedule';

import type { TaskForm } from "../DayModal";

type FormAddTaskProps = {
    form: TaskForm;
    setForm: React.Dispatch<React.SetStateAction<TaskForm>>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    setShowForm: (value: boolean) => void;
    error: string;
};

export function FormAddTask({ form, setForm, handleSubmit, setShowForm, error }: FormAddTaskProps) {
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3" >
            <input

                type="text"
                placeholder="Título de la tarea…"
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-line-soft text-base md:text-sm text-ink bg-muted
                           placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
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
                className="w-full px-4 py-2.5 rounded-xl border border-line-soft text-base md:text-sm text-ink bg-muted
                           placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
                           transition-all resize-none max-h-[160px] overflow-y-auto"
                rows={2}
            />

            <div className="grid grid-cols-2 gap-2">
                <select required value={form.startTime} onChange={(e) => setForm(f => ({ ...f, startTime: e.target.value, endTime: TIME_SLOTS.find((slot) => slot.start === e.target.value)?.end ?? '' }))} className="w-full rounded-xl border border-line-soft bg-muted px-3 py-2.5 text-base md:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30">
                    <option value="">Inicio</option>
                    {TIME_SLOTS.map((slot) => <option key={slot.start} value={slot.start}>{slot.start}</option>)}
                </select>
                <select required value={form.endTime} onChange={(e) => setForm(f => ({ ...f, endTime: e.target.value }))} className="w-full rounded-xl border border-line-soft bg-muted px-3 py-2.5 text-base md:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30">
                    <option value="">Fin</option>
                    {TIME_SLOTS.filter((slot) => slot.start === form.startTime).map((slot) => <option key={slot.end} value={slot.end}>{slot.end}</option>)}
                </select>
            </div>

            {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
                    {error}
                </p>
            )}

            {form.description.length > 0 && (
                <div className="flex justify-between items-center">
                    <span className={`text-xs transition-all ${form.description.length > 2000
                        ? 'text-red-500 font-semibold'
                        : 'text-ink-faint'
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
                    className="flex-1 py-2 rounded-xl border border-line-soft text-sm text-ink-soft
                               hover:bg-muted-hover transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={form.description.length > 2000}
                    className={`flex-1 py-2 rounded-xl text-sm text-white font-semibold transition-all ${form.description.length > 2000
                        ? 'bg-gray-400 opacity-50 cursor-not-allowed'
                        : 'bg-brand-strong hover:bg-brand-hover active:scale-95'
                        }`}
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}
