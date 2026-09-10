export type MemberSortMode = 'asc' | 'desc' | 'recent';

type MemberSortControlsProps = {
    sortMode: MemberSortMode;
    onSortModeChange: (sortMode: MemberSortMode) => void;
};

const sortOptions: Array<{ value: MemberSortMode; label: string }> = [
    { value: 'asc', label: 'A-Z' },
    { value: 'desc', label: 'Z-A' },
    { value: 'recent', label: 'Más recientes' },
];

export function MemberSortControls({ sortMode, onSortModeChange }: MemberSortControlsProps) {
    return (
        <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold uppercase tracking-[0.12em] text-ink-faint">Ordenar por:</span>
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
