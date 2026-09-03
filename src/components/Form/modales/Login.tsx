import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuthStore } from "../../../store/AuthStore";
import { GoogleIcon } from '../GoogleIcon';

type LoginProps = {
    onSwitch: () => void;
    onSuccess: () => void;
};

export function Login({ onSwitch, onSuccess }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useAuthStore((state) => state.login);
    const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        const result = await login({ email, password });
        setIsSubmitting(false);
        if (!result.success) {
            setError(result.error ?? '');
            return;
        }

        setError('');
        onSuccess();
    };

    const handleGoogleLogin = async () => {
        if (isGoogleSubmitting) return;
        setError('');
        setIsGoogleSubmitting(true);
        const result = await loginWithGoogle();
        if (!result.success) {
            setError(result.error ?? 'No se pudo iniciar sesión con Google.');
            setIsGoogleSubmitting(false);
        }
    };

    return (
        <form className="flex flex-col items-center gap-4 w-full" onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border-2 border-brand bg-surface px-4 py-3 text-base text-ink outline-none transition-all duration-200 placeholder:text-ink-faint hover:border-brand-hover focus:border-brand-strong focus:ring-2 focus:ring-brand-ring md:text-sm animate-inputIn"
                style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border-2 border-brand bg-surface px-4 py-3 text-base text-ink outline-none transition-all duration-200 placeholder:text-ink-faint hover:border-brand-hover focus:border-brand-strong focus:ring-2 focus:ring-brand-ring md:text-sm animate-inputIn"
                style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm animate-inputIn"
                style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
            >
                {isSubmitting ? 'Iniciando sesión…' : 'Login'}
            </button>

            <div className="flex w-full items-center gap-3 text-xs text-ink-faint">
                <span className="h-px flex-1 bg-line" />
                <span>o continúa con</span>
                <span className="h-px flex-1 bg-line" />
            </div>

            <button
                type="button"
                onClick={() => void handleGoogleLogin()}
                disabled={isGoogleSubmitting || isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface py-3 text-sm font-semibold text-ink transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
                <GoogleIcon />
                {isGoogleSubmitting ? 'Conectando…' : 'Continuar con Google'}
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
