import { Link } from 'react-router';
import { useState } from 'react';
import { COURSE_SECTIONS } from '../../../../utils/courseSections';
import { ExitModal } from '../../Common/ExitModal/ExitModal';

const navLink = "flex items-center gap-4 px-4 py-2 rounded-xl transition-colors duration-200 text-[#424754] no-underline text-sm leading-5 hover:bg-blue-500 cursor-pointer border-none w-full text-left font-[inherit]";
const navLinkActive = "bg-blue-500 text-white font-semibold";

const sections = [
    { key: COURSE_SECTIONS.DASHBOARD, icon: 'dashboard', label: 'General' },
    { key: COURSE_SECTIONS.CALENDAR, icon: 'calendar_month', label: 'Calendario' },
    { key: COURSE_SECTIONS.ADD_TASKS, icon: 'assignment', label: 'Agregar Tareas' },
];

export function SideNav({ courseId, activeSection, onSectionChange }) {
    const [showModal, setShowModal] = useState(false);
    const onClose = () => setShowModal(false);


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
                <ExitModal courseId={courseId} onClose={onClose} />
            )}
        </>
    )
}
