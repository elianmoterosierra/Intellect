import { create } from 'zustand';
import { supabase } from '../lib/supabase';

import type {
    AuthState,
    CourseRole,
    LoginResult,
    RegisterResult,
    TaskStatusMap,
    User,
} from '../types';

type UsuarioRow = {
    id: string;
    name: string;
    gmail: string;
    selected_course_id: number | null;
    task_status: TaskStatusMap | null;
    is_admin: boolean;
    
};

function mapRow(row: UsuarioRow, courseRoles: Record<string, CourseRole> = {}): User {
    return {
        id: row.id,
        name: row.name,
        email: row.gmail,
        selectedCourseId: row.selected_course_id,
        taskStatusByCourse: row.task_status ?? {},
        isAdmin: row.is_admin,
        courseRoles,
    };
}

interface AuthActions {
    login: (credentials: { email: string; password: string }) => Promise<LoginResult>;
    loginWithGoogle: () => Promise<LoginResult>;
    register: (data: { name: string; email: string; password: string }) => Promise<RegisterResult>;
    updateUser: (field: EditableUserField, value: string) => Promise<boolean>;
    setSelectedCourse: (courseId: number | null) => Promise<boolean>;
    setSelectedCourseLocal: (courseId: number | null) => void;

    toggleTaskStatus: (courseId: number, taskId: string) => void;
    logout: () => Promise<void>;
    fetchProfile: (userId: string) => Promise<User | null>;
    restoreSession: () => Promise<void>;
}

type EditableUserField = 'name' | 'email' | 'password';

const USER_COLUMN_BY_FIELD: Record<'name' | 'email', string> = {
    name: 'name',
    email: 'gmail',
};

async function ensureProfile(userId: string, email: string | undefined, metadata: Record<string, unknown>, preferredName?: string): Promise<boolean> {
    if (!email) return false;

    const metadataName = typeof metadata.full_name === 'string'
        ? metadata.full_name
        : typeof metadata.name === 'string' ? metadata.name : '';
    const name = preferredName?.trim() || metadataName.trim() || email.split('@')[0] || 'Usuario';
    const { error } = await supabase.from('usuarios').insert({
        id: userId,
        name,
        gmail: email,
        task_status: {},
        selected_course_id: null,
        is_admin: false,
    });

    if (error && error.code !== '23505') {
        console.error('[ensureProfile] error:', error.message);
        return false;
    }
    return true;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    isLoggedIn: false,
    sessionReady: false,
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

        let user = await get().fetchProfile(data.user.id);
        if (!user) {
            await ensureProfile(data.user.id, data.user.email, data.user.user_metadata as Record<string, unknown>);
            user = await get().fetchProfile(data.user.id);
        }
        if (!user) {
            return { success: false, error: "No se encontró el perfil del usuario." };
        }

        set({ isLoggedIn: true, user });
        return { success: true, user };
    },

    loginWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/course`,
            },
        });

        if (error) {
            console.error('[googleSignIn] error:', error.message);
            return { success: false, error: 'No se pudo iniciar sesión con Google.' };
        }

        return { success: true };
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

        if (!signUpData.session) {
            return {
                success: false,
                error: 'Cuenta creada. Revisa tu correo para confirmar la cuenta antes de iniciar sesión.',
            };
        }

        const { data, error } = await supabase
            .from("usuarios")
            .insert([{
                id: signUpData.user.id,
                name: name.trim(),
                gmail: normalizedEmail,

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
        if (!currentUser) return false;

        const { error } = await supabase
            .from('usuarios')
            .update({ selected_course_id: courseId })
            .eq('id', currentUser.id);
        if (error) return false;

        const user = { ...currentUser, selectedCourseId: courseId };
        set({ user });
        return true;
    },

    setSelectedCourseLocal: (courseId) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({ user: { ...currentUser, selectedCourseId: courseId } });
    },

    updateUser: async (field: EditableUserField, value) => {
        const currentUser = get().user;
        if (!currentUser) return false;

        if (field === 'email' || field === 'password') {
            const { error } = await supabase.auth.updateUser({ [field]: value });
            if (error) return false;
        }

        const updatedUser = { ...currentUser, [field]: value };

        if (field !== 'password') {
            const { error } = await supabase
                .from('usuarios')
                .update({ [USER_COLUMN_BY_FIELD[field]]: value })
                .eq('id', currentUser.id);
            if (error) return false;
        }

        set({ user: field === 'password' ? currentUser : updatedUser });
        return true;
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
        const { error } = await supabase.auth.signOut();
        if (error) console.error('[logout] error:', error.message);
        if (!error) set({ isLoggedIn: false, user: null });
    },

    fetchProfile: async (userId) => {
        const { data, error } = await supabase
            .from("usuarios")
            .select("*")
            .eq("id", userId)
            .limit(1)
            .single();

        if (error || !data) return null;
        const { data: memberships } = await supabase
            .from('course_members')
            .select('course_id, role')
            .eq('user_id', userId);

        const courseRoles: Record<string, CourseRole> = {};

        for (const membership of memberships ?? []) {
            courseRoles[String(membership.course_id)] = membership.role;
        }

        return mapRow(data as UsuarioRow, courseRoles);
    },

    restoreSession: async () => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const sessionUser = sessionData.session?.user;
            if (!sessionUser) {
                set({ isLoggedIn: false, user: null });
                return;
            }

            let user = await get().fetchProfile(sessionUser.id);

            if (!user && sessionUser.app_metadata?.provider === 'google' && sessionUser.email) {
                const created = await ensureProfile(
                    sessionUser.id,
                    sessionUser.email,
                    sessionUser.user_metadata as Record<string, unknown>,
                );

                if (created) {
                    user = await get().fetchProfile(sessionUser.id);
                }
            }

            if (!user) {
                set({ isLoggedIn: false, user: null });
                return;
            }

            set({ isLoggedIn: true, user });
        } finally {
            set({ sessionReady: true });
        }
    },
}));
