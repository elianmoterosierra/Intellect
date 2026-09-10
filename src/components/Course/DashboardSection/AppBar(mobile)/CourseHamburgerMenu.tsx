import { useState } from 'react';
import { COURSE_SECTIONS } from '../../../../utils/courseSections';
import type { SectionKey } from '../../../../utils/courseSections';
import { ThemeToggle } from '../../../ThemeToggle/ThemeToggle';
import { useThemeStore } from '../../../../store/themeStore';
import { SettingsModal } from '../../../SettingsModal/SettingsModal';
import { useUIStore } from '../../../../store/uiStore';

const navItems: Array<{ key: SectionKey; icon: string; label: string }> = [
    { key: COURSE_SECTIONS.DASHBOARD, icon: 'dashboard', label: 'General' },
    { key: COURSE_SECTIONS.CALENDAR, icon: 'calendar_month', label: 'Calendario' },
    { key: COURSE_SECTIONS.ADD_TASKS, icon: 'assignment', label: 'Agregar Tareas' },
    { key: COURSE_SECTIONS.MANAGE_SUBJECTS, icon: 'menu_book', label: 'Gestionar materias' },
    { key: COURSE_SECTIONS.VIEW_ALL_MEMBER, icon: 'person', label: 'Ver miembros' },
];

type CourseHamburgerMenuProps = {
    activeSection: SectionKey;
    onSectionChange: (section: SectionKey) => void;
    canManageTasks: boolean;
    onClose: () => void;
    onOpenExit: () => void;
};

export function CourseHamburgerMenu({ activeSection, onSectionChange, canManageTasks, onClose, onOpenExit }: CourseHamburgerMenuProps) {
    const [showSettings, setShowSettings] = useState(false);
    const { isDark } = useThemeStore();
    const openPerfilModal = useUIStore((state) => state.openPerfilModal);
    const visibleItems = canManageTasks
        ? navItems
        : navItems.filter((item) => (
            item.key !== COURSE_SECTIONS.ADD_TASKS
            && item.key !== COURSE_SECTIONS.MANAGE_SUBJECTS
            && item.key !== COURSE_SECTIONS.VIEW_ALL_MEMBER
        ));

    function handleSectionChange(section: SectionKey) {
        onSectionChange(section);
        onClose();
    }

    return (
        <>
            <section className="fixed inset-0 z-[300] flex justify-start bg-black/40 animate-overlayIn" onClick={onClose}>
                <div className="flex h-full w-72 flex-col bg-surface shadow-2xl animate-slideInLeft" onClick={(event) => event.stopPropagation()}>
                    <div className="flex items-center justify-between border-b border-line px-5 py-6">
                        <span className="text-xl font-bold text-brand">Intellect</span>
                        <button type="button" onClick={onClose} className="material-symbols-outlined rounded-full p-1 text-ink-soft hover:bg-muted hover:text-brand" aria-label="Cerrar menú">close</button>
                    </div>

                    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
                        {visibleItems.map(({ key, icon, label }) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => handleSectionChange(key)}
                                className={`flex items-center gap-3 rounded-xl border-none px-4 py-3 text-left text-base font-medium transition-colors ${activeSection === key ? 'bg-brand-soft font-semibold text-brand' : 'bg-transparent text-ink-soft hover:bg-muted-hover hover:text-brand'}`}
                            >
                                <span className="material-symbols-outlined text-xl">{icon}</span>
                                {label}
                            </button>
                        ))}
                    </nav>

                    <div className="flex flex-col gap-1 border-t border-line px-2 py-2">
                        <div className="flex items-center gap-1 rounded-xl px-2 py-1">
                            <ThemeToggle />
                            <span className="text-base font-medium text-ink-soft">Modo {isDark ? 'Claro' : 'Oscuro'}</span>
                        </div>
                        <button type="button" onClick={() => { onClose(); setShowSettings(true); }} className="flex w-full items-center gap-3 rounded-xl border-none bg-transparent px-4 py-3 text-left text-base font-medium text-ink-soft transition-colors hover:bg-muted-hover hover:text-brand">
                            <span className="material-symbols-outlined text-xl">settings</span>
                            Ajustes
                        </button>
                        <button type="button" onClick={() => { onClose(); onOpenExit(); }} className="flex w-full items-center gap-3 rounded-xl border-none bg-transparent px-4 py-3 text-left text-base font-medium text-red-500 transition-colors hover:bg-red-500/10">
                            <span className="material-symbols-outlined text-xl">logout</span>
                            Abandonar curso
                        </button>
                    </div>
                </div>
            </section>

            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onOpenPerfil={openPerfilModal} />}
        </>
    );
}
