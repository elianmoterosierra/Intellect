import { DayCard } from './DayCard/DayCard';
import { useMonthDay } from '../../../../Hooks/useMonthDay';
import type { CalendarDay } from '../../../../types';
import { TIME_SLOTS } from '../../../../utils/taskSchedule';

type DayProps = {
    courseId: number;
    currentMonth: number;
    currentYear: number;
    desktopWorkweek?: boolean;
    weekStart?: Date;
};

export function Day({ courseId, currentMonth, currentYear, desktopWorkweek = false, weekStart }: DayProps) {
    const monthDaysData = useMonthDay(currentYear, currentMonth);

    if (desktopWorkweek) {
        const baseDate = weekStart ?? new Date(currentYear, currentMonth, 1);
        const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
        const weekdays = dayNames.map((name, index) => {
            const date = new Date(baseDate);
            date.setDate(baseDate.getDate() + index);
            const today = new Date();
            const type = date.toDateString() === today.toDateString()
                ? 'today'
                : date < today ? 'past' : 'future';
            return {
                id: date.toISOString(),
                name,
                number: date.getDate(),
                type,
                date,
            } satisfies CalendarDay & { date: Date };
        });

        return (
            <div className="weekly-calendar">
                <div className="calendar-weekdays" aria-label="Días laborales">
                    <div className="calendar-time-corner" />
                    {weekdays.map((day) => (
                        <div key={day.id} className="calendar-weekday">
                            <span>{day.name}</span>
                            <strong>{day.number}</strong>
                        </div>
                    ))}
                </div>
                <div className="calendar-week-grid">
                    <div className="calendar-time-axis">
                        {TIME_SLOTS.map((slot) => <div key={slot.start} className="calendar-time-label">{slot.start}</div>)}
                    </div>
                    {weekdays.map((day) => (
                        <DayCard key={day.id} courseId={courseId} day={day} year={day.date.getFullYear()} month={day.date.getMonth()} weekly />
                    ))}
                </div>
            </div>
        );
    }

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
