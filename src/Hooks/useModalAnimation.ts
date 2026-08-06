import { useCallback, useRef, useState } from 'react';

export type ModalAnimationOptions = {
    onClose: () => void;
    duration?: number;
    enterModalClass?: string;
    exitModalClass?: string;
    enterOverlayClass?: string;
    exitOverlayClass?: string;
};

/**
 * Hook genérico para animar la entrada/salida de modales.
 *
 * Devuelve las clases de animación ya resueltas según el estado (`entrando` /
 * `saliendo`) y un `handleClose` que reproduce la salida y solo invoca `onClose`
 * después de `duration` ms, para que el desmontaje real no corte la animación.
 *
 * Por defecto la caja desliza desde abajo hacia el centro (`slideUp`) y el
 * overlay hace fade, durante `duration` ms (600). Puedes cambiar la dirección
 * pasando otras clases para reutilizarlo en cualquier modal futuro.
 */
export function useModalAnimation({
    onClose,
    duration = 600,
    enterModalClass = 'animate-slideUpIn',
    exitModalClass = 'animate-slideUpOut',
    enterOverlayClass = 'animate-overlayIn',
    exitOverlayClass = 'animate-overlayOut',
}: ModalAnimationOptions) {
    const [closing, setClosing] = useState(false);
    const closingRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleClose = useCallback(() => {
        if (closingRef.current) return;
        closingRef.current = true;
        setClosing(true);
        timerRef.current = setTimeout(onClose, duration);
    }, [onClose, duration]);

    return {
        closing,
        handleClose,
        overlayClass: closing ? exitOverlayClass : enterOverlayClass,
        modalClass: closing ? exitModalClass : enterModalClass,
        animationStyle: { animationDuration: `${duration}ms` } as const,
    };
}