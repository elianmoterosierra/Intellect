import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { CourseMemberSummary } from '../types';

type CourseMemberRow = {
    user_id: string;
    name: string;
    email: string;
    completed_tasks: number;
    overdue_tasks: number;
    joined_at: string;
};

type CourseMemberState = {
    membersByCourse: Record<string, CourseMemberSummary[]>;
    loadingByCourse: Record<string, boolean>;
    errorByCourse: Record<string, string | undefined>;
    fetchMembers: (courseId: number, force?: boolean) => Promise<CourseMemberSummary[]>;
};

export const useCourseMemberStore = create<CourseMemberState>((set, get) => ({
    membersByCourse: {},
    loadingByCourse: {},
    errorByCourse: {},

    fetchMembers: async (courseId, force = false) => {
        const key = String(courseId);
        const cached = get().membersByCourse[key];
        if (cached && !force) return cached;
        if (get().loadingByCourse[key]) return cached ?? [];

        set((state) => ({
            loadingByCourse: { ...state.loadingByCourse, [key]: true },
            errorByCourse: { ...state.errorByCourse, [key]: undefined },
        }));

        const { data, error } = await supabase.rpc('get_course_members_summary', {
            p_course_id: courseId,
        });

        if (error) {
            console.error('[courseMembers] error:', error.message);
            set((state) => ({
                loadingByCourse: { ...state.loadingByCourse, [key]: false },
                errorByCourse: { ...state.errorByCourse, [key]: error.message },
            }));
            return [];
        }

        const members = ((data ?? []) as CourseMemberRow[]).map((row) => ({
            id: row.user_id,
            name: row.name,
            email: row.email,
            completedTasks: Number(row.completed_tasks),
            overdueTasks: Number(row.overdue_tasks),
            joinedAt: row.joined_at,
        }));

        set((state) => ({
            membersByCourse: { ...state.membersByCourse, [key]: members },
            loadingByCourse: { ...state.loadingByCourse, [key]: false },
        }));
        return members;
    },
}));
