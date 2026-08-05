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
                    <h2 className="text-[36px] leading-[44px] font-bold tracking-tight text-[#191b23] mb-2">
                        Agregar tareas
                    </h2>
                    <p className="text-[20px] leading-6 text-[#424754] mb-4">
                        Las tareas se muestran para todos del curso
                    </p>
                </div>
                <div className="mb-5 mx-auto  rounded-lg w-48 h-12 left-7">
                    <AddTaskButton courseId={courseId} />
                </div>

                <div className="bg-white rounded-lg border border-[#c2c6d6] shadow-sm overflow-hidden max-w-2xl mx-auto">
                    <div className="px-4 py-2.5 border-b border-[#c2c6d6] bg-[rgba(242,243,253,0.3)] flex items-center justify-center">
                        <h3 className="text-sm leading-5 font-semibold tracking-tight text-[#191b23]">
                            Tareas del curso
                        </h3>
                    </div>

                    <TaskList courseId={courseId} />
                </div>
            </div>
        </section>
    );
}
