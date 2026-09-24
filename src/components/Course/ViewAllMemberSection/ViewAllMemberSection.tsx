import { useEffect, useMemo, useState } from 'react';
import { useCourseMemberStore } from '../../../store/courseMemberStorage';
import { canManageCourse } from '../../../utils/permission';
import { useAuthStore } from '../../../store/AuthStore';
import type { CourseMemberSummary } from '../../../types';
import { MemberSectionHeader } from './MemberSectionHeader';
import { MemberSortControls, type MemberSortMode } from './MemberSortControls';
import { MemberTable } from './MemberTable';

type ViewAllMemberSectionProps = {
    courseId: number;
};

const EMPTY_MEMBERS: CourseMemberSummary[] = [];

export default function ViewAllMemberSection({ courseId }: ViewAllMemberSectionProps) {
    const user = useAuthStore((state) => state.user);
    const members = useCourseMemberStore((state) => state.membersByCourse[String(courseId)] ?? EMPTY_MEMBERS);
    const isLoading = useCourseMemberStore((state) => state.loadingByCourse[String(courseId)] ?? false);
    const error = useCourseMemberStore((state) => state.errorByCourse[String(courseId)]);
    const fetchMembers = useCourseMemberStore((state) => state.fetchMembers);
    const [sortMode, setSortMode] = useState<MemberSortMode>('recent');

    useEffect(() => {
        if (canManageCourse(user, courseId)) void fetchMembers(courseId, true);
    }, [courseId, fetchMembers, user]);

    const orderedMembers = useMemo(() => {
        const sorted = [...members];
        if (sortMode === 'recent') {
            sorted.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
        } else {
            sorted.sort((a, b) => {
                const result = a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
                return sortMode === 'asc' ? result : -result;
            });
        }
        return sorted;
    }, [members, sortMode]);

    if (!canManageCourse(user, courseId)) return null;

    return (
        <section className="min-h-full bg-page p-4 text-left md:p-10">
            <div className="mx-auto max-w-6xl">
                <MemberSectionHeader memberCount={members.length} />
                <MemberSortControls sortMode={sortMode} onSortModeChange={setSortMode} />
                <MemberTable members={orderedMembers} isLoading={isLoading} error={error} />
            </div>
        </section>
    );
}
