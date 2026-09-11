import { useMemo, useState } from 'react';
import { getTimeOptionsAfter, rangesOverlap, TIME_SLOTS } from '../../../../utils/taskSchedule';
import { EMPTY_SUBJECTS, useSubjectStore } from '../../../../store/subjectStorage';
import { hasSubjectScheduleConflict } from '../../../../utils/subjectSchedule';
import { isGoogleMeetUrl } from '../../../../utils/meetingLink';
import { useModalAnimation } from '../../../../Hooks/useModalAnimation';
import { capitalizePersonName, capitalizeSubjectName } from '../../../../utils/subjectName';
import type { Subject, SubjectColor, SubjectSchedule, SubjectWeekday } from '../../../../types';

type SubjectModalProps = {
    courseId: number;
    onClose: () => void;
    subject?: Subject;
};

const WEEKDAYS: Array<{ value: SubjectWeekday; label: string }> = [
    { value: 'monday', label: 'Lunes' },
    { value: 'tuesday', label: 'Martes' },
    { value: 'wednesday', label: 'Miércoles' },
    { value: 'thursday', label: 'Jueves' },
    { value: 'friday', label: 'Viernes' },
];

const COLORS: Array<{ value: SubjectColor; label: string; className: string }> = [
    { value: 'blue', label: 'Azul', className: 'subject-color-blue' },
    { value: 'purple', label: 'Morado', className: 'subject-color-purple' },
    { value: 'pink', label: 'Rosado', className: 'subject-color-pink' },
    { value: 'yellow', label: 'Amarillo', className: 'subject-color-yellow' },
    { value: 'green', label: 'Verde', className: 'subject-color-green' },
    { value: 'orange', label: 'Naranja', className: 'subject-color-orange' },
    { value: 'red', label: 'Rojo', className: 'subject-color-red' },
    { value: 'gray', label: 'Gris', className: 'subject-color-gray' },
    { value: 'white', label: 'Blanco', className: 'subject-color-white' },
];

function createSchedule(): SubjectSchedule {
    return {
        id: crypto.randomUUID(),
        weekday: 'monday',
        startTime: TIME_SLOTS[0].start,
        endTime: TIME_SLOTS[0].end,
    };
}

