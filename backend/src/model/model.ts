import type { Course, NotificationItem } from "../../type.ts";
import { courseData } from "../data/cursos.ts"


interface Curso {
    id: number;
    title: string;
    description: string;
    icon: string;
    notification?: NotificationItem[];
}
const cursos: Course[] = courseData;

export function getCursos(): Course[] {
    return [...cursos];
}

export function getCursoPorId(id: number): Curso | undefined {
    return cursos.find(curso => curso.id === id);
}

export function agregarCurso(curso: Curso): Curso[] {
    cursos.push(curso);
    return cursos;
}

export function actualizarCurso(id: number, curso: Curso): Curso[] {
    const cursoIndex = cursos.findIndex(curso => curso.id === id);
    if (cursoIndex === -1) {
        return [];
    }
    cursos[cursoIndex] = curso;
    return cursos;
}
export function deleteCurso(id: number): Curso[] {
    const curso = cursos.findIndex(curso => curso.id === id);
    if (curso === -1) {
        return cursos;
    }
    cursos.splice(curso, 1)
    return cursos;
}