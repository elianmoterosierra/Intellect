import { useMemo, useState } from 'react';
import { EMPTY_SUBJECTS, useSubjectStore } from '../../../../store/subjectStorage';
import { getSubjectWeekday } from '../../../../utils/subjectSchedule';
import { getMonday } from '../../../../utils/dateNavigation';
import { timeToMinutes } from '../../../../utils/taskSchedule';
import { isGoogleMeetUrl } from '../../../../utils/meetingLink';
import type { SubjectColor } from '../../../../types';
import { GoogleMeet } from '../../../Form/GoogleMeet';

type DashboardCalendarProps = {
    courseId: number;
};

const WEEKDAYS = [
    { value: 'monday', short: 'Lun', full: 'Lunes' },
    { value: 'tuesday', short: 'Mar', full: 'Martes' },
    { value: 'wednesday', short: 'Mié', full: 'Miércoles' },
    { value: 'thursday', short: 'Jue', full: 'Jueves' },
    { value: 'friday', short: 'Vie', full: 'Viernes' },
] as const;

const SUBJECT_COLORS: Record<SubjectColor, string> = {
    blue: 'subject-border-blue',
    purple: 'subject-border-purple',
    pink: 'subject-border-pink',
    yellow: 'subject-border-yellow',
    green: 'subject-border-green',
    orange: 'subject-border-orange',
    red: 'subject-border-red',
    gray: 'subject-border-gray',
    white: 'subject-border-white',
};

function formatDate(date: Date): string {
    const value = date.toLocaleDateString('es-DO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function DashboardCalendar({ courseId }: DashboardCalendarProps) {
    const subjects = useSubjectStore((state) => state.subjectsByCourse[String(courseId)] ?? EMPTY_SUBJECTS);
    const today = useMemo(() => new Date(), []);
    const weekStart = useMemo(() => getMonday(today), [today]);
    const initialDay = Math.min(Math.max(today.getDay() - 1, 0), WEEKDAYS.length - 1);
    const [selectedDayIndex, setSelectedDayIndex] = useState(initialDay);
    const selectedDate = new Date(weekStart);
    selectedDate.setDate(weekStart.getDate() + selectedDayIndex);
    const selectedWeekday = getSubjectWeekday(selectedDate);

    const daySubjects = selectedWeekday
        ? subjects
            .flatMap((subject) => subject.schedules
                .filter((schedule) => schedule.weekday === selectedWeekday)
                .map((schedule) => ({ subject, schedule })))
            .sort((a, b) => timeToMinutes(a.schedule.startTime) - timeToMinutes(b.schedule.startTime))
        : [];

    return (
        <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm" aria-labelledby="dashboard-calendar-title">
            <header className="flex items-center justify-between gap-4 border-b border-line-soft bg-muted/40 px-4 py-4 md:px-6">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="material-symbols-outlined text-base text-brand" aria-hidden="true">calendar_month</span>
                    <div className="min-w-0">
                        <h2 id="dashboard-calendar-title" className="truncate text-base font-bold text-ink md:text-lg">Horario semanal</h2>
                        <p className="mt-0.5 text-xs text-ink-soft md:text-sm">{formatDate(selectedDate)}</p>
                    </div>
                </div>
                <span className="hidden shrink-0 rounded-lg bg-brand-soft px-3 py-2 text-[10px] font-semibold text-brand sm:inline-flex">Semana actual</span>
            </header>

            <div className="px-4 py-4 md:px-6">
                <div className="grid grid-cols-5 gap-2" role="tablist" aria-label="Días de la semana">
                    {WEEKDAYS.map((day, index) => {
                        const date = new Date(weekStart);
                        date.setDate(weekStart.getDate() + index);
                        const isSelected = index === selectedDayIndex;

                        return (
                            <button
                                key={day.value}
                                type="button"
                                role="tab"
                                aria-selected={isSelected}
                                onClick={() => setSelectedDayIndex(index)}
                                className={`rounded-lg border px-2 py-2 text-center text-[11px] font-semibold transition-colors duration-150 md:text-xs ${isSelected
                                        ? 'border-brand bg-brand-strong text-white shadow-sm'
                                        : 'border-line-soft bg-muted text-ink-soft hover:border-brand-ring hover:bg-brand-tint hover:text-brand'
                                    }`}
                            >
                                <span className="sm:hidden">{day.short}</span>
                                <span className="hidden sm:inline">{day.full.slice(0, 3)}</span>
                                <span className="ml-1 opacity-75">{date.getDate()}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4 space-y-2" role="tabpanel">
                    {daySubjects.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-line-soft px-4 py-8 text-center text-sm text-ink-soft">No hay materias asignadas este día.</p>
                    ) : (
                        daySubjects.map(({ subject, schedule }) => (
                            <article key={schedule.id} className={`rounded-lg border border-line-soft border-l-4 bg-muted/45 px-3 py-3 transition-colors hover:bg-muted ${SUBJECT_COLORS[subject.color]}`}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 text-left">
                                        <h3 className="truncate text-left text-base font-bold text-ink md:text-lg">{subject.name}</h3>
                                        {subject.teacher && (
                                            <p className="mt-1 truncate text-left text-xs font-semibold text-ink-soft md:text-sm">
                                                Profesor: {subject.teacher}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex shrink-0 flex-col items-center gap-2">
                                        <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-semibold text-brand md:text-[11px]">
                                            {schedule.startTime} – {schedule.endTime}
                                        </span>
                                        {subject.meetingUrl && isGoogleMeetUrl(subject.meetingUrl) && (
                                            <a
                                                href={subject.meetingUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Abrir Google Meet"
                                                className="inline-flex items-center rounded-md outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand-ring"
                                            >
                                                <GoogleMeet className="h-4 w-5 shrink-0" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
