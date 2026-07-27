import { Link } from 'react-router';
import { Perfil } from '../../../Perfil/Perfil';
import { useUIStore } from '../../../../store/uiStore';

const SECTION_LABELS = {
    dashboard: 'General',
    calendar: 'Calendario',
    'Agregar Tareas': 'Tareas',
};

export function AppBar({ activeSection, onToggleSearch, isSearchOpen, }) {
    const { openPerfilModal, closePerfilModal, isPerfilModalOpen } = useUIStore();
    const sectionLabel = SECTION_LABELS[activeSection] ?? 'Intellect';


    return (
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
                <div className="px-4 py-3 mobile-search-row">
                    <div className="search-box-mobile">
                        <span className="material-symbols-outlined search-icon">search</span>
                        <input
                            className="search-input-mobile"
                            placeholder="Buscar tareas..."
                            type="text"
                        />
                    </div>
                </div>
            )}
            {isPerfilModalOpen && <Perfil onClose={closePerfilModal} />}
        </header>

    );
}
