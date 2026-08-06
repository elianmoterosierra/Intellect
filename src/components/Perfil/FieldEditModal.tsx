import { useState } from 'react'
import { useAuthStore } from '../../store/AuthStore'

type EditableField = 'name' | 'email' | 'password';

const INPUT_CONFIG: Record<EditableField, { type: string; placeholder: string; label: string }> = {
    name: { type: 'text', placeholder: 'Nuevo nombre', label: 'Nombre' },
    email: { type: 'email', placeholder: 'Nuevo email', label: 'Email' },
    password: { type: 'password', placeholder: 'Nueva contraseña', label: 'Contraseña' },
}

type FieldEditModalProps = {
    field: EditableField;
    onCancel: () => void;
};

export function FieldEditModal({ field, onCancel }: FieldEditModalProps) {
    const { user, updateUser } = useAuthStore()
    const config = INPUT_CONFIG[field]
    const [value, setValue] = useState('')
    const [error, setError] = useState('')

    const handleSave = () => {
        const trimmed = value.trim()
        if (!trimmed) {
            setError('Este campo no puede estar vacío')
            return
        }

        if (field === 'email') {
            const normalized = trimmed.toLowerCase()
            const exists = useAuthStore.getState().users.some(
                (u) => u.email === normalized && u.email !== user?.email
            )
            if (exists) {
                setError('Este email ya está registrado')
                return
            }
            updateUser('email', normalized)
        } else {
            updateUser(field, trimmed)
        }

        onCancel()
    }

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] animate-overlayIn"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-[380px] rounded-2xl bg-surface shadow-2xl border border-line-soft animate-fadeIn overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 pt-6 pb-2">
                    <h3 className="text-lg font-bold text-ink">Editar {config.label}</h3>
                    <p className="text-sm text-ink-faint mt-1">
                        {field === 'password'
                            ? 'Ingresa tu nueva contraseña'
                            : `Nuevo valor para ${config.label.toLowerCase()}`
                        }
                    </p>
                </div>

                <div className="px-6 py-4">
                    <input
                        type={config.type}
                        value={value}
                        onChange={(e) => { setValue(e.target.value); setError('') }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        placeholder={config.placeholder}
                        className="w-full rounded-xl border border-line bg-muted px-4 py-3 text-sm text-ink outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand-ring"
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
                        className="flex-1 rounded-xl border border-line py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-muted-hover cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 rounded-xl bg-brand-strong py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer border-none"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}