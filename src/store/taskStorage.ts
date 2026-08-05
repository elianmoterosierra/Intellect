import { create } from 'zustand';

import type { Task } from '../types';

const STORAGE_KEY = 'tasksByCourse';

type TasksByCourse = Record<string, Task[]>;

function loadTasks(): TasksByCourse {
    try {
        return (JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '') as TasksByCourse) ?? {};
    } catch {
        return {};
    }
}

function saveTasks(tasksByCourse: TasksByCourse): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksByCourse));
}

interface TaskStore {
    tasksByCourse: TasksByCourse;
    addTask: (courseId: string | number, task: Task) => void;
    deleteTask: (courseId: string | number, taskId: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasksByCourse: loadTasks(),

    addTask: (courseId, task) =>
        set((state) => {
            const tasksByCourse: TasksByCourse = {
                ...state.tasksByCourse,
                [courseId]: [
                    ...(state.tasksByCourse[courseId] ?? []),
                    task,
                ],
            };

            saveTasks(tasksByCourse);
            return { tasksByCourse };
        }),

    deleteTask: (courseId, taskId) =>
        set((state) => {
            const tasksByCourse: TasksByCourse = {
                ...state.tasksByCourse,
                [courseId]: (state.tasksByCourse[courseId] ?? []).filter(
                    (task) => task.id !== taskId
                ),
            };

            saveTasks(tasksByCourse);
            return { tasksByCourse };
        }),
}));