import { SubjectButton } from '../AddTaskSection/AddSubjectButton/SubjectButton';

type SubjectSectionHeaderProps = {
    courseId: number;
};

export function SubjectSectionHeader({ courseId }: SubjectSectionHeaderProps) {
    return (
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-ink">Gestionar materias</h2>
                <p className="mt-1 text-sm text-ink-soft">Organiza las materias y sus horarios recurrentes.</p>
            </div>
            <SubjectButton courseId={courseId} label="Agregar materia" />
        </div>
    );
}
