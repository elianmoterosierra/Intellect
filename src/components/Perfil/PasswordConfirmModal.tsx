import { useState } from 'react'
import { useAuthStore } from '../../store/AuthStore'

type PasswordConfirmModalProps = {
    fieldLabel: string;
    onSuccess: () => void;
    onCancel: () => void;
};

export function PasswordConfirmModal({ fieldLabel, onSuccess, onCancel }: PasswordConfirmModalProps) {
    const { user } = useAuthStore()
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleConfirm = () => {
        if (password !== user?.password) {
            setError('Contraseña incorrecta')
            return
        }
        onSuccess()
    }

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] animate-overlayIn"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-[380px] rounded-2xl bg-white shadow-2xl border border-[#e2e3f0] animate-fadeIn overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 pt-6 pb-2">
                    <h3 className="text-lg font-bold text-[#191b23]">Confirmar contraseña</h3>
                    <p className="text-sm text-[#9298af] mt-1">
                        Ingresa tu contraseña para editar <span className="font-semibold text-[#191b23]">{fieldLabel}</span>
                    </p>
                </div>

                <div className="px-6 py-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError('') }}
                        onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                        placeholder="Contraseña actual"
                        className="w-full rounded-xl border border-[#cdd3e9] bg-[#f9faff] px-4 py-3 text-sm text-[#191b23] outline-none transition-all duration-200 focus:border-[#0058be] focus:ring-2 focus:ring-[rgba(0,88,190,0.15)]"
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
                        onClick={onCancel}
                        className="flex-1 rounded-xl border border-[#cdd3e9] py-3 text-sm font-medium text-[#424754] transition-colors hover:bg-[#f3f5fc] cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 rounded-xl bg-[#0058be] py-3 text-sm font-medium text-white transition-colors hover:bg-[#004a9e] cursor-pointer border-none"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    )
}