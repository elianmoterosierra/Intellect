import { create } from 'zustand';
import { useAuthStore } from './AuthStore';

function selectedCourseStatus() {
    const courseId = useAuthStore.getState().user?.selectedCourseId;
    return courseId ? { [courseId]: 'selected' } : {};
}

export const useCourseStore = create((set) => ({
    buttonStatus: selectedCourseStatus(),

    syncFromAuth: () => set({ buttonStatus: selectedCourseStatus() }),

    handleSelect: (courseId) => {
        set({ buttonStatus: { [courseId]: 'processing' } });

        setTimeout(() => {
            useAuthStore.getState().setSelectedCourse(courseId);
            set({ buttonStatus: { [courseId]: 'selected' } });
        }, 800);
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
