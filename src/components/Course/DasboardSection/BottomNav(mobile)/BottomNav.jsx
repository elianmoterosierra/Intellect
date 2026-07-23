const navItems = [
    { key: 'dashboard', icon: 'dashboard' },
    { key: 'calendar', icon: 'calendar_month' },
    { key: 'tasks', icon: 'assignment' },
];

export function BottomNav({ activeSection, onSectionChange }) {
    return (
        <nav className="md:hidden flex fixed bottom-0 w-full bg-[#f9f9ff] border-t border-[#c2c6d6] justify-around items-center h-16 px-2 pb-2 z-50">
            {navItems.map(({ key, icon }) => (
                <button
                    key={key}
                    onClick={() => onSectionChange(key)}
                    className={`flex flex-col items-center gap-1 w-16 bg-transparent border-none cursor-pointer ${
                        activeSection === key ? 'text-[#0058be]' : 'text-[#424754]'
                    }`}
                >
                    <span className="material-symbols-outlined">{icon}</span>
                </button>
            ))}
            <button className="flex flex-col items-center gap-1 w-16 text-[#424754] bg-transparent border-none cursor-pointer">
                <span className="material-symbols-outlined">add</span>
            </button>
            <button className="flex flex-col items-center gap-1 w-16 text-[#424754] bg-transparent border-none cursor-pointer">
                <span className="material-symbols-outlined">account_circle</span>
            </button>
        </nav>
    )
}