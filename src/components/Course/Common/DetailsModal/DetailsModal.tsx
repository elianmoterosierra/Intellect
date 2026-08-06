import { useAuthStore } from '../../../../store/AuthStore';
import type { TaskWithCompleted } from '../../../../types';

type DetailsModalProps = {
    task: TaskWithCompleted;
    courseId: number;
    onClose: () => void;
};

export function DetailsModal({ task, courseId, onClose }: DetailsModalProps) {
    const toggleTaskStatus = useAuthStore((state) => state.toggleTaskStatus);
    const user = useAuthStore((state) => state.user);
    const done = user?.taskStatusByCourse?.[courseId]?.[task.id]?.completed ?? false;

    const handleToggle = () => {
        toggleTaskStatus(courseId, task.id);
    };

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-overlayIn"
            onClick={onClose}
            role="presentation"
        >
            <div
                className="w-full max-w-[500px] overflow-hidden rounded-2xl bg-surface shadow-2xl border border-line-soft animate-fadeIn"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header con gradiente, mismo estilo que AddTaskModal */}
                <div
                    className="relative flex items-center gap-5 px-7 py-7 text-white"
                    style={{ background: 'linear-gradient(135deg, #0058be 0%, #2170e4 100%)' }}
                >
                    <span className="material-symbols-outlined text-5xl leading-none">description</span>
                    <div className="flex flex-col">
                        <h3 className="text-xl font-bold leading-6">Detalle de la tarea</h3>
                        <p className="mt-1 text-sm font-medium text-white/80">Información completa del pendiente</p>
                    </div>
                    <span className={`ml-auto rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider transition-all duration-200 ${done ? 'border-white/30 bg-white/15' : 'border-white/30 bg-white/15'}`}>
                        {done ? 'COMPLETADA' : 'PENDIENTE'}
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-5 top-5 rounded-full p-1 text-white/75 transition-colors hover:bg-white/15 hover:text-white"
                        aria-label="Cerrar detalle"
                    >
                        <span className="material-symbols-outlined block text-2xl">close</span>
                    </button>
                </div>

                {/* Título centrado */}
                <div className="px-7 pt-6 pb-2 border-b border-line-soft">
                    <h2 className="text-center text-xl font-bold leading-7 text-ink break-words">
                        {task.title}
                    </h2>
                </div>

                {/* Subtítulo con scroll + fecha */}
                <div className="space-y-4 px-7 py-5">
                    <div className="max-h-40 overflow-y-auto rounded-xl border border-line bg-muted px-5 py-3">
                        <p className="text-[15px] leading-6 text-ink-soft break-words whitespace-pre-wrap">
                            {task.subtitle}
                        </p>
                    </div>

                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-ink-faint">calendar_month</span>
                        <div className="w-full rounded-xl border border-line bg-muted py-3 pl-11 pr-4 text-[15px] text-ink-soft">
                            {task.hour}
                        </div>
                    </div>

                    {/* Marcar como completada */}
                    <button
                        type="button"
                        onClick={handleToggle}
                        className={`flex w-full items-center gap-3 rounded-xl border px-5 py-3 text-left transition-all duration-200 active:scale-[0.98] ${
                            done
                                ? 'border-green-600 bg-green-50 text-green-700'
                                : 'border-line bg-muted text-ink-soft hover:bg-muted-hover'
                        }`}
                    >
                        <span
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                                done ? 'border-green-600 bg-green-600' : 'border-line bg-transparent'
                            }`}
                        >
                            <span className={`material-symbols-outlined text-base transition-all duration-200 ${done ? 'text-white' : 'text-transparent'}`}>
                                check
                            </span>
                        </span>
                        <span className="text-[15px] font-medium">
                            {done ? 'Tarea completada' : 'Marcar como completada'}
                        </span>
                    </button>
                </div>

                {/* Footer con botón cerrar */}
                <div className="flex gap-2 px-7 pb-7">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-line py-3 text-[15px] font-medium text-ink-soft transition-colors hover:bg-muted-hover"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
