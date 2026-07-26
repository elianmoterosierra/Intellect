import { useRef } from 'react';

// Distancia mínima (px) para considerar un swipe horizontal.
// Más bajo = más sensible; más alto = más "firme" requerido.
const MIN_DISTANCE = 50;

/**
 * Hook para detectar swipes horizontales sobre un contenedor.
 * Devuelve handlers de touch que deben esparcirse en el JSX.
 * Ignora gestos predominantemente verticales (scroll).
 */
export function useSwipe({ onSwipeLeft, onSwipeRight }) {
    const startX = useRef(0);
    const startY = useRef(0);
    const tracking = useRef(false);

    function onTouchStart(e) {
        const touch = e.touches[0];
        startX.current = touch.clientX;
        startY.current = touch.clientY;
        tracking.current = true;
    }

    function onTouchMove(e) {
        if (!tracking.current) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX.current;
        const dy = touch.clientY - startY.current;
        // Si el movimiento es más vertical que horizontal, no es swipe horizontal.
        if (Math.abs(dy) > Math.abs(dx)) {
            tracking.current = false;
        }
    }

    function onTouchEnd(e) {
        if (!tracking.current) return;
        tracking.current = false;
        const endX = e.changedTouches[0].clientX;
        const dx = endX - startX.current;
        if (Math.abs(dx) < MIN_DISTANCE) return;
        if (dx < 0) onSwipeLeft?.();
        else onSwipeRight?.();
    }

    return { onTouchStart, onTouchMove, onTouchEnd };
}
