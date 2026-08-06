import { CalendarCard } from "./CalendarCard/Calendar";
import { Progress } from "./Progress/Progress";
import { ManagementCard } from "./ManagementCard/ManagementCard";

export function FeaturesSection() {
    return (
        <section className="py-24 px-10 max-w-[1280px] mx-auto" id="features">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-ink mb-4">Herramientas para el Éxito</h2>
                <p className="text-ink-soft max-w-[600px] mx-auto">
                    Diseñamos cada componente para eliminar el ruido y potenciar tu productividad académica diaria.
                </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* 💡 SUB-COMPONENTE: <CalendarFeatureCard /> */}
                <CalendarCard />
                {/* --- FIN <CalendarFeatureCard /> --- */}

                {/* 💡 SUB-COMPONENTE: <ProgressFeatureCard /> */}
                <Progress />
                {/* --- FIN <ProgressFeatureCard /> --- */}

                {/* 💡 SUB-COMPONENTE: <ManagementFeatureCard /> */}
                <ManagementCard />
                {/* --- FIN <ManagementFeatureCard /> --- */}
            </div>
        </section>
    )
}