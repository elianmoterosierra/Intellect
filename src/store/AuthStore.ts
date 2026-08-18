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
    selected_course_id: number | null;
    task_status: TaskStatusMap | null;
};

function mapRow(row: UsuarioRow): User {
    return {
        id: row.id,
        name: row.name,
        email: row.gmail,
        selectedCourseId: row.selected_course_id,
        taskStatusByCourse: row.task_status ?? {},
    };
}

interface AuthActions {
    login: (credentials: { email: string; password: string }) => Promise<LoginResult>;
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

        await fetch(`http://localhost:3000/api/email/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                to: normalizedEmail,
                subject: "Gracias por Registrarte",
                html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 8px;">
        <h1 style="font-size: 22px; color: #1f2937;">¡Gracias por registrarte, ${name.trim()}!</h1>
        <p style="font-size: 16px; color: #374151; line-height: 1.5;">
          Tu cuenta en nuestra plataforma ha sido creada exitosamente. Ya puedes iniciar sesión y comenzar a usarla.
        </p>
        <p style="font-size: 16px; color: #374151; line-height: 1.5;">
          Si tienes alguna pregunta, puedes responder directamente a este correo y con gusto te ayudamos.
        </p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="font-size: 12px; color: #9ca3af;">
          Recibiste este correo porque te registraste en [nombre de tu plataforma] ([tu-dominio.com]).
        </p>
      </div>
    `,
    text: `¡Gracias por registrarte, ${name.trim()}!\n\nTu cuenta en nuestra plataforma ha sido creada exitosamente. Ya puedes iniciar sesión y comenzar a usarla.\n\nSi tienes alguna pregunta, responde directamente a este correo.\n\n---\nRecibiste este correo porque te registraste en Intellect (https://intellect-pearl.vercel.app/).`,
}),
        }).catch(error => console.error('Error al enviar correo de bienvenida:', error));
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
        return mapRow(data as UsuarioRow);
    },

    restoreSession: async () => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const sessionUser = sessionData.session?.user;
            if (!sessionUser) {
                set({ isLoggedIn: false, user: null });
                return;
            }

            const user = await get().fetchProfile(sessionUser.id);
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
