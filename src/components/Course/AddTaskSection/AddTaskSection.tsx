import { useState } from 'react';
import { AddTaskButton } from "../DashboardSection/UpcomingTasks/AddTask/AddTaskButton";

import { TaskList } from "./TaskList/TaskList";
import type { TaskSortMode } from './TaskList/TaskList';

type AddTaskSectionProps = {
    courseId: number;
};

export default function AddTaskSection({ courseId }: AddTaskSectionProps) {
    const [sortMode, setSortMode] = useState<TaskSortMode>('recent');
    const sortOptions: Array<{ value: TaskSortMode; label: string }> = [
        { value: 'asc', label: 'A-Z' },
        { value: 'desc', label: 'Z-A' },
        { value: 'recent', label: 'Más recientes' },
    ];

    return (
        <section data-testid="add-task-section" className="min-h-full bg-page p-4 text-left md:p-10">
            <div className="mx-auto max-w-6xl">
                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-ink">Agregar tareas</h2>
                        <p className="mt-1 text-sm text-ink-soft">Las tareas se muestran para todos del curso.</p>
                    </div>
                    <AddTaskButton courseId={courseId} />
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-xs font-bold uppercase tracking-[0.12em] text-ink-faint">Filtrar por:</span>
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setSortMode(option.value)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${sortMode === option.value ? 'border-brand bg-brand text-white' : 'border-line bg-muted text-ink-soft hover:border-brand hover:text-brand'}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <div className="overflow-visible rounded-xl border border-line bg-surface shadow-sm">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-b border-line bg-muted/50 px-4 py-3 text-left sm:px-6">
                        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                            Tarea
                        </h3>
                        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                            Progreso
                        </h3>
                        <h3 className="pr-1 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                            Acciones
                        </h3>
                    </div>

                    <TaskList courseId={courseId} sortMode={sortMode} />
                </div>
            </div>
        </section>
    );
}
