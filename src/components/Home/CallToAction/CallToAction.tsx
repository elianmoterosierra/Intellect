import { ButtonPrincipal } from '../../Button/ButtonPrincipal'
import { ButtonOutline } from '../../Button/ButtonSecondary'
import { useState } from "react"
import type { MouseEvent } from "react"
import { FormSection } from "../../Form/FormSection"
import { useAuthStore } from "../../../store/AuthStore"
import { useNavigate } from "react-router"


export function CTASection() {
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
        <section className="flex flex-col items-center justify-center min-h-[400px] px-10 py-[120px] text-center max-w-[1280px] mx-auto">
            <h2 className="text-4xl text-gray-900 mb-4">Lleva tu organización al siguiente nivel</h2>
            <p className="text-gray-500 mb-8 max-w-[600px]">
                Únete a miles de estudiantes y educadores que ya optimizan su tiempo con Intellect.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <ButtonPrincipal onClick={handleCoursesClick} title="seguir" />
                <ButtonOutline title="Donarle dinero a elian" />
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
    )
}