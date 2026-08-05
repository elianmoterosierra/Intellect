export type NotificationItem = {
    id: number | string;
    title: string;
    subtitle: string;
    urgent: boolean;
};

export type Course = {
    id: number;
    title: string;
    description: string;
    icon: string;
    notification: NotificationItem[];
};

export type Task = {
    id: string;
    title: string;
    subtitle: string;
    dueDate: string;
    hour: string;
    description?: string;
};

export type TaskWithCompleted = Task & { completed: boolean };

/** Estado `completed` por curso y tarea, almacenado en el perfil del usuario. */
export type TaskStatusMap = Record<string, Record<string, { completed: boolean }>>;

export type User = {
    name: string;
    email: string;
    password: string;
    selectedCourseId: number | null;
    taskStatusByCourse: TaskStatusMap;
};

export type AuthState = {
    isLoggedIn: boolean;
    user: User | null;
    users: User[];
};

export type LoginResult = { success: boolean; user?: User; error?: string };
export type RegisterResult = LoginResult;

export type CourseId = string | number;

export type TaskStatus = 'overdue' | 'tomorrow' | 'dayAfterTomorrow' | 'normal';

export type TaskStatusConfig = {
    diff: number | null;
    status: TaskStatus;
    bgColor: string;
    borderColor: string;
    textColor: string;
    pillBg: string;
    icon: string | null;
    badgeText: string | null;
};

export type MonthRef = { year: number; month: number };

export type DayType = 'today' | 'tomorrow' | 'past' | 'weekend' | 'future';

export type CalendarDay = {
    id: string;
    name: string;
    number: number;
    type: DayType;
};