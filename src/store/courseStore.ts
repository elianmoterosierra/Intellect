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
    handleSelect: (courseId: number) => Promise<boolean>;
    handleLeave: (courseId: number) => boolean;
    verifyAndSelect: (courseId: number, code: string) => Promise<{ success: boolean; error?: string }>;
}

export const useCourseStore = create<CourseStore>((set) => ({
    buttonStatus: selectedCourseStatus(),

    syncFromAuth: () => set({ buttonStatus: selectedCourseStatus() }),

    handleSelect: async (courseId) => {
        set({ buttonStatus: { [courseId]: 'processing' } });
        const user = useAuthStore.getState().user;
        if (!user) {
            set({ buttonStatus: {} });
            return false;
        }
        const { data, error } = await supabase
            .from('usuarios')
            .update({ selected_course_id: courseId })
            .eq('id', user.id)
            .select()
            .single();
        if (error || !data) {
            set({ buttonStatus: {} });
            return false;
        }
        useAuthStore.getState().setSelectedCourseLocal(data.selected_course_id);
        set({ buttonStatus: { [courseId]: 'selected' } });
        return true;
    },
    verifyAndSelect: async (courseId: number, code: string): Promise<{ success: boolean; error?: string }> => {
        const { data: isValid, error: rpcError } = await supabase
            .from('cursos')
            .select('id')
            .eq('id', courseId)
            .eq('code_verification', code.trim())
            .single();
        if (rpcError || !isValid) {
            return { success: false, error: 'Código de acceso incorrecto' };
        }

        const selected = await useCourseStore.getState().handleSelect(courseId);
        return selected
            ? { success: true }
            : { success: false, error: 'No se pudo seleccionar el curso. Inténtalo de nuevo.' };
    },


    handleLeave: (courseId) => {
        const selectedCourseId = useAuthStore.getState().user?.selectedCourseId;
        if (selectedCourseId == null || String(selectedCourseId) !== String(courseId)) return false;

        useAuthStore.getState().setSelectedCourse(null);
        set({ buttonStatus: {} });
        return true;
    },
}));

useAuthStore.subscribe((state, previousState) => {
    if (state.user?.email !== previousState.user?.email) {
        useCourseStore.getState().syncFromAuth();
    }
});
