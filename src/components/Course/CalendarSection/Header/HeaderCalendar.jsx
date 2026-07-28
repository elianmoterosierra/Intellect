import { useState, useRef, useEffect } from 'react';
import { formatMonthLabel } from '../../../../utils/dateNavigation';
import { useSwipe } from '../../../../Hooks/useSwipe';
import { SearchDropdown } from '../../DashboardSection/AppBar(mobile)/SearchDropdown';

export function HeaderCalendar({
    handlePerfil,
    handlePreviousMonth,
    handleNextMonth,
    handleToday,
    currentMonth,
    currentYear,
    isCurrentMonth,
    searchQuery,
    setSearchQuery,
    courseId,
    setSelectedTask,
}) {
    const swipe = useSwipe({
        onSwipeLeft: handleNextMonth,
        onSwipeRight: handlePreviousMonth,
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="desktop-header">
            <div className="header-left">
                <h1 className="page-title">Calendario</h1>
                <div
                    className="date-selector"
                    {...swipe}
                >
                    <button
                        type="button"
                        onClick={handlePreviousMonth}
                        className="selector-arrow"
                        aria-label="Mes anterior"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="date-range">{formatMonthLabel(currentYear, currentMonth)}</span>
                    <button
                        type="button"
                        onClick={handleToday}
                        className="today-button"
                        aria-label="Volver al mes actual"
                        disabled={isCurrentMonth}
                    >
                        <span className="material-symbols-outlined">today</span>
                        Hoy
                    </button>
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className="selector-arrow"
                        aria-label="Mes siguiente"
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
