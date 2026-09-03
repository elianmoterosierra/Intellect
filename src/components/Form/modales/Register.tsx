import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuthStore } from "../../../store/AuthStore";
import { GoogleIcon } from '../GoogleIcon';

type RegisterProps = {
    onSwitch: () => void;
    onSuccess: () => void;
};

export function Register({ onSwitch, onSuccess }: RegisterProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const register = useAuthStore((state) => state.register);
    const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (name == ('') || email == ('') || password == ('')) return setError('Todos los campos son obligatorios');
        else if (name.length < 3) return setError('El nombre debe tener al menos 3 caracteres');
        else if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');
        else if (password.includes(' ')) return setError('La contraseña no puede contener espacios');
        else if (!email.includes('@')) return setError('El email debe tener un @');
        else if (!email.includes('.')) return setError('El email debe tener un .');
        else if (email.includes(' ')) return setError('El email no puede contener espacios');

        else {
            setIsSubmitting(true);
            const result = await register({ name, email, password });
            setIsSubmitting(false);
            if (!result.success) return setError(result.error ?? '');

            setError('');
            onSuccess();
        }

    };

    const handleGoogleRegister = async () => {
        if (isGoogleSubmitting) return;
        setError('');
        setIsGoogleSubmitting(true);
        const result = await loginWithGoogle();
        if (!result.success) {
            setError(result.error ?? 'No se pudo registrarte con Google.');
            setIsGoogleSubmitting(false);
        }
    };

    return (
        <form className="flex flex-col items-center gap-4 w-full md:mt-8" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-xl border-2 border-brand bg-surface px-4 py-3 text-base text-ink outline-none transition-all duration-200 placeholder:text-ink-faint hover:border-brand-hover focus:border-brand-strong focus:ring-2 focus:ring-brand-ring md:text-sm animate-inputIn"
                style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border-2 border-brand bg-surface px-4 py-3 text-base text-ink outline-none transition-all duration-200 placeholder:text-ink-faint hover:border-brand-hover focus:border-brand-strong focus:ring-2 focus:ring-brand-ring md:text-sm animate-inputIn"
                style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border-2 border-brand bg-surface px-4 py-3 text-base text-ink outline-none transition-all duration-200 placeholder:text-ink-faint hover:border-brand-hover focus:border-brand-strong focus:ring-2 focus:ring-brand-ring md:text-sm animate-inputIn"
                style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm animate-inputIn"
                style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
            >
                {isSubmitting ? 'Registrando…' : 'Register'}
            </button>

            <div className="flex w-full items-center gap-3 text-xs text-ink-faint">
                <span className="h-px flex-1 bg-line" />
                <span>o regístrate con</span>
                <span className="h-px flex-1 bg-line" />
            </div>

            <button
                type="button"
                onClick={() => void handleGoogleRegister()}
                disabled={isGoogleSubmitting || isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface py-3 text-sm font-semibold text-ink transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
                <GoogleIcon />
                {isGoogleSubmitting ? 'Conectando…' : 'Registrarse con Google'}
            </button>
            <span className="text-sm text-red-500 animate-inputIn" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>{error}</span>

            <p className="text-sm text-ink-soft animate-inputIn" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
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
