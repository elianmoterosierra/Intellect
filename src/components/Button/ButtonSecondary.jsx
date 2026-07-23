

export function ButtonOutline({ title, onClick }) {
    return (
        <button
            className="inline-flex items-center gap-2 border-2 border-[rgba(0,88,190,0.2)] text-[#0058be] px-8 py-4 rounded-lg font-semibold text-xl transition-all duration-300 hover:bg-[rgba(0,88,190,0.05)]"
            onClick={onClick}
        >{title}</button>
    )
}