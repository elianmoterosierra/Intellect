import { Link, useLocation } from "react-router"
import { useCourseStore } from "../../../store/courseStore";
import { useAuthStore } from "../../../store/AuthStore";
import { ThemeToggle } from "../../ThemeToggle/ThemeToggle";
import { useThemeStore } from "../../../store/themeStore";

type HamburgerMenuProps = {
    onClose: () => void;
    onOpenForm: () => void;
    onOpenPerfil: () => void;
    onOpenSettings: () => void;
};

export function HamburgerMenu({ onClose, onOpenForm, onOpenPerfil, onOpenSettings }: HamburgerMenuProps) {
    const location = useLocation();
    const { isLoggedIn } = useAuthStore();
    const { buttonStatus } = useCourseStore();
    const selectedCourseID = Object.keys(buttonStatus).find(id => buttonStatus[id] === 'selected');
    const { isDark } = useThemeStore();
    const linkClass = (path: string) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium no-underline transition-colors cursor-pointer
        ${location.pathname === path
            ? 'text-brand bg-brand-soft font-semibold'
            : 'text-ink-soft hover:bg-muted-hover hover:text-brand'
        }`

    const handleCoursesClick = () => {
        if (!isLoggedIn) {
            onClose();
            onOpenForm();
        }
    };

    const handlePerfilClick = () => {
        onClose();
        onOpenPerfil();
    };

    return (
        <section
            className="fixed inset-0 z-[300] flex justify-end bg-black/40 animate-overlayIn"
            onClick={onClose}
        >
            <div
                className="w-72 h-full bg-surface shadow-2xl animate-slideInRight flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-6 border-b border-gray-200">
                    <span className="text-xl font-bold text-brand">Intellect</span>
                    <button
                        onClick={onClose}
                        className="material-symbols-outlined border-none bg-transparent cursor-pointer p-1 text-ink-soft hover:text-brand"
                    >
                        close
                    </button>
                </div>

                <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
                    <Link className={linkClass('/')} to="/" onClick={onClose}>
                        <span className="material-symbols-outlined text-xl">home</span>
                        Inicio
                    </Link>

                    <Link
                        className={linkClass('/course')}
                        to="/course"
                        onClick={handleCoursesClick}
                    >
                        <span className="material-symbols-outlined text-xl">school</span>
                        Cursos
                    </Link>

                    {selectedCourseID ? (
                        <Link
                            className={linkClass(`/course-dashboard/${selectedCourseID}`)}
                            to={`/course-dashboard/${selectedCourseID}`}
                            onClick={onClose}
                        >
                            <span className="material-symbols-outlined text-xl">dashboard</span>
                            Ver mi Curso
                        </Link>
                    ) : (
                        <span className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-300 cursor-not-allowed">
                            <span className="material-symbols-outlined text-xl">dashboard</span>
                            Ver mi Curso
                        </span>
                    )}
                </nav>

                <div className="border-t border-gray-200 flex flex-col gap-1">
                    <div className="flex items-center gap-1 px-2 py-2 rounded-xl">
                        <ThemeToggle />
                        <span className=" text-base font-medium text-ink-soft">Modo {isDark ? 'Claro' : 'Oscuro'}</span>

                    </div>
                    <button
                        onClick={() => { onClose(); onOpenSettings(); }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-ink-soft hover:bg-muted-hover hover:text-brand transition-colors cursor-pointer border-none bg-transparent w-full text-left"
                    >
                        <span className="material-symbols-outlined text-xl">settings</span>
                        Ajustes
                    </button>
                    <button
                        onClick={handlePerfilClick}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-ink-soft hover:bg-muted-hover hover:text-brand transition-colors cursor-pointer border-none bg-transparent w-full text-left"
                    >
                        <span className="material-symbols-outlined text-xl">account_circle</span>
                        {isLoggedIn ? 'Perfil' : 'Iniciar sesión'}
                    </button>
                </div>
            </div>
        </section>
    );
}