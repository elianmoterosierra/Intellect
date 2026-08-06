import { useThemeStore } from '../../store/themeStore';

export function ThemeToggle() {
    const isDark = useThemeStore((s) => s.isDark);
    const toggleThemeAt = useThemeStore((s) => s.toggleThemeAt);

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        // Centro del botón como origen de la onda
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round(rect.left + rect.width / 2);
        const y = Math.round(rect.top + rect.height / 2);
        toggleThemeAt(x, y);
    }

    return (
        <button
            onClick={handleClick}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="material-symbols-outlined border-none bg-transparent cursor-pointer p-2 text-ink-soft rounded-full transition-all duration-200 hover:bg-brand-tint hover:text-brand active:scale-95"
        >
            {isDark ? 'light_mode' : 'dark_mode'}
        </button>
    );
}