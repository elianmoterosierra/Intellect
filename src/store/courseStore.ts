import { create } from 'zustand';
import { useAuthStore } from './AuthStore';
import { supabase } from '../lib/supabase';

type ButtonStatus = 'selected' | 'processing';

function selectedCourseStatus(): Record<string, ButtonStatus> {
    const courseId = useAuthStore.getState().user?.selectedCourseId;
    return courseId != null ? { [courseId]: 'selected' } : {};
}

interface CourseStore {
    buttonStatus: Record<string, ButtonStatus>;
    syncFromAuth: () => void;
    handleLeave: (courseId: number) => Promise<boolean>;
    verifyAndSelect: (courseId: number, code: string) => Promise<{ success: boolean; error?: string }>;
}

export const useCourseStore = create<CourseStore>((set) => ({
    buttonStatus: selectedCourseStatus(),

    syncFromAuth: () => set({ buttonStatus: selectedCourseStatus() }),

    verifyAndSelect: async (courseId: number, code: string): Promise<{ success: boolean; error?: string }> => {
        const { data: isValid, error: rpcError } = await supabase
            .from('cursos')
            .select('id')
            .eq('id', courseId)
            .eq('code_verification', code.trim())
            .maybeSingle();
        if (rpcError || !isValid) {
            return { success: false, error: 'Código de acceso incorrecto' };
        }

        set({ buttonStatus: { [courseId]: 'processing' } });
        const user = useAuthStore.getState().user;
        if (!user) {
            set({ buttonStatus: {} });
            return { success: false, error: 'Debes iniciar sesión para seleccionar un curso.' };
        }

        const { error: membershipError } = await supabase
            .from('course_members')
            .upsert({
                user_id: user.id,
                course_id: courseId,
                role: 'student',
            }, { onConflict: 'user_id,course_id', ignoreDuplicates: true });

        if (membershipError && membershipError.code !== '23505') {
            set({ buttonStatus: {} });
            return { success: false, error: 'No se pudo registrar tu acceso al curso. Inténtalo de nuevo.' };
        }

        const { data, error } = await supabase
            .from('usuarios')
            .update({ selected_course_id: courseId })
            .eq('id', user.id)
            .select('selected_course_id')
            .single();
        if (error || !data) {
            set({ buttonStatus: {} });
            return { success: false, error: 'No se pudo seleccionar el curso. Inténtalo de nuevo.' };
        }

        useAuthStore.getState().setSelectedCourseLocal(data.selected_course_id);
        set({ buttonStatus: { [courseId]: 'selected' } });
        return { success: true };
    },


    handleLeave: async (courseId) => {
        const selectedCourseId = useAuthStore.getState().user?.selectedCourseId;
        if (selectedCourseId == null || String(selectedCourseId) !== String(courseId)) return false;

        const user = useAuthStore.getState().user;
        if (!user) return false;

        const { error: membershipError } = await supabase
            .from('course_members')
            .delete()
            .eq('user_id', user.id)
            .eq('course_id', courseId);
        if (membershipError) {
            console.error('[courseStore] error leaving course:', membershipError.message);
            return false;
        }

        const selectedCourseUpdated = await useAuthStore.getState().setSelectedCourse(null);
        if (!selectedCourseUpdated) return false;

        set({ buttonStatus: {} });
        return true;
    },
}));

useAuthStore.subscribe((state, previousState) => {
    if (state.user?.email !== previousState.user?.email) {
        useCourseStore.getState().syncFromAuth();
    }
});
