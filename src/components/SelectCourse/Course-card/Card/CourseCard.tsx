import { useNavigate } from 'react-router';
import { useCourseStore } from '../../../../store/courseStore';
import type { ReactNode } from 'react';

const btnBase = "flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg font-semibold cursor-pointer border-none transition-all duration-200 text-sm";

type CourseCardProps = {
    title: string;
    description: string;
    icon: string;
    courseId: number;
};

export function CourseCard({ title, description, icon, courseId }: CourseCardProps) {
    const navigate = useNavigate();
    const buttonStatus = useCourseStore(s => s.buttonStatus);
    const handleSelect = useCourseStore(s => s.handleSelect);

    const status = buttonStatus[courseId] || 'idle';
    const anySelected = Object.values(buttonStatus).some(s => s === 'selected');

    let button: ReactNode;

    if (status === 'processing') {
        button = (
            <button disabled className={`${btnBase} bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed`}>
                <span className="material-symbols-outlined animate-spin">sync</span> Procesando...
            </button>
        );
    } else if (status === 'selected') {
        button = (
            <button
                className={`${btnBase} bg-green-700/10 text-green-700 border border-green-700/20`}
                onClick={() => navigate(`/course-dashboard/${courseId}`)}
            >
                <span className="material-symbols-outlined">check_circle</span> abrir curso
            </button>
        );
    } else if (anySelected) {
        button = (
            <button disabled className={`${btnBase} bg-red-700 text-white cursor-not-allowed`}>
                <span className="material-symbols-outlined">lock</span>
                Ya eres parte de un curso
            </button>
        );
    } else {
        button = (
            <button
                onClick={() => handleSelect(courseId)}
                className={`${btnBase} bg-brand-strong text-white hover:bg-brand-hover`}
            >
                Seleccionar Curso
            </button>
        );
    }

    return (
        <div className="bg-surface border border-gray-200 rounded-2xl p-7 flex flex-col h-full shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-brand-ring focus-within:outline focus-within:outline-2 focus-within:outline-brand focus-within:outline-offset-2">
            <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center mb-5 bg-brand-soft text-brand transition-transform duration-300 group-hover:scale-105">
                <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>{icon}</span>
            </div>
            <h3 className="text-xl font-semibold text-ink mb-2">{title}</h3>
            <p className="text-sm text-ink-soft mb-6 flex-grow leading-[22px]">{description}</p>
            {button}
        </div>
    );
}