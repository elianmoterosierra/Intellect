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
export type CourseRole = 'student' | 'manager';

export type Task = {
    id: string;
    title: string;
    subtitle: string;
    dueDate: string;
    hour: string;
    description?: string;
    subjectId?: string;
    startTime?: string;
    endTime?: string;
};

export type TaskWithCompleted = Task & { completed: boolean };

export type TaskProgressUser = {
    id: string;
    name: string;
};

export type TaskProgressSummary = {
    total: number;
    completedCount: number;
    pendingCount: number;
    completedUsers: TaskProgressUser[];
    pendingUsers: TaskProgressUser[];
};

export type CourseMemberSummary = {
    id: string;
    name: string;
    email: string;
    completedTasks: number;
    overdueTasks: number;
    joinedAt: string;
};

export type SubjectColor = 'blue' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange';

export type SubjectWeekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export type SubjectSchedule = {
    id: string;
    weekday: SubjectWeekday;
    startTime: string;
    endTime: string;
};

export type Subject = {
    id: string;
    courseId: number;
    name: string;
    teacher: string;
    description: string;
    meetingUrl?: string;
    color: SubjectColor;
    schedules: SubjectSchedule[];
    createdAt: string;
};

/** Estado `completed` por curso y tarea, almacenado en el perfil del usuario. */
export type TaskStatusMap = Record<string, Record<string, { completed: boolean }>>;

export type User = {
    id: string;
    name: string;
    email: string;

    selectedCourseId: number | null;
    taskStatusByCourse: TaskStatusMap;
    isAdmin: boolean;
    courseRoles: Record<string, CourseRole>;
};

export type AuthState = {
    isLoggedIn: boolean;
    sessionReady: boolean;
    user: User | null;
};

export type LoginResult = { success: boolean; user?: User; error?: string };

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
