import { useEffect, useRef, useState } from 'react';
import { Day } from './Day/Day';
import { MONTH_NAMES } from '../../../utils/dateNavigation';
import { getDaysInMonth } from '../../../Hooks/useDaysInMonth';

type MonthGroupProps = {
    year: number;
    month: number;
    courseId: number;
    forceVisible: boolean;
};

export function MonthGroup({ year, month, courseId, forceVisible }: MonthGroupProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isNear, setIsNear] = useState(forceVisible);

    useEffect(() => {
        if (isNear) return;
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return;
                if (entry.isIntersecting) {
                    setIsNear(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '600px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [isNear]);

    return (
        <div ref={ref} data-month-group data-year={year} data-month={month}>
            <div className="sticky top-0 z-10 bg-page px-4 py-3 text-lg font-bold text-brand border-b border-line">
                {MONTH_NAMES[month]} {year}
            </div>
            {isNear ? (
                <div className="calendar-grid">
                    <Day courseId={courseId} currentMonth={month} currentYear={year} />
                </div>
            ) : (
                <div className="calendar-grid opacity-40">
                    {Array.from({ length: getDaysInMonth(year, month) }, (_, i) => (
                        <div key={i} className="aspect-square rounded-xl border border-line bg-page" />
                    ))}
                </div>
            )}
        </div>
    );
}