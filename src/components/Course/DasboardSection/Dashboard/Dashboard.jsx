import { HeaderDashboard } from '../Header/HeaderDashboard';
import { Notification } from '../Notification/Notification';
import { TaskSummary } from '../TaskSummary/TaskSummary';
import { UpcomingTasks } from '../UpcomingTasks/UpcomingTasks';

export default function Dashboard({ course }) {
    return (
        <div className="p-4 md:p-10">
            <HeaderDashboard />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-min">
                <Notification notification={course.notification} />
                <TaskSummary tasks={course.task} courseId={course.id} />
                <UpcomingTasks task={course.task} courseId={course.id} />
            </div>
        </div>
    );
}
