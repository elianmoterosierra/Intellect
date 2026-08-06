import { useTaskStore } from "../../../../store/taskStorage";
import type { Dispatch, SetStateAction } from "react";

type ConfirmDeleteProps = {
    taskId: string;
    courseId: number;
    setShowConfirmModal: Dispatch<SetStateAction<boolean>>;
};

export function ConfirmDelete({ taskId, courseId, setShowConfirmModal }: ConfirmDeleteProps) {
    const deleteTask = useTaskStore((state) => state.deleteTask);

    function confirmDelete() {
        deleteTask(courseId, taskId);
        setShowConfirmModal(false);

    };

    return (
        <><div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]"
            onClick={() => setShowConfirmModal(false)}
        >
            <div
                className="bg-muted border border-line rounded-xl p-6 max-w-[380px] w-[90%]"
                onClick={e => e.stopPropagation()}
            >

                <div className="relative mb-2">
                    <h3 className="text-lg font-semibold text-ink pr-8">¿Eliminar tarea?</h3>
                    <button
                        type="button"
                        onClick={() => setShowConfirmModal(false)}
                        aria-label="Cerrar"
                        className="material-symbols-outlined absolute right-0 top-0 cursor-pointer text-ink hover:text-black"
                    >
                        close
                    </button>
                </div>
                <p className="text-sm text-ink-soft mb-6 leading-[1.5]">Deberas volver a crear la tarea si la eliminas por accidente.</p>
                <div className="flex gap-5 justify-center">
                    <button
                        className="px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer border-none bg-muted-strong text-ink hover:bg-muted-strong-hover transition-colors"
                        onClick={() => setShowConfirmModal(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer border-none bg-red-500 text-white hover:bg-red-600 transition-colors"
                        onClick={confirmDelete}
                    >
                        Salir
                    </button>
                </div>
            </div>
        </div></>
    )
}
