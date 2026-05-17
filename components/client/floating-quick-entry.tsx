'use client';

import { AddTransactionModal } from '@/components/modals/add-transaction-modal';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Position = {
  x: number;
  y: number;
};

const FLOATING_SIZE = 56;
const MARGIN = 16;
const DRAG_THRESHOLD = 6;
const STORAGE_KEY = 'owwi.newui:floating-quick-entry-position';

export function FloatingQuickEntry() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const bubbleRef = useRef<HTMLButtonElement | null>(null);
  const dragStateRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });

  const clampPosition = useCallback((nextX: number, nextY: number) => {
    const maxX = Math.max(MARGIN, window.innerWidth - FLOATING_SIZE - MARGIN);
    const maxY = Math.max(MARGIN, window.innerHeight - FLOATING_SIZE - MARGIN);
    return {
      x: Math.min(Math.max(MARGIN, nextX), maxX),
      y: Math.min(Math.max(MARGIN, nextY), maxY),
    };
  }, []);

  const savePosition = useCallback((next: Position) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage failures
    }
  }, []);

  useEffect(() => {
    const syncInitialPosition = () => {
      const defaultPosition = {
        x: window.innerWidth - FLOATING_SIZE - MARGIN,
        y: window.innerHeight - FLOATING_SIZE - 96,
      };

      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setPosition(defaultPosition);
          return;
        }

        const parsed = JSON.parse(raw) as Position;
        setPosition(clampPosition(parsed.x, parsed.y));
      } catch {
        setPosition(defaultPosition);
      }
    };

    syncInitialPosition();
    window.addEventListener('resize', syncInitialPosition);
    return () => window.removeEventListener('resize', syncInitialPosition);
  }, [clampPosition]);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(false);
  }, [position.x, position.y]);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    const state = dragStateRef.current;
    if (state.pointerId !== event.pointerId) return;

    event.preventDefault();
    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > DRAG_THRESHOLD) {
      state.moved = true;
      setIsDragging(true);
    }

    if (!state.moved) return;

    const next = clampPosition(state.originX + deltaX, state.originY + deltaY);
    setPosition(next);
  }, [clampPosition]);

  const finishPointer = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    const state = dragStateRef.current;
    if (state.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.currentTarget.releasePointerCapture(event.pointerId);
    const didMove = state.moved;

    if (didMove) {
      savePosition(position);
    }

    dragStateRef.current = {
      pointerId: -1,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      moved: false,
    };

    setTimeout(() => setIsDragging(false), 0);

    if (!didMove) {
      setIsOpen(true);
    }
  }, [position, savePosition]);

  const bubbleStyle = useMemo(() => ({ left: `${position.x}px`, top: `${position.y}px` }), [position.x, position.y]);

  return (
    <>
      <AddTransactionModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <button
      ref={bubbleRef}
      type="button"
      aria-label="Mở nhập giao dịch nhanh"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointer}
      onPointerCancel={finishPointer}
      className="fixed z-[60] flex touch-none select-none items-center justify-center rounded-full border border-white/35 bg-white/20 text-slate-800 shadow-xl backdrop-blur-xl transition duration-150 dark:border-white/10 dark:bg-slate-800/30 dark:text-white"
      style={{
        ...bubbleStyle,
        width: `${FLOATING_SIZE}px`,
        height: `${FLOATING_SIZE}px`,
        opacity: isDragging ? 0.98 : 0.82,
        transform: isDragging ? 'scale(1.1)' : 'scale(1)',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      <span className="pointer-events-none select-none text-3xl font-light leading-none">+</span>
      </button>
    </>
  );
}
