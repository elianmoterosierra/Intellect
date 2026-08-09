import type { NotificationItem, TaskWithCompleted } from '../types';
import { getDaysDifference } from './taskStatus';

function dueLabel(dateString: string): string {
    const days = getDaysDifference(dateString);
    if (days === null) return `Vence el ${new Date(dateString).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}`;
    if (days < 0) return `Vencida hace ${Math.abs(days)} día${Math.abs(days) === 1 ? '' : 's'}`;
    if (days === 0) return 'Vence hoy';
    if (days === 1) return 'Vence mañana';
    return `Vence el ${new Date(dateString).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}`;
}

export function getTaskNotifications(tasks: TaskWithCompleted[]): NotificationItem[] {
    return tasks
        .filter((task) => {
            if (!task.dueDate) return false;
            const days = getDaysDifference(task.dueDate);
            return days !== null && days >= 0 && !task.completed;
        })
        .sort((first, second) => new Date(first.dueDate).getTime() - new Date(second.dueDate).getTime())
        .map((task) => ({
            id: task.id,
            title: task.title,
            subtitle: dueLabel(task.dueDate),
            urgent: (getDaysDifference(task.dueDate) ?? 0) <= 1,
        }));
}