import { DayCard } from './DayCard/DayCard';
import { useMonthDay } from '../../../../Hooks/useMonthDay';

export function Day({ currentMonth, currentYear }) {
    const monthDaysData = useMonthDay(currentYear, currentMonth);

    return (
        <>
            {monthDaysData.map((day) => (
                <DayCard
                    key={day.id}
                    day={day}
                    year={currentYear}
                    month={currentMonth}
                />
            ))}
        </>
    );
}
