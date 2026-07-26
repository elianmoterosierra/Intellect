// Helpers puros para navegar meses en el calendario.
// Sin React, sin localStorage. Se usan desde CalendarSection / HeaderCalendar.

export const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function getNextMonth(year, month) {
    if (month === 11) return { year: year + 1, month: 0 };
    return { year, month: month + 1 };
}

export function getPreviousMonth(year, month) {
    if (month === 0) return { year: year - 1, month: 11 };
    return { year, month: month - 1 };
}

export function isCurrentMonth(year, month) {
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth();
}

export function formatMonthLabel(year, month) {
    return `${MONTH_NAMES[month]} - ${year}`;
}

// Persistencia ligera por curso: sobrevive recargas, muere al cerrar la pestaña.
const KEY_PREFIX = 'intellect.calendar.lastMonth.';

export function loadSavedMonth(courseId) {
    if (!courseId) return null;
    try {
        const raw = sessionStorage.getItem(KEY_PREFIX + courseId);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (
            !parsed ||
            typeof parsed.year !== 'number' ||
            typeof parsed.month !== 'number' ||
            parsed.month < 0 ||
            parsed.month > 11
        ) {
            return null;
        }
        return { year: parsed.year, month: parsed.month };
    } catch {
        return null;
    }
}

export function saveMonth(courseId, year, month) {
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
