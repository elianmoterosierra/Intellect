import { getTaskNotifications } from '../../../../utils/taskNotifications';
import type { TaskWithCompleted } from '../../../../types';

type NotificationProps = {
    tasks: TaskWithCompleted[];
};

type NotificationItemProps = {
    title: string;
    subtitle: string;
    type: 'urgent' | 'normal';
};

export function Notification({ tasks }: NotificationProps) {
    const notifications = getTaskNotifications(tasks).slice(0, 4);

    return (
        <div className="md:col-span-8 bg-surface rounded-xl border border-line p-6 shadow-sm flex flex-col gap-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-xl leading-7 font-semibold text-ink">Notificaciones</h3>
                <span className="material-symbols-outlined text-brand">notifications_active</span>
            </div>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {notifications.length === 0 ? (
                    <p className="md:col-span-2 py-5 text-center text-sm text-ink-faint">No tienes tareas pendientes.</p>
                ) : notifications.map((n) => (
                    <NotificationItem
                        key={n.id}
                        title={n.title}
                        subtitle={n.subtitle}
                        type={n.urgent ? 'urgent' : 'normal'}
                    />
                ))}
            </div>
        </div>
    )
}

export function NotificationItem({ title, subtitle, type }: NotificationItemProps) {
    const isUrgent = type === 'urgent';
    return (
        <div className={`p-2 rounded-lg border ${isUrgent
            ? 'bg-red-50 border-l-4 border-danger'
            : 'bg-muted border-line'
            }`}>
            <p className={`text-sm leading-5 font-semibold ${isUrgent ? 'text-danger' : 'text-ink'}`}>
                {title.length > 10 ? title.slice(0, 10) + '…' : title}
            </p>
            <p className={`text-xs leading-4 tracking-wider font-semibold uppercase mt-0.5 ${isUrgent ? 'text-danger opacity-80' : 'text-ink-soft'}`}>
                {subtitle}
            </p>
        </div>
    )
}
