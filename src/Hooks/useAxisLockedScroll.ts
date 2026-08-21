import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

const DRAG_SENSITIVITY = 2;

const AXIS_LOCK_THRESHOLD = 10;
const MOMENTUM_MULTIPLIER = 0.65;
const MOMENTUM_FRICTION = 0.96;
const MAX_VELOCITY = 1;
const VELOCITY_SMOOTHING = 0.15;
const MIN_MOMENTUM = 0.01;

type ScrollAxis = 'x' | 'y';

type AxisLockedScrollHandlers = {
    onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerCancel: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

/**
 * Locks a touch gesture to its dominant axis so a diagonal drag cannot
 * scroll the calendar horizontally and vertically at the same time.
 */
export function useAxisLockedScroll(): AxisLockedScrollHandlers {
    const startX = useRef(0);
    const startY = useRef(0);
    const lastX = useRef(0);
    const lastY = useRef(0);
    const lastMoveTime = useRef(0);
    const velocityX = useRef(0);
    const velocityY = useRef(0);
    const activePointerId = useRef<number | null>(null);
    const lockedAxis = useRef<ScrollAxis | null>(null);
    const momentumFrame = useRef<number | null>(null);

    function stopMomentum() {
        if (momentumFrame.current !== null) {
            cancelAnimationFrame(momentumFrame.current);
            momentumFrame.current = null;
        }
    }

    function startMomentum(container: HTMLDivElement) {
        const axis = lockedAxis.current;
        if (!axis) return;

        let velocity = (axis === 'x' ? -velocityX.current : -velocityY.current) * MOMENTUM_MULTIPLIER;
        if (Math.abs(velocity) < MIN_MOMENTUM) return;

        let previousTime = performance.now();

        function animate(currentTime: number) {
            const elapsed = Math.min(currentTime - previousTime, 32);
            previousTime = currentTime;

            const previousPosition = axis === 'x' ? container.scrollLeft : container.scrollTop;
            if (axis === 'x') {
                container.scrollLeft += velocity * elapsed;
            } else {
                container.scrollTop += velocity * elapsed;
            }

            const currentPosition = axis === 'x' ? container.scrollLeft : container.scrollTop;
            const reachedEdge = currentPosition === previousPosition;
            velocity *= Math.pow(MOMENTUM_FRICTION, elapsed / 16.67);

            if (reachedEdge || Math.abs(velocity) < MIN_MOMENTUM) {
                momentumFrame.current = null;
                return;
            }

            momentumFrame.current = requestAnimationFrame(animate);
        }

        momentumFrame.current = requestAnimationFrame(animate);
    }

    function reset(event: ReactPointerEvent<HTMLDivElement>, continueMomentum: boolean) {
        if (continueMomentum) {
            startMomentum(event.currentTarget);
        }

        if (activePointerId.current === event.pointerId && event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        activePointerId.current = null;
        lockedAxis.current = null;
    }

    function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
        if (event.pointerType === 'mouse') return;

        stopMomentum();
        const container = event.currentTarget;
        startX.current = event.clientX;
        startY.current = event.clientY;
        lastX.current = event.clientX;
        lastY.current = event.clientY;
        lastMoveTime.current = performance.now();
        velocityX.current = 0;
        velocityY.current = 0;
        activePointerId.current = event.pointerId;
        lockedAxis.current = null;
        container.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
        if (activePointerId.current !== event.pointerId) return;

        const dx = event.clientX - startX.current;
        const dy = event.clientY - startY.current;

        if (!lockedAxis.current) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) < AXIS_LOCK_THRESHOLD) return;
            lockedAxis.current = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
        }

        event.preventDefault();

        const currentTime = performance.now();
        const elapsed = Math.max(currentTime - lastMoveTime.current, 1);
        const movementX = (event.clientX - lastX.current) * DRAG_SENSITIVITY;
        const movementY = (event.clientY - lastY.current) * DRAG_SENSITIVITY;
        const instantVelocityX = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, movementX / elapsed));
        const instantVelocityY = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, movementY / elapsed));
        velocityX.current = velocityX.current * (1 - VELOCITY_SMOOTHING) + instantVelocityX * VELOCITY_SMOOTHING;
        velocityY.current = velocityY.current * (1 - VELOCITY_SMOOTHING) + instantVelocityY * VELOCITY_SMOOTHING;
        lastX.current = event.clientX;
        lastY.current = event.clientY;
        lastMoveTime.current = currentTime;

        if (lockedAxis.current === 'x') {
            event.currentTarget.scrollLeft -= movementX;
        } else {
            event.currentTarget.scrollTop -= movementY;
        }
    }

    function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
        reset(event, true);
    }

    function onPointerCancel(event: ReactPointerEvent<HTMLDivElement>) {
        reset(event, false);
    }

    return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
}
