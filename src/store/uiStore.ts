import { create } from 'zustand';

interface UIStore {
    isAddTaskModalOpen: boolean;
    openAddTaskModal: () => void;
    closeAddTaskModal: () => void;

    isPerfilModalOpen: boolean;
    openPerfilModal: () => void;
    closePerfilModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    isAddTaskModalOpen: false,
    openAddTaskModal: () => set({ isAddTaskModalOpen: true }),
    closeAddTaskModal: () => set({ isAddTaskModalOpen: false }),

    isPerfilModalOpen: false,
    openPerfilModal: () => set({ isPerfilModalOpen: true }),
    closePerfilModal: () => set({ isPerfilModalOpen: false }),
}))