import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import '../../../page/css/Calendar.css';
import { Perfil } from '../../Perfil/Perfil';
import { HeaderCalendar } from './Header/HeaderCalendar';
import { Day } from './Day/Day';
import { MonthGroup } from './MonthGroup';
import {
    getNextMonth,
    getPreviousMonth,
    isCurrentMonth,
    loadSavedMonth,
    saveMonth,
} from '../../../utils/dateNavigation';

export default function CalendarSection({ courseId, onToggleNotifications }) {

    const today = new Date();
    const initial = loadSavedMonth(courseId);
    const [currentYear, setCurrentYear] = useState(initial?.year ?? today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(initial?.month ?? today.getMonth());
    const [showPerfil, setShowPerfil] = useState(false);

    // Persistir el mes visto cada vez que cambia, por curso (desktop).
    useEffect(() => {
        saveMonth(courseId, currentYear, currentMonth);
    }, [courseId, currentYear, currentMonth]);

    // ─── Mobile: scroll infinito ──────────────────────────────────
    const [months, setMonths] = useState(() => {
        const saved = loadSavedMonth(courseId);
        const baseYear = saved?.year ?? today.getFullYear();
        const baseMonth = saved?.month ?? today.getMonth();
        const prev = getPreviousMonth(baseYear, baseMonth);
        const next = getNextMonth(baseYear, baseMonth);
        return [
            { year: prev.year, month: prev.month },
            { year: baseYear, month: baseMonth },
            { year: next.year, month: next.month },
        ];
    });

    const topSentinelRef = useRef(null);
    const bottomSentinelRef = useRef(null);
    const mobileScrollRef = useRef(null);
    const isLoadingRef = useRef(false);
    const pendingScrollAdj = useRef(null);
    const [prependedKey, setPrependedKey] = useState(null);

    // IntersectionObserver para cargar meses al hacer scroll.
    // Depende de [months] para tener la lista actualizada en la closure.
    useEffect(() => {
        const topEl = topSentinelRef.current;
        const bottomEl = bottomSentinelRef.current;
        const scrollEl = mobileScrollRef.current;
        if (!topEl || !bottomEl || !scrollEl) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (isLoadingRef.current) return;
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    isLoadingRef.current = true;

                    if (entry.target === topEl) {
                        const oldScrollHeight = scrollEl.scrollHeight;
                        const oldScrollTop = scrollEl.scrollTop;
                        const first = months[0];
                        const pm = getPreviousMonth(first.year, first.month);
                        setPrependedKey(`${pm.year}-${pm.month}`);
                        setMonths((prev) => {
                            const first = prev[0];
                            const pm = getPreviousMonth(first.year, first.month);
                            return [{ year: pm.year, month: pm.month }, ...prev];
                        });
                        pendingScrollAdj.current = { oldScrollHeight, oldScrollTop };
                    } else if (entry.target === bottomEl) {
                        setMonths((prev) => {
                            const last = prev[prev.length - 1];
                            const nm = getNextMonth(last.year, last.month);
                            return [...prev, { year: nm.year, month: nm.month }];
                        });
                    }

                    setTimeout(() => { isLoadingRef.current = false; }, 300);
                });
            },
            { root: scrollEl, threshold: 0 }
        );

        observer.observe(topEl);
        observer.observe(bottomEl);

        return () => observer.disconnect();
    }, [months]);

    // Restaurar scroll después de anteponer un mes (evita salto visual).
    useLayoutEffect(() => {
        const adj = pendingScrollAdj.current;
        const el = mobileScrollRef.current;
        if (adj && el) {
            el.scrollTop = adj.oldScrollTop + (el.scrollHeight - adj.oldScrollHeight);
            pendingScrollAdj.current = null;
        }
    });

    // ─── Desktop: handlers ───────────────────────────────────────
    function handleNextMonth() {
        const { year, month } = getNextMonth(currentYear, currentMonth);
        setCurrentYear(year);
        setCurrentMonth(month);
    }

    function handlePreviousMonth() {
        const { year, month } = getPreviousMonth(currentYear, currentMonth);
        setCurrentYear(year);
        setCurrentMonth(month);
    }

    function handleToday() {
        const now = new Date();
        setCurrentYear(now.getFullYear());
        setCurrentMonth(now.getMonth());
    }

    const handlePerfil = (e) => {
        e.preventDefault();
        setShowPerfil(true);
    };

    return (
        <>
            {/* ─── DESKTOP ────────────────────────────────────────────── */}
            <div className="hidden md:block">
                <HeaderCalendar
                    onToggleNotifications={onToggleNotifications}
                    handlePerfil={handlePerfil}
                    handlePreviousMonth={handlePreviousMonth}
                    handleNextMonth={handleNextMonth}
                    handleToday={handleToday}
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    isCurrentMonth={isCurrentMonth(currentYear, currentMonth)}
                />
                <div className="calendar-container" style={{ overflowY: 'visible' }}>
                    <div className="calendar-grid">
                        <Day courseId={courseId} currentMonth={currentMonth} currentYear={currentYear} />
                    </div>
                </div>
            </div>

            {/* ─── MOBILE: scroll infinito ───────────────────────────── */}
            <div
                ref={mobileScrollRef}
                className="md:hidden h-full overflow-y-auto bg-[#f9f9ff] pb-20"
            >
                <div ref={topSentinelRef} className="h-2" />
                {months.map((m) => (
                    <MonthGroup
                        key={`${m.year}-${m.month}`}
                        year={m.year}
                        month={m.month}
                        courseId={courseId}
                        forceVisible={prependedKey === `${m.year}-${m.month}`}
                    />
                ))}
                <div ref={bottomSentinelRef} className="h-2" />
            </div>

            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </>
    );
}
