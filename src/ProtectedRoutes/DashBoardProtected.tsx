import { Navigate } from "react-router";
import { useAuthStore } from "../store/AuthStore";
import type { ReactNode } from "react";

type DashBoardProtectedProps = {
    children: ReactNode;
};

export default function DashBoardProtected({ children }: DashBoardProtectedProps) {

    const { isLoggedIn, sessionReady } = useAuthStore();

    if (!sessionReady) {
        return <div className="min-h-screen bg-page" aria-busy="true" />;
    }

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }



    return children;
}
