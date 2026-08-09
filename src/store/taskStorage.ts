import { create } from 'zustand';
import { supabase } from '../lib/supabase';

import type { Task } from '../types';



type TasksByCourse = Record<string, Task[]>;


function rowToTask(row: { id: string; course_id: number; title: string; subtitle: string; due_date: string; hour: string; description?: string | null }): Task {
    return {
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        dueDate: row.due_date,
        hour: row.hour,
        ...(row.description ? { description: row.description } : {}),
    };
}

interface TaskStore {
    tasksByCourse: TasksByCourse;
    fetchTasks: () => Promise<TasksByCourse>;
    addTask: (courseId: string | number, task: Task) => Promise<void>;
    deleteTask: (courseId: string | number, taskId: string) => Promise<void>;

}

export const useTaskStore = create<TaskStore>((set) => ({
    tasksByCourse: {},

    fetchTasks: async (): Promise<TasksByCourse> => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('course_id');

        if (error || !data) {
            console.error('Error fetching tasks:', error);
            return {};
        }

        const grouped: TasksByCourse = {};
        for (const row of data) {
            const courseId = String(row.course_id);
            grouped[courseId] ??= [];
            grouped[courseId].push({
                id: row.id,
                title: row.title,
                subtitle: row.subtitle,
                dueDate: row.due_date,          // ← snake → camel
                hour: row.hour,
                ...(row.description ? { description: row.description } : {}),
            });
        }


        set({ tasksByCourse: grouped });
        return grouped;
    },
    addTask: async (courseId, task) => {
        const { data, error } = await supabase
            .from('tasks')
            .insert({
                id: task.id,
                course_id: Number(courseId),
                title: task.title,
                subtitle: task.subtitle,
                due_date: task.dueDate,
                hour: task.hour,
                description: task.description,
            })
            .select('*')
            .single();

        if (error || !data) {
            console.error('Error adding task:', error);
            return;
        }
        set((state) => ({
            tasksByCourse: {
                ...state.tasksByCourse,
                [courseId]: [
                    ...(state.tasksByCourse[courseId] ?? []),
                    rowToTask(data),             // mismo mapper de fetchTasks
                ],
            },
        }));

    },
    deleteTask: async (courseId, taskId) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);

        if (error) {
            console.error('Error deleting task:', error);
            return;
        }

        set((state) => ({
            tasksByCourse: {
                ...state.tasksByCourse,
                [courseId]: (state.tasksByCourse[courseId] ?? []).filter(
                    (t) => t.id !== taskId
                ),
            }
        }));
    },




}));