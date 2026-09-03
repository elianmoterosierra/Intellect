const STUDENT_FEATURES = [
    'Notificaciones inteligentes',
    'Calendario personalizable',
    'Métricas de rendimiento',
] as const;

export function StudentFeatureCard() {
    return (
        <article className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-surface p-8 text-center">
            <span className="material-symbols-outlined pointer-events-none absolute right-0 top-0 select-none p-6 text-[120px] text-brand opacity-5">
                school
            </span>
            <h3 className="relative text-xl font-semibold text-ink">Para estudiantes</h3>
            <ul className="relative mt-6 flex list-none flex-col items-center gap-4">
                {STUDENT_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-ink-soft">
                        <span className="material-symbols-outlined text-brand">check_circle</span>
                        {feature}
                    </li>
                ))}
            </ul>
        </article>
    );
}
