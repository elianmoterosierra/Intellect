import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuthStore } from "../../../store/AuthStore";

type LoginProps = {
    onSwitch: () => void;
    onSuccess: () => void;
};

export function Login({ onSwitch, onSuccess }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useAuthStore((state) => state.login);
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = login({ email, password });
        if (!result.success) {
            setError(result.error ?? '');
            return;
        }

        setError('');
        onSuccess();
    };

    return (
        <form className="flex flex-col items-center gap-4 w-full" onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm hover:border-gray-300 animate-inputIn"
                style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm hover:border-gray-300 animate-inputIn"
                style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            />
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm animate-inputIn"
                style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
            >
                Login
            </button>

            {error && <span className="text-sm text-red-500">{error}</span>}

            <p className="text-sm text-ink-soft animate-inputIn" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                ¿No tienes una cuenta?{' '}
                <span
                    onClick={onSwitch}
                    className="text-blue-600 hover:underline cursor-pointer transition-colors duration-200"
                >
                    Regístrate
                </span>
            </p>
        </form>
    );
}