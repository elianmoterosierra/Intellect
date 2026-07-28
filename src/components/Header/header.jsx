import { Link, useNavigate, useLocation } from "react-router"
import { useState } from "react"
import { useCourseStore } from "../../store/courseStore";
import { useAuthStore } from "../../store/AuthStore";
import { FormSection } from "../Form/FormSection";
import { Perfil } from "../Perfil/Perfil";
import { HamburgerMenu } from "../Home/hamburgerMenu/HamburgerMenu";
import { SettingsModal } from "../SettingsModal/SettingsModal";

export function Header() {
    const navigate = useNavigate();
    const { buttonStatus } = useCourseStore()
    const { isLoggedIn } = useAuthStore()
    const selectedCourseID = Object.keys(buttonStatus).find(id => buttonStatus[id] === 'selected');
    const [showForm, setShowForm] = useState(false);
    const [showPerfil, setShowPerfil] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const handleCoursesClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            setShowForm(true);
        }
    };

    const handleAuthSuccess = () => {
        setShowForm(false);
        navigate('/course');
    };

    const handlePerfil = () => {
        if (isLoggedIn) {
            setShowPerfil(true);
        } else {
            setShowForm(true);
        }
    };

    const location = useLocation();

    const linkClass = (path) =>
        `no-underline px-4 py-2 rounded text-sm font-medium transition-all duration-200
        ${location.pathname === path
            ? 'text-[#0058be] bg-[rgba(33,112,228,0.12)] font-semibold border-b-2 border-[#0058be]'
            : 'text-gray-500 hover:bg-[rgba(33,112,228,0.08)] hover:text-[#0058be]'
        }`

    return (
        <>
            <header className="sticky top-0 z-50 flex items-center px-4 md:px-6 w-full h-16 bg-white/85 backdrop-blur-md border-b border-gray-200">
                {/* Logo — izquierda */}
                <div className="flex flex-1 items-center gap-4">
                    <Link to="/" className="text-[28px] leading-9 font-bold text-[#0058be] tracking-tight no-underline">
                        Intellect
                    </Link>
                </div>

                {/* Nav links — centrado absoluto */}
                <nav className="hidden lg:flex flex-1 justify-center gap-1 whitespace-nowrap">
                    <Link className={linkClass('/')} to="/">Inicio</Link>
                    <Link className={linkClass('/course')} to="/course" onClick={handleCoursesClick}>Cursos</Link>
                    {selectedCourseID ? (
                        <Link className={linkClass(`/course-dashboard/${selectedCourseID}`)} to={`/course-dashboard/${selectedCourseID}`}>Ver mi Curso</Link>
                    ) : (
                        <span className="no-underline px-4 py-2 rounded text-sm font-medium text-gray-300 cursor-not-allowed">Ver mi Curso</span>
                    )}
                </nav>

                {/* Íconos — derecha */}
                <div className="hidden lg:flex flex-1 items-center justify-end gap-2">
                    <button onClick={() => setShowSettings(true)} className="material-symbols-outlined border-none bg-transparent cursor-pointer p-2 text-gray-500 rounded-full transition-all duration-200 hover:bg-[rgba(33,112,228,0.08)] hover:text-[#0058be] active:scale-95">
                        settings
                    </button>
                    <button onClick={handlePerfil} className="material-symbols-outlined border-none bg-transparent cursor-pointer p-2 text-gray-500 rounded-full transition-all duration-200 hover:bg-[rgba(33,112,228,0.08)] hover:text-[#0058be] active:scale-95">
                        account_circle
                    </button>
                </div>

                {/* Hamburguesa — solo en móvil */}
                <button
                    onClick={() => setShowMenu(true)}
                    className="material-symbols-outlined lg:hidden ml-auto border-none bg-transparent cursor-pointer p-2 text-gray-500"
                >
                    menu
                </button>

            </header>
            {
                showForm && (
                    <FormSection
                        onClose={() => setShowForm(false)}
                        onSuccess={handleAuthSuccess}
                    />
                )
            }
            {
                isLoggedIn && showPerfil && (
                    <Perfil onClose={() => setShowPerfil(false)} />
                )
            }

            {showMenu && (
                <div className="lg:hidden">
                    <HamburgerMenu
                        onClose={() => setShowMenu(false)}
                        onOpenForm={() => setShowForm(true)}
                        onOpenPerfil={handlePerfil}
                        onOpenSettings={() => setShowSettings(true)}
                    />
                </div>
            )}

            {showSettings && (
                <SettingsModal
                    onClose={() => setShowSettings(false)}
                    onOpenPerfil={handlePerfil}
                />
            )}

        </>
    )
}
