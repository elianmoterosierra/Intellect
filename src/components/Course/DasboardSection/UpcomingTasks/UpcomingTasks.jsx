import { TaskItem } from './TaskItem/TaskItem';
import { AddTaskButton } from './AddTask/AddTaskButton';


export function UpcomingTasks({ tasks, courseId }) {
    return (
        <div className=" md:col-span-12 bg-white rounded-xl border border-[#c2c6d6] shadow-sm overflow-hidden mt-2">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#c2c6d6] flex justify-between items-center bg-[rgba(242,243,253,0.3)]">
                <h3 className="text-2xl leading-8 font-semibold tracking-tight text-[#191b23]">Próximas Tareas</h3>
                <button className="bg-transparent border-none text-[#0058be] text-xs leading-4 tracking-widest font-semibold cursor-pointer hover:underline">
                    Ver todas las tareas
                </button>
            </div>

            {/* Task list */}
            <ul className="list-none p-0 m-0">
                {tasks.length === 0 ? (
                    <li className="px-6 py-8 text-center text-[#424754]">
                        Todavía no tienes tareas.
                    </li>
                ) : (
                    tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            courseId={courseId}
                        />
                    ))
                )}
            </ul>


            {/* Add button */}
            <div className="flex justify-center my-4">
                <AddTaskButton courseId={courseId} />
            </div>
        </div>
    )
}
