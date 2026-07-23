import { create } from 'zustand';

function loadAuth() {
    try {
        const saved = localStorage.getItem('auth');
        return saved ? JSON.parse(saved) : { isLoggedIn: false, userName: null };
    } catch {
        return { isLoggedIn: false, userName: null };
    }
}

export const useAuthStore = create((set) => ({
    ...loadAuth(),

    login: (userName) => {
        const data = { isLoggedIn: true, userName };
        localStorage.setItem('auth', JSON.stringify(data));
        set(data);
    },

    register: (userName) => {
        const data = { isLoggedIn: true, userName };
        localStorage.setItem('auth', JSON.stringify(data));
        set(data);
    },

    logout: () => {
        localStorage.removeItem('auth');
        set({ isLoggedIn: false, userName: null });
    },
}));
