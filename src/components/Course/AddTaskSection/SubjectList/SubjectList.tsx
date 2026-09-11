import { EMPTY_SUBJECTS, useSubjectStore } from '../../../../store/subjectStorage';
import type { SubjectColor } from '../../../../types';

type SubjectListProps = {
    courseId: number;
};

const colorClasses: Record<SubjectColor, string> = {
    blue: 'subject-color-blue',
    purple: 'subject-color-purple',
    pink: 'subject-color-pink',
    yellow: 'subject-color-yellow',
    green: 'subject-color-green',
    orange: 'subject-color-orange',
    red: 'subject-color-red',
    gray: 'subject-color-gray',
    white: 'subject-color-white',
};

const weekdayLabels = {
    monday: 'Lun',
    tuesday: 'Mar',
    wednesday: 'Mié',
    thursday: 'Jue',
    friday: 'Vie',
} as const;

export function SubjectList({ courseId }: SubjectListProps) {
    const subjects = useSubjectStore((state) => state.subjectsByCourse[String(courseId)] ?? EMPTY_SUBJECTS);
    const deleteSubject = useSubjectStore((state) => state.deleteSubject);

    if (subjects.length === 0) {
        return <p className="px-4 py-6 text-center text-sm text-ink-soft">Todavía no hay materias en este curso.</p>;
    }

    return (
        <ul className="divide-y divide-line">
            {subjects.map((subject) => (
                <li key={subject.id} className="flex items-start gap-3 px-4 py-3">
                    <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${colorClasses[subject.color]}`} />
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-ink">{subject.name}</p>
                        <p className="text-xs text-ink-soft">{subject.teacher}</p>
                        <p className="mt-1 text-xs text-ink-faint">
                            {subject.schedules.map((schedule) => `${weekdayLabels[schedule.weekday]} ${schedule.startTime}–${schedule.endTime}`).join(' · ')}
                        </p>
                    </div>
                    <button type="button" onClick={() => { if (window.confirm(`¿Eliminar ${subject.name}?`)) deleteSubject(courseId, subject.id); }} className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Eliminar</button>
                </li>
            ))}
        </ul>
    );
}