export function SubjectModal({ courseId, onClose, subject }: SubjectModalProps) {
    const addSubject = useSubjectStore((state) => state.addSubject);
    const updateSubject = useSubjectStore((state) => state.updateSubject);
    const existingSubjects = useSubjectStore((state) => state.subjectsByCourse[String(courseId)] ?? EMPTY_SUBJECTS);
    const [name, setName] = useState(subject?.name ?? '');
    const [teacher, setTeacher] = useState(subject?.teacher ?? '');
    const [meetingUrl, setMeetingUrl] = useState(subject?.meetingUrl ?? '');
    const [color, setColor] = useState<SubjectColor>(subject?.color ?? 'blue');
    const [schedules, setSchedules] = useState<SubjectSchedule[]>(subject?.schedules ?? [createSchedule()]);
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

    const availableEndTimes = useMemo(
        () => schedules.map((schedule) => getTimeOptionsAfter(schedule.startTime)),
        [schedules],
    );

    function updateSchedule(id: string, changes: Partial<SubjectSchedule>) {
        setSchedules((current) => current.map((schedule) => (
            schedule.id === id ? { ...schedule, ...changes } : schedule
        )));
    }

    function addSchedule() {
        setSchedules((current) => [...current, createSchedule()]);
    }

    function removeSchedule(id: string) {
        setSchedules((current) => current.filter((schedule) => schedule.id !== id));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedName = capitalizeSubjectName(name);
        const trimmedTeacher = capitalizePersonName(teacher);
        const trimmedMeetingUrl = meetingUrl.trim();

        if (!trimmedName || !trimmedTeacher) {
            setError('Completa el nombre y el profesor.');
            return;
        }

        if (trimmedMeetingUrl && !isGoogleMeetUrl(trimmedMeetingUrl)) {
            setError('El enlace debe ser una URL válida de Google Meet.');
            return;
        }

        if (schedules.length === 0) {
            setError('Agrega al menos un horario.');
            return;
        }

        if (schedules.some((schedule) => !schedule.startTime || !schedule.endTime)) {
            setError('Completa todos los horarios.');
            return;
        }

        const hasInvalidTimeSlot = schedules.some((schedule) => !TIME_SLOTS.some((slot) => (
            slot.start === schedule.startTime && slot.end === schedule.endTime
        )));
        if (hasInvalidTimeSlot) {
            setError('Selecciona uno de los bloques horarios disponibles.');
            return;
        }

        const existingSchedules = existingSubjects
            .filter((existingSubject) => existingSubject.id !== subject?.id)
            .flatMap((existingSubject) => existingSubject.schedules);
        const conflictsWithExisting = schedules.some((schedule) => existingSchedules.some((existing) => (
            schedule.weekday === existing.weekday && rangesOverlap(schedule, existing)
        )));

        if (hasSubjectScheduleConflict(schedules) || conflictsWithExisting) {
            setError('Hay dos materias solapadas el mismo día. Ajusta sus horarios.');
            return;
        }

        const subjectToSave: Subject = {
            id: subject?.id ?? crypto.randomUUID(),
            courseId,
            name: trimmedName,
            teacher: trimmedTeacher,
            description: '',
            ...(trimmedMeetingUrl ? { meetingUrl: trimmedMeetingUrl } : {}),
            color,
            schedules,
            createdAt: subject?.createdAt ?? new Date().toISOString(),
        };

        const saved = subject
            ? await updateSubject(subjectToSave)
            : await addSubject(subjectToSave);
        if (!saved) {
            setError('No se pudo guardar la materia. Inténtalo nuevamente.');
            return;
        }

        handleClose();
    }

    return (
        <div className={`fixed inset-0 z-[220] flex items-center justify-center bg-black/50 p-4 ${overlayClass}`} onClick={(event) => { if (event.target === event.currentTarget) handleClose(); }} style={animationStyle}>
            <div className={`subject-modal-scroll w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-line-soft shadow-2xl ${modalClass}`} onClick={(event) => event.stopPropagation()} style={animationStyle}>
                <div className="flex items-start justify-between gap-4 border-b border-line-soft px-6 py-5">
                    <div className="text-left">

                        <h3 className="mt-1 text-xl font-bold text-ink">{subject ? 'Editar materia' : 'Agregar materia'}</h3>

                    </div>
                    <button type="button" onClick={handleClose} className="material-symbols-outlined rounded-full p-1 text-ink-soft hover:bg-muted" aria-label="Cerrar">close</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5 text-left">
                    <label className="flex flex-col gap-1.5 text-left text-sm font-semibold text-ink">
                        Nombre de la materia
                        <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-xl border border-line bg-muted px-4 py-3 text-base text-ink outline-none focus:border-brand md:text-sm" placeholder="Matemática" />
                    </label>

                    <label className="flex flex-col gap-1.5 text-left text-sm font-semibold text-ink">
                        Profesor
                        <input value={teacher} onChange={(event) => setTeacher(event.target.value)} className="rounded-xl border border-line bg-muted px-4 py-3 text-base text-ink outline-none focus:border-brand md:text-sm" placeholder="Nombre del profesor" />
                    </label>

                    <label className="flex flex-col gap-1.5 text-left text-sm font-semibold text-ink">
                        Enlace de reunión virtual <span className="font-normal text-ink-soft">(opcional)</span>
                        <input
                            type="url"
                            value={meetingUrl}
                            onChange={(event) => setMeetingUrl(event.target.value)}
                            className="rounded-xl border border-line bg-muted px-4 py-3 text-base text-ink outline-none focus:border-brand md:text-sm"
                            placeholder="https://meet.google.com/..."
                            inputMode="url"
                            autoComplete="url"
                        />
                        <span className="text-xs font-normal text-ink-soft">Solo se aceptan enlaces de Google Meet.</span>
                    </label>

                    <fieldset>
                        <legend className="mb-2 text-left text-sm font-semibold text-ink">Color de la materia</legend>
                        <div className="grid grid-cols-3 gap-2">
                            {COLORS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setColor(option.value)}
                                    className={`flex w-full items-center justify-center gap-2 rounded-full border px-2 py-2 text-xs font-semibold transition ${color === option.value ? 'border-brand ring-2 ring-brand-ring' : 'border-line'}`}
                                >
                                    <span className={`h-3 w-3 rounded-full ${option.className}`} />
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset>
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <legend className="text-left text-sm font-semibold text-ink">Días y horarios</legend>
                            <button type="button" onClick={addSchedule} className="rounded-lg border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand-tint"><span className="material-symbols-outlined">add</span></button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {schedules.map((schedule, index) => (
                                <div key={schedule.id} className="grid grid-cols-1 gap-2 rounded-xl border border-line-soft bg-muted p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
                                    <select value={schedule.weekday} onChange={(event) => updateSchedule(schedule.id, { weekday: event.target.value as SubjectWeekday })} className="rounded-lg border border-line bg-surface px-3 py-2.5 text-base text-ink md:text-sm">
                                        {WEEKDAYS.map((weekday) => <option key={weekday.value} value={weekday.value}>{weekday.label}</option>)}
                                    </select>
                                    <select value={schedule.startTime} onChange={(event) => updateSchedule(schedule.id, { startTime: event.target.value, endTime: getTimeOptionsAfter(event.target.value)[0] ?? '' })} className="rounded-lg border border-line bg-surface px-3 py-2.5 text-base text-ink md:text-sm">
                                        {TIME_SLOTS.map((slot) => <option key={slot.start} value={slot.start}>{slot.start}</option>)}
                                    </select>
                                    <select value={schedule.endTime} onChange={(event) => updateSchedule(schedule.id, { endTime: event.target.value })} className="rounded-lg border border-line bg-surface px-3 py-2.5 text-base text-ink md:text-sm">
                                        {(availableEndTimes[index] ?? []).map((time) => <option key={time} value={time}>{time}</option>)}
                                    </select>
                                    <button type="button" onClick={() => removeSchedule(schedule.id)} disabled={schedules.length === 1} className="rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-muted-strong disabled:cursor-not-allowed disabled:opacity-40" aria-label="Eliminar horario">delete</button>
                                </div>
                            ))}
                        </div>
                    </fieldset>

                    {error && <p className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-800">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={handleClose} className="flex-1 rounded-xl border border-line py-3 text-sm font-semibold text-ink-soft hover:bg-muted">Cancelar</button>
                        <button type="submit" className="flex-1 rounded-xl bg-brand-strong py-3 text-sm font-semibold text-white hover:bg-brand-hover">{subject ? 'Guardar cambios' : 'Guardar materia'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
