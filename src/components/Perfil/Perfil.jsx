import { useAuthStore } from "../../store/AuthStore";
import { useNavigate } from "react-router";
import { ButtonLogout } from "./ButtonLogout/ButtonLogout";

export function Perfil({ onClose }) {
    const { userName, logout } = useAuthStore();
    const navigate = useNavigate();

    const initial = userName ? userName.charAt(0).toUpperCase() : "?";

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-overlayIn"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-[400px] overflow-hidden border border-gray-100 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header band */}
                <div
                    className="relative h-24 w-full flex items-center justify-center"
                    style={{
                        background: "linear-gradient(135deg, #0058be 0%, #2170e4 100%)",
                    }}
                >
                    {/* Avatar */}
                    <div
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white border-4 border-white"
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
                <div className="px-8 pt-14 pb-8 flex flex-col items-center gap-5">
                    {/* Name & role */}
                    <div className="text-center">
                        <h2
                            className="font-bold text-gray-800"
                            style={{ fontSize: "20px", margin: 0, letterSpacing: "-0.3px" }}
                        >
                            {userName ?? "Usuario"}
                        </h2>
                        <p className="text-sm mt-1" style={{ color: "#0058be" }}>
                            Miembro activo
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="w-full border-t border-gray-100" />

                    {/* Info rows */}
                    <div className="w-full flex flex-col gap-3">
                        {[
                            { icon: "person", label: "Nombre", value: userName ?? "—" },
                            { icon: "mail", label: "Email", value: userName ? `${userName.toLowerCase()}@mail.com` : "—" },
                            { icon: "lock", label: "Contraseña", value: "••••••••" },
                        ].map(({ icon, label, value }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 group"
                                style={{ background: "#f8faff", border: "1px solid #e8eef8" }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = "rgba(0,88,190,0.06)";
                                    e.currentTarget.style.border = "1px solid rgba(0,88,190,0.2)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = "#f8faff";
                                    e.currentTarget.style.border = "1px solid #e8eef8";
                                }}
                            >
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ background: "rgba(0,88,190,0.1)" }}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: "18px", color: "#0058be" }}
                                    >
                                        {icon}
                                    </span>
                                </div>
                                <div className="flex flex-col items-start">
                                    <span
                                        style={{
                                            color: "#9ca3af",
                                            fontSize: "10px",
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.8px",
                                        }}
                                    >
                                        {label}
                                    </span>
                                    <span style={{ color: "#1f2937", fontSize: "14px", fontWeight: 500 }}>
                                        {value}
                                    </span>
                                </div>
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
    );
}