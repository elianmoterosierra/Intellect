import { useTaskStore } from '../../../../store/taskStorage';
import { getTaskNotifications } from '../../../../utils/taskNotifications';

const EMPTY_TASKS = [];

export function NotificationPanel({ courseId, onClose }) {
    const tasks = useTaskStore((state) => state.tasksByCourse[courseId] ?? EMPTY_TASKS);
    const notifications = getTaskNotifications(tasks);

    return (
        <div className="notification-panel">
            <div className="notification-header">
                <h3 className="notification-header-title">Notificaciones</h3>
                <button className="icon-close" onClick={onClose} aria-label="Cerrar notificaciones">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            <div className="notification-list">
                {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-[#727785]">No tienes tareas pendientes.</p>
                ) : notifications.map((notification) => (
                    <div className="notification-item" key={notification.id}>
                        <span className={`material-symbols-outlined ${notification.urgent ? 'text-warning' : 'text-info'}`}>
                            {notification.urgent ? 'warning' : 'assignment'}
                        </span>
                        <div>
                            <p className="notification-item-text font-semibold">{notification.title}</p>
                            <p className="notification-item-time">{notification.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
