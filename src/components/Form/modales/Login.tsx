import { useState } from 'react';
import { useAuthStore } from "../../../store/AuthStore";
import { GoogleIcon } from '../GoogleIcon';

type LoginProps = {
    onSuccess: () => void;
};

export function Login({ onSuccess }: LoginProps) {
    const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
    const [error, setError] = useState('');
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

    const handleGoogleLogin = async () => {
        if (isGoogleSubmitting) return;
        setError('');
        setIsGoogleSubmitting(true);
        const result = await loginWithGoogle();
        if (!result.success) {
            setError(result.error ?? 'No se pudo iniciar sesión con Google.');
            setIsGoogleSubmitting(false);
            return;
        }

        onSuccess();
    };

    return (
        <div className="flex w-full flex-col items-center gap-4">
            <button
                type="button"
                onClick={() => void handleGoogleLogin()}
                disabled={isGoogleSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface py-3 text-sm font-semibold text-ink transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
                <GoogleIcon />
                {isGoogleSubmitting ? 'Conectando…' : 'Continuar con Google'}
            </button>

            {error && <span className="text-sm text-red-500">{error}</span>}

            <p className="text-center text-sm text-ink-soft">
                Usa tu cuenta de Google para iniciar sesión o crear tu cuenta.
            </p>
        </div>
    );
}
