import { useMemo, useState } from 'react';
import { SubjectButton } from '../AddTaskSection/AddSubjectButton/SubjectButton';
import { SubjectEditModal } from './SubjectEditModal';
import { ConfirmDeleteSubject } from './ConfirmDeleteSubject';
import { EMPTY_SUBJECTS, useSubjectStore } from '../../../store/subjectStorage';
import type { SubjectColor } from '../../../types';

type ManageSubjectsSectionProps = {
    courseId: number;
};

type SortMode = 'asc' | 'desc' | 'recent';

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

const sortOptions: Array<{ value: SortMode; label: string }> = [
    { value: 'asc', label: 'A-Z' },
    { value: 'desc', label: 'Z-A' },
    { value: 'recent', label: 'Más recientes' },
];

export default function ManageSubjectsSection({ courseId }: ManageSubjectsSectionProps) {
    const subjects = useSubjectStore((state) => state.subjectsByCourse[String(courseId)] ?? EMPTY_SUBJECTS);
    const [sortMode, setSortMode] = useState<SortMode>('recent');
    const [editingSubject, setEditingSubject] = useState<typeof subjects[number] | null>(null);
    const [deletingSubject, setDeletingSubject] = useState<typeof subjects[number] | null>(null);

    const orderedSubjects = useMemo(() => {
        const sorted = [...subjects];
        if (sortMode === 'recent') {
            sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else {
            sorted.sort((a, b) => {
                const result = a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
                return sortMode === 'asc' ? result : -result;
            });
        }
        return sorted;
    }, [sortMode, subjects]);

    return (
        <section className="min-h-full bg-page p-4 text-left md:p-10">
            <div className="mx-auto max-w-6xl">
                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-ink">Gestionar materias</h2>
                        <p className="mt-1 text-sm text-ink-soft">Organiza las materias y sus horarios recurrentes.</p>
                    </div>
                    <SubjectButton courseId={courseId} label="Agregar materia" />
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
                                {orderedSubjects.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-ink-soft">Todavía no hay materias en este curso.</td>
                                    </tr>
                                ) : orderedSubjects.map((subject) => (
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
                                                onClick={() => setEditingSubject(subject)}
                                                className="material-symbols-outlined rounded-full p-2 text-ink-soft transition-colors hover:bg-brand-tint hover:text-brand"
                                                aria-label={`Editar ${subject.name}`}
                                                title="Editar materia"
                                            >
                                                edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeletingSubject(subject)}
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
            </div>
            {editingSubject && (
                <SubjectEditModal
                    courseId={courseId}
                    subject={editingSubject}
                    onClose={() => setEditingSubject(null)}
                />
            )}
            {deletingSubject && (
                <ConfirmDeleteSubject
                    courseId={courseId}
                    subject={deletingSubject}
                    onClose={() => setDeletingSubject(null)}
                />
            )}
        </section>
    );
}
