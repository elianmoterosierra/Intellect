import { HeroCourse } from '../components/SelectCourse/Hero/Hero';
import { lazy, Suspense } from 'react'

const CourseCards = lazy(() => import('../components/SelectCourse/Course-card/Course-Card.tsx'));

export function CoursePage() {
    return (
        <div className="min-h-screen relative text-base leading-6 overflow-hidden bg-page">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-700 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <main className="relative max-w-[1280px] mx-auto px-4 py-6 md:px-10 md:py-8 xl:px-12 xl:py-10">
                <HeroCourse />

                {/* Course cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Suspense fallback={<div><p className="text-white"> cargando </p></div>}>
                        <CourseCards />
                    </Suspense>
                </div>

                {/* Support section */}
                <section className="mt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface border border-gray-200 rounded-2xl p-5">
                        <div className="flex items-center gap-3 text-ink-soft text-sm">
                            <span className="material-symbols-outlined">help_outline</span>
                            <span>¿No encuentras tu curso? Contacta con el equipo de admisiones.</span>
                        </div>
                        <button className="border border-brand-ring text-brand px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-tint transition-colors cursor-pointer bg-transparent">
                            Solicitar Soporte
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}
