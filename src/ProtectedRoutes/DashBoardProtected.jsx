import { Navigate } from "react-router";
import { useAuthStore } from "../store/AuthStore.js";

export default function DashBoardProtected({ children }) {

    const { isLoggedIn } = useAuthStore();

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return children;
}