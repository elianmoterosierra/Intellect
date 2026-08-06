import { FormAddTask } from "./FormTask";

import type { TaskForm } from "../DayModal";

type AddTaskProps = {
    showForm: boolean;
    setShowForm: (value: boolean) => void;
    form: TaskForm;
    setForm: React.Dispatch<React.SetStateAction<TaskForm>>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    disabled: boolean;
};

export const AddTask = ({ showForm, setShowForm, form, setForm, handleSubmit, disabled }: AddTaskProps) => {
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
                            : "border-line text-brand hover:border-brand hover:bg-muted-hover cursor-pointer"
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