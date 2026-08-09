import { create } from 'zustand';
import { supabase } from '../lib/supabase';

import type {
    AuthState,
    LoginResult,
    RegisterResult,
    TaskStatusMap,
    User,
} from '../types';

type UsuarioRow = {
    id: string;
    name: string;
    gmail: string;
    password: string;
    selected_course_id: number | null;
    task_status: TaskStatusMap | null;
};

function mapRow(row: UsuarioRow): User {
    return {
        id: row.id,
        name: row.name,
        email: row.gmail,
        password: row.password,
        selectedCourseId: row.selected_course_id,
        taskStatusByCourse: row.task_status ?? {},
    };
}

interface AuthActions {
    login: (credentials: { email: string; password: string }) => Promise<LoginResult>;
    register: (data: { name: string; email: string; password: string }) => Promise<RegisterResult>;
    updateUser: (field: keyof Pick<User, 'name' | 'email' | 'password'>, value: string) => Promise<void>;
    setSelectedCourse: (courseId: number | null) => void;

    toggleTaskStatus: (courseId: number, taskId: string) => void;
    logout: () => Promise<void>;
    fetchProfile: (userId: string) => Promise<User | null>;
    restoreSession: () => Promise<void>;
}

const USER_COLUMN_BY_FIELD: Record<keyof Pick<User, 'name' | 'email' | 'password'>, string> = {
    name: 'name',
    email: 'gmail',
    password: 'password',
};

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    isLoggedIn: false,
    user: null,

    login: async ({ email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();

        const { data, error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
        });

        if (error || !data.user) {
            return { success: false, error: "Email o contraseña incorrectos." };
        }

        const user = await get().fetchProfile(data.user.id);
        if (!user) {
            return { success: false, error: "No se encontró el perfil del usuario." };
        }

        set({ isLoggedIn: true, user });
        return { success: true, user };
    },

    register: async ({ name, email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: normalizedEmail,
            password,
        });

        if (signUpError || !signUpData.user) {
            console.error('[signUp] error:', signUpError?.status, signUpError?.code, signUpError?.message ?? signUpError);
            if (signUpError?.status === 429 || signUpError?.code === "over_email_send_rate_limit") {
                return {
                    success: false,
                    error: "Se alcanzó el límite de registros por hora del proyecto. Vuelve a intentarlo en la próxima hora.",
                };
            }

            return { success: false, error: signUpError?.message ?? "Error al crear la cuenta." };
        }

        const { data, error } = await supabase
            .from("usuarios")
            .insert([{
                id: signUpData.user.id,
                name: name.trim(),
                gmail: normalizedEmail,
                password,
                task_status: {},
                selected_course_id: null,
            }])
            .select("*")
            .limit(1)
            .single();

        if (error || !data) {
            return { success: false, error: "Error al registrar usuario." };
        }

        const user = mapRow(data as UsuarioRow);
        set({ isLoggedIn: true, user });
        return { success: true, user };
    },

    setSelectedCourse: async (courseId) => {
        const currentUser = get().user;
        if (!currentUser) return;

        await supabase
            .from('usuarios')
            .update({ selected_course_id: courseId })
            .eq('id', currentUser.id);

        const user = { ...currentUser, selectedCourseId: courseId };
        set({ user });
    },

    updateUser: async (field, value) => {
        const currentUser = get().user;
        if (!currentUser) return;

        if (field === 'email' || field === 'password') {
            const { error } = await supabase.auth.updateUser({ [field]: value });
            if (error) return;
        }

        const updatedUser = { ...currentUser, [field]: value };

        await supabase
            .from('usuarios')
            .update({ [USER_COLUMN_BY_FIELD[field]]: value })
            .eq('id', currentUser.id);

        set({ user: updatedUser });
    },

    toggleTaskStatus: async (courseId, taskId) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const courseStatus = currentUser.taskStatusByCourse?.[courseId] ?? {};
        const currentTask = courseStatus[taskId] ?? { completed: false };
        const user = {
            ...currentUser,
            taskStatusByCourse: {
                ...currentUser.taskStatusByCourse,
                [courseId]: {
                    ...courseStatus,
                    [taskId]: { ...currentTask, completed: !currentTask.completed },
                },
            },
        };

        await supabase
            .from('usuarios')
            .update({ task_status: user.taskStatusByCourse })
            .eq('id', currentUser.id);

        set({ user });
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({ isLoggedIn: false, user: null });
    },

    fetchProfile: async (userId) => {
        const { data, error } = await supabase
            .from("usuarios")
            .select("*")
            .eq("id", userId)
            .limit(1)
            .single();

        if (error || !data) return null;
        return mapRow(data as UsuarioRow);
    },

    restoreSession: async () => {
        const { data: sessionData } = await supabase.auth.getSession();
        const sessionUser = sessionData.session?.user;
        if (!sessionUser) return;

        const user = await get().fetchProfile(sessionUser.id);
        if (!user) return;

        set({ isLoggedIn: true, user });
    },
}));