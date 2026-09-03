import { useModalAnimation } from '../../Hooks/useModalAnimation';

type PrivacyPolicyModalProps = {
    onClose: () => void;
};

export function PrivacyPolicyModal({ onClose }: PrivacyPolicyModalProps) {
    const { handleClose, overlayClass, modalClass, animationStyle } = useModalAnimation({
        onClose,
        duration: 260,
        enterModalClass: 'animate-fadeIn',
        exitModalClass: 'animate-modalOut',
    });

    return (
        <div
            className={`fixed inset-0 z-[220] flex items-center justify-center bg-black/50 p-4 ${overlayClass}`}
            onClick={(event) => { if (event.target === event.currentTarget) handleClose(); }}
            style={animationStyle}
        >
            <div
                className={`subject-modal-scroll max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-line-soft bg-surface shadow-2xl ${modalClass}`}
                onClick={(event) => event.stopPropagation()}
                style={animationStyle}
            >
                <div className="flex items-center justify-between gap-4 border-b border-line-soft px-6 py-5">
                    <div className="text-left">
                        <span className="material-symbols-outlined text-brand">shield_lock</span>
                        <h2 className="mt-2 text-xl font-bold text-ink">Política de privacidad</h2>
                        <p className="mt-1 text-sm text-ink-soft">Cómo protegemos y usamos tu información.</p>
                    </div>
                    <button type="button" onClick={handleClose} className="material-symbols-outlined rounded-full p-1 text-ink-soft hover:bg-muted" aria-label="Cerrar política de privacidad">close</button>
                </div>

                <div className="space-y-5 px-6 py-6 text-left text-sm leading-6 text-ink-soft">
                    <section>
                        <h3 className="mb-1 font-semibold text-ink">Información que recopilamos</h3>
                        <p>Solo usamos los datos necesarios para crear tu cuenta, administrar tus cursos y mostrar tu progreso académico.</p>
                    </section>
                    <section>
                        <h3 className="mb-1 font-semibold text-ink">Cómo usamos tus datos</h3>
                        <p>Tus datos permiten autenticarte, guardar tus tareas y sincronizar la información de los cursos a los que perteneces.</p>
                    </section>
                    <section>
                        <h3 className="mb-1 font-semibold text-ink">Tus opciones</h3>
                        <p>Puedes revisar y actualizar la información de tu perfil desde Ajustes. Si necesitas eliminar tu cuenta, solicita asistencia al administrador de tu institución.</p>
                    </section>
                </div>

                <div className="flex justify-end border-t border-line-soft px-6 py-4">
                    <button type="button" onClick={handleClose} className="rounded-xl bg-brand-strong px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover">Entendido</button>
                </div>
            </div>
        </div>
    );
}
