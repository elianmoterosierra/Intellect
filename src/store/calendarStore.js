import { create } from 'zustand';

const getDateKey = (daysFromToday) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + daysFromToday);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const initialTasksByDate = {
    [getDateKey(0)]: [
        { id: 't1', title: 'Revisar pendientes de hoy', description: 'Tareas asignadas para la jornada', completed: false },
    ],
    [getDateKey(1)]: [
        { id: 't2', title: 'Estudiar React Hooks', description: 'Repasar la documentación oficial', completed: false },
        { id: 't3', title: 'Revisar apuntes de clase', description: 'Resumen del módulo', completed: true },
    ],
    [getDateKey(2)]: [
        { id: 't4', title: 'Entregar informe final', description: 'Subir archivo PDF a la plataforma', completed: false },
    ],
    [getDateKey(3)]: [
        { id: 't5', title: 'Preparar presentación', description: 'Diapositivas para la reunión del equipo', completed: false },
    ],
};

export const useCalendarStore = create((set) => ({
    tasksByDate: initialTasksByDate,

    addTask: (dateKey, newTask) => set((state) => ({
        tasksByDate: {
            ...state.tasksByDate,
            [dateKey]: [...(state.tasksByDate[dateKey] ?? []), newTask],
        },
    })),

    toggleTask: (dateKey, taskId) => set((state) => ({
        tasksByDate: {
            ...state.tasksByDate,
            [dateKey]: (state.tasksByDate[dateKey] ?? []).map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
        },
    })),
}));
