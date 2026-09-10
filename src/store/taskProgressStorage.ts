import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { TaskProgressSummary, TaskProgressUser } from '../types';

type TaskProgressRow = {
    user_id: string;
    name: string;
    completed: boolean;
};

type TaskProgressState = {
    progressByTask: Record<string, TaskProgressSummary>;
    loadingByTask: Record<string, boolean>;
    errorByTask: Record<string, string | undefined>;
    fetchTaskProgress: (courseId: number, taskId: string, force?: boolean) => Promise<TaskProgressSummary | null>;
};

function getProgressKey(courseId: number, taskId: string): string {
    return `${courseId}:${taskId}`;
}

function toSummary(rows: TaskProgressRow[]): TaskProgressSummary {
    const completedUsers: TaskProgressUser[] = [];
    const pendingUsers: TaskProgressUser[] = [];

    for (const row of rows) {
        const user = { id: row.user_id, name: row.name };
        if (row.completed) {
            completedUsers.push(user);
        } else {
            pendingUsers.push(user);
        }
    }

    return {
        total: rows.length,
        completedCount: completedUsers.length,
        pendingCount: pendingUsers.length,
        completedUsers,
        pendingUsers,
    };
}

export const useTaskProgressStore = create<TaskProgressState>((set, get) => ({
    progressByTask: {},
    loadingByTask: {},
    errorByTask: {},

    fetchTaskProgress: async (courseId, taskId, force = false) => {
        const key = getProgressKey(courseId, taskId);
        const cached = get().progressByTask[key];
        if (cached && !force) return cached;
        if (get().loadingByTask[key]) return cached ?? null;

        set((state) => ({
            loadingByTask: { ...state.loadingByTask, [key]: true },
            errorByTask: { ...state.errorByTask, [key]: undefined },
        }));

        const { data, error } = await supabase.rpc('get_task_progress', {
            p_course_id: courseId,
            p_task_id: taskId,
        });

        if (error) {
            set((state) => ({
                loadingByTask: { ...state.loadingByTask, [key]: false },
                errorByTask: { ...state.errorByTask, [key]: error.message },
            }));
            return null;
        }

        const summary = toSummary((data ?? []) as TaskProgressRow[]);
        set((state) => ({
            progressByTask: { ...state.progressByTask, [key]: summary },
            loadingByTask: { ...state.loadingByTask, [key]: false },
        }));
        return summary;
    },
}));
