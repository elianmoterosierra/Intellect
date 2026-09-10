export type SubjectSortMode = 'asc' | 'desc' | 'recent';

type SubjectSortControlsProps = {
    sortMode: SubjectSortMode;
    onSortModeChange: (sortMode: SubjectSortMode) => void;
};

const sortOptions: Array<{ value: SubjectSortMode; label: string }> = [
    { value: 'asc', label: 'A-Z' },
    { value: 'desc', label: 'Z-A' },
    { value: 'recent', label: 'Más recientes' },
];

export function SubjectSortControls({ sortMode, onSortModeChange }: SubjectSortControlsProps) {
    return (
        <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold uppercase tracking-[0.12em] text-ink-faint">Filtrar por:</span>
            {sortOptions.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onSortModeChange(option.value)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${sortMode === option.value ? 'border-brand bg-brand text-white' : 'border-line bg-muted text-ink-soft hover:border-brand hover:text-brand'}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
