import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuthStore } from "../../../store/AuthStore";

type RegisterProps = {
    onSwitch: () => void;
    onSuccess: () => void;
};

export function Register({ onSwitch, onSuccess }: RegisterProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const register = useAuthStore((state) => state.register);
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (name == ('') || email == ('') || password == ('')) return setError('Todos los campos son obligatorios');
        else if (name.length < 3) return setError('El nombre debe tener al menos 3 caracteres');
        else if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');
        else if (password.includes(' ')) return setError('La contraseña no puede contener espacios');
        else if (!email.includes('@')) return setError('El email debe tener un @');
        else if (!email.includes('.')) return setError('El email debe tener un .');
        else if (email.includes(' ')) return setError('El email no puede contener espacios');

        else {
            const result = register({ name, email, password });
            if (!result.success) return setError(result.error ?? '');

            setError('');
            onSuccess();
        }

    };

    return (
        <form className="flex flex-col items-center gap-4 w-full md:mt-8" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm hover:border-gray-300 animate-inputIn"
                style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm hover:border-gray-300 animate-inputIn"
                style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm hover:border-gray-300 animate-inputIn"
                style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
            />
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm animate-inputIn"
                style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
            >
                Register
            </button>
            <span className="text-sm text-red-500 animate-inputIn" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>{error}</span>

            <p className="text-sm text-gray-500 animate-inputIn" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                ¿Ya tienes una cuenta?{' '}
                <span
                    onClick={onSwitch}
                    className="text-blue-600 hover:underline cursor-pointer transition-colors duration-200"
                >
                    Login
                </span>
            </p>
        </form>
    );
}