import { Link } from 'react-router';
import { useState } from 'react';
import type { FocusEvent, MouseEvent } from 'react';
import { COURSE_SECTIONS } from '../../../../utils/courseSections';
import type { SectionKey } from '../../../../utils/courseSections';
import { ExitModal } from '../../Common/ExitModal/ExitModal';
import { ThemeToggle } from '../../../ThemeToggle/ThemeToggle';
import { useThemeStore } from '../../../../store/themeStore';
import { SettingsModal } from '../../../SettingsModal/SettingsModal';
import { useUIStore } from '../../../../store/uiStore';

const navLink = "flex items-center gap-4 px-4 py-2 rounded-xl transition-colors duration-150 ease-out text-ink-soft no-underline text-sm leading-5 hover:bg-blue-500 cursor-pointer border-none w-full text-left font-[inherit]";
const navLinkActive = "bg-blue-500 text-white font-semibold";

const sections = [
    { key: COURSE_SECTIONS.DASHBOARD, icon: 'dashboard', label: 'General' },
    { key: COURSE_SECTIONS.CALENDAR, icon: 'calendar_month', label: 'Calendario' },
    { key: COURSE_SECTIONS.ADD_TASKS, icon: 'assignment', label: 'Agregar Tareas' },
    { key: COURSE_SECTIONS.MANAGE_SUBJECTS, icon: 'menu_book', label: 'Gestionar materias' },
    { key: COURSE_SECTIONS.VIEW_ALL_MEMBER, icon: 'person', label: 'Ver miembros' },
];

type SideNavProps = {
    courseId: string | number;
    activeSection: SectionKey;
    onSectionChange: (section: SectionKey) => void;
    canManageCourse: boolean;
    isCollapsed: boolean;
    onCollapsedChange: (collapsed: boolean) => void;
};

export function SideNav({ courseId, activeSection, onSectionChange, canManageCourse, isCollapsed, onCollapsedChange }: SideNavProps) {
    const [showModal, setShowModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const onClose = () => setShowModal(false);
    const { isDark } = useThemeStore();
    const openPerfilModal = useUIStore((state) => state.openPerfilModal);
    const visibleSections = canManageCourse
        ? sections
        : sections.filter((section) => (
            section.key !== COURSE_SECTIONS.ADD_TASKS
            && section.key !== COURSE_SECTIONS.MANAGE_SUBJECTS
            && section.key !== COURSE_SECTIONS.VIEW_ALL_MEMBER
        ));

    function expandSidebar() {
        onCollapsedChange(false);
    }

    function collapseSidebar() {
        onCollapsedChange(true);
    }

    function handleMouseLeave(event: MouseEvent<HTMLElement>) {
        const activeElement = document.activeElement;
        if (!activeElement || !event.currentTarget.contains(activeElement)) {
            collapseSidebar();
        }
    }

    function handleBlur(event: FocusEvent<HTMLElement>) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            collapseSidebar();
        }
    }





    return (
        <>
            <nav
                className={`hidden md:flex fixed left-0 top-0 z-40 h-full flex-col overflow-x-hidden border-r border-line bg-muted p-4 text-brand text-sm leading-5 transition-[width] duration-[320ms] ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
                onMouseEnter={expandSidebar}
                onMouseLeave={handleMouseLeave}
                onFocusCapture={expandSidebar}
                onBlurCapture={handleBlur}
            >
                <div className={`mb-8 flex items-start ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                    <Link to="/" className={`flex items-center overflow-hidden text-ink no-underline ${isCollapsed ? 'justify-center gap-0' : 'gap-2'}`} title={isCollapsed ? 'Intellect' : undefined}>
                        <span className={`block h-8 shrink-0 ${isCollapsed ? 'w-6' : 'w-0 overflow-hidden'}`} aria-hidden="true" />
                        <span className={`overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-[260ms] ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[9rem] opacity-100'}`}>
                            <span className="block text-xl font-semibold leading-7">Intellect</span>
                            <span className="mt-0.5 block text-xs font-semibold uppercase leading-4 tracking-widest text-ink-soft">Task manager</span>
                        </span>
                    </Link>
                </div>

                <ul className="flex-1 flex flex-col gap-2 list-none p-0 m-0">
                    {visibleSections.map(({ key, icon, label }) => (
                        <li key={key}>
                            <button
                                className={`${navLink} ${activeSection === key ? navLinkActive : ''}`}
                                onClick={() => onSectionChange(key)}
                                title={isCollapsed ? label : undefined}
                            >
                                <span
                                    className="material-symbols-outlined shrink-0"
                                    style={activeSection === key ? { fontVariationSettings: "'FILL' 1" } : undefined}
                                >
                                    {icon}
                                </span>
                                <span className={`overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-[260ms] ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[10rem] opacity-100'}`}>
                                    {label}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>

                <ul className="mt-auto flex flex-col gap-2 border-t border-line pt-4 list-none p-0 m-0">
                    <li>
                        <div className="flex items-center gap-3 px-2 py-2">
                            <ThemeToggle />
                            <span className={`overflow-hidden whitespace-nowrap text-sm text-ink-soft transition-[opacity,max-width] duration-[260ms] ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[10rem] opacity-100'}`}>Modo {isDark ? 'Claro' : 'Oscuro'}</span>

                        </div>
                    </li>

                    <li>
                        <button className={navLink} onClick={() => setShowSettings(true)} title={isCollapsed ? 'Ajustes' : undefined}>
                            <span className="material-symbols-outlined shrink-0">settings</span>
                            <span className={`overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-[260ms] ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[10rem] opacity-100'}`}>Ajustes</span>
                        </button>
                    </li>

                    <li>
                        <button
                            className={`${navLink} text-red-500 hover:bg-red-500/10 hover:text-red-500`}
                            title={isCollapsed ? 'Abandonar curso' : undefined}
                            onClick={() => setShowModal(true)}
                        >
                            <span className="material-symbols-outlined shrink-0">logout</span>
                            <span className={`overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-[260ms] ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[10rem] opacity-100'}`}>Abandonar curso</span>
                        </button>
                    </li>
                </ul>
            </nav>

            {showModal && (
                <ExitModal courseId={courseId} onClose={onClose} />
            )}

            {showSettings && (
                <SettingsModal
                    onClose={() => setShowSettings(false)}
                    onOpenPerfil={openPerfilModal}
                />
            )}

        </>
    )
}
