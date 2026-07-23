import { HeaderDashboard } from './Header/HeaderDashboard';
import { Notification } from './Notification/Notification';
import { TaskSummary } from './TaskSummary/TaskSummary';
import { UpcomingTasks } from './UpcomingTasks/UpcomingTasks';
import { useTaskStore } from '../../../store/taskStorage';

const EMPTY_TASKS = [];

export default function Dashboard({ course }) {
    const tasks = useTaskStore((state) => state.tasksByCourse[course.id] ?? EMPTY_TASKS);

    return (
        <div className="p-4 md:p-10">
            <HeaderDashboard />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-min">
                <Notification tasks={tasks} />
                <TaskSummary tasks={tasks} />
                <UpcomingTasks tasks={tasks} courseId={course.id} />
            </div>
        </div>
    );
}
