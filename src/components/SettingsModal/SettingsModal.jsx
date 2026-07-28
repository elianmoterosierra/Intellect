import { useState } from 'react'

export function SettingsModal({ onClose, onOpenPerfil }) {
    const [view, setView] = useState('menu')

    const handleEditProfile = () => {
        onClose()
        onOpenPerfil()
    }

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-overlayIn"
            onClick={onClose}
            role="presentation"
        >
            <div
                className="w-full max-w-[500px] max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#e2e3f0] animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="relative flex items-center gap-5 px-7 py-7 text-white"
                    style={{ background: 'linear-gradient(135deg, #0058be 0%, #2170e4 100%)' }}
                >
                    <span className="material-symbols-outlined text-5xl leading-none">settings</span>
                    <div className="flex flex-col">
                        <h3 className="text-xl font-bold leading-6">Ajustes</h3>
                        <p className="mt-1 text-sm font-medium text-white/80">Configura tu experiencia</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-5 top-5 rounded-full p-1 text-white/75 transition-colors hover:bg-white/15 hover:text-white"
                        aria-label="Cerrar ajustes"
                    >
                        <span className="material-symbols-outlined block text-2xl">close</span>
                    </button>
                </div>

                {view === 'menu' ? (
                    <div className="flex-1 overflow-y-auto px-7 py-5">
                        <button
                            type="button"
                            onClick={handleEditProfile}
                            className="flex items-center gap-4 w-full rounded-xl border border-[#cdd3e9] bg-[#f9faff] px-5 py-4 text-left transition-all hover:bg-[#f3f5fc] active:scale-[0.98]"
                        >
                            <span className="material-symbols-outlined text-[28px] text-[#0058be]">account_circle</span>
                            <div className="flex-1">
                                <h4 className="text-[15px] font-semibold text-[#191b23]">Editar Perfil</h4>
                                <p className="text-sm text-[#9298af]">Nombre, email y contraseña</p>
                            </div>
                            <span className="material-symbols-outlined text-[#9298af]">chevron_right</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setView('about')}
                            className="flex items-center gap-4 w-full rounded-xl border border-[#cdd3e9] bg-[#f9faff] px-5 py-4 text-left transition-all hover:bg-[#f3f5fc] active:scale-[0.98] mt-3"
                        >
                            <span className="material-symbols-outlined text-[28px] text-[#0058be]">info</span>
                            <div className="flex-1">
                                <h4 className="text-[15px] font-semibold text-[#191b23]">Acerca de</h4>
                                <p className="text-sm text-[#9298af]">Información de la aplicación</p>
                            </div>
                            <span className="material-symbols-outlined text-[#9298af]">chevron_right</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto px-7 py-8">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-6xl text-[#0058be]">info</span>
                            <h3 className="text-2xl font-bold text-[#191b23] mt-4">Intellect</h3>
                            <p className="text-sm font-semibold text-[#9298af] uppercase tracking-widest mt-1">v0.0.0</p>
                            <p className="text-[15px] text-[#424754] mt-4 max-w-sm mx-auto leading-6">
                                Plataforma de gestión académica para organizar tareas, cursos y progreso personal.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 mt-6">
                                <span className="px-3 py-1 rounded-full bg-[#f2f3fd] text-xs font-medium text-[#424754]">React 19</span>
                                <span className="px-3 py-1 rounded-full bg-[#f2f3fd] text-xs font-medium text-[#424754]">Tailwind 3</span>
                                <span className="px-3 py-1 rounded-full bg-[#f2f3fd] text-xs font-medium text-[#424754]">Zustand</span>
                                <span className="px-3 py-1 rounded-full bg-[#f2f3fd] text-xs font-medium text-[#424754]">Vite 8</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-2 px-7 pb-7">
                    {view === 'about' && (
                        <button
                            type="button"
                            onClick={() => setView('menu')}
                            className="flex-1 rounded-xl border border-[#cdd3e9] py-3 text-[15px] font-medium text-[#424754] transition-colors hover:bg-[#f3f5fc]"
                        >
                            Volver
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-[#cdd3e9] py-3 text-[15px] font-medium text-[#424754] transition-colors hover:bg-[#f3f5fc]"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}
