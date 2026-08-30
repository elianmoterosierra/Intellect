import type { Subject, SubjectSchedule, SubjectWeekday } from '../types';
import { rangesOverlap } from './taskSchedule';

const WEEKDAY_BY_JS_INDEX: Array<SubjectWeekday | null> = [
    null,
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    null,
];

export function getSubjectWeekday(date: Date): SubjectWeekday | null {
    return WEEKDAY_BY_JS_INDEX[date.getDay()] ?? null;
}

export function hasSubjectScheduleConflict(schedules: SubjectSchedule[]): boolean {
    for (let index = 0; index < schedules.length; index += 1) {
        const current = schedules[index];
        if (!current) continue;

        for (let nextIndex = index + 1; nextIndex < schedules.length; nextIndex += 1) {
            const next = schedules[nextIndex];
            if (!next) continue;

            if (current.weekday === next.weekday && rangesOverlap(current, next)) {
                return true;
            }
        }
    }

    return false;
}

export type SubjectDateOption = {
    value: string;
    label: string;
};

function toLocalDateValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getSubjectDateOptions(
    subject: Subject | null,
    fromDate: Date = new Date(),
    daysAhead = 365,
): SubjectDateOption[] {
    if (!subject) return [];

    const weekdays = new Set(subject.schedules.map((schedule) => schedule.weekday));
    const options: SubjectDateOption[] = [];

    for (let offset = 0; offset <= daysAhead; offset += 1) {
        const date = new Date(fromDate);
        date.setHours(12, 0, 0, 0);
        date.setDate(fromDate.getDate() + offset);

        const weekday = getSubjectWeekday(date);
        if (!weekday || !weekdays.has(weekday)) continue;

        const label = date.toLocaleDateString('es-DO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        options.push({
            value: toLocalDateValue(date),
            label: label.charAt(0).toUpperCase() + label.slice(1),
        });
    }

    return options;
}
