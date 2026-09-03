import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { toDatabaseTime } from './taskScheduleStorage';
import type { Task } from '../types';



type TasksByCourse = Record<string, Task[]>;


function rowToTask(row: { id: string; course_id: number; title: string; subtitle: string; due_date: string; hour: string; description?: string | null; subject_id?: string | null; start_time?: string | null; end_time?: string | null }): Task {
    return {
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        dueDate: row.due_date,
        hour: row.hour,
        ...(row.description ? { description: row.description } : {}),
        ...(row.subject_id ? { subjectId: row.subject_id } : {}),
        ...(row.start_time ? { startTime: row.start_time } : {}),
        ...(row.end_time ? { endTime: row.end_time } : {}),
    };
}

interface TaskStore {
    tasksByCourse: TasksByCourse;
    fetchTasks: () => Promise<TasksByCourse>;
    clearTasks: () => void;
    addTask: (courseId: string | number, task: Task) => Promise<boolean>;
    updateTask: (courseId: string | number, task: Task) => Promise<boolean>;
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
                ...(row.subject_id ? { subjectId: row.subject_id } : {}),
                ...(row.start_time ? { startTime: row.start_time } : {}),
                ...(row.end_time ? { endTime: row.end_time } : {}),
            });
        }


        set({ tasksByCourse: grouped });
        return grouped;
    },
    clearTasks: () => set({ tasksByCourse: {} }),
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
                subject_id: task.subjectId ?? null,
                start_time: task.startTime ? toDatabaseTime(task.startTime) : null,
                end_time: task.endTime ? toDatabaseTime(task.endTime) : null,
            })
            .select('*')
            .single();

        if (error || !data) {
            console.error('Error adding task:', error);
            return false;
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
        return true;

    },
    updateTask: async (courseId, task) => {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                title: task.title,
                subtitle: task.subtitle,
                due_date: task.dueDate,
                hour: task.hour,
                subject_id: task.subjectId ?? null,
            })
            .eq('id', task.id)
            .eq('course_id', Number(courseId))
            .select('*')
            .single();

        if (error || !data) {
            console.error('Error updating task:', error);
            return false;
        }

        const updatedTask = rowToTask(data);
        set((state) => ({
            tasksByCourse: {
                ...state.tasksByCourse,
                [courseId]: (state.tasksByCourse[courseId] ?? []).map((currentTask) => (
                    currentTask.id === task.id ? updatedTask : currentTask
                )),
            },
        }));
        return true;
    },
    deleteTask: async (courseId, taskId) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)
            .eq('course_id', Number(courseId));

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
