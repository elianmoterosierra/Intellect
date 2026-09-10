import { Login } from './modales/Login';

type FormSectionProps = {
    onClose: () => void;
    onSuccess: () => void;
};

export function FormSection({ onClose, onSuccess }: FormSectionProps) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-overlayIn" onClick={onClose}>
            <div
                className="relative bg-surface rounded-2xl shadow-2xl w-[400px] overflow-hidden border border-gray-100 animate-fadeIn"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-gray-50 hover:bg-gray-100 rounded-full p-1.5 shadow-sm border-none cursor-pointer z-20 text-gray-400 hover:text-gray-600 hover:scale-110 active:scale-95 transition-all duration-200"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>

                <div className="p-8">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-semibold text-ink">Iniciar sesión</h2>
                        <p className="mt-2 text-sm text-ink-soft">Accede a Intellect con tu cuenta de Google.</p>
                    </div>

                    <div className="flex min-h-[150px] w-full items-center justify-center">
                        <Login onSuccess={onSuccess} />
                    </div>
                </div>
            </div>
        </div>
    )
}
