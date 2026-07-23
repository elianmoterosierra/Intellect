export function CalendarCard() {
    return (
        <>
            <div className="col-span-12 md:col-span-7 fade-in-section bg-white border border-gray-200 p-8 rounded-2xl transition-shadow duration-300 hover:shadow-md">
                <div className="mb-2">
                    <span className="material-symbols-outlined text-[32px] text-[#0058be] mb-4 block">calendar_month</span>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Calendario Inteligente</h3>
                    <p className="text-sm text-gray-500">Sistema de urgencia visual para priorizar lo que realmente importa.</p>
                </div>
                <div className="grid grid-cols-7 gap-2 border-t border-gray-200 pt-6 mt-6">
                    <div className="aspect-square bg-gray-100 rounded p-1 flex flex-col justify-between">
                        <span className="text-[10px] font-bold opacity-40">14</span>
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                    <div className="aspect-square bg-gray-100 rounded p-1 flex flex-col justify-between">
                        <span className="text-[10px] font-bold opacity-40">15</span>
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    </div>
                    <div className="aspect-square bg-[rgba(0,88,190,0.1)] border border-[#0058be] rounded p-1 flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-[#0058be]">16</span>
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                    </div>
                    <div className="aspect-square bg-gray-100 rounded p-1 flex flex-col justify-between">
                        <span className="text-[10px] font-bold opacity-40">17</span>
                    </div>
                    <div className="aspect-square bg-gray-100 rounded p-1 flex flex-col justify-between">
                        <span className="text-[10px] font-bold opacity-40">18</span>
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                    <div className="aspect-square bg-gray-100 rounded p-1 flex flex-col justify-between">
                        <span className="text-[10px] font-bold opacity-40">19</span>
                    </div>
                    <div className="aspect-square bg-gray-100 rounded p-1 flex flex-col justify-between">
                        <span className="text-[10px] font-bold opacity-40">20</span>
                    </div>
                </div>
            </div>
        </>
    )
}