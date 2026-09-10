import { Navigate, useNavigationType } from "react-router";
import type { ReactNode } from "react";
import { useAuthStore } from "../store/AuthStore";

type CourseEntryRedirectProps = {
    children: ReactNode;
};

/**
 * Keeps the public/course entry points from making users with an active
 * course select the same course again.
 */
export default function CourseEntryRedirect({ children }: CourseEntryRedirectProps) {
    const { isLoggedIn, sessionReady, user } = useAuthStore();
    const navigationType = useNavigationType();

    if (!sessionReady) {
        return <div className="min-h-screen bg-page" aria-busy="true" />;
    }

    // POP is the initial browser entry/reload. Internal sidebar and page links
    // use PUSH, so they must keep allowing the user to visit Home or Courses.
    if (
        navigationType === "POP" &&
        isLoggedIn &&
        user?.selectedCourseId !== null &&
        user?.selectedCourseId !== undefined
    ) {
        return <Navigate to={`/course-dashboard/${user.selectedCourseId}`} replace />;
    }

    return children;
}
