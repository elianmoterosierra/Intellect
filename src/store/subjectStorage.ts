import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { fromDatabaseTime } from '../utils/taskSchedule';
import type { Subject, SubjectColor, SubjectSchedule, SubjectWeekday } from '../types';

type SubjectsByCourse = Record<string, Subject[]>;

export const EMPTY_SUBJECTS: Subject[] = [];

type SubjectRow = {
    id: string;
    course_id: number;
    name: string;
    teacher: string;
    description: string;
    color: SubjectColor;
    created_at: string;
};

type SubjectScheduleRow = {
    id: string;
    subject_id: string;
    weekday: number | string;
    start_time: string;
    end_time: string;
};

type SubjectStore = {
    subjectsByCourse: SubjectsByCourse;
    loadSubjects: (courseId: number | null) => Promise<void>;
    clearSubjects: () => void;
    addSubject: (subject: Subject) => Promise<boolean>;
    updateSubject: (subject: Subject) => Promise<boolean>;
    deleteSubject: (courseId: number, subjectId: string) => Promise<boolean>;
};

const WEEKDAY_BY_NUMBER: Record<number, SubjectWeekday> = {
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
};

function rowToSchedule(row: SubjectScheduleRow): SubjectSchedule | null {
    const weekday = typeof row.weekday === 'string' && Object.values(WEEKDAY_BY_NUMBER)
        .includes(row.weekday as SubjectWeekday)
        ? row.weekday as SubjectWeekday
        : WEEKDAY_BY_NUMBER[Number(row.weekday)];
    if (!weekday) return null;

    return {
        id: row.id,
        weekday,
        startTime: fromDatabaseTime(row.start_time),
        endTime: fromDatabaseTime(row.end_time),
    };
}

function rowsToSubjects(subjectRows: SubjectRow[], scheduleRows: SubjectScheduleRow[]): SubjectsByCourse {
    const schedulesBySubject: Record<string, SubjectSchedule[]> = {};

    for (const row of scheduleRows) {
        const schedule = rowToSchedule(row);
        if (schedule) {
            const subjectSchedules = schedulesBySubject[row.subject_id] ?? [];
            subjectSchedules.push(schedule);
            schedulesBySubject[row.subject_id] = subjectSchedules;
        }
    }

    const grouped: SubjectsByCourse = {};
    for (const row of subjectRows) {
        const subject: Subject = {
            id: row.id,
            courseId: row.course_id,
            name: row.name,
            teacher: row.teacher,
            description: row.description,
            color: row.color,
            schedules: schedulesBySubject[row.id] ?? [],
            createdAt: row.created_at,
        };

        const courseKey = String(row.course_id);
        const courseSubjects = grouped[courseKey] ?? [];
        courseSubjects.push(subject);
        grouped[courseKey] = courseSubjects;
    }

    return grouped;
}

function weekdayToNumber(weekday: SubjectWeekday): number {
    const entry = Object.entries(WEEKDAY_BY_NUMBER)
        .find(([, value]) => value === weekday);
    return entry ? Number(entry[0]) : 1;
}

export const useSubjectStore = create<SubjectStore>((set) => ({
    subjectsByCourse: {},

    clearSubjects: () => {
        set({ subjectsByCourse: {} });
    },

    loadSubjects: async (courseId) => {
        if (courseId == null) {
            set({ subjectsByCourse: {} });
            return;
        }

        const { data: subjectRows, error: subjectsError } = await supabase
            .from('subjects')
            .select('id, course_id, name, teacher, description, color, created_at')
            .eq('course_id', courseId)
            .order('created_at');

        if (subjectsError || !subjectRows) {
            console.error('Error fetching subjects:', subjectsError);
            return;
        }

        const typedSubjectRows = subjectRows as SubjectRow[];
        if (typedSubjectRows.length === 0) {
            set({ subjectsByCourse: {} });
            return;
        }

        const { data: scheduleRows, error: schedulesError } = await supabase
            .from('subject_schedules')
            .select('id, subject_id, weekday, start_time, end_time')
            .in('subject_id', typedSubjectRows.map((row) => row.id))
            .order('weekday')
            .order('start_time');

        if (schedulesError || !scheduleRows) {
            console.error('Error fetching subject schedules:', schedulesError);
            return;
        }

        set({ subjectsByCourse: rowsToSubjects(typedSubjectRows, scheduleRows as SubjectScheduleRow[]) });
    },

    addSubject: async (subject) => {
        const { data: subjectRow, error: subjectError } = await supabase
            .from('subjects')
            .insert({
                id: subject.id,
                course_id: subject.courseId,
                name: subject.name,
                teacher: subject.teacher,
                description: subject.description,
                color: subject.color,
                created_at: subject.createdAt,
            })
            .select('id, course_id, name, teacher, description, color, created_at')
            .single();

        if (subjectError || !subjectRow) {
            console.error('Error adding subject:', subjectError);
            return false;
        }

        const scheduleRows = subject.schedules.map((schedule) => ({
            id: schedule.id,
            subject_id: subject.id,
            course_id: subject.courseId,
            weekday: weekdayToNumber(schedule.weekday),
            start_time: schedule.startTime,
            end_time: schedule.endTime,
        }));

        const { error: schedulesError } = await supabase
            .from('subject_schedules')
            .insert(scheduleRows);

        if (schedulesError) {
            await supabase.from('subjects').delete().eq('id', subject.id);
            console.error('Error adding subject schedules:', schedulesError);
            return false;
        }

        set((state) => {
            const courseKey = String(subject.courseId);
            return {
                subjectsByCourse: {
                    ...state.subjectsByCourse,
                    [courseKey]: [...(state.subjectsByCourse[courseKey] ?? []), subject],
                },
            };
        });

        return true;
    },

    updateSubject: async (subject) => {
        const { data: subjectRow, error: subjectError } = await supabase
            .from('subjects')
            .update({
                name: subject.name,
                teacher: subject.teacher,
                description: subject.description,
                color: subject.color,
            })
            .eq('id', subject.id)
            .eq('course_id', subject.courseId)
            .select('id, course_id, name, teacher, description, color, created_at')
            .single();

        if (subjectError || !subjectRow) {
            console.error('Error updating subject:', subjectError);
            return false;
        }

        const { error: deleteSchedulesError } = await supabase
            .from('subject_schedules')
            .delete()
            .eq('subject_id', subject.id);

        if (deleteSchedulesError) {
            console.error('Error replacing subject schedules:', deleteSchedulesError);
            return false;
        }

        const scheduleRows = subject.schedules.map((schedule) => ({
            id: schedule.id,
            subject_id: subject.id,
            course_id: subject.courseId,
            weekday: weekdayToNumber(schedule.weekday),
            start_time: schedule.startTime,
            end_time: schedule.endTime,
        }));

        const { error: schedulesError } = await supabase
            .from('subject_schedules')
            .insert(scheduleRows);

        if (schedulesError) {
            console.error('Error adding updated subject schedules:', schedulesError);
            return false;
        }

        const updatedSubject: Subject = {
            ...subject,
            createdAt: subjectRow.created_at,
        };

        set((state) => ({
            subjectsByCourse: {
                ...state.subjectsByCourse,
                [String(subject.courseId)]: (state.subjectsByCourse[String(subject.courseId)] ?? [])
                    .map((currentSubject) => currentSubject.id === subject.id ? updatedSubject : currentSubject),
            },
        }));

        return true;
    },

    deleteSubject: async (courseId, subjectId) => {
        const { error } = await supabase
            .from('subjects')
            .delete()
            .eq('id', subjectId)
            .eq('course_id', courseId);

        if (error) {
            console.error('Error deleting subject:', error);
            return false;
        }

        set((state) => ({
            subjectsByCourse: {
                ...state.subjectsByCourse,
                [String(courseId)]: (state.subjectsByCourse[String(courseId)] ?? [])
                    .filter((subject) => subject.id !== subjectId),
            },
        }));

        return true;
    },
}));
