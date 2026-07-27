import { create } from 'zustand'

export const useUIStore = create((set) => ({

    addTaskModal: {
        isAddTaskModalOpen: false,
        openAddTaskModal: () => set({ isAddTaskModalOpen: true }),
        closeAddTaskModal: () => set({ isAddTaskModalOpen: false }),
    },
    PerfilModal: {
        isPerfilModalOpen: false,
        openPerfilModal: () => set({ isPerfilModalOpen: true }),
        closePerfilModal: () => set({ isPerfilModalOpen: false }),

    }
}))



