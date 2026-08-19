import type { User } from '../types';

export function canManageCourse(
  user: User | null,
  courseId: string | number
): boolean {
  if (!user) return false;

  return (
    user.isAdmin ||
    user.courseRoles[String(courseId)] === 'manager'
  );
}