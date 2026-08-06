import { Login } from './modales/Login';
import { Register } from './modales/Register';
import { useState } from 'react';

type FormSectionProps = {
    onClose: () => void;
    onSuccess: () => void;
};

export function FormSection({ onClose, onSuccess }: FormSectionProps) {
    const [loginIsVisible, setLoginIsVisible] = useState(true);

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
                    {/* Header Tabs */}
                    <div className="flex w-full mb-6 bg-gray-100 rounded-xl p-1 relative">
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-2px)] rounded-lg bg-surface shadow-md transition-all duration-300 ease-out ${loginIsVisible ? 'left-1' : 'left-[calc(50%+1px)]'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setLoginIsVisible(true)}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold relative z-10 transition-all duration-300 ${loginIsVisible ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginIsVisible(false)}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold relative z-10 transition-all duration-300 ${!loginIsVisible ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            Registro
                        </button>
                    </div>

                    {/* Forms slider wrapper */}
                    <div className="overflow-hidden relative w-full h-[300px]">
                        <div
                            className="flex w-[200%] h-full transition-transform duration-500 ease-out"
                            style={{ transform: loginIsVisible ? 'translateX(0%)' : 'translateX(-50%)' }}
                        >
                            {/* Login Form */}
                            <div className="w-1/2 h-full pr-4 flex flex-col justify-center transition-opacity duration-300" style={{ opacity: loginIsVisible ? 1 : 0 }}>
                                <Login
                                    onSwitch={() => setLoginIsVisible(false)}
                                    onSuccess={onSuccess}
                                />
                            </div>

                            {/* Register Form */}
                            <div className="w-1/2 h-full pl-4 flex flex-col justify-center transition-opacity duration-300" style={{ opacity: !loginIsVisible ? 1 : 0 }}>
                                <Register
                                    onSwitch={() => setLoginIsVisible(true)}
                                    onSuccess={onSuccess}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}