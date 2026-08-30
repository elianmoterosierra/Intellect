import { useState } from 'react';
import { SubjectModal } from '../AddSubjectModal/SubjectModal';

type SubjectButtonProps = {
    courseId: number;
};

export function SubjectButton({ courseId }: SubjectButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} className="flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand px-4 text-sm font-semibold text-brand transition hover:bg-brand-tint">
                <span className="material-symbols-outlined text-lg">menu_book</span>
                Materia
            </button>
            {isOpen && <SubjectModal courseId={courseId} onClose={() => setIsOpen(false)} />}
        </>
    );
}
