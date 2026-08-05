import type { TaskWithCompleted } from '../../../../types';

type TaskSummaryProps = {
    tasks: TaskWithCompleted[];
};

export function TaskSummary({ tasks }: TaskSummaryProps) {
    const completedCount = tasks.filter((task) => task.completed).length;
    const total = tasks.length;
    const pendingCount = total - completedCount;
    const progress = total > 0
        ? Math.round((completedCount / total) * 100)
        : 0;

    return (
        <div className="md:col-span-4 bg-gradient-to-br from-[#2170e4] to-[#005ac2] text-[#fefcff] rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl leading-7 font-semibold">Resumen de Tareas</h3>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        checklist
                    </span>
                </div>
                <div className="flex items-baseline gap-6 mb-1">
                    <div>
                        <div className="text-[36px] leading-[44px] font-bold tracking-tight">{completedCount}</div>
                        <p className="text-sm leading-5 opacity-90">Completadas</p>
                    </div>
                    <div>
                        <div className="text-[36px] leading-[44px] font-bold tracking-tight">{pendingCount}</div>
                        <p className="text-sm leading-5 opacity-90">Pendientes</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex justify-between items-end mb-1">
                    <div>
                        <div className="text-xs leading-4 tracking-widest font-semibold uppercase opacity-80">Progreso</div>
                        <div className="text-xl leading-7 font-semibold">{progress}%</div>
                    </div>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#fefcff] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
            </div>
        </div>
    );
}
