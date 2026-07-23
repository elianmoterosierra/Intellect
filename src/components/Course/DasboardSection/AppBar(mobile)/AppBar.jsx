export function AppBar({ onToggleNotifications }) {
    return (
        <header className="md:hidden sticky top-0 z-50 flex justify-between items-center px-4 w-full h-16 bg-[#f9f9ff] border-b border-[#c2c6d6]">
            <div className="text-xl font-bold text-[#0058be] tracking-tight">
                Intelect
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onToggleNotifications}
                    className="relative flex items-center justify-center p-2 rounded-full text-[#424754] bg-transparent border-none cursor-pointer transition-colors duration-200 hover:bg-[#f2f3fd]"
                >
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-[#f9f9ff]" />
                </button>
                <button className="flex items-center justify-center p-2 rounded-full text-[#424754] bg-transparent border-none cursor-pointer transition-colors duration-200 hover:bg-[#f2f3fd]">
                    <span className="material-symbols-outlined">account_circle</span>
                </button>
            </div>
        </header>
    )
}