export function ManagementOverview() {
    return (
        <div className="col-span-12 flex min-h-48 items-center justify-center rounded-2xl border border-gray-200 bg-surface p-8 text-center transition-shadow duration-300 fade-in-section hover:shadow-md">
            <div className="max-w-2xl">
                <span className="material-symbols-outlined mb-4 block text-[32px] text-brand">admin_panel_settings</span>
                <h3 className="mb-2 text-2xl font-semibold text-ink">Gestión Centralizada</h3>
                <p className="text-sm text-ink-soft">
                    Para instituciones y administradores: delega tareas, monitorea el desempeño grupal y mantén a todos en la misma página.
                </p>
            </div>
        </div>
    );
}
