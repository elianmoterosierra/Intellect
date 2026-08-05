import { useState } from "react";
import { ConfirmDelete } from "../ConfirnDelete/ConfirmDelete";
import { useMediaQuery } from "../../../../Hooks/useMediaQuery";

type DeleteTaskProps = {
    courseId: number;
    taskId: string;
    isOverdue: boolean;
};

export function DeleteTask({ courseId, taskId, isOverdue }: DeleteTaskProps) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const isMobile = useMediaQuery('(max-width: 767px)');


    function OpenModal() {
        setShowConfirmModal(true);
    }

    return (
        <>
            <button
                onClick={OpenModal}
                type="button"
                className={`flex-shrink-0 rounded-md border-2 border-red-600 leading-4 tracking-widest font-semibold cursor-pointer transition-colors duration-200 ${isMobile
                    ? 'px-1.5 py-0.5 text-[11px]'
                    : 'px-2 py-1 text-[14px]'
                    } ${isOverdue
                    ? 'bg-white/15 text-white hover:bg-white/25'
                    : 'bg-transparent text-red-600 hover:bg-red-200'
                    }`}
            >
                Eliminar
            </button>
            {showConfirmModal && (
                <ConfirmDelete taskId={taskId} courseId={courseId} setShowConfirmModal={setShowConfirmModal} />
            )}
        </>
    )
}
