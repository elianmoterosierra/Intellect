export function Footer() {
    return (
        <footer className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 px-10 py-6 bg-gray-50 border-t border-gray-200">
            <div>
                <strong className="text-xl text-ink">Intellect</strong>
                <p className="text-sm text-ink-soft mt-1">© 2026 Intellect. Built for Academic Precision.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
                <a href="#" className="text-sm text-ink-soft hover:text-brand hover:underline transition-colors">Privacy Policy</a>
                <a href="#" className="text-sm text-ink-soft hover:text-brand hover:underline transition-colors">Terms of Service</a>
                <a href="#" className="text-sm text-ink-soft hover:text-brand hover:underline transition-colors">Contact Us</a>
                <a href="#" className="text-sm text-ink-soft hover:text-brand hover:underline transition-colors">Documentation</a>
            </div>
        </footer>
    )
}