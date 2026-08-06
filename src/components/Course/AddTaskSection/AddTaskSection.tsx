import { AddTaskButton } from "../DashboardSection/UpcomingTasks/AddTask/AddTaskButton";

import { TaskList } from "./TaskList/TaskList";

type AddTaskSectionProps = {
    courseId: number;
};

export default function AddTaskSection({ courseId }: AddTaskSectionProps) {


    return (
        <section data-testid="add-task-section" className="p-4 md:p-10">
            <div className="">
                <div className="flex flex-col items-center">
                    <h2 className="text-[36px] leading-[44px] font-bold tracking-tight text-ink mb-2">
                        Agregar tareas
                    </h2>
                    <p className="text-[20px] leading-6 text-ink-soft mb-4">
                        Las tareas se muestran para todos del curso
                    </p>
                </div>
                <div className="mb-5 mx-auto  rounded-lg w-48 h-12 left-7">
                    <AddTaskButton courseId={courseId} />
                </div>

                <div className="bg-surface rounded-lg border border-line shadow-sm overflow-hidden max-w-2xl mx-auto">
                    <div className="px-4 py-2.5 border-b border-line bg-muted/50 flex items-center justify-center">
                        <h3 className="text-sm leading-5 font-semibold tracking-tight text-ink">
                            Tareas del curso
                        </h3>
                    </div>

                    <TaskList courseId={courseId} />
                </div>
            </div>
        </section>
    );
}
