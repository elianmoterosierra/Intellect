import { Link } from 'react-router';
import { Perfil } from '../../../Perfil/Perfil';
import { useUIStore } from '../../../../store/uiStore';
import { SearchDropdown } from './SearchDropdown';
import type { SectionKey } from '../../../../utils/courseSections';
import type { TaskWithCompleted } from '../../../../types';

const SECTION_LABELS: Record<SectionKey, string> = {
    dashboard: 'General',
    calendar: 'Calendario',
    'Agregar Tareas': 'Tareas',
};

type AppBarProps = {
    activeSection: SectionKey;
    onToggleSearch: () => void;
    isSearchOpen: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    courseId: number;
    setSelectedTask: (task: TaskWithCompleted) => void;
};

export function AppBar({ activeSection, onToggleSearch, isSearchOpen, searchQuery, setSearchQuery, courseId, setSelectedTask }: AppBarProps) {
    const { openPerfilModal, closePerfilModal, isPerfilModalOpen } = useUIStore();
    const sectionLabel = SECTION_LABELS[activeSection] ?? 'Intellect';


    return (
        <>
            <header className="md:hidden sticky top-0 z-50 flex flex-col bg-[#f9f9ff] border-b border-[#c2c6d6]">
                {/* Fila 1: home | título | acciones */}
                <div className="flex items-center px-4 w-full h-16">
                    <div className="flex items-center gap-3 flex-1">
                        <Link
                            to="/"
                            className="flex items-center justify-center p-1 rounded-full text-[#424754] hover:bg-[#f2f3fd] transition-colors"
                            aria-label="Ir al inicio"
                        >
                            <span className="material-symbols-outlined text-2xl">home</span>
                        </Link>
                        <span className="text-xl font-bold text-[#0058be] tracking-tight">
                            {sectionLabel}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onToggleSearch}
                            className="flex items-center justify-center p-2 rounded-full text-[#424754] bg-transparent border-none cursor-pointer transition-colors duration-200 hover:bg-[#f2f3fd]"
                            aria-label="Buscar"
                        >
                            <span className="material-symbols-outlined">
                                {isSearchOpen ? 'close' : 'search'}
                            </span>
                        </button>
                        <button onClick={
                            () => {
                                openPerfilModal();
                            }
                        }
                            type="button"
                            className="flex items-center justify-center p-2 rounded-full text-[#424754] bg-transparent border-none cursor-pointer transition-colors duration-200 hover:bg-[#f2f3fd]"
                            aria-label="Perfil"
                        >
                            <span className="material-symbols-outlined">account_circle</span>
                        </button>
                    </div>
                </div>

                {/* Fila 2: input de búsqueda (condicional) */}
                {isSearchOpen && (
                    <div className="px-4 py-3 relative bg-[#f2f3fd] border-t border-[#c2c6d6]">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[#727785] text-lg">search</span>
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-2 pr-3 pl-8 bg-white border border-[#c2c6d6] rounded-lg text-sm text-[#191b23] outline-none focus:shadow-[0_0_0_2px_#0058be]"
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
            {isPerfilModalOpen && <Perfil onClose={closePerfilModal} compact />}
        </>);
}
