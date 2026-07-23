import { useAuthStore } from "../../../../store/AuthStore";

export function HeaderDashboard() {
    const { userName } = useAuthStore();
    return (
        <header className="mb-8">
            <h2 className="text-[36px] leading-[44px] font-bold tracking-tight text-[#191b23] mb-1">
                Bienvenido de nuevo, {userName}
            </h2>
            <p className="text-base leading-6 text-[#424754]">
                Aquí está tu resumen de progreso académico.
            </p>
        </header>
    )
}