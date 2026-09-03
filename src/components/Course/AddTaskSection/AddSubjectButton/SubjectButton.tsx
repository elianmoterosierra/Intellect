import { useState } from 'react';
import { SubjectModal } from '../AddSubjectModal/SubjectModal';

type SubjectButtonProps = {
    courseId: number;
    label?: string;
};

export function SubjectButton({ courseId, label = 'Materia' }: SubjectButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} className="flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand px-4 text-sm font-semibold text-brand transition hover:bg-brand-tint">
                <span className="material-symbols-outlined text-lg">add</span>
                {label}
            </button>
            {isOpen && <SubjectModal courseId={courseId} onClose={() => setIsOpen(false)} />}
        </>
    );
}
