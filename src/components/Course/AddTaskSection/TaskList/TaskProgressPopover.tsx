import { useEffect, useRef, useState } from 'react';
import { useTaskProgressStore } from '../../../../store/taskProgressStorage';
import type { TaskProgressUser } from '../../../../types';

type ProgressKind = 'completed' | 'pending';

type TaskProgressPopoverProps = {
    courseId: number;
    taskId: string;
    kind: ProgressKind;
};

const COPY: Record<ProgressKind, { label: string; empty: string; color: string }> = {
    completed: {
        label: 'Completaron',
        empty: 'Nadie ha marcado esta tarea como completada.',
        color: 'text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50',
    },
    pending: {
        label: 'Pendientes',
        empty: 'Todos los usuarios han completado esta tarea.',
        color: 'text-amber-700 hover:border-amber-300 hover:bg-amber-50',
    },
};

export function TaskProgressPopover({ courseId, taskId, kind }: TaskProgressPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const fetchTaskProgress = useTaskProgressStore((state) => state.fetchTaskProgress);
    const progress = useTaskProgressStore((state) => state.progressByTask[`${courseId}:${taskId}`]);
    const isLoading = useTaskProgressStore((state) => state.loadingByTask[`${courseId}:${taskId}`] ?? false);
    const error = useTaskProgressStore((state) => state.errorByTask[`${courseId}:${taskId}`]);
    const copy = COPY[kind];
    const users: TaskProgressUser[] = kind === 'completed'
        ? progress?.completedUsers ?? []
        : progress?.pendingUsers ?? [];
    const count = kind === 'completed'
        ? progress?.completedCount ?? 0
        : progress?.pendingCount ?? 0;
    const total = progress?.total ?? 0;

    useEffect(() => {
        function handlePointerDown(event: PointerEvent) {
            if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') setIsOpen(false);
        }

        if (!isOpen) return undefined;
        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    async function togglePopover() {
        if (isOpen) {
            setIsOpen(false);
            return;
        }

        setIsOpen(true);
        await fetchTaskProgress(courseId, taskId, true);
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    void togglePopover();
                }}
                className={`rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-semibold transition-colors ${copy.color}`}
                aria-expanded={isOpen}
                aria-label={`${copy.label}: ${count} de ${total}`}
            >
                {count}/{total}
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label={`${copy.label} de la tarea`}
                    className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-line bg-surface p-3 text-left shadow-xl"
                    onClick={(event) => event.stopPropagation()}
                >
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">
                        {copy.label}
                    </p>
                    {isLoading && <p className="text-sm text-ink-soft">Cargando usuarios…</p>}
                    {!isLoading && error && <p className="text-sm text-red-600">No se pudo cargar la lista.</p>}
                    {!isLoading && !error && users.length === 0 && <p className="text-sm text-ink-soft">{copy.empty}</p>}
                    {!isLoading && !error && users.length > 0 && (
                        <ul className="max-h-48 space-y-1 overflow-y-auto">
                            {users.map((user) => (
                                <li key={user.id} className="rounded-md px-2 py-1.5 text-sm text-ink hover:bg-muted">
                                    {user.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
