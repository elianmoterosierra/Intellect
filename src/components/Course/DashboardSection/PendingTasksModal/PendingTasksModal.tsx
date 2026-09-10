import { useMemo, useState } from 'react';
import { useModalAnimation } from '../../../../Hooks/useModalAnimation';
import type { TaskWithCompleted } from '../../../../types';
import { getDaysDifference } from '../../../../utils/taskStatus';
import { TaskItem } from '../UpcomingTasks/TaskItem/TaskItem';
import { TaskFilters, type TaskFilter } from './TaskFilters/TaskFilters';

type PendingTasksModalProps = {
    tasks: TaskWithCompleted[];
    courseId: number;
    canManageCourse: boolean;
    onClose: () => void;
};

export function PendingTasksModal({ tasks, courseId, canManageCourse, onClose }: PendingTasksModalProps) {
    const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
    const categorizedTasks = useMemo(() => {
        const pending: TaskWithCompleted[] = [];
        const overdue: TaskWithCompleted[] = [];
        const completed: TaskWithCompleted[] = [];

        tasks.forEach((task) => {
            if (task.completed) {
                completed.push(task);
                return;
            }

            if ((getDaysDifference(task.dueDate) ?? 0) < 0) {
                overdue.push(task);
            } else {
                pending.push(task);
            }
        });

        const byDueDateAscending = (a: TaskWithCompleted, b: TaskWithCompleted) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        const byDueDateDescending = (a: TaskWithCompleted, b: TaskWithCompleted) =>
            byDueDateAscending(b, a);

        pending.sort(byDueDateAscending);
        completed.sort(byDueDateDescending);
        overdue.sort(byDueDateDescending);

        return {
            pending,
            completed,
            overdue,
            all: [...pending, ...completed, ...overdue],
        };
    }, [tasks]);
    const counts = {
        all: tasks.length,
        pending: categorizedTasks.pending.length,
        overdue: categorizedTasks.overdue.length,
        completed: categorizedTasks.completed.length,
    } satisfies Record<TaskFilter, number>;
    const visibleTasks = categorizedTasks[activeFilter];
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
                <div className="flex items-center justify-between gap-3 border-b border-line-soft px-4 py-4 md:gap-4 md:px-6 md:py-5">
                    <div className="text-left">
                        <h3 className="text-base font-bold text-ink md:text-xl">Tareas pendientes</h3>
                        <p className="mt-1 max-w-[220px] text-[11px] leading-4 text-ink-soft md:max-w-none md:text-sm">Organiza tus tareas por estado y fecha.</p>
                    </div>
                    <button type="button" onClick={handleClose} className="material-symbols-outlined rounded-full p-1 text-ink-soft hover:bg-muted" aria-label="Cerrar">close</button>
                </div>

                <div className="border-b border-line-soft px-4 py-3 md:px-6 md:py-4">
                    <TaskFilters activeFilter={activeFilter} counts={counts} onChange={setActiveFilter} />
                </div>

                <ul className="list-none p-0">
                    {visibleTasks.length === 0 ? (
                        <li className="px-4 py-8 text-center text-sm text-ink-soft md:px-6 md:py-10">
                            {activeFilter === 'all' ? 'No tienes tareas.' : 'No hay tareas en este filtro.'}
                        </li>
                    ) : (
                        visibleTasks.map((task) => (
                            <TaskItem key={task.id} task={task} courseId={courseId} canManageCourse={canManageCourse} compact />
                        ))
                    )}
                </ul>

                <div className="flex justify-end border-t border-line-soft px-4 py-3 md:px-6 md:py-4">
                    <button type="button" onClick={handleClose} className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-muted hover:text-ink">Cerrar</button>
                </div>
            </div>
        </div>
    );
}
