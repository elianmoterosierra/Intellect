
import { useState } from "react";

export function HeaderCalendar({ onToggleNotifications, handlePerfil }) {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    function handleNextMonth() {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    }

    function handlePreviousMonth() {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    }


    return (
        <header className="desktop-header">
            <div className="header-left">
                <h1 className="page-title">Calendario</h1>
                <div className="date-selector">
                    <button onClick={handlePreviousMonth} className="selector-arrow">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="date-range">{monthNames[currentMonth]} - {currentYear}</span>
                    <button onClick={handleNextMonth} className="selector-arrow">
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
                >
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="notification-badge"></span>
                </button>
                <button onClick={(e) => handlePerfil(e)} className="icon-button">
                    <span className="material-symbols-outlined">account_circle</span>
                </button>
            </div>
        </header>

    );
}