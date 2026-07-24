
import { useState } from "react";
import { ConfirmDelete } from "../ConfirnDelete/ConfirmDelete";

export function DeleteTask({ courseId, taskId, isOverdue }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);


    function OpenModal() {
        setShowConfirmModal(true);
    }

    return (
        <>
            <button
                onClick={OpenModal}
                type="button"
                className={`flex-shrink-0 rounded-md px-2 py-1 text-[14px] border-2 border-red-600 leading-4 tracking-widest font-semibold  cursor-pointer transition-colors duration-200 ${isOverdue
                    ? 'bg-white/15 text-white hover:bg-white/25'
                    : 'bg-transparent text-red-600 hover:bg-red-200'
                    }`}
            >
                Eliminar
            </button>
            {showConfirmModal && (
                <ConfirmDelete taskId={taskId} courseId={courseId} OpenModal={OpenModal} setShowConfirmModal={setShowConfirmModal} />
            )}
        </>
    )
}