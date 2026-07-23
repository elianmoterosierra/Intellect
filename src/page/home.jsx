import { useEffect } from 'react';
import { Hero } from '../components/Home/hero/hero';
import { FeaturesSection } from '../components/Home/features/featuresSection';
import { RoleSection } from '../components/Home/Role/RoleSection';
import { CTASection } from '../components/Home/CallToAction/CallToAction';
import { Footer } from '../components/Footer/Footer';

export default function AcademiaFlow() {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                }
            });
        }, observerOptions);

        const cards = document.querySelectorAll('.fade-in-section');
        cards.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#191b23] font-[Inter,sans-serif]">
            <main className="max-w-[1440px] mx-auto">
                <Hero />
                {/* --- FIN <HeroSection /> --- */}

                {/* 💡 COMPONENTE SUGERIDO: <StatsSection /> o <SocialProof />
            Por qué: Los datos numéricos ("10k+", "50+") podrían venir de una API o base de datos en el futuro. */}

                {/* --- FIN <StatsSection /> --- */}

                {/* 💡 COMPONENTE SUGERIDO: <FeaturesSection />
            Dentro de esta sección hay varias tarjetas. Cada tarjeta podría ser su propio sub-componente. */}
                <FeaturesSection />
                {/* --- FIN <FeaturesSection /> --- */}

                {/* 💡 COMPONENTE SUGERIDO: <RoleComparisonSection />
            Podrías tener un sub-componente <RoleCard title="..." icon="..." features={[]} /> */}
                <RoleSection />                {/* --- FIN <RoleComparisonSection /> --- */}

                {/* 💡 COMPONENTE SUGERIDO: <CallToActionSection /> */}
                <CTASection />
                {/* --- FIN <CallToActionSection /> --- */}
            </main>

            {/* 💡 COMPONENTE SUGERIDO: <Footer />
          Por qué: Al igual que el Navbar, el footer es un elemento global que suele incluirse en el layout principal de la app. */}
            <Footer />

            {/* --- FIN <Footer /> --- */}
        </div>
    );
}