import { useState } from 'react';
import { useModalAnimation } from '../../../Hooks/useModalAnimation';
import { useSubjectStore } from '../../../store/subjectStorage';
import type { Subject } from '../../../types';

type ConfirmDeleteSubjectProps = {
    courseId: number;
    subject: Subject;
    onClose: () => void;
};

export function ConfirmDeleteSubject({ courseId, subject, onClose }: ConfirmDeleteSubjectProps) {
    const deleteSubject = useSubjectStore((state) => state.deleteSubject);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');
    const {
        handleClose,
        overlayClass,
        modalClass,
        animationStyle,
    } = useModalAnimation({
        onClose,
        duration: 260,
        enterModalClass: 'animate-fadeIn',
        exitModalClass: 'animate-modalOut',
    });

    async function confirmDelete() {
        if (isDeleting) return;

        setIsDeleting(true);
        const deleted = await deleteSubject(courseId, subject.id);
        setIsDeleting(false);

        if (!deleted) {
            setError('No se pudo eliminar la materia. Inténtalo nuevamente.');
            return;
        }

        handleClose();
    }

    return (
        <div
            className={`fixed inset-0 z-[230] flex items-center justify-center bg-black/60 p-4 ${overlayClass}`}
            onClick={(event) => { if (event.target === event.currentTarget) handleClose(); }}
            style={animationStyle}
            role="presentation"
        >
            <div
                className={`w-full max-w-[380px] rounded-xl border border-line bg-muted p-6 shadow-2xl ${modalClass}`}
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-subject-title"
                style={animationStyle}
            >
                <div className="relative mb-2">
                    <h3 id="delete-subject-title" className="pr-8 text-lg font-semibold text-ink">¿Eliminar materia?</h3>
                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Cerrar"
                        className="material-symbols-outlined absolute right-0 top-0 rounded-full text-ink hover:bg-muted-strong"
                    >
                        close
                    </button>
                </div>
                <p className="mb-2 text-sm leading-[1.5] text-ink-soft">
                    Se eliminará <strong className="text-ink">{subject.name}</strong> junto con sus horarios.
                </p>
                <p className="mb-6 text-sm leading-[1.5] text-ink-soft">Esta acción no se puede deshacer.</p>

                {error && <p className="mb-4 rounded-lg bg-danger px-3 py-2 text-sm text-white">{error}</p>}

                <div className="flex gap-5 justify-center">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isDeleting}
                        className="rounded-lg bg-muted-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-muted-strong-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={() => void confirmDelete()}
                        disabled={isDeleting}
                        className="rounded-lg bg-danger px-5 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
