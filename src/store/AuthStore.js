import { create } from 'zustand';

const AUTH_KEY = 'auth';
const USERS_KEY = 'users';
const loggedOutState = { isLoggedIn: false, user: null };

function readStorage(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
}

function loadUsers() {
    const users = readStorage(USERS_KEY, []);
    return Array.isArray(users) ? users : [];
}

function loadAuth() {
    const auth = readStorage(AUTH_KEY, loggedOutState);
    return auth?.isLoggedIn && auth?.user ? auth : loggedOutState;
}

function saveAuth(user) {
    const auth = { isLoggedIn: true, user };
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    return auth;
}


export const useAuthStore = create((set, get) => ({
    ...loadAuth(),
    users: loadUsers(),

    login: ({ email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const user = get().users.find(
            (candidate) => candidate.email.toLowerCase() === normalizedEmail && candidate.password === password,
        );

        if (!user) {
            return { success: false, error: 'El email o la contraseña son incorrectos.' };
        }

        const auth = saveAuth(user);
        set(auth);
        return { success: true, user };
    },

    register: ({ name, email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const users = get().users;

        if (users.some((candidate) => candidate.email.toLowerCase() === normalizedEmail)) {
            return { success: false, error: 'Ya existe una cuenta con ese email.' };
        }

        const user = {
            name: name.trim(),
            email: normalizedEmail,
            password,
            selectedCourseId: null,
            taskStatusByCourse: {},
        };
        const updatedUsers = [...users, user];
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

        const auth = saveAuth(user);
        set({ ...auth, users: updatedUsers });
        return { success: true, user };
    },

    setSelectedCourse: (courseId) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const user = { ...currentUser, selectedCourseId: courseId };
        const users = get().users.map((candidate) =>
            candidate.email === user.email ? user : candidate,
        );

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        const auth = saveAuth(user);
        set({ ...auth, users });
    },

    updateUser: (field, value) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = { ...currentUser, [field]: value };
        const users = get().users.map((candidate) =>
            candidate.email === currentUser.email ? updatedUser : candidate
        );

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        const auth = saveAuth(updatedUser);
        set({ ...auth, users });
    },

    toggleTaskStatus: (courseId, taskId) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const courseStatus = currentUser.taskStatusByCourse?.[courseId] ?? {};
        const currentTask = courseStatus[taskId] ?? { completed: false };
        const user = {
            ...currentUser,
            taskStatusByCourse: {
                ...currentUser.taskStatusByCourse,
                [courseId]: {
                    ...courseStatus,
                    [taskId]: {
                        ...currentTask,
                        completed: !currentTask.completed,
                    },
                },
            },
        };
        const users = get().users.map((candidate) =>
            candidate.email === user.email ? user : candidate
        );

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        localStorage.setItem(
            AUTH_KEY,
            JSON.stringify({ isLoggedIn: true, user })
        );

        set({ user, users });


    },

    logout: () => {
        localStorage.removeItem(AUTH_KEY);
        set(loggedOutState);
    },
}));
