import { Outlet, useLocation } from 'react-router'
import { Header } from '../Header/header'
import { useEffect } from 'react'

export function Layout() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    return (
        <>
            <div className="min-h-screen bg-[#F8FAFC]">
                <Header />
                <Outlet />
            </div>
        </>
    )
}
