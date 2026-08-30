export type TaskSchedule = {
    startTime: string;
    endTime: string;
};

export const TIME_OPTIONS = [
    '7:30 AM', '8:20 AM', '9:10 AM', '10:00 AM', '10:30 AM',
    '11:20 AM', '12:10 PM', '1:00 PM', '1:50 PM', '2:40 PM', '3:30 PM',
] as const;

export const TIME_SLOTS = [
    { start: '7:30 AM', end: '8:20 AM' },
    { start: '8:20 AM', end: '9:10 AM' },
    { start: '9:10 AM', end: '10:00 AM' },
    { start: '10:00 AM', end: '10:30 AM' },
    { start: '10:30 AM', end: '11:20 AM' },
    { start: '11:20 AM', end: '12:10 PM' },
    { start: '12:10 PM', end: '1:00 PM' },
    { start: '1:00 PM', end: '1:50 PM' },
    { start: '1:50 PM', end: '2:40 PM' },
    { start: '2:40 PM', end: '3:30 PM' },
] as const;

export function getTimeOptionsAfter(startTime: string): readonly string[] {
    const startIndex = TIME_OPTIONS.indexOf(startTime as typeof TIME_OPTIONS[number]);
    return startIndex < 0 ? TIME_OPTIONS : TIME_OPTIONS.slice(startIndex + 1);
}

export function timeToMinutes(time: string): number {
    const match = /^(\d+):(\d+) (AM|PM)$/.exec(time);
    if (!match) return -1;
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    if (match[3] === 'PM' && hour !== 12) hour += 12;
    if (match[3] === 'AM' && hour === 12) hour = 0;
    return hour * 60 + minute;
}

/** Converts a Postgres time value (HH:mm:ss) to the UI's 12-hour format. */
export function fromDatabaseTime(time: string): string {
    const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(time);
    if (!match) return time;

    const hour = Number(match[1]);
    const meridiem = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${match[2]} ${meridiem}`;
}

export function rangesOverlap(first: TaskSchedule, second: TaskSchedule): boolean {
    return timeToMinutes(first.startTime) < timeToMinutes(second.endTime)
        && timeToMinutes(second.startTime) < timeToMinutes(first.endTime);
}

export function isSameLocalDay(first: Date, second: Date): boolean {
    return first.getFullYear() === second.getFullYear()
        && first.getMonth() === second.getMonth()
        && first.getDate() === second.getDate();
}
