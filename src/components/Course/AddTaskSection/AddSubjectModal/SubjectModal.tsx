import { useMemo, useState } from 'react';
import { getTimeOptionsAfter, rangesOverlap, TIME_OPTIONS } from '../../../../utils/taskSchedule';
import { EMPTY_SUBJECTS, useSubjectStore } from '../../../../store/subjectStorage';
import { hasSubjectScheduleConflict } from '../../../../utils/subjectSchedule';
import { useModalAnimation } from '../../../../Hooks/useModalAnimation';
import type { Subject, SubjectColor, SubjectSchedule, SubjectWeekday } from '../../../../types';

type SubjectModalProps = {
    courseId: number;
    onClose: () => void;
};

const WEEKDAYS: Array<{ value: SubjectWeekday; label: string }> = [
    { value: 'monday', label: 'Lunes' },
    { value: 'tuesday', label: 'Martes' },
    { value: 'wednesday', label: 'Miércoles' },
    { value: 'thursday', label: 'Jueves' },
    { value: 'friday', label: 'Viernes' },
];

const COLORS: Array<{ value: SubjectColor; label: string; className: string }> = [
    { value: 'blue', label: 'Azul', className: 'bg-blue-600' },
    { value: 'purple', label: 'Morado', className: 'bg-purple-950' },
    { value: 'pink', label: 'Rosado', className: 'bg-pink-500' },
    { value: 'yellow', label: 'Amarillo', className: 'bg-yellow-400' },
    { value: 'green', label: 'Verde', className: 'bg-green-600' },
    { value: 'orange', label: 'Naranja', className: 'bg-orange-500' },
];

const RECESS_RANGES = [
    { startTime: '10:00 AM', endTime: '10:30 AM' },
    { startTime: '1:00 PM', endTime: '1:50 PM' },
] as const;

const RECESS_START_TIMES: ReadonlySet<string> = new Set(RECESS_RANGES.map((range) => range.startTime));

function createSchedule(): SubjectSchedule {
    return {
        id: crypto.randomUUID(),
        weekday: 'monday',
        startTime: TIME_OPTIONS[0],
        endTime: TIME_OPTIONS[1],
    };
}

export function SubjectModal({ courseId, onClose }: SubjectModalProps) {
    const addSubject = useSubjectStore((state) => state.addSubject);
    const existingSubjects = useSubjectStore((state) => state.subjectsByCourse[String(courseId)] ?? EMPTY_SUBJECTS);
    const [name, setName] = useState('');
    const [teacher, setTeacher] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState<SubjectColor>('blue');
    const [schedules, setSchedules] = useState<SubjectSchedule[]>([createSchedule()]);
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
        const trimmedName = name.trim();
        const trimmedTeacher = teacher.trim();

        if (!trimmedName || !trimmedTeacher || !description.trim()) {
            setError('Completa el nombre, el profesor y la descripción.');
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

        const overlapsRecess = schedules.some((schedule) => RECESS_RANGES.some((recess) => rangesOverlap(schedule, recess)));
        if (overlapsRecess) {
            setError('Ese horario está reservado para el recreo.');
            return;
        }

        const existingSchedules = existingSubjects.flatMap((subject) => subject.schedules);
        const conflictsWithExisting = schedules.some((schedule) => existingSchedules.some((existing) => (
            schedule.weekday === existing.weekday && rangesOverlap(schedule, existing)
        )));

        if (hasSubjectScheduleConflict(schedules) || conflictsWithExisting) {
            setError('Hay dos materias solapadas el mismo día. Ajusta sus horarios.');
            return;
        }

        const subject: Subject = {
            id: crypto.randomUUID(),
            courseId,
            name: trimmedName,
            teacher: trimmedTeacher,
            description: description.trim(),
            color,
            schedules,
            createdAt: new Date().toISOString(),
        };

        const saved = await addSubject(subject);
        if (!saved) {
            setError('No se pudo guardar la materia. Inténtalo nuevamente.');
            return;
        }

        handleClose();
    }

    return (
        <div className={`fixed inset-0 z-[220] flex items-center justify-center bg-black/50 p-4 ${overlayClass}`} onClick={(event) => { if (event.target === event.currentTarget) handleClose(); }} style={animationStyle}>
            <div className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-line-soft shadow-2xl ${modalClass}`} onClick={(event) => event.stopPropagation()} style={animationStyle}>
                <div className="flex items-start justify-between gap-4 border-b border-line-soft px-6 py-5">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Horario recurrente</p>
                        <h3 className="mt-1 text-xl font-bold text-ink">Agregar materia</h3>
                        <p className="mt-1 text-sm text-ink-soft">Se repetirá cada semana en los días seleccionados.</p>
                    </div>
                    <button type="button" onClick={handleClose} className="material-symbols-outlined rounded-full p-1 text-ink-soft hover:bg-muted" aria-label="Cerrar">close</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
                    <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
                        Nombre de la materia
                        <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-xl border border-line bg-muted px-4 py-3 text-base text-ink outline-none focus:border-brand md:text-sm" placeholder="Matemática" />
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
                        Profesor
                        <input value={teacher} onChange={(event) => setTeacher(event.target.value)} className="rounded-xl border border-line bg-muted px-4 py-3 text-base text-ink outline-none focus:border-brand md:text-sm" placeholder="Nombre del profesor" />
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
                        Descripción
                        <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-24 resize-y rounded-xl border border-line bg-muted px-4 py-3 text-base text-ink outline-none focus:border-brand md:text-sm" placeholder="Información adicional de la materia" />
                    </label>

                    <fieldset>
                        <legend className="mb-2 text-sm font-semibold text-ink">Color de la materia</legend>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setColor(option.value)}
                                    className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${color === option.value ? 'border-brand ring-2 ring-brand-ring' : 'border-line'}`}
                                >
                                    <span className={`h-3 w-3 rounded-full ${option.className}`} />
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset>
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <legend className="text-sm font-semibold text-ink">Días y horarios</legend>
                            <button type="button" onClick={addSchedule} className="rounded-lg border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand-tint">Agregar horario</button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {schedules.map((schedule, index) => (
                                <div key={schedule.id} className="grid grid-cols-1 gap-2 rounded-xl border border-line-soft bg-muted p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
                                    <select value={schedule.weekday} onChange={(event) => updateSchedule(schedule.id, { weekday: event.target.value as SubjectWeekday })} className="rounded-lg border border-line bg-surface px-3 py-2.5 text-base text-ink md:text-sm">
                                        {WEEKDAYS.map((weekday) => <option key={weekday.value} value={weekday.value}>{weekday.label}</option>)}
                                    </select>
                                    <select value={schedule.startTime} onChange={(event) => updateSchedule(schedule.id, { startTime: event.target.value, endTime: getTimeOptionsAfter(event.target.value)[0] ?? '' })} className="rounded-lg border border-line bg-surface px-3 py-2.5 text-base text-ink md:text-sm">
                                        {TIME_OPTIONS.slice(0, -1).map((time) => <option key={time} value={time} disabled={RECESS_START_TIMES.has(time)}>{time}{RECESS_START_TIMES.has(time) ? ' (Recreo)' : ''}</option>)}
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
                        <button type="submit" className="flex-1 rounded-xl bg-brand-strong py-3 text-sm font-semibold text-white hover:bg-brand-hover">Guardar materia</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
