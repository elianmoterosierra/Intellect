import { FormAddTask } from "./FormTask";

export const AddTask = ({ showForm, setShowForm, form, setForm, handleSubmit, disabled }) => {
    return (
        <>
            {!showForm ? (
                <button
                    disabled={disabled}
                    onClick={() => !disabled && setShowForm(true)}
                    title={disabled ? "No se permite agregar tareas para hoy ni para días pasados" : "Agregar tarea"}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed
                                text-sm font-medium transition-all ${disabled
                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
                            : "border-[#c5c8e8] text-[#5c6bc0] hover:border-[#5c6bc0] hover:bg-[#f0f1fb] cursor-pointer"
                        }`}
                >
                    <span className="material-symbols-outlined text-base leading-none">
                        {disabled ? "block" : "add"}
                    </span>
                    {disabled ? "Agregar tarea (No disponible)" : "Agregar tarea"}
                </button>
            ) : (
                <FormAddTask form={form} setForm={setForm} handleSubmit={handleSubmit} setShowForm={setShowForm} />
            )}
        </>
    );
};