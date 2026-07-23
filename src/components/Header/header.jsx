import { Link, useNavigate, useLocation } from "react-router"
import { useState } from "react"
import { useCourseStore } from "../../store/courseStore";
import { useAuthStore } from "../../store/AuthStore";
import { FormSection } from "../Form/FormSection";
import { Perfil } from "../Perfil/Perfil";

export function Header() {
    const navigate = useNavigate();
    const { buttonStatus } = useCourseStore()
    const { isLoggedIn, login } = useAuthStore()
    const selectedCourseID = Object.keys(buttonStatus).find(id => buttonStatus[id] === 'selected');
    const [showForm, setShowForm] = useState(false);
    const [showPerfil, setShowPerfil] = useState(false);

    const handleCoursesClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            setShowForm(true);
        }
    };

    const handleAuthSuccess = (name) => {
        login(name);
        setShowForm(false);
        navigate('/course');
    };

    const handlePerfil = (e) => {
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
            <header className="sticky top-0 z-50 flex items-center px-4 w-full h-16 bg-white/85 backdrop-blur-md border-b border-gray-200">
                {/* Logo — izquierda */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-[28px] leading-9 font-bold text-[#0058be] tracking-tight no-underline">
                        Intellect
                    </Link>
                </div>

                {/* Nav links — centrado absoluto */}
                <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-1">
                    <Link className={linkClass('/')} to="/">Inicio</Link>
                    <Link className={linkClass('/course')} to="/course" onClick={handleCoursesClick}>Cursos</Link>
                    {selectedCourseID ? (
                        <Link className={linkClass(`/course-dashboard/${selectedCourseID}`)} to={`/course-dashboard/${selectedCourseID}`}>Ver mi Curso</Link>
                    ) : (
                        <span className="no-underline px-4 py-2 rounded text-sm font-medium text-gray-300 cursor-not-allowed">Ver mi Curso</span>
                    )}
                </nav>

                {/* Íconos — derecha */}
                <div className="hidden md:flex items-center gap-2 ml-auto">
                    <button className="material-symbols-outlined border-none bg-transparent cursor-pointer p-2 text-gray-500 rounded-full transition-all duration-200 hover:bg-[rgba(33,112,228,0.08)] hover:text-[#0058be] active:scale-95">
                        notifications
                    </button>
                    <button onClick={(e) => handlePerfil(e)} className="material-symbols-outlined border-none bg-transparent cursor-pointer p-2 text-gray-500 rounded-full transition-all duration-200 hover:bg-[rgba(33,112,228,0.08)] hover:text-[#0058be] active:scale-95">
                        account_circle
                    </button>
                </div>

                {/* Hamburguesa — solo en móvil */}
                <button className="material-symbols-outlined md:hidden ml-auto border-none bg-transparent cursor-pointer p-2 text-gray-500">
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

        </>
    )
}