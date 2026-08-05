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
                className="bg-[#f2f3fd] border border-[#c2c6d6] rounded-xl p-6 max-w-[380px] w-[90%]"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-[#191b23] mb-2">¿Quieres abandonar el curso?</h3>
                <p className="text-sm text-[#424754] mb-6 leading-[1.5]">Si abandonas el curso, deberás volver a iniciar sesión y seleccionar el curso para acceder de nuevo, si quieres volver al inicio sin abandonar presiona el icono de casa.</p>
                <div className="flex gap-3 justify-end">
                    <button
                        className="px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer border-none bg-[#e1e2ec] text-[#191b23] hover:bg-[#d0d1e0] transition-colors"
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
