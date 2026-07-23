import { TaskItem } from './TaskItem/TaskItem';

export function UpcomingTasks({ task, courseId }) {
    return (
        <div className="md:col-span-12 bg-white rounded-xl border border-[#c2c6d6] shadow-sm overflow-hidden mt-2">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#c2c6d6] flex justify-between items-center bg-[rgba(242,243,253,0.3)]">
                <h3 className="text-2xl leading-8 font-semibold tracking-tight text-[#191b23]">Próximas Tareas</h3>
                <button className="bg-transparent border-none text-[#0058be] text-xs leading-4 tracking-widest font-semibold cursor-pointer hover:underline">
                    Ver todas las tareas
                </button>
            </div>

            {/* Task list */}
            <ul className="list-none p-0 m-0">
                {task.map((t) => (
                    <TaskItem
                        key={t.id}
                        title={t.title}
                        subtitle={t.subtitle}
                        hour={t.hour}
                        dueDate={t.dueDate}
                        taskId={t.id}
                        courseId={courseId}
                    />
                ))}
            </ul>

            {/* Add button */}
            <button className="flex items-center justify-center gap-2 w-full py-4 bg-transparent border-none border-t border-[#c2c6d6] text-[#0058be] text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#f2f3fd]">
                <span className="material-symbols-outlined">add</span>
                Nueva Tarea
            </button>
        </div>
    )
}
