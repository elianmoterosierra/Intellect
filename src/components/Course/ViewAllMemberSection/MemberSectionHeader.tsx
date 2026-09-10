type MemberSectionHeaderProps = {
    memberCount: number;
};

export function MemberSectionHeader({ memberCount }: MemberSectionHeaderProps) {
    return (
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-ink">Ver miembros</h2>
                <p className="mt-1 text-sm text-ink-soft">Consulta los miembros del curso y su progreso académico.</p>
            </div>
            <div className="rounded-xl border border-line bg-surface px-4 py-3 text-left shadow-sm">
                <span className="block text-xs font-bold uppercase tracking-[0.12em] text-ink-faint">Miembros</span>
                <span className="mt-1 block text-2xl font-bold leading-none text-brand">{memberCount}</span>
            </div>
        </div>
    );
}
