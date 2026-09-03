import { useState, useRef, useEffect } from 'react';
import { useSwipe } from '../../../../Hooks/useSwipe';
import { SearchDropdown } from '../../DashboardSection/AppBar(mobile)/SearchDropdown';

import type { TaskWithCompleted } from '../../../../types';

type HeaderCalendarProps = {
    handlePerfil: (e: React.MouseEvent) => void;
    handlePreviousWeek: () => void;
    handleNextWeek: () => void;
    handleToday: () => void;
    weekLabel: string;
    isCurrentWeek: boolean;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    courseId: number;
    setSelectedTask: (task: TaskWithCompleted) => void;
};

export function HeaderCalendar({
    handlePerfil,
    handlePreviousWeek,
    handleNextWeek,
    handleToday,
    weekLabel,
    isCurrentWeek,
    searchQuery,
    setSearchQuery,
    courseId,
    setSelectedTask,
}: HeaderCalendarProps) {
    const swipe = useSwipe({
        onSwipeLeft: handleNextWeek,
        onSwipeRight: handlePreviousWeek,
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (searchContainerRef.current && e.target instanceof Node && !searchContainerRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="desktop-header">
            <div className="header-left">
                <div
                    className="date-selector"
                    {...swipe}
                >
                    <button
                        type="button"
                        onClick={handlePreviousWeek}
                        className="selector-arrow"
                        aria-label="Semana anterior"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="date-range">{weekLabel}</span>
                    <button
                        type="button"
                        onClick={handleToday}
                        className="today-button"
                        aria-label="Volver a la semana actual"
                        disabled={isCurrentWeek}
                    >
                        <span className="material-symbols-outlined">today</span>
                        Hoy
                    </button>
                    <button
                        type="button"
                        onClick={handleNextWeek}
                        className="selector-arrow"
                        aria-label="Semana siguiente"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className="header-right">
                <div className="search-box relative" ref={searchContainerRef}>
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input
                        className="search-input"
                        placeholder="Buscar tareas..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setIsDropdownOpen(true); }}
                        onFocus={() => setIsDropdownOpen(true)}
                    />
                    <SearchDropdown
                        courseId={courseId}
                        isOpen={isDropdownOpen}
                        searchQuery={searchQuery}
                        setSelectedTask={setSelectedTask}
                    />
                </div>
                <button
                    onClick={(e) => handlePerfil(e)}
                    className="icon-button"
                    aria-label="Perfil"
                >
                    <span className="material-symbols-outlined">account_circle</span>
                </button>
            </div>
        </header>
    );
}
