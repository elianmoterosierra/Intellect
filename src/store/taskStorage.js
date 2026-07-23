import { create } from 'zustand';

const STORAGE_KEY = 'tasksByCourse';

function loadTasks() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
    } catch {
        return {};
    }
}

function saveTasks(tasksByCourse) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksByCourse));
}

export const useTaskStore = create((set) => ({
    tasksByCourse: loadTasks(),

    addTask: (courseId, task) =>
        set((state) => {
            const tasksByCourse = {
                ...state.tasksByCourse,
                [courseId]: [
                    ...(state.tasksByCourse[courseId] ?? []),
                    task,
                ],
            };

            saveTasks(tasksByCourse);
            return { tasksByCourse };
        }),

    toggleTask: (courseId, taskId) =>
        set((state) => {
            const tasksByCourse = {
                ...state.tasksByCourse,
                [courseId]: (state.tasksByCourse[courseId] ?? []).map((task) =>
                    task.id === taskId
                        ? { ...task, completed: !task.completed }
                        : task
                ),
            };

            saveTasks(tasksByCourse);
            return { tasksByCourse };
        }),

    deleteTask: (courseId, taskId) =>
        set((state) => {
            const tasksByCourse = {
                ...state.tasksByCourse,
                [courseId]: (state.tasksByCourse[courseId] ?? []).filter(
                    (task) => task.id !== taskId
                ),
            };

            saveTasks(tasksByCourse);
            return { tasksByCourse };
        }),
}));