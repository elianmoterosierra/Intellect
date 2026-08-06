import { useState } from 'react'
import { useAuthStore } from "../../store/AuthStore";
import { ButtonLogout } from "./ButtonLogout/ButtonLogout";
import { PasswordConfirmModal } from "./PasswordConfirmModal";
import { FieldEditModal } from "./FieldEditModal";

type EditableField = 'name' | 'email' | 'password';

const FIELD_LABELS: Record<EditableField, string> = { name: 'Nombre', email: 'Email', password: 'Contraseña' }

type PerfilProps = {
    onClose: () => void;
    compact?: boolean;
};

export function Perfil({ onClose, compact = false }: PerfilProps) {
    const { user } = useAuthStore();
    const [editingField, setEditingField] = useState<EditableField | null>(null)
    const [step, setStep] = useState<'password' | 'edit' | null>(null)

    const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

    const handleFieldClick = (field: EditableField) => {
        setEditingField(field)
        setStep('password')
    }

    const handlePasswordSuccess = () => {
        setStep('edit')
    }

    const handleCancel = () => {
        setEditingField(null)
        setStep(null)
    }

    const infoRows: Array<{ field: EditableField; icon: string; label: string; value: string }> = [
        { field: 'name', icon: "person", label: "Nombre", value: user?.name ?? "—" },
        { field: 'email', icon: "mail", label: "Email", value: user?.email ?? "—" },
        { field: 'password', icon: "lock", label: "Contraseña", value: "••••••••" },
    ];

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-overlayIn"
                onClick={onClose}
            >
                <div
                    className="relative bg-surface rounded-2xl shadow-2xl w-[90vw] max-w-[400px] overflow-hidden border border-gray-100 animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header band */}
                    <div
                        className={`relative w-full flex items-center justify-center ${compact ? 'h-16 md:h-20' : 'h-20 md:h-24'}`}
                        style={{
                            background: "linear-gradient(135deg, #0058be 0%, #2170e4 100%)",
                        }}
                    >
                        {/* Avatar */}
                        <div
                            className={`absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center font-bold text-white border-4 border-white ${compact
                                ? '-bottom-5 w-11 h-11 text-lg md:w-13 md:h-13 md:text-xl'
                                : '-bottom-7 md:-bottom-8 w-14 h-14 md:w-16 md:h-16 text-xl md:text-2xl'
                                }`}
                            style={{
                                background: "linear-gradient(135deg, #2170e4, #0058be)",
                                boxShadow: "0 4px 20px rgba(0,88,190,0.35)",
                            }}
                        >
                            {initial}
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 bg-white/20 hover:bg-white/35 rounded-full p-1.5 border-none cursor-pointer transition-all duration-200"
                            style={{ color: "white" }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: "18px", display: "block" }}>close</span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className={`flex flex-col items-center ${compact ? 'px-5 md:px-8 pt-9 pb-4 gap-3' : 'px-5 md:px-8 pt-12 md:pt-14 pb-6 md:pb-8 gap-4 md:gap-5'}`}>
                        {/* Name & role */}
                        <div className="text-center">
                            <h2
                                className={`font-bold text-gray-800 ${compact ? 'text-base' : 'text-lg md:text-xl'}`}
                                style={{ margin: 0, letterSpacing: "-0.3px" }}
                            >
                                {user?.name ?? "Usuario"}
                            </h2>
                            <p className="text-sm mt-1 text-brand">
                                Miembro activo
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="w-full border-t border-gray-100" />

                        {/* Info rows */}
                        <div className="w-full flex flex-col gap-3">
                            {infoRows.map(({ field, icon, label, value }) => (
                                <div
                                    key={label}
                                    className={`flex items-center gap-3 rounded-xl transition-all duration-200 group cursor-pointer ${compact ? 'px-2.5 md:px-3 py-2 md:py-2.5' : 'px-3 md:px-4 py-2.5 md:py-3'}`}
                                    style={{ background: "rgb(var(--muted))", border: "1px solid rgb(var(--line-soft))" }}
                                    onClick={() => handleFieldClick(field)}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = "rgb(var(--brand) / 0.06)";
                                        e.currentTarget.style.border = "1px solid rgb(var(--brand) / 0.2)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = "rgb(var(--muted))";
                                        e.currentTarget.style.border = "1px solid rgb(var(--line-soft))";
                                    }}
                                >
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-brand-soft"
                                    >
                                        <span
                                            className="material-symbols-outlined text-brand"
                                            style={{ fontSize: "18px" }}
                                        >
                                            {icon}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-start flex-1">
                                        <span
                                            style={{
                                                color: "rgb(var(--ink-faint))",
                                                fontSize: "10px",
                                                fontWeight: 600,
                                                textTransform: "uppercase",
                                                letterSpacing: "0.8px",
                                            }}
                                        >
                                            {label}
                                        </span>
                                        <span style={{ color: "rgb(var(--ink))", fontSize: "14px", fontWeight: 500 }}>
                                            {value}
                                        </span>
                                    </div>
                                    <span className="material-symbols-outlined text-ink-faint text-base opacity-0 group-hover:opacity-100 transition-opacity duration-200">edit</span>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="w-full border-t border-gray-100" />

                        {/* Logout button */}
                        <ButtonLogout onClose={onClose} />
                    </div>
                </div>
            </div>

            {step === 'password' && editingField && (
                <PasswordConfirmModal
                    fieldLabel={FIELD_LABELS[editingField]}
                    onSuccess={handlePasswordSuccess}
                    onCancel={handleCancel}
                />
            )}

            {step === 'edit' && editingField && (
                <FieldEditModal
                    field={editingField}
                    onCancel={handleCancel}
                />
            )}
        </>
    );
}