import { DayCard } from './DayCard/DayCard';
import { useMonthDay } from '../../../../Hooks/useMonthDay';
import type { CalendarDay } from '../../../../types';
import { NOON_SUBJECT_SLOT, SUBJECT_TIME_SLOTS, TIME_SLOTS } from '../../../../utils/taskSchedule';
import { EMPTY_SUBJECTS, useSubjectStore } from '../../../../store/subjectStorage';
import { getSubjectWeekday } from '../../../../utils/subjectSchedule';

type DayProps = {
    courseId: number;
    currentMonth: number;
    currentYear: number;
    desktopWorkweek?: boolean;
    weekStart?: Date;
    dataVersion?: string;
};

export function Day({ courseId, currentMonth, currentYear, desktopWorkweek = false, weekStart, dataVersion = '' }: DayProps) {
    const monthDaysData = useMonthDay(currentYear, currentMonth);
    const subjects = useSubjectStore((state) => state.subjectsByCourse[String(courseId)] ?? EMPTY_SUBJECTS);

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
        const showNoonSlot = weekdays.some((day) => {
            const weekday = getSubjectWeekday(day.date);
            return subjects.some((subject) => subject.schedules.some((schedule) => (
                schedule.weekday === weekday
                && schedule.startTime === NOON_SUBJECT_SLOT.start
                && schedule.endTime === NOON_SUBJECT_SLOT.end
            )));
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
                    <div className={`calendar-time-axis ${showNoonSlot ? 'calendar-time-axis-with-noon' : ''}`}>
                        {(showNoonSlot ? SUBJECT_TIME_SLOTS : TIME_SLOTS).map((slot) => <div key={slot.start} className="calendar-time-label">{slot.start}</div>)}
                    </div>
                    {weekdays.map((day) => (
                        <DayCard key={day.id} courseId={courseId} day={day} year={day.date.getFullYear()} month={day.date.getMonth()} weekly dataVersion={dataVersion} showNoonSlot={showNoonSlot} />
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
                    dataVersion={dataVersion}

                />
            ))}
        </>
    );
}
