import { useMemo, useState } from 'react';
import { EMPTY_SUBJECTS, useSubjectStore } from '../../../store/subjectStorage';
import type { Subject } from '../../../types';
import { ConfirmDeleteSubject } from './ConfirmDeleteSubject';
import { SubjectEditModal } from './SubjectEditModal';
import { SubjectSectionHeader } from './SubjectSectionHeader';
import { SubjectSortControls, type SubjectSortMode } from './SubjectSortControls';
import { SubjectTable } from './SubjectTable';

type ManageSubjectsSectionProps = {
    courseId: number;
};

export default function ManageSubjectsSection({ courseId }: ManageSubjectsSectionProps) {
    const subjects = useSubjectStore((state) => state.subjectsByCourse[String(courseId)] ?? EMPTY_SUBJECTS);
    const [sortMode, setSortMode] = useState<SubjectSortMode>('recent');
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

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
                <SubjectSectionHeader courseId={courseId} />
                <SubjectSortControls sortMode={sortMode} onSortModeChange={setSortMode} />
                <SubjectTable
                    subjects={orderedSubjects}
                    onEdit={setEditingSubject}
                    onDelete={setDeletingSubject}
                />
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
