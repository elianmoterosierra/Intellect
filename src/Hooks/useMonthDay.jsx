import { useMemo } from "react";
import { getDaysInMonth } from "./useDaysInMonth";

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Referencia estable para días sin tareas.
// CRÍTICO: evita crear un [] nuevo en cada ejecución del useMemo.
// Sin esto, day.tasks para días vacíos nunca sería === al anterior,
// rompiendo el comparador custom de React.memo en DayCard.
export const EMPTY_TASKS = Object.freeze([]);

export function useMonthDay(year, month) {
    return useMemo(() => {
        const totalDays = getDaysInMonth(year, month);
        const today     = new Date();
        const tomorrow  = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        return Array.from({ length: totalDays }, (_, i) => {
            const dayNumber = i + 1;
            const dateObj   = new Date(year, month, dayNumber);
            const dayOfWeek = dateObj.getDay();

            let type = 'future';
            if (dayOfWeek === 0 || dayOfWeek === 6)                      type = 'weekend';
            else if (dateObj.toDateString() === tomorrow.toDateString()) type = 'tomorrow';
            else if (dateObj.toDateString() === today.toDateString())    type = 'today';
            else if (dateObj < today)                                     type = 'past';

            const dataKey = `${year}-${month}-${dayNumber}`;
            // ?? EMPTY_TASKS: referencia estable para días sin tareas
            return { id: dataKey, name: DAY_NAMES[dayOfWeek], number: dayNumber, type };
        });
    }, [year, month]);
}
