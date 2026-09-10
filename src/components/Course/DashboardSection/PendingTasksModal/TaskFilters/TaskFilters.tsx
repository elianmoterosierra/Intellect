export type TaskFilter = 'all' | 'pending' | 'overdue' | 'completed';

type TaskFiltersProps = {
    activeFilter: TaskFilter;
    counts: Record<TaskFilter, number>;
    onChange: (filter: TaskFilter) => void;
};

const filters: Array<{ id: TaskFilter; label: string; activeClass: string }> = [
    { id: 'all', label: 'Todas', activeClass: 'border-brand-ring bg-brand-soft text-brand' },
    { id: 'pending', label: 'Pendientes', activeClass: 'border-amber-300 bg-amber-100 text-amber-900' },
    { id: 'overdue', label: 'Vencidas', activeClass: 'border-danger bg-danger/10 text-danger' },
    { id: 'completed', label: 'Completadas', activeClass: 'border-emerald-300 bg-emerald-100 text-emerald-900' },
];

export function TaskFilters({ activeFilter, counts, onChange }: TaskFiltersProps) {
    return (
        <div className="flex flex-wrap gap-2 pb-1 sm:flex-nowrap sm:overflow-x-auto" aria-label="Filtrar tareas">
            {filters.map((filter) => {
                const isActive = activeFilter === filter.id;

                return (
                    <button
                        key={filter.id}
                        type="button"
                        onClick={() => onChange(filter.id)}
                        aria-pressed={isActive}
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1.5 text-[10px] font-semibold transition-colors duration-150 sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs ${
                            isActive
                                ? filter.activeClass
                                : 'border-line-soft bg-muted text-ink-soft hover:bg-muted-hover hover:text-ink'
                        }`}
                    >
                        {filter.label}
                        <span className="rounded-full bg-ink/10 px-1.5 py-0.5 text-[10px] leading-none">
                            {counts[filter.id]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
