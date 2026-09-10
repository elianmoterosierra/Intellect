import type { Subject, SubjectColor } from '../../../types';

type SubjectTableProps = {
    subjects: Subject[];
    onEdit: (subject: Subject) => void;
    onDelete: (subject: Subject) => void;
};

const colorClasses: Record<SubjectColor, string> = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    pink: 'bg-pink-500',
    yellow: 'bg-yellow-400',
    green: 'bg-green-600',
    orange: 'bg-orange-500',
};

const weekdayLabels = {
    monday: 'Lun',
    tuesday: 'Mar',
    wednesday: 'Mié',
    thursday: 'Jue',
    friday: 'Vie',
} as const;

export function SubjectTable({ subjects, onEdit, onDelete }: SubjectTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                    <thead className="bg-muted">
                        <tr className="border-b border-line text-left text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
                            <th className="w-14 px-4 py-3">Color</th>
                            <th className="px-4 py-3">Materia</th>
                            <th className="px-4 py-3">Profesor</th>
                            <th className="px-4 py-3">Horario</th>
                            <th className="w-28 px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {subjects.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-sm text-ink-soft">Todavía no hay materias en este curso.</td>
                            </tr>
                        ) : subjects.map((subject) => (
                            <tr key={subject.id} className="transition-colors odd:bg-surface even:bg-muted/25 hover:bg-muted">
                                <td className="px-4 py-4">
                                    <span className={`block h-3 w-3 rounded-full ${colorClasses[subject.color]}`} aria-label={`Color ${subject.color}`} />
                                </td>
                                <td className="px-4 py-4 text-sm font-semibold text-ink">{subject.name}</td>
                                <td className="px-4 py-4 text-sm text-ink-soft">{subject.teacher}</td>
                                <td className="px-4 py-4 text-xs text-ink-soft">
                                    <span className="material-symbols-outlined mr-1 align-middle text-sm text-brand">schedule</span>
                                    {subject.schedules.map((schedule) => `${weekdayLabels[schedule.weekday]} ${schedule.startTime}–${schedule.endTime}`).join(' · ')}
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(subject)}
                                        className="material-symbols-outlined rounded-full p-2 text-ink-soft transition-colors hover:bg-brand-tint hover:text-brand"
                                        aria-label={`Editar ${subject.name}`}
                                        title="Editar materia"
                                    >
                                        edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(subject)}
                                        className="material-symbols-outlined rounded-full p-2 text-red-500 transition-colors hover:bg-red-500/10"
                                        aria-label={`Eliminar ${subject.name}`}
                                        title="Eliminar materia"
                                    >
                                        delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
