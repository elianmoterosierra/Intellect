import { create } from 'zustand'

export const useUIStore = create((set) => ({
    isAddTaskModalOpen: false,
    openAddTaskModal: () => set({ isAddTaskModalOpen: true }),
    closeAddTaskModal: () => set({ isAddTaskModalOpen: false }),
}))
