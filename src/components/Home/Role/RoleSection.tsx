import { RoleCard } from "../../CardRol/RoleCard"

export function RoleSection() {
    return (
        <section className="bg-gray-100/30 px-10 py-24" id="roles">
            <div className="flex flex-col md:flex-row gap-8 max-w-[1280px] mx-auto md:w-4/5">
                <RoleCard
                    title="Para Estudiantes"
                    features={[
                        "Notificaciones inteligentes",
                        "Calendario personalizable",
                        "Métricas de rendimiento",
                    ]}
                />
            </div>
        </section>
    )
}