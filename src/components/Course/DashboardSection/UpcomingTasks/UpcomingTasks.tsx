import { TaskItem } from './TaskItem/TaskItem';
import { AddTaskButton } from './AddTask/AddTaskButton';
import type { TaskWithCompleted } from '../../../../types';

type UpcomingTasksProps = {
    tasks: TaskWithCompleted[];
    courseId: number;
};

export function UpcomingTasks({ tasks, courseId }: UpcomingTasksProps) {
    return (
        <div className=" md:col-span-12 bg-surface rounded-xl border border-line shadow-sm overflow-hidden mt-2">
            {/* Header */}
            <div className="px-6 py-4 border-b border-line flex justify-between items-center bg-muted/50">
                <h3 className="text-2xl leading-8 font-semibold tracking-tight text-ink">Próximas Tareas</h3>
                <button className="bg-transparent border-none text-brand text-xs leading-4 tracking-widest font-semibold cursor-pointer hover:underline">
                    Ver todas las tareas
                </button>
            </div>

            {/* Task list */}
            <ul className="list-none p-0 m-0">
                {tasks.length === 0 ? (
                    <li className="px-6 py-8 text-center text-ink-soft">
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