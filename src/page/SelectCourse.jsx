import { HeroCourse } from '../components/SelectCourse/Hero/Hero';
import { CourseCards } from '../components/SelectCourse/Course-card/Course-Card';
import { useCourseStore } from '../store/courseStore';
import { useNavigate } from 'react-router';

export function CourseButton({ courseId }) {
    const navigate = useNavigate();
    const buttonStatus = useCourseStore(s => s.buttonStatus);
    const handleSelect = useCourseStore(s => s.handleSelect);

    const status = buttonStatus[courseId] || 'idle';
    const anySelected = Object.values(buttonStatus).some(s => s === 'selected');

    const btnBase = "flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 border-none cursor-pointer";

    if (status === 'processing') {
        return (
            <button disabled className={`${btnBase} bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed`}>
                <span className="material-symbols-outlined animate-spin">sync</span> Procesando...
            </button>
        );
    }

    if (status === 'selected') {
        return (
            <button className={`${btnBase} bg-green-700/10 text-green-700 border border-green-700/20`} onClick={() => navigate(`/course-dashboard/${courseId}`)}>
                <span className="material-symbols-outlined">check_circle</span> abrir curso
            </button>
        );
    }

    if (anySelected) {
        return (
            <button disabled className={`${btnBase} bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed`}>
                <span className="material-symbols-outlined">lock</span>
                Ya eres parte de un curso
            </button>
        );
    }

    return (
        <button onClick={() => handleSelect(courseId)} className={`${btnBase} bg-[#0058be] text-white hover:bg-[#004a9e]`}>
            Seleccionar Curso
        </button>
    );
}

export function CoursePage() {
    return (
        <div className="min-h-screen relative text-base leading-6 overflow-hidden bg-[#f9f9ff]">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-700 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <main className="relative max-w-[1280px] mx-auto px-4 py-6 md:px-10 md:py-8 xl:px-12 xl:py-10">
                <HeroCourse />

                {/* Course cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CourseCards />
                </div>

                {/* Support section */}
                <section className="mt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-gray-200 rounded-2xl p-5">
                        <div className="flex items-center gap-3 text-gray-500 text-sm">
                            <span className="material-symbols-outlined">help_outline</span>
                            <span>¿No encuentras tu curso? Contacta con el equipo de admisiones.</span>
                        </div>
                        <button className="border border-[rgba(0,88,190,0.2)] text-[#0058be] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[rgba(0,88,190,0.05)] transition-colors cursor-pointer bg-transparent">
                            Solicitar Soporte
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
