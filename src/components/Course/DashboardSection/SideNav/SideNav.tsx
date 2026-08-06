import { Link } from 'react-router';
import { useState } from 'react';
import { COURSE_SECTIONS } from '../../../../utils/courseSections';
import type { SectionKey } from '../../../../utils/courseSections';
import { ExitModal } from '../../Common/ExitModal/ExitModal';
import { ThemeToggle } from '../../../ThemeToggle/ThemeToggle';
import { useThemeStore } from '../../../../store/themeStore';

const navLink = "flex items-center gap-4 px-4 py-2 rounded-xl transition-colors duration-200 text-ink-soft no-underline text-sm leading-5 hover:bg-blue-500 cursor-pointer border-none w-full text-left font-[inherit]";
const navLinkActive = "bg-blue-500 text-white font-semibold";

const sections = [
    { key: COURSE_SECTIONS.DASHBOARD, icon: 'dashboard', label: 'General' },
    { key: COURSE_SECTIONS.CALENDAR, icon: 'calendar_month', label: 'Calendario' },
    { key: COURSE_SECTIONS.ADD_TASKS, icon: 'assignment', label: 'Agregar Tareas' },
];

type SideNavProps = {
    courseId: string | number;
    activeSection: SectionKey;
    onSectionChange: (section: SectionKey) => void;
};

export function SideNav({ courseId, activeSection, onSectionChange }: SideNavProps) {
    const [showModal, setShowModal] = useState(false);
    const onClose = () => setShowModal(false);
    const { isDark } = useThemeStore();


    return (
        <>
            <nav className=" hidden md:flex flex-col fixed left-0 top-0 h-full p-4 bg-muted text-brand text-sm leading-5 border-r border-line w-64 z-40 transition-all duration-200">
                <div className="mb-8">
                    <Link to="/" className="text-xl leading-7 font-semibold text-ink no-underline">Intellect </Link>
                    <p className="text-ink-soft text-xs leading-4 tracking-widest font-semibold uppercase mt-0.5">Task manager</p>
                </div>

                <ul className="flex-1 flex flex-col gap-2 list-none p-0 m-0">
                    {sections.map(({ key, icon, label }) => (
                        <li key={key}>
                            <button
                                className={`${navLink} ${activeSection === key ? navLinkActive : ''}`}
                                onClick={() => onSectionChange(key)}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={activeSection === key ? { fontVariationSettings: "'FILL' 1" } : undefined}
                                >
                                    {icon}
                                </span>
                                {label}
                            </button>
                        </li>
                    ))}
                </ul>

                <ul className="mt-auto flex flex-col gap-2 border-t border-line pt-4 list-none p-0 m-0">
                    <li>
                        <div className="flex items-center gap-3 px-2 py-2">
                            <ThemeToggle />
                            <span className=" text-sm text-ink-soft">Modo {isDark ? 'Claro' : 'Oscuro'}</span>

                        </div>
                    </li>

                    <li>
                        <button className={navLink}>
                            <span className="material-symbols-outlined">settings</span>
                            Ajustes
                        </button>
                    </li>

                    <li>
                        <button
                            className={`${navLink} text-red-500 hover:bg-red-500/10 hover:text-red-500`}
                            onClick={() => setShowModal(true)}
                        >
                            <span className="material-symbols-outlined">logout</span>
                            Abandonar curso
                        </button>
                    </li>
                </ul>
            </nav>

            {showModal && (
                <ExitModal courseId={courseId} onClose={onClose} />
            )}
        </>
    )
}
