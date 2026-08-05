import type { NotificationItem, TaskWithCompleted } from '../types';

function daysUntil(dateString: string): number {
    const target = new Date(dateString);
    const today = new Date();
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function dueLabel(dateString: string): string {
    const days = daysUntil(dateString);
    if (days < 0) return `Vencida hace ${Math.abs(days)} día${Math.abs(days) === 1 ? '' : 's'}`;
    if (days === 0) return 'Vence hoy';
    if (days === 1) return 'Vence mañana';
    return `Vence el ${new Date(dateString).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}`;
}

export function getTaskNotifications(tasks: TaskWithCompleted[]): NotificationItem[] {
    return tasks
        .filter((task) => !task.completed && task.dueDate)
        .sort((first, second) => new Date(first.dueDate).getTime() - new Date(second.dueDate).getTime())
        .map((task) => {
            const days = daysUntil(task.dueDate);
            return {
                id: task.id,
                title: task.title,
                subtitle: dueLabel(task.dueDate),
                urgent: days <= 1,
            };
        });
}