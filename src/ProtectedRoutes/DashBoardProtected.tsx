import { Navigate } from "react-router";
import { useAuthStore } from "../store/AuthStore";
import type { ReactNode } from "react";

type DashBoardProtectedProps = {
    children: ReactNode;
};

export default function DashBoardProtected({ children }: DashBoardProtectedProps) {

    const { isLoggedIn } = useAuthStore();

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return children;
}
