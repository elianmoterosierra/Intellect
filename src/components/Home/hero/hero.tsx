import { ButtonPrincipal } from '../../Button/ButtonPrincipal'
import { ButtonOutline } from '../../Button/ButtonSecondary'
import { useNavigate } from 'react-router';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useAuthStore } from '../../../store/AuthStore';
import { FormSection } from '../../Form/FormSection';
export function Hero() {
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);
    const { isLoggedIn } = useAuthStore();

    const handleAuthSuccess = () => {
        setShowForm(false);
        navigate('/course');
    };

    const handleCoursesClick = (e: MouseEvent<HTMLButtonElement>) => {
        if (!isLoggedIn) {
            e.preventDefault();
            setShowForm(true);
        }
        else if (isLoggedIn) {
            navigate("/course");
        }

    };

    return (
        <section className="flex flex-col md:flex-row items-center justify-between gap-12 w-full max-w-[1280px] mx-auto px-10 py-20 md:py-12 rounded-2xl bg-gradient-to-br from-surface via-blue-100 to-green-50/25 mt-16 text-left box-border">
            {/* Text side */}
            <div className="flex-1 min-w-0 z-10">
                <div className="inline-flex items-center gap-2 bg-brand-soft text-brand px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Gestión Académica de Precisión</span>
                </div>
                <h1 className="text-[clamp(36px,5vw,64px)] leading-tight font-bold mb-6 text-ink">
                    Domina tu Semestre con <span className="text-brand">Intellect</span>
                </h1>
                <p className="text-base text-ink-soft mb-10 max-w-[500px]">
                    Reduce la carga cognitiva y optimiza tu rendimiento académico. Una plataforma diseñada para el orden estructural y el enfoque absoluto en tus metas educativas.
                </p>
                <div className="flex flex-wrap gap-4">
                    <ButtonPrincipal onClick={handleCoursesClick} title="Seguir " className="w-full sm:w-auto" />
                    <ButtonOutline title="Donarle dinero a elian" className="w-full sm:w-auto" />
                </div>
            </div>

            {/* Image side */}
            <div className="hidden md:block flex-none w-full max-w-[320px] md:w-[420px] md:max-w-[420px] relative order-2">
                <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                    <img
                        alt="Software dashboard interface mockup"
                        src="https://png.pngtree.com/png-clipart/20240708/original/pngtree-sticker-of-a-cartoon-laptop-computer-with-pie-chart-png-image_15515880.png"
                        className="w-full max-h-80 object-contain block"
                    />
                </div>
                <div className="absolute w-64 h-64 rounded-full blur-3xl -z-10 -top-12 -right-12 bg-brand-soft" />
                <div className="absolute w-64 h-64 rounded-full blur-3xl -z-10 -bottom-12 -left-12 bg-[rgba(108,248,187,0.2)]" />
            </div>
            {
                showForm && (
                    <FormSection
                        onClose={() => setShowForm(false)}
                        onSuccess={handleAuthSuccess}
                    />
                )
            }
        </section>
    );
}