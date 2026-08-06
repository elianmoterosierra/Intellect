import { useRef } from 'react';
import type { FormEvent, RefObject } from 'react';

type AddTaskModalProps = {
    closeModal: () => void;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    titleInputRef: RefObject<HTMLInputElement | null>;
    title: string;
    setTitle: (value: string) => void;
    subtitle: string;
    setSubtitle: (value: string) => void;
    dueDate: string;
    setDueDate: (value: string) => void;
    today: string;
    error: string;
};

export function AddTaskModal({ closeModal, handleSubmit, titleInputRef, title, setTitle, subtitle, setSubtitle, dueDate, setDueDate, today, error }: AddTaskModalProps) {
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-overlayIn"
            onClick={closeModal}
            role="presentation"
        >
            <form
                className="flex flex-col w-full max-w-[500px] max-h-[90vh] overflow-hidden rounded-2xl bg-surface shadow-2xl border border-line-soft animate-fadeIn"
                onSubmit={handleSubmit}
                onClick={(event) => event.stopPropagation()}
            >
                <div
                    className="shrink-0 relative flex items-center gap-5 px-7 py-7 text-white"
                    style={{ background: 'linear-gradient(135deg, #0058be 0%, #2170e4 100%)' }}
                >
                    <span className="text-6xl font-black leading-none tracking-tight">+</span>
                    <div className="flex flex-col">
                        <h3 className="text-xl font-bold leading-6">Nueva tarea</h3>
                        <p className="mt-1 text-sm font-medium text-white/80">Organiza tu próximo pendiente</p>
                    </div>

                    <button
                        type="button"
                        onClick={closeModal}
                        className="absolute right-5 top-5 rounded-full p-1 text-white/75 transition-colors hover:bg-white/15 hover:text-white"
                        aria-label="Cerrar formulario"
                    >
                        <span className="material-symbols-outlined block text-2xl">close</span>
                    </button>
                </div>

                <div className="shrink-0 px-7 py-5 border-b border-line-soft">
                    <p className="text-center text-[15px] text-ink-faint">Completa los datos para guardar tu tarea</p>
                </div>

                <div className="flex-1 overflow-y-auto px-7 py-5">
                    <div className="space-y-3">
                        <input
                            ref={titleInputRef}
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="material o titulo de la clase..."
                            className="w-full rounded-xl border border-line bg-muted px-5 py-3 text-[15px] text-ink outline-none transition-all placeholder:text-ink-faint focus:border-brand focus:ring-2 focus:ring-brand/25"
                            maxLength={30}
                        />

                        <textarea
                            ref={descriptionRef}
                            value={subtitle}
                            onChange={(e) => {
                                setSubtitle(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                            }}
                            placeholder="contenido de la clase..."
                            className="w-full rounded-xl border border-line bg-muted px-5 py-3 text-[15px] text-ink outline-none transition-all placeholder:text-ink-faint focus:border-brand focus:ring-2 focus:ring-brand/25 resize-none max-h-[160px] overflow-y-auto"
                            rows={2}
                        />

                        {(subtitle.length > 0 || error) && (
                            <div className="flex justify-between items-center">
                                <span className={`text-xs transition-all ${subtitle.length > 2000
                                        ? 'text-red-500 font-semibold'
                                        : 'text-ink-faint'
                                    }`}>
                                    {subtitle.length}/2000 caracteres
                                </span>
                                {subtitle.length > 2000 && (
                                    <span className="text-xs text-red-500">
                                        Te has excedido por {subtitle.length - 2000} caracteres
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="relative">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-ink-faint">calendar_month</span>
                            <input
                                type="date"
                                value={dueDate}
                                min={today}
                                onChange={(event) => setDueDate(event.target.value)}
                                className="w-full rounded-xl border border-line bg-muted py-3 pl-11 pr-4 text-[15px] text-ink-soft outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/25"
                            />
                        </div>

                        {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
                    </div>
                </div>

                <div className="shrink-0 flex gap-2 px-7 pb-7">
                    <button type="button" onClick={closeModal} className="flex-1 rounded-xl border border-line py-3 text-[15px] font-medium text-ink-soft transition-colors hover:bg-muted-hover">
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={subtitle.length > 2000}
                        className={`flex-1 rounded-xl py-3 text-[15px] font-bold text-white transition-opacity ${subtitle.length > 2000
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:opacity-90'
                            }`}
                        style={{ backgroundColor: 'rgb(var(--brand-strong))' }}
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    )
}