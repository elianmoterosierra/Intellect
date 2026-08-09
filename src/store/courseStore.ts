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
    handleSelect: (courseId: number) => void;
    handleLeave: (courseId: number) => boolean;
}

export const useCourseStore = create<CourseStore>((set) => ({
    buttonStatus: selectedCourseStatus(),

    syncFromAuth: () => set({ buttonStatus: selectedCourseStatus() }),

    handleSelect: async (courseId) => {
        set({ buttonStatus: { [courseId]: 'processing' } });
        const user = useAuthStore.getState().user;
        if (!user) return;
        const { data, error } = await supabase
            .from('usuarios')
            .update({ selected_course_id: courseId })
            .eq('id', user.id)
            .select()
            .single();
        if (error || !data) {
            set({ buttonStatus: {} });
            return;
        }
        useAuthStore.getState().setSelectedCourse(data.selected_course_id);
        set({ buttonStatus: { [courseId]: 'selected' } });
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