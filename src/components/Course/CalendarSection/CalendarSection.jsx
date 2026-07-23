import { Day } from './Day/Day';
import { useState } from 'react';
import '../../../page/css/Calendar.css';
import { Perfil } from '../../Perfil/Perfil';
import { HeaderCalendar } from './Header/HeaderCalendar';

export default function CalendarSection({ courseId, onToggleNotifications }) {

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
    const [showPerfil, setShowPerfil] = useState(false);

    const handlePerfil = (e) => {
        e.preventDefault();
        setShowPerfil(true);
    };
    return (
        <>
            {console.log('CalendarSection currentMonth:', currentMonth, 'currentYear:', currentYear)}
            <HeaderCalendar
                onToggleNotifications={onToggleNotifications} handlePerfil={handlePerfil}
                handlePreviousMonth={handlePreviousMonth}
                handleNextMonth={handleNextMonth}
                monthNames={monthNames}
                currentMonth={currentMonth}
                currentYear={currentYear} />
            <div className="calendar-container" style={{ overflowY: 'visible' }}>
                <div className="calendar-grid">
                    <Day courseId={courseId} currentMonth={currentMonth} currentYear={currentYear} />
                </div>
            </div>
            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </>
    );
}
