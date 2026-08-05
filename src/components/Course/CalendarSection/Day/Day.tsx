import { DayCard } from './DayCard/DayCard';
import { useMonthDay } from '../../../../Hooks/useMonthDay';

type DayProps = {
    courseId: number;
    currentMonth: number;
    currentYear: number;
};

export function Day({ courseId, currentMonth, currentYear }: DayProps) {
    const monthDaysData = useMonthDay(currentYear, currentMonth);

    return (
        <>
            {monthDaysData.map((day) => (
                <DayCard
                    key={day.id}
                    courseId={courseId}
                    day={day}
                    year={currentYear}
                    month={currentMonth}
                />
            ))}
        </>
    );
}