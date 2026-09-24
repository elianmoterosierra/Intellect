import { useMemo, useState } from 'react';
import { useModalAnimation } from '../../../../Hooks/useModalAnimation';
import { EMPTY_SUBJECTS, useSubjectStore } from '../../../../store/subjectStorage';
import { useTaskStore } from '../../../../store/taskStorage';
import { getSubjectDateOptions, type SubjectDateOption } from '../../../../utils/subjectSchedule';
import type { Subject, TaskWithCompleted } from '../../../../types';

type TaskEditProps = {
    task: TaskWithCompleted;
    courseId: number;
    onClose: () => void;
};

function getDateValue(isoDate: string): string {
    const date = new Date(isoDate);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

function getDateLabel(dateValue: string): string {
    const date = new Date(`${dateValue}T12:00:00`);
    const label = date.toLocaleDateString('es-DO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    return label.charAt(0).toUpperCase() + label.slice(1);
}

function addCurrentDateOption(options: SubjectDateOption[], currentDate: string): SubjectDateOption[] {
    if (!currentDate || options.some((option) => option.value === currentDate)) return options;
    return [{ value: currentDate, label: `${getDateLabel(currentDate)} (actual)` }, ...options];
}

export function TaskEdit({ task, courseId, onClose }: TaskEditProps) {
    const updateTask = useTaskStore((state) => state.updateTask);
    const subjects = useSubjectStore((state) => state.subjectsByCourse[String(courseId)] ?? EMPTY_SUBJECTS);
    const [title, setTitle] = useState(task.title);
    const [subtitle, setSubtitle] = useState(task.subtitle);
    const [subjectId, setSubjectId] = useState(task.subjectId ?? '');
    const [dueDate, setDueDate] = useState(getDateValue(task.dueDate));
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const selectedSubject = subjects.find((subject) => subject.id === subjectId) ?? null;
    const availableDates = useMemo(
        () => addCurrentDateOption(getSubjectDateOptions(selectedSubject), dueDate),
        [selectedSubject, dueDate],
    );
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

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSubmitting) return;

        const trimmedTitle = title.trim();
        const trimmedSubtitle = subtitle.trim();

        if (!trimmedTitle || !trimmedSubtitle || !subjectId || !dueDate) {
            setError('Completa el título, el contenido, la materia y el día de entrega.');
            return;
        }

        if (subtitle.length > 2000) {
            setError(`Te has excedido por ${subtitle.length - 2000} caracteres.`);
            return;
        }

        setIsSubmitting(true);
        const date = new Date(`${dueDate}T23:59:00`);
        const saved = await updateTask(courseId, {
            ...task,
            title: trimmedTitle,
            subtitle: trimmedSubtitle,
            subjectId,
            dueDate: date.toISOString(),
            hour: date.toLocaleDateString('es-DO', { day: 'numeric', month: 'short' }),
        });
        setIsSubmitting(false);

        if (!saved) {
            setError('No se pudo actualizar la tarea. Inténtalo nuevamente.');
            return;
        }

        handleClose();
    }

    return (
        <div
            className={`fixed inset-0 z-[220] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm ${overlayClass}`}
            onClick={(event) => { if (event.target === event.currentTarget) handleClose(); }}
            style={animationStyle}
        >
            <form
                onSubmit={handleSubmit}
                onClick={(event) => event.stopPropagation()}
                className={`flex w-full max-w-[500px] max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-2xl ${modalClass}`}
                style={animationStyle}
            >
                <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line-soft bg-muted px-6 py-5 text-left">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Editar tarea</p>
                        <h3 className="mt-1 text-xl font-bold text-ink">Actualiza los datos</h3>
                    </div>
                    <button type="button" onClick={handleClose} className="material-symbols-outlined rounded-full p-1 text-ink-soft hover:bg-muted-strong" aria-label="Cerrar">close</button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                    <div className="flex flex-col gap-4 text-left">
                        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
                            Título
                            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={50} className="rounded-xl border border-line bg-muted px-4 py-3 text-base text-ink outline-none focus:border-brand md:text-sm" />
                        </label>

                        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
                            Contenido
                            <textarea value={subtitle} onChange={(event) => setSubtitle(event.target.value)} maxLength={2100} rows={3} className="resize-y rounded-xl border border-line bg-muted px-4 py-3 text-base text-ink outline-none focus:border-brand md:text-sm" />
                            <span className={`text-right text-xs font-normal ${subtitle.length > 2000 ? 'text-red-500' : 'text-ink-faint'}`}>{subtitle.length}/2000</span>
                        </label>

                        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
                            Materia
                            <select required value={subjectId} onChange={(event) => { setSubjectId(event.target.value); setDueDate(''); }} className="rounded-xl border border-line bg-muted px-4 py-3 text-base text-ink outline-none focus:border-brand md:text-sm">
                                <option value="">Selecciona una materia</option>
                                {subjects.map((subject: Subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
                            Día de entrega
                            <select required disabled={!subjectId} value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="rounded-xl border border-line bg-muted px-4 py-3 text-base text-ink outline-none focus:border-brand disabled:cursor-not-allowed disabled:opacity-60 md:text-sm">
                                <option value="">{subjectId ? 'Selecciona el día de entrega' : 'Selecciona primero una materia'}</option>
                                {availableDates.map((date) => <option key={date.value} value={date.value}>{date.label}</option>)}
                            </select>
                        </label>

                        {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}
                    </div>
                </div>

                <div className="flex shrink-0 gap-3 border-t border-line-soft px-6 py-4">
                    <button type="button" onClick={handleClose} className="flex-1 rounded-xl border border-line py-3 text-sm font-semibold text-ink-soft hover:bg-muted">Cancelar</button>
                    <button type="submit" disabled={isSubmitting || subtitle.length > 2000} className="flex-1 rounded-xl bg-brand-strong py-3 text-sm font-semibold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? 'Guardando...' : 'Guardar cambios'}</button>
                </div>
            </form>
        </div>
    );
}
