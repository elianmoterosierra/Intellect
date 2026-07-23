/**
 * Utility functions for calculating dynamic task statuses based on date differences.
 */

/**
 * Calculates the difference in calendar days between targetDate and currentDate.
 * @param {Date|string} targetDate
 * @param {Date} [currentDate=new Date()]
 * @returns {number|null} Difference in days (0 = today, 1 = tomorrow, 2 = day after tomorrow, etc.)
 */
export function getDaysDifference(targetDate, currentDate = new Date()) {
    if (!targetDate) return null;
    const dTarget = new Date(targetDate);
    const dCurrent = new Date(currentDate);

    if (isNaN(dTarget.getTime())) return null;

    // Reset hours to compare purely calendar days
    const startOfCurrent = new Date(dCurrent.getFullYear(), dCurrent.getMonth(), dCurrent.getDate());
    const startOfTarget = new Date(dTarget.getFullYear(), dTarget.getMonth(), dTarget.getDate());

    const diffMs = startOfTarget.getTime() - startOfCurrent.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns visual status metadata for a task based on its target date.
 * - Mañana (1 día): fondo amarillo + ícono ⚠️
 * - Pasado mañana (2 días): fondo verde
 * - 3+ días (o hoy/pasado): estilo predeterminado
 *
 * @param {Date|string} targetDate
 * @param {Date} [currentDate=new Date()]
 */
export function getTaskStatusConfig(targetDate, currentDate = new Date()) {
    const diff = getDaysDifference(targetDate, currentDate);

    if (diff !== null && diff < 0) {
        return {
            diff,
            status: 'overdue',
            bgColor: 'bg-[#ba1a1a]',
            borderColor: 'border-[#ba1a1a]',
            textColor: 'text-white',
            pillBg: 'bg-white/15 text-white border border-white/30 font-bold',
            icon: 'error',
            badgeText: 'Tarea vencida',
        };
    } else if (diff === 1) {
        return {
            diff,
            status: 'tomorrow',
            bgColor: 'bg-amber-100/90',
            borderColor: 'border-amber-300',
            textColor: 'text-amber-950',
            pillBg: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
            icon: 'warning',
            badgeText: 'Queda 1 día (Mañana)',
        };
    } else if (diff === 2) {
        return {
            diff,
            status: 'dayAfterTomorrow',
            bgColor: 'bg-emerald-100/90',
            borderColor: 'border-emerald-300',
            textColor: 'text-emerald-950',
            pillBg: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold',
            icon: null,
            badgeText: '🌱 Pasado mañana (2 días)',
        };
    } else {
        return {
            diff,
            status: 'normal',
            bgColor: 'bg-[#f8f9ff]',
            borderColor: 'border-[#e8eaf6]',
            textColor: 'text-[#191b23]',
            pillBg: 'bg-gray-100 text-gray-700 border-gray-200',
            icon: null,
            badgeText: null,
        };
    }
}
