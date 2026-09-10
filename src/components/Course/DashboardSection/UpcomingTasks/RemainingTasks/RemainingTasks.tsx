type RemainingTasksProps = {
    count: number;
};

export function RemainingTasks({ count }: RemainingTasksProps) {
    if (count <= 0) return null;

    return (
        <span
            className="inline-flex min-w-6 items-center justify-center rounded-full bg-danger px-2 py-1 text-[11px] font-bold tracking-normal text-white shadow-sm"
            aria-label={`${count} tareas pendientes adicionales`}
        >
            +{count}
        </span>
    );
}
