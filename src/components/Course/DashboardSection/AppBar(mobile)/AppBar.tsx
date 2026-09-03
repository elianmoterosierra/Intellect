import { useState } from 'react';
import { useUIStore } from '../../../../store/uiStore';
import { ExitModal } from '../../Common/ExitModal/ExitModal';
import { SearchDropdown } from './SearchDropdown';
import { CourseHamburgerMenu } from './CourseHamburgerMenu';
import type { SectionKey } from '../../../../utils/courseSections';
import type { TaskWithCompleted } from '../../../../types';

const SECTION_LABELS: Record<SectionKey, string> = {
    dashboard: 'General',
    calendar: 'Calendario',
    'Agregar Tareas': 'Tareas',
    'Gestionar materias': 'Materias',
};

type AppBarProps = {
    activeSection: SectionKey;
    onToggleSearch: () => void;
    isSearchOpen: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    courseId: number;
    setSelectedTask: (task: TaskWithCompleted) => void;
    onSectionChange: (section: SectionKey) => void;
    canManageTasks: boolean;
};

export function AppBar({ activeSection, onToggleSearch, isSearchOpen, searchQuery, setSearchQuery, courseId, setSelectedTask, onSectionChange, canManageTasks }: AppBarProps) {
    const openPerfilModal = useUIStore((state) => state.openPerfilModal);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const sectionLabel = SECTION_LABELS[activeSection] ?? 'Intellect';


    return (
        <>
            <header className="md:hidden sticky top-0 z-50 flex flex-col bg-page border-b border-line">
                {/* Fila 1: menú | título | acciones */}
                <div className="flex items-center px-4 w-full h-16">
                    <div className="flex items-center gap-3 flex-1">
                        <button type="button" onClick={() => setIsMenuOpen(true)} className="flex items-center justify-center rounded-full border-none bg-transparent p-1 text-ink-soft transition-colors hover:bg-muted" aria-label="Abrir menú de navegación">
                            <span className="material-symbols-outlined text-2xl">menu</span>
                        </button>
                        <span className="text-xl font-bold text-brand tracking-tight">
                            {sectionLabel}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onToggleSearch}
                            className="flex items-center justify-center p-2 rounded-full text-ink-soft bg-transparent border-none cursor-pointer transition-colors duration-200 hover:bg-muted"
                            aria-label="Buscar"
                        >
                            <span className="material-symbols-outlined">
                                {isSearchOpen ? 'close' : 'search'}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={openPerfilModal}
                            className="flex items-center justify-center rounded-full border-none bg-transparent p-2 text-ink-soft transition-colors duration-200 hover:bg-muted"
                            aria-label="Perfil"
                        >
                            <span className="material-symbols-outlined">account_circle</span>
                        </button>
                    </div>
                </div>

                {/* Fila 2: input de búsqueda (condicional) */}
                {isSearchOpen && (
                    <div className="px-4 py-3 relative bg-muted border-t border-line">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-ink-faint text-lg">search</span>
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-2 pr-3 pl-8 bg-surface border border-line rounded-lg text-sm text-ink outline-none focus:shadow-[0_0_0_2px_rgb(var(--brand))]"
                                placeholder="Buscar tareas..."
                                type="text"
                            />
                        </div>
                        <SearchDropdown
                            courseId={courseId}
                            isOpen={true}
                            searchQuery={searchQuery}
                            setSelectedTask={setSelectedTask}
                        />
                    </div>
                )}
            </header>
            {isMenuOpen && <CourseHamburgerMenu activeSection={activeSection} onSectionChange={onSectionChange} canManageTasks={canManageTasks} onClose={() => setIsMenuOpen(false)} onOpenExit={() => setShowExitModal(true)} />}
            {showExitModal && <ExitModal courseId={courseId} onClose={() => setShowExitModal(false)} />}
        </>);
}
