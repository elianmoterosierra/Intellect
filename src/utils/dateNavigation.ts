// Helpers puros para navegar meses en el calendario.
// Sin React, sin localStorage. Se usan desde CalendarSection / HeaderCalendar.

import type { MonthRef } from '../types';

export const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
] as const;

export function getNextMonth(year: number, month: number): MonthRef {
    if (month === 11) return { year: year + 1, month: 0 };
    return { year, month: month + 1 };
}

export function getPreviousMonth(year: number, month: number): MonthRef {
    if (month === 0) return { year: year - 1, month: 11 };
    return { year, month: month - 1 };
}

export function isCurrentMonth(year: number, month: number): boolean {
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth();
}

export function formatMonthLabel(year: number, month: number): string {
    return `${MONTH_NAMES[month]} - ${year}`;
}

// Persistencia ligera por curso: sobrevive recargas, muere al cerrar la pestaña.
const KEY_PREFIX = 'intellect.calendar.lastMonth.';

export function loadSavedMonth(courseId: number | string | null): MonthRef | null {
    if (!courseId) return null;
    try {
        const raw = sessionStorage.getItem(KEY_PREFIX + courseId);
        if (!raw) return null;
        const parsed: unknown = JSON.parse(raw);
        if (
            typeof parsed !== 'object' ||
            parsed === null ||
            typeof (parsed as MonthRef).year !== 'number' ||
            typeof (parsed as MonthRef).month !== 'number' ||
            (parsed as MonthRef).month < 0 ||
            (parsed as MonthRef).month > 11
        ) {
            return null;
        }
        return { year: (parsed as MonthRef).year, month: (parsed as MonthRef).month };
    } catch {
        return null;
    }
}

export function saveMonth(courseId: number | string | null, year: number, month: number): void {
    if (!courseId) return;
    try {
        sessionStorage.setItem(
            KEY_PREFIX + courseId,
            JSON.stringify({ year, month }),
        );
    } catch {
        // sessionStorage puede no estar disponible (modo privado); ignorar.
    }
}