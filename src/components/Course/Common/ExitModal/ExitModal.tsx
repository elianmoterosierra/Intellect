import { useCourseStore } from "../../../../store/courseStore";
import { useNavigate } from "react-router";

type ExitModalProps = {
    courseId: number | string | null;
    onClose: () => void;
};

export function ExitModal({ courseId, onClose }: ExitModalProps) {

    const navigate = useNavigate();
    const handleLeave = useCourseStore(s => s.handleLeave);


    const confirmLeave = () => {
        if (courseId == null) return;

        const didLeave = handleLeave(Number(courseId));
        if (!didLeave) return;

        onClose();
        navigate('/course', { replace: true });
    };
    return (

        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]"
            onClick={onClose}
        >
            <div
                className="bg-muted border border-line rounded-xl p-6 max-w-[380px] w-[90%]"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-ink mb-2">¿Quieres abandonar el curso?</h3>
                <p className="text-sm text-ink-soft mb-6 leading-[1.5]">Si abandonas el curso, deberás volver a iniciar sesión y seleccionar el curso para acceder de nuevo, si quieres volver al inicio sin abandonar presiona el icono de casa.</p>
                <div className="flex gap-3 justify-end">
                    <button
                        className="px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer border-none bg-muted-strong text-ink hover:bg-muted-strong-hover transition-colors"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer border-none bg-red-500 text-white hover:bg-red-600 transition-colors"
                        onClick={confirmLeave}
                    >
                        Salir
                    </button>
                </div>
            </div>
        </div>


    )
}
