import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { useCourseStore } from '../../../../store/courseStore';

const navLink = "flex items-center gap-4 px-4 py-2 rounded-xl transition-colors duration-200 text-[#424754] no-underline text-sm leading-5 hover:bg-blue-500 cursor-pointer border-none w-full text-left font-[inherit]";
const navLinkActive = "bg-blue-500 text-white font-semibold";

const sections = [
    { key: 'dashboard', icon: 'dashboard', label: 'General' },
    { key: 'calendar', icon: 'calendar_month', label: 'Calendario' },
    { key: 'tasks', icon: 'assignment', label: 'Tareas' },

];

export function SideNav({ courseId, activeSection, onSectionChange }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const handleLeave = useCourseStore(s => s.handleLeave);

    const confirmLeave = () => {
        const didLeave = handleLeave(courseId);
        if (!didLeave) return;

        setShowModal(false);
        navigate('/course', { replace: true });
    };

    return (
        <>
            <nav className=" hidden md:flex flex-col fixed left-0 top-0 h-full p-4 bg-[#f2f3fd] text-[#0058be] text-sm leading-5 border-r border-[#c2c6d6] w-64 z-40 transition-all duration-200">
                <div className="mb-8">
                    <Link to="/" className="text-xl leading-7 font-semibold text-[#191b23] no-underline">Intellect </Link>
                    <p className="text-[#424754] text-xs leading-4 tracking-widest font-semibold uppercase mt-0.5">Task manager</p>
                </div>

                <ul className="flex-1 flex flex-col gap-2 list-none p-0 m-0">
                    {sections.map(({ key, icon, label }) => (
                        <li key={key}>
                            <button
                                className={`${navLink} ${activeSection === key ? navLinkActive : ''}`}
                                onClick={() => onSectionChange(key)}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={activeSection === key ? { fontVariationSettings: "'FILL' 1" } : undefined}
                                >
                                    {icon}
                                </span>
                                {label}
                            </button>
                        </li>
                    ))}
                </ul>

                <ul className="mt-auto flex flex-col gap-2 border-t border-[#c2c6d6] pt-4 list-none p-0 m-0">
                    <li>
                        <button className={navLink}>
                            <span className="material-symbols-outlined">settings</span>
                            Ajustes
                        </button>
                    </li>

                    <li>
                        <button
                            className={`${navLink} text-red-500 hover:bg-red-500/10 hover:text-red-500`}
                            onClick={() => setShowModal(true)}
                        >
                            <span className="material-symbols-outlined">logout</span>
                            Salir del curso
                        </button>
                    </li>
                </ul>
            </nav>

            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-[#f2f3fd] border border-[#c2c6d6] rounded-xl p-6 max-w-[380px] w-[90%]"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-[#191b23] mb-2">¿Salir del curso?</h3>
                        <p className="text-sm text-[#424754] mb-6 leading-[1.5]">Deberás volver a seleccionar el curso para acceder.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                className="px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer border-none bg-[#e1e2ec] text-[#191b23] hover:bg-[#d0d1e0] transition-colors"
                                onClick={() => setShowModal(false)}
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
            )}
        </>
    )
}
