import { useMemo } from 'react';
import { useModalAnimation } from '../../../../Hooks/useModalAnimation';
import type { TaskWithCompleted } from '../../../../types';
import { TaskItem } from '../UpcomingTasks/TaskItem/TaskItem';

type PendingTasksModalProps = {
    tasks: TaskWithCompleted[];
    courseId: number;
    canManageCourse: boolean;
    onClose: () => void;
};

export function PendingTasksModal({ tasks, courseId, canManageCourse, onClose }: PendingTasksModalProps) {
    const pendingTasks = useMemo(
        () => tasks
            .filter((task) => !task.completed)
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
        [tasks],
    );
    const { handleClose, overlayClass, modalClass, animationStyle } = useModalAnimation({
        onClose,
        duration: 260,
        enterModalClass: 'animate-fadeIn',
        exitModalClass: 'animate-modalOut',
    });

    return (
        <div
            className={`fixed inset-0 z-[220] flex items-center justify-center bg-black/50 p-4 ${overlayClass}`}
            onClick={(event) => { if (event.target === event.currentTarget) handleClose(); }}
            style={animationStyle}
        >
            <div
                className={`subject-modal-scroll flex max-h-[85vh] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl border border-line-soft bg-surface shadow-2xl ${modalClass}`}
                onClick={(event) => event.stopPropagation()}
                style={animationStyle}
            >
                <div className="flex items-center justify-between gap-4 border-b border-line-soft px-6 py-5">
                    <div className="text-left">
                        <h3 className="text-xl font-bold text-ink">Tareas pendientes</h3>
                        <p className="mt-1 text-sm text-ink-soft">Todas las tareas que aún tienes por completar.</p>
                    </div>
                    <button type="button" onClick={handleClose} className="material-symbols-outlined rounded-full p-1 text-ink-soft hover:bg-muted" aria-label="Cerrar">close</button>
                </div>

                <ul className="list-none p-0">
                    {pendingTasks.length === 0 ? (
                        <li className="px-6 py-10 text-center text-sm text-ink-soft">No tienes tareas pendientes.</li>
                    ) : (
                        pendingTasks.map((task) => (
                            <TaskItem key={task.id} task={task} courseId={courseId} canManageCourse={canManageCourse} />
                        ))
                    )}
                </ul>

                <div className="flex justify-end border-t border-line-soft px-6 py-4">
                    <button type="button" onClick={handleClose} className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-muted hover:text-ink">Cerrar</button>
                </div>
            </div>
        </div>
    );
}
