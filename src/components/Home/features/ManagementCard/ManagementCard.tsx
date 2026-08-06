export function ManagementCard() {
    return (
        <div className="col-span-12 fade-in-section bg-surface border border-gray-200 p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-8 hover:shadow-md transition-shadow duration-300">
            {/* Info half */}
            <div className="flex-1">
                <span className="material-symbols-outlined text-[32px] text-brand mb-4 block">hub</span>
                <h3 className="text-2xl font-semibold text-ink mb-2">Gestión Centralizada</h3>
                <p className="text-sm text-ink-soft">
                    Para instituciones y administradores: delega tareas, monitorea el desempeño grupal y mantén a todos en la misma página.
                </p>
            </div>

            {/* Task list half */}
            <div className="flex-1 flex flex-col gap-3 w-full">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <span className="material-symbols-outlined text-brand">person</span>
                        <strong className="text-sm text-ink">Asignar Proyecto Final</strong>
                    </div>
                    <span className="text-xs px-3 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold">Pendiente</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <span className="material-symbols-outlined text-brand">groups</span>
                        <strong className="text-sm text-ink">Revisión de Notas</strong>
                    </div>
                    <span className="text-xs px-3 py-0.5 rounded-full bg-green-100 text-green-800 font-semibold">Completado</span>
                </div>
            </div>
        </div>
    )
}