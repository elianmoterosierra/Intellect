import { useAuthStore } from "../../../store/AuthStore";
import { useNavigate } from "react-router";
import { useCourseStore } from "../../../store/courseStore";

export function ButtonLogout({ onClose }) {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const { handleLeave } = useCourseStore()

    const handleLogout = () => {
        logout();
        onClose();
        navigate("/");
        handleLeave();
        localStorage.removeItem('selectedCourses');


    };
    return (
        <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl font-medium hover:bg-red-50 text-red-600 transition-colors border-none"
        >
            Cerrar sesión
        </button>
    );
}