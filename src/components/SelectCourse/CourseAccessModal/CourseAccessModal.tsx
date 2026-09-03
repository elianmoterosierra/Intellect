import { useState } from 'react';
import { useModalAnimation } from '../../../Hooks/useModalAnimation';
import { useCourseStore } from '../../../store/courseStore';


type CourseAccessModalProps = {
    courseId: number;
    courseTitle: string;
    onSuccess: () => void;
    onClose: () => void;

};

export function CourseAccessModal({ courseId, courseTitle, onSuccess, onClose }: CourseAccessModalProps) {
    const { handleClose, overlayClass, modalClass, animationStyle } = useModalAnimation({ onClose });
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        const trimmed = code.trim();
        if (!/^\d{7}$/.test(trimmed)) {
            setError('El código debe tener 7 dígitos');
            return;
        }

        const result = await useCourseStore.getState().verifyAndSelect(courseId, code);
        if (!result.success && result.error) {
            setError(result.error);
            return;
        }

        onSuccess();
    };

    return (
        <div
            className={`fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] ${overlayClass}`}
            style={animationStyle}
            onClick={handleClose}
        >
            <div
                className={`w-full max-w-[380px] rounded-2xl bg-surface shadow-2xl border border-line-soft ${modalClass} overflow-hidden`}
                style={animationStyle}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 pt-6 pb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-brand-soft text-brand">
                        <span className="material-symbols-outlined text-[22px]">lock</span>
                    </div>
                    <h3 className="text-lg font-bold text-ink">Código de acceso</h3>
                    <p className="text-sm text-ink-faint mt-1">
                        Ingresa el código de 7 dígitos para unirte a <span className="font-semibold text-ink">{courseTitle}</span>
                    </p>
                </div>

                <div className="px-6 py-4">
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={7}
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value.trim());
                            setError('');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                        placeholder="Ej. 1234567"
                        className="w-full rounded-xl border border-line bg-muted px-4 py-3 text-center text-lg font-semibold tracking-widest text-ink outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand-ring placeholder:text-sm placeholder:font-normal placeholder:tracking-normal"
                        autoFocus
                    />
                    {error && (
                        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">error</span>
                            {error}
                        </p>
                    )}
                </div>

                <div className="flex gap-2 px-6 pb-6">
                    <button
                        onClick={handleClose}
                        className="flex-1 rounded-xl border border-line py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-muted-hover cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 rounded-xl bg-brand-strong py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer border-none"
                    >
                        Unirme
                    </button>
                </div>
            </div>
        </div>
    );
}
