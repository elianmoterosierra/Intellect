import { COURSE_SECTIONS } from '../../../../utils/courseSections';
import { ExitModal } from '../../Common/ExitModal/ExitModal';
import { useAuthStore } from '../../../../store/AuthStore';
import { useUIStore } from '../../../../store/uiStore';
import { useState } from 'react';

const btnClass = "flex flex-col items-center justify-center flex-1 h-full bg-transparent border-none cursor-pointer";

const navItems = [
    { key: COURSE_SECTIONS.DASHBOARD, icon: 'dashboard' },
    { key: COURSE_SECTIONS.CALENDAR, icon: 'calendar_month' },
    { key: COURSE_SECTIONS.ADD_TASKS, icon: 'assignment' },
];

export function BottomNav({ activeSection, onSectionChange }) {
    const courseId = useAuthStore(s => s.user?.selectedCourseId);
    const openAddTaskModal = useUIStore(s => s.openAddTaskModal);
    const [showModal, setShowModal] = useState(false);
    const onClose = () => setShowModal(false);

    return (
        <>
            <nav className="md:hidden flex fixed bottom-0 w-full bg-[#f9f9ff] border-t border-[#c2c6d6] items-center h-16 z-50">
                {navItems.map(({ key, icon }) => (
                    <button
                        key={key}
                        onClick={() => onSectionChange(key)}
                        className={`${btnClass} ${activeSection === key ? 'text-[#0058be]' : 'text-[#424754]'}`}
                    >
                        <span className="material-symbols-outlined text-2xl">{icon}</span>
                    </button>
                ))}
                <button className={`${btnClass} text-[#424754]`} onClick={openAddTaskModal}>
                    <span className="material-symbols-outlined text-2xl">add</span>
                </button>
                <button
                    className={`${btnClass} text-red-500`}
                    onClick={() => setShowModal(true)}
                >
                    <span className="material-symbols-outlined text-2xl">logout</span>
                </button>
            </nav>
            {
                showModal && (
                    <ExitModal courseId={courseId} onClose={onClose} />
                )
            }
        </>
    )
}