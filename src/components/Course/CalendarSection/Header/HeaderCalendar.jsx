import { formatMonthLabel } from '../../../../utils/dateNavigation';
import { useSwipe } from '../../../../Hooks/useSwipe';

export function HeaderCalendar({
    onToggleNotifications,
    handlePerfil,
    handlePreviousMonth,
    handleNextMonth,
    handleToday,
    currentMonth,
    currentYear,
    isCurrentMonth,
}) {
    const swipe = useSwipe({
        onSwipeLeft: handleNextMonth,
        onSwipeRight: handlePreviousMonth,
    });

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
                <div className="search-box">
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input className="search-input" placeholder="Search tasks..." type="text" />
                </div>
                <button
                    onClick={onToggleNotifications}
                    className="icon-button relative-badge"
                    aria-label="Notificaciones"
                >
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="notification-badge"></span>
                </button>
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
