import { CourseCard } from "./Card/CourseCard";
import { courseData } from "../../../data/data";

export function CourseCards() {
    return (
        <>
            {courseData.map(course => (
                <CourseCard key={course.id} courseId={course.id}
                    icon={course.icon}
                    title={course.title}
                    description={course.description}
                />
            ))}
        </>
    )
}