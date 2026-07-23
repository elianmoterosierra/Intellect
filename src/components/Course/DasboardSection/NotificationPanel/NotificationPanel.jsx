export function NotificationPanel({ onClose }) {
    return (
        <div className="notification-panel">
            <div className="notification-header">
                <h3 className="notification-header-title">Recent Notifications</h3>
                <button className="icon-close" onClick={onClose}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            <div className="notification-list">
                <div className="notification-item">
                    <span className="material-symbols-outlined text-warning">warning</span>
                    <div>
                        <p className="notification-item-text font-semibold">Próxima entrega: Ensayo de Física</p>
                        <p className="notification-item-time">Vence en 2 horas</p>
                    </div>
                </div>
                <div className="notification-item">
                    <span className="material-symbols-outlined text-info">info</span>
                    <div>
                        <p className="notification-item-text">Nueva nota: Matemáticas</p>
                        <p className="notification-item-time">Hace 15 minutos</p>
                    </div>
                </div>
            </div>
            <div className="notification-footer">
                <button className="btn-link-center">Ver todas</button>
            </div>
        </div>
    );
}
