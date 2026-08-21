import { useState } from 'react';
import '../../../page/css/Calendar.css';
import { Perfil } from '../../Perfil/Perfil';
import { HeaderCalendar } from './Header/HeaderCalendar';
import { Day } from './Day/Day';
import { isCurrentWeek, getMonday, formatWeekLabel, addDays } from '../../../utils/dateNavigation';
import { useMediaQuery } from '../../../Hooks/useMediaQuery';
import { useAxisLockedScroll } from '../../../Hooks/useAxisLockedScroll';

import type { TaskWithCompleted } from '../../../types';

type CalendarSectionProps = {
    courseId: number;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    setSelectedTask: (task: TaskWithCompleted) => void;

};

export default function CalendarSection({ courseId, searchQuery, setSearchQuery, setSelectedTask }: CalendarSectionProps) {


    const today = new Date();
    const [weekStart, setWeekStart] = useState(() => getMonday(today));
    const [showPerfil, setShowPerfil] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const mobileScrollHandlers = useAxisLockedScroll();
    // Navegación compartida entre desktop y mobile.
    function handleNextWeek() {
        setWeekStart((current) => addDays(current, 7));
    }

    function handlePreviousWeek() {
        setWeekStart((current) => addDays(current, -7));
    }

    function handleToday() {
        setWeekStart(getMonday(new Date()));
    }

    const handlePerfil = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowPerfil(true);
    };

    return (
        <>
            {/* ─── DESKTOP ────────────────────────────────────────────── */}
            {isDesktop && <div>
                <HeaderCalendar
                    handlePerfil={handlePerfil}
                    handlePreviousWeek={handlePreviousWeek}
                    handleNextWeek={handleNextWeek}
                    handleToday={handleToday}
                    weekLabel={formatWeekLabel(weekStart)}
                    isCurrentWeek={isCurrentWeek(weekStart)}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    courseId={courseId}
                    setSelectedTask={setSelectedTask}
                />
                <div className="calendar-container" style={{ overflowY: 'visible' }}>
                    <Day courseId={courseId} currentMonth={weekStart.getMonth()} currentYear={weekStart.getFullYear()} desktopWorkweek weekStart={weekStart} />
                </div>
            </div>}

            {/* ─── MOBILE: agenda semanal con scroll bidimensional ─────── */}
            {!isDesktop && <div className="calendar-mobile-week">
                <div className="calendar-mobile-toolbar">
                    <button type="button" onClick={handlePreviousWeek} className="selector-arrow" aria-label="Semana anterior">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <div>
                        <p className="calendar-mobile-title">Calendario</p>
                        <p className="calendar-mobile-range">{formatWeekLabel(weekStart)}</p>
                    </div>
                    <button type="button" onClick={handleToday} className="today-button" disabled={isCurrentWeek(weekStart)}>
                        Hoy
                    </button>
                    <button type="button" onClick={handleNextWeek} className="selector-arrow" aria-label="Semana siguiente">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
                <div className="calendar-mobile-scroll" {...mobileScrollHandlers}>
                    <Day courseId={courseId} currentMonth={weekStart.getMonth()} currentYear={weekStart.getFullYear()} desktopWorkweek weekStart={weekStart} />
                </div>
            </div>}

            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </>
    );
}
