import { useState } from "react";
import { ConfirmDelete } from "../ConfirnDelete/ConfirmDelete";

type DeleteTaskProps = {
    courseId: number;
    taskId: string;
    isOverdue: boolean;
    compact?: boolean;
};

export function DeleteTask({ courseId, taskId, isOverdue, compact = false }: DeleteTaskProps) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    function openModal() {
        setShowConfirmModal(true);
    }

    return (
        <>
            <button
                onClick={(event) => {
                    event.stopPropagation();
                    openModal();
                }}
                type="button"
                className={`material-symbols-outlined flex flex-shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${compact ? 'h-7 w-7 text-base' : 'h-9 w-9'} ${isOverdue
                    ? 'border-white/30 bg-white/15 text-white hover:bg-white/25'
                    : 'border-transparent text-red-600 hover:border-red-200 hover:bg-red-100'
                    }`}
                aria-label="Eliminar tarea"
                title="Eliminar tarea"
            >
                delete
            </button>
            {showConfirmModal && (
                <ConfirmDelete taskId={taskId} courseId={courseId} setShowConfirmModal={setShowConfirmModal} />
            )}
        </>
    )
}
