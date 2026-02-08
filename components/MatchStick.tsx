import React, { useState, useEffect, useRef } from 'react';
import { FirecrackerRef } from './Firecracker';

interface MatchStickProps {
    firecrackers: React.RefObject<FirecrackerRef>[];
}

const MatchStick: React.FC<MatchStickProps> = ({ firecrackers }) => {
    const [pos, setPos] = useState<{x: number | null, y: number | null}>({x: null, y: null});
    const [isDragging, setIsDragging] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    const checkCollision = (x: number, y: number) => {
        firecrackers.forEach(ref => {
            const rect = ref.current?.getFuseRect();
            if (rect) {
                if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                    ref.current?.ignite();
                }
            }
        });
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        const clientX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
        
        setPos({ x: clientX, y: clientY });
        checkCollision(clientX, clientY);
    };

    const handleEnd = () => {
        setIsDragging(false);
        setPos({ x: null, y: null });
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('touchmove', handleMove, { passive: false });
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchend', handleEnd);
        } else {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchend', handleEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging]);

    return (
        <div 
            ref={elementRef}
            className={`fixed z-[100] text-[3.5rem] cursor-grab select-none drop-shadow-[0_0_15px_#e67e22] transition-transform duration-100 ${isDragging ? 'cursor-grabbing' : 'transition-all duration-500'}`}
            style={{
                left: pos.x !== null ? pos.x : undefined,
                top: pos.y !== null ? pos.y : undefined,
                right: pos.x === null ? '35px' : undefined,
                bottom: pos.y === null ? '35px' : undefined,
                transform: pos.x !== null ? 'translate(-50%, -50%)' : 'none',
                pointerEvents: 'auto'
            }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
        >
            🕯️
        </div>
    );
};

export default MatchStick;