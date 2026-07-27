import { getTaskNotifications } from '../../../../utils/taskNotifications';

export function Notification({ tasks }) {
    const notifications = getTaskNotifications(tasks).slice(0, 4);

    return (
        <div className="md:col-span-8 bg-white rounded-xl border border-[#c2c6d6] p-6 shadow-sm flex flex-col gap-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-xl leading-7 font-semibold text-[#191b23]">Notificaciones</h3>
                <span className="material-symbols-outlined text-[#0058be]">notifications_active</span>
            </div>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {notifications.length === 0 ? (
                    <p className="md:col-span-2 py-5 text-center text-sm text-[#727785]">No tienes tareas pendientes.</p>
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

export function NotificationItem({ title, subtitle, type }) {
    const isUrgent = type === 'urgent';
    return (
        <div className={`p-2 rounded-lg border ${isUrgent
            ? 'bg-red-50 border-l-4 border-[#ba1a1a]'
            : 'bg-[#f2f3fd] border-[#c2c6d6]'
            }`}>
            <p className={`text-sm leading-5 font-semibold ${isUrgent ? 'text-[#ba1a1a]' : 'text-[#191b23]'}`}>
                {title.length > 10 ? title.slice(0, 10) + '…' : title}
            </p>
            <p className={`text-xs leading-4 tracking-wider font-semibold uppercase mt-0.5 ${isUrgent ? 'text-[#ba1a1a] opacity-80' : 'text-[#424754]'}`}>
                {subtitle}
            </p>
        </div>
    )
}
