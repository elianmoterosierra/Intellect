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
} from '../../../utils/dateNavigation';

import type { MonthRef, TaskWithCompleted } from '../../../types';

type CalendarSectionProps = {
    courseId: number;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    setSelectedTask: (task: TaskWithCompleted) => void;
};

export default function CalendarSection({ courseId, searchQuery, setSearchQuery, setSelectedTask }: CalendarSectionProps) {

    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [showPerfil, setShowPerfil] = useState(false);
    const [showUpArrow, setShowUpArrow] = useState(false);
    const [showDownArrow, setShowDownArrow] = useState(false);

    // ─── Mobile: scroll infinito ──────────────────────────────────
    const [months, setMonths] = useState<MonthRef[]>(() => {
        const baseYear = today.getFullYear();
        const baseMonth = today.getMonth();
        const prev = getPreviousMonth(baseYear, baseMonth);
        const next = getNextMonth(baseYear, baseMonth);
        return [
            { year: prev.year, month: prev.month },
            { year: baseYear, month: baseMonth },
            { year: next.year, month: next.month },
        ];
    });

    const topSentinelRef = useRef<HTMLDivElement | null>(null);
    const bottomSentinelRef = useRef<HTMLDivElement | null>(null);
    const mobileScrollRef = useRef<HTMLDivElement | null>(null);
    const isLoadingRef = useRef(false);
    const pendingScrollAdj = useRef<{ oldScrollHeight: number; oldScrollTop: number } | null>(null);
    const [prependedKey, setPrependedKey] = useState<string | null>(null);

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
                        if (!first) return;
                        const pm = getPreviousMonth(first.year, first.month);
                        setPrependedKey(`${pm.year}-${pm.month}`);
                        setMonths((prev) => {
                            const first = prev[0];
                            if (!first) return prev;
                            const pm = getPreviousMonth(first.year, first.month);
                            return [{ year: pm.year, month: pm.month }, ...prev];
                        });
                        pendingScrollAdj.current = { oldScrollHeight, oldScrollTop };
                    } else if (entry.target === bottomEl) {
                        setMonths((prev) => {
                            const last = prev[prev.length - 1];
                            if (!last) return prev;
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

    // Scroll al día actual al montar en móvil.
    useLayoutEffect(() => {
        const el = mobileScrollRef.current;
        if (!el) return;
        const todayEl = el.querySelector('[data-today]');
        if (todayEl) {
            todayEl.scrollIntoView({ block: 'center' });
        }
    }, []);

    // Detectar si el día actual está visible en móvil y mostrar flechas.
    useEffect(() => {
        const el = mobileScrollRef.current;
        if (!el) return;
        const todayEl = el.querySelector('[data-today]');
        if (!todayEl) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return;
                if (!entry.isIntersecting) {
                    const rb = entry.rootBounds;
                    if (!rb) return;
                    const bb = entry.boundingClientRect;
                    if (bb.top < rb.top) {
                        setShowUpArrow(true);
                        setShowDownArrow(false);
                    } else {
                        setShowUpArrow(false);
                        setShowDownArrow(true);
                    }
                } else {
                    setShowUpArrow(false);
                    setShowDownArrow(false);
                }
            },
            { root: el, threshold: 0 }
        );

        observer.observe(todayEl);
        return () => observer.disconnect();
    }, []);

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

    const scrollToToday = () => {
        const el = mobileScrollRef.current;
        if (!el) return;
        const todayEl = el.querySelector('[data-today]');
        if (todayEl) {
            todayEl.scrollIntoView({ block: 'center' });
        }
    };

    const handlePerfil = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowPerfil(true);
    };

    return (
        <>
            {/* ─── DESKTOP ────────────────────────────────────────────── */}
            <div className="hidden md:block">
                <HeaderCalendar
                    handlePerfil={handlePerfil}
                    handlePreviousMonth={handlePreviousMonth}
                    handleNextMonth={handleNextMonth}
                    handleToday={handleToday}
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    isCurrentMonth={isCurrentMonth(currentYear, currentMonth)}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    courseId={courseId}
                    setSelectedTask={setSelectedTask}
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
                        forceVisible={prependedKey === `${m.year}-${m.month}` || (m.year === today.getFullYear() && m.month === today.getMonth())}
                    />
                ))}
                <div ref={bottomSentinelRef} className="h-2" />
            </div>

            {/* Flechas de navegación al día de hoy (mobile) */}
            {showUpArrow && (
                <button
                    onClick={scrollToToday}
                    className="md:hidden fixed top-36 left-1/2 -translate-x-1/2 -ml-4 z-[60] bg-[#0058be] text-white rounded-full p-2 shadow-lg hover:bg-[#0041a8] transition-all duration-200 animate-fadeIn"
                    aria-label="Ir al día de hoy"
                >
                    <span className="material-symbols-outlined text-xl">expand_less</span>
                </button>
            )}
            {showDownArrow && (
                <button
                    onClick={scrollToToday}
                    className="md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 -ml-4 z-[60] bg-[#0058be] text-white rounded-full p-2 shadow-lg hover:bg-[#0041a8] transition-all duration-200 animate-fadeIn"
                    aria-label="Ir al día de hoy"
                >
                    <span className="material-symbols-outlined text-xl">expand_more</span>
                </button>
            )}

            {showPerfil && <Perfil onClose={() => setShowPerfil(false)} />}
        </>
    );
}