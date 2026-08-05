export function Progress() {
    return (
        <div className="col-span-12 md:col-span-5 fade-in-section bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-md transition-shadow duration-300">
            <span className="material-symbols-outlined text-[32px] text-[#0058be] mb-4 block">analytics</span>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Seguimiento Académico</h3>
            <p className="text-sm text-gray-500 mb-8">
                Visualiza tu progreso en tiempo real con métricas detalladas.
            </p>

            <div className="flex flex-col gap-4">
                {/* Progress item */}
                <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-gray-700">Cálculo Multivariable</span>
                        <span className="text-[#0058be]">85%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0058be] rounded-full" style={{ width: '85%' }} />
                    </div>
                </div>
                {/* Progress item */}
                <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-gray-700">Historia Moderna</span>
                        <span className="text-[#0058be]">42%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0058be] rounded-full" style={{ width: '42%' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}