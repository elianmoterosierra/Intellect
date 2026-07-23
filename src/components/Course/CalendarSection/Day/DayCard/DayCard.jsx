import { memo, useState } from 'react';
import { getTaskStatusConfig } from '../../../../../utils/taskStatus';
import { DayModal } from '../DayModal/DayModal';
import { EMPTY_TASKS } from '../../../../../Hooks/useMonthDay';
import { useTaskStore } from '../../../../../store/taskStorage';

const typeStyles = {
    past: 'opacity-50 bg-[#f2f3fd]',
    today: 'bg-amber-50 border-2 border-amber-400 shadow-sm',
    tomorrow: 'bg-white border-2 border-[#0058be] shadow-md',
    future: 'bg-white',
    weekend: 'bg-[#f2f3fd] opacity-70',
};

export const DayCard = memo(function DayCard({ day, year, month, courseId }) {
    const { name, number, type } = day;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const courseTasks = useTaskStore((state) => state.tasksByCourse[courseId] ?? EMPTY_TASKS);
    const addTask = useTaskStore((state) => state.addTask);
    const toggleTask = useTaskStore((state) => state.toggleTask);
    const tasks = courseTasks.filter((task) => {
        const date = new Date(task.dueDate);
        return date.getFullYear() === year && date.getMonth() === month && date.getDate() === number;
    });

    const isTomorrow = type === 'tomorrow';
    const isToday = type === 'today';
    const cardDate = new Date(year, month, number);

    return (
        <>
            <div
                className={`relative rounded-xl border border-[#c2c6d6] p-3 flex flex-col gap-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${typeStyles[type] ?? typeStyles.future}`}
                onClick={() => setIsModalOpen(true)}
            >
                {(isTomorrow || isToday) && <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${isTomorrow ? 'bg-[#0058be]' : 'bg-amber-400'}`} />}

                <div className="flex justify-between items-center">
                    <span className={`text-xs font-semibold ${isTomorrow ? 'text-[#0058be]' : isToday ? 'text-amber-600' : 'text-[#424754]'}`}>{name}</span>
                    <span className={`text-sm font-semibold ${isTomorrow ? 'text-[#0058be]' : isToday ? 'text-amber-600' : 'text-[#191b23]'}`}>{number}</span>
                </div>

                <div className="flex flex-col gap-1">
                    {tasks.map((task) => {
                        const status = getTaskStatusConfig(new Date(task.dueDate ?? cardDate));
                        return (
                            <div key={task.id} className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${task.completed ? 'bg-gray-100 text-gray-400 line-through' : status.pillBg}`}>
                                {status.icon && !task.completed && <span className="material-symbols-outlined text-[12px] leading-none">{status.icon}</span>}
                                <span className="truncate">{task.title}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="text-[10px] text-[#424754] opacity-60 mt-auto">Click para ver detalles</div>
            </div>

            {isModalOpen && (
                <DayModal
                    day={day}
                    tasks={tasks}
                    courseId={courseId}
                    year={year}
                    month={month}
                    onClose={() => setIsModalOpen(false)}
                    onAddTask={addTask}
                    onToggleTask={toggleTask}
                />
            )}
        </>
    );
});
