import { useState } from 'react';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';

export function Footer() {
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    return (
        <footer className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 px-10 py-6 bg-gray-50 border-t border-gray-200">
            <div>
                <strong className="text-xl text-ink">Intellect</strong>
                <p className="text-sm text-ink-soft mt-1">© 2026 Intellect. Built for Academic Precision.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
                <button type="button" onClick={() => setIsPrivacyOpen(true)} className="border-none bg-transparent p-0 text-sm text-ink-soft transition-colors hover:text-brand hover:underline">Política de privacidad</button>
            </div>
            {isPrivacyOpen && <PrivacyPolicyModal onClose={() => setIsPrivacyOpen(false)} />}
        </footer>
    )
}
