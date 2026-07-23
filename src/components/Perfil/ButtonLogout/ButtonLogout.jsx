import { useAuthStore } from "../../../store/AuthStore";


export function ButtonLogout({ onClose }) {
    const { logout } = useAuthStore();


    const handleLogout = () => {
        logout();
        onClose();
        window.location.assign("/");
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
