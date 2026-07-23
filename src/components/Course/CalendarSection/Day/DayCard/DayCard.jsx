import { memo, useState } from 'react';
import { getTaskStatusConfig } from "../../../../../utils/taskStatus";
import { DayModal } from '../DayModal/DayModal';
import { EMPTY_TASKS } from '../../../../../Hooks/useMonthDay';
import { useCalendarStore } from '../../../../../store/calendarStore';

const typeStyles = {
    past:     'opacity-50 bg-[#f2f3fd]',
    today:    'bg-amber-50 border-2 border-amber-400 shadow-sm',
    tomorrow: 'bg-white border-2 border-[#0058be] shadow-md',
    future:   'bg-white',
    weekend:  'bg-[#f2f3fd] opacity-70',
};

// Comparador custom: compara day.tasks por referencia (no el objeto day completo).
// useMonthDay siempre crea un objeto `day` nuevo en Array.from, pero preserva
// la misma referencia de array tasks para los días que no fueron modificados
// (el spread en setTasksByDate conserva todas las demás referencias).
// Esto permite que memo salte el re-render de DayCards no afectados.
function areDayCardPropsEqual(prev, next) {
    return (
        prev.day.tasks  === next.day.tasks  &&  // misma ref de array → no hubo cambios en este día
        prev.day.type   === next.day.type   &&  // mismo tipo (hoy/mañana/pasado/futuro)
        prev.year       === next.year       &&
        prev.month      === next.month      &&
        prev.onSelect   === next.onSelect       // setter de useState → siempre estable
    );
}

export const DayCard = memo(function DayCard({ day, year, month }) {
    const { name, number, type } = day;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const tasks = useCalendarStore((state) => state.tasksByDate[day.id] ?? EMPTY_TASKS);
    const addTask = useCalendarStore((state) => state.addTask);
    const toggleTask = useCalendarStore((state) => state.toggleTask);

    const isTomorrow    = type === 'tomorrow';
    const isActualToday = type === 'today';
    const cardStyle     = typeStyles[type] || typeStyles.future;

    const cardDate = (year !== undefined && month !== undefined && number)
        ? new Date(year, month, number)
        : null;

    return (
        <>
            <div
            className={`relative rounded-xl border border-[#c2c6d6] p-3 flex flex-col gap-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${cardStyle}`}
            onClick={() => setIsModalOpen(true)}
        >
            {/* Tomorrow bar (blue) */}
            {isTomorrow && <div className="absolute top-0 left-0 right-0 h-1 bg-[#0058be] rounded-t-xl" />}
            {/* Today bar (amber) */}
            {isActualToday && <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400 rounded-t-xl" />}

            {/* Day header */}
            <div className="flex justify-between items-center">
                <span className={`text-xs font-semibold
                    ${isTomorrow     ? 'text-[#0058be]' : ''}
                    ${isActualToday  ? 'text-amber-600' : ''}
                    ${!isTomorrow && !isActualToday ? 'text-[#424754]' : ''}
                `}>
                    {name}
                </span>

                {isTomorrow ? (
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[10px] font-bold text-[#0058be] uppercase tracking-wider">MAÑANA</span>
                        <span className="text-sm font-bold text-[#0058be]">{number}</span>
                    </div>
                ) : isActualToday ? (
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">HOY</span>
                        <span className="text-sm font-bold text-amber-600">{number}</span>
                    </div>
                ) : (
                    <span className="text-sm font-semibold text-[#191b23]">{number}</span>
                )}
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-1">
                {tasks.map((task, i) => {
                    const targetDate = task.dueDate ? new Date(task.dueDate) : cardDate;
                    const status = getTaskStatusConfig(targetDate);

                    return (
                        <div
                            key={task.id || i}
                            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-all ${
                                task.completed
                                    ? 'bg-gray-100 text-gray-400 line-through'
                                    : status.pillBg
                            }`}
                        >
                            {status.icon && !task.completed && (
                                <span className="material-symbols-outlined text-[12px] leading-none flex-shrink-0">{status.icon}</span>
                            )}
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
                    year={year}
                    month={month}
                    onClose={() => setIsModalOpen(false)}
                    onAddTask={addTask}
                    onToggleTask={toggleTask}
                />
            )}
        </>
    );
}, areDayCardPropsEqual);
