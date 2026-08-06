import { useAuthStore } from "../../../../store/AuthStore";

export function HeaderDashboard() {
    const { user } = useAuthStore();
    return (
        <header className="mb-8">
            <h2 className="text-[36px] leading-[44px] font-bold tracking-tight text-ink mb-1">
                Bienvenido de nuevo, {user?.name ?? 'estudiante'}
            </h2>
            <p className="text-base leading-6 text-ink-soft">
                Aquí está tu resumen de progreso académico.
            </p>
        </header>
    )
}
