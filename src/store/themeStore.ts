import { create } from 'zustand';

const THEME_KEY = 'theme';

function applyTheme(dark: boolean) {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
}

interface ThemeStore {
    isDark: boolean;
    toggleTheme: () => void;
    toggleThemeAt: (x: number, y: number) => void;
    setTheme: (dark: boolean) => void;
    initTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
    isDark: false,

    toggleTheme: () => {
        const next = !get().isDark;
        set({ isDark: next });
        applyTheme(next);
    },

    toggleThemeAt: (x: number, y: number) => {
        const next = !get().isDark;

        // Fallback: sin View Transitions API o con prefer-reduced-motion
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!document.startViewTransition || prefersReduced) {
            set({ isDark: next });
            applyTheme(next);
            return;
        }

        // Radio máximo necesario para cubrir toda la pantalla desde (x, y)
        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y),
        );

        // CSS custom props para que el keyframe sepa el origen
        document.documentElement.style.setProperty('--vt-x', `${x}px`);
        document.documentElement.style.setProperty('--vt-y', `${y}px`);
        document.documentElement.style.setProperty('--vt-r', `${maxRadius}px`);

        const transition = document.startViewTransition(() => {
            set({ isDark: next });
            applyTheme(next);
        });

        transition.ready.then(() => {
            document.documentElement.animate(
                [
                    { clipPath: `circle(0px at ${x}px ${y}px)` },
                    { clipPath: `circle(${maxRadius}px at ${x}px ${y}px)` },
                ],
                {
                    duration: 600,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    pseudoElement: '::view-transition-new(root)',
                },
            );
        });
    },

    setTheme: (dark) => {
        set({ isDark: dark });
        applyTheme(dark);
    },

    initTheme: () => {
        const saved = localStorage.getItem(THEME_KEY);
        let dark: boolean;
        if (saved === null) {
            dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
            dark = saved === 'dark';
        }
        set({ isDark: dark });
        applyTheme(dark);
    },
}));
