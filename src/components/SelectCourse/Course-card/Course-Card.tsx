import { CourseCard } from "./Card/CourseCard";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import type { Course } from "../../../types.ts";

export default function CourseCards() {
    const [courseData, setCourseData] = useState<Course[]>([]);
    useEffect(() => {
        supabase
            .from("cursos")
            .select("id, title, description, icon")
            .order("id", { ascending: true })
            .then(({ data, error }) => {
                if (error) {
                    console.error("Error al obtener los cursos:", error);
                } else {

                    setCourseData((data ?? []).map(course => ({ ...course, notification: [] })));
                }
            })

    }, []);
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