export type Course = {
    id: number;
    title: string;
    description: string;
    icon: string;
    notification?: NotificationItem[];
}

export type NotificationItem = {
    id: number;
    title: string;
    subtitle: string;
    urgent: boolean;
}