import type { CourseMemberSummary } from '../../../types';

type MemberTableProps = {
    members: CourseMemberSummary[];
    isLoading: boolean;
    error?: string;
};

function formatCount(count: number): string {
    return new Intl.NumberFormat('es-DO').format(count);
}

export function MemberTable({ members, isLoading, error }: MemberTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse">
                    <thead className="bg-muted">
                        <tr className="border-b border-line text-left text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
                            <th className="px-4 py-3 sm:px-6">Nombre</th>
                            <th className="px-4 py-3 sm:px-6">Email</th>
                            <th className="px-4 py-3 text-center sm:px-6">Tareas completadas</th>
                            <th className="px-4 py-3 text-center sm:px-6">Tareas vencidas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {isLoading && (
                            <tr>
                                <td colSpan={4} className="px-4 py-10 text-center text-sm text-ink-soft">Cargando miembros…</td>
                            </tr>
                        )}
                        {!isLoading && error && (
                            <tr>
                                <td colSpan={4} className="px-4 py-10 text-center text-sm text-red-600">No se pudo cargar la lista de miembros.</td>
                            </tr>
                        )}
                        {!isLoading && !error && members.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-10 text-center text-sm text-ink-soft">Todavía no hay miembros en este curso.</td>
                            </tr>
                        )}
                        {!isLoading && !error && members.map((member) => (
                            <tr key={member.id} className="transition-colors odd:bg-surface even:bg-muted/25 hover:bg-muted">
                                <td className="px-4 py-4 text-sm font-semibold text-ink sm:px-6">{member.name}</td>
                                <td className="px-4 py-4 text-sm text-ink-soft sm:px-6">{member.email}</td>
                                <td className="px-4 py-4 text-center text-sm font-semibold text-emerald-700 sm:px-6">{formatCount(member.completedTasks)}</td>
                                <td className="px-4 py-4 text-center text-sm font-semibold text-red-600 sm:px-6">{formatCount(member.overdueTasks)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
