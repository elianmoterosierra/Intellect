export function FormAddTask({ form, setForm, handleSubmit, setShowForm }) {
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 animate-fadeIn" style={{ animationDuration: '0.22s' }}>
            <input
                autoFocus
                type="text"
                placeholder="Título de la tarea…"
                value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d0d2e8] text-sm text-[#191b23] bg-[#f8f9ff]
                           placeholder-[#9496a8] focus:outline-none focus:ring-2 focus:ring-[#5c6bc0]/30 focus:border-[#5c6bc0] transition-all"
            />
            <input
                type="text"
                placeholder="Descripción de la tarea…"
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d0d2e8] text-sm text-[#191b23] bg-[#f8f9ff]
                           placeholder-[#9496a8] focus:outline-none focus:ring-2 focus:ring-[#5c6bc0]/30 focus:border-[#5c6bc0] transition-all"
            />
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2 rounded-xl border border-[#d0d2e8] text-sm text-[#424754]
                               hover:bg-[#f0f1fb] transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#0058be] text-sm text-white font-semibold
                               hover:bg-[#0041a8] active:scale-95 transition-all"
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}