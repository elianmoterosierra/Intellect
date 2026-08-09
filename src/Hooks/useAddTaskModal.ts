import { useEffect, useRef } from 'react';
import { useUIStore } from '../store/uiStore';

export function useAddTaskModal() {
    const isOpen = useUIStore((state) => state.isAddTaskModalOpen);
    const closeAddTaskModal = useUIStore((state) => state.closeAddTaskModal);
    const titleInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        titleInputRef.current?.focus();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeAddTaskModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeAddTaskModal]);

    return { isOpen, close: closeAddTaskModal, titleInputRef };
}