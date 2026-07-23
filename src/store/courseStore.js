import { create } from 'zustand';

function loadSelected() {
    try {
        const saved = localStorage.getItem('selectedCourses');
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
}

export const useCourseStore = create((set, get) => ({
    buttonStatus: loadSelected(),

    syncFromStorage: () => set({ buttonStatus: loadSelected() }),

    handleSelect: (courseId) => {
        set({ buttonStatus: { [courseId]: 'processing' } });

        setTimeout(() => {
            set({ buttonStatus: { [courseId]: 'selected' } });
            localStorage.setItem('selectedCourses', JSON.stringify({ [courseId]: 'selected' }));
        }, 800);
    },

    handleLeave: (courseId) => {
        const current = loadSelected();
        delete current[courseId];
        localStorage.setItem('selectedCourses', JSON.stringify(current));
        set({ buttonStatus: current });
    },
}));
