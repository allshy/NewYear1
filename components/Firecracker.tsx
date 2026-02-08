import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';

interface FirecrackerProps {
    side: 'left' | 'right';
    label: string;
    onExplode?: (x: number, y: number) => void;
}

export interface FirecrackerRef {
    ignite: () => void;
    getFuseRect: () => DOMRect | null;
}

const Firecracker = forwardRef<FirecrackerRef, FirecrackerProps>(({ side, label, onExplode }, ref) => {
    const [isActive, setIsActive] = useState(false);
    const [fuseLit, setFuseLit] = useState(false);
    const [mainFuseHeight, setMainFuseHeight] = useState(100);
    const [visibleItems, setVisibleItems] = useState<number[]>(Array.from({length: 8}, (_, i) => i));
    const [opacity, setOpacity] = useState(1);

    const fuseRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isIgnitedRef = useRef(false);

    const dropCracker = (index: number, rect: DOMRect, initialRotation: number) => {
        const div = document.createElement('div');
        div.className = "w-[18px] h-[36px] rounded-[3px] absolute z-[150] pointer-events-none";
        div.style.background = "linear-gradient(90deg, #8B0000, #ff4d4d, #8B0000)";
        // Use the rect position directly. Since rect includes transforms, we should position there.
        // But we must NOT re-apply the translation transform, only rotation.
        div.style.left = `${rect.left}px`;
        div.style.top = `${rect.top}px`;
        div.style.transform = `rotate(${initialRotation}deg)`;
        div.style.filter = 'brightness(1.5)';
        div.style.boxShadow = '0 0 5px rgba(255, 200, 0, 0.5)';
        
        div.innerHTML = `<div style="position:absolute;left:0;width:100%;height:3px;background:#f1c40f;opacity:0.9;top:4px;"></div>
                         <div style="position:absolute;left:0;width:100%;height:3px;background:#f1c40f;opacity:0.9;bottom:4px;"></div>`;
        
        document.body.appendChild(div);

        let vx = (Math.random() - 0.5) * 15;
        let vy = -5 - Math.random() * 5; // Upward burst
        let gravity = 0.6;
        let rot = initialRotation; 
        let rotSpeed = (Math.random() - 0.5) * 20;

        // Random ground level between bottom of screen and 40px up
        const groundLevel = window.innerHeight - 20 - Math.random() * 40;

        const update = () => {
            vy += gravity;
            const currentLeft = parseFloat(div.style.left);
            const currentTop = parseFloat(div.style.top);
            
            // Safety check for NaN
            if (isNaN(currentLeft) || isNaN(currentTop)) {
                div.remove();
                return;
            }

            const nextLeft = currentLeft + vx;
            const nextTop = currentTop + vy;

            div.style.left = nextLeft + 'px';
            div.style.top = nextTop + 'px';
            rot += rotSpeed;
            div.style.transform = `rotate(${rot}deg)`;
            
            if (nextTop < groundLevel) {
                requestAnimationFrame(update);
            } else {
                // Hit the ground - turn into debris
                div.style.top = `${groundLevel}px`;
                div.style.zIndex = '0'; // Move to background layer
                div.style.transition = 'transform 0.1s ease-out';
                
                // Simulate flattened, torn paper
                div.style.transform = `rotate(${rot}deg) scale(1.1, 0.6)`; 
                div.style.filter = 'brightness(0.9)';
                div.style.background = '#c62828'; // Flat red paper color
                div.style.borderRadius = '2px 8px 3px 6px'; // Irregular shape
                div.style.boxShadow = 'none';
                div.innerHTML = ''; // Remove the gold stripes
                
                // Add a small "ash" effect or variation
                if (Math.random() > 0.5) {
                     div.style.clipPath = 'polygon(0% 0%, 100% 10%, 95% 100%, 5% 90%)';
                }
                
                // It stays there (no remove)
            }
        };
        requestAnimationFrame(update);
    };

    const ignite = () => {
        if (isIgnitedRef.current) return;
        isIgnitedRef.current = true;
        
        setIsActive(true);
        setFuseLit(true);

        setTimeout(() => setFuseLit(false), 200);

        let currentIndex = 0;
        const total = 8;
        
        const explodeNext = () => {
            if (currentIndex >= total) {
                setMainFuseHeight(0);
                setTimeout(() => {
                    setOpacity(0);
                    setTimeout(() => {
                        // Reset
                        setIsActive(false);
                        setMainFuseHeight(100);
                        setVisibleItems(Array.from({length: 8}, (_, i) => i));
                        setOpacity(1);
                        isIgnitedRef.current = false;
                    }, 1000);
                }, 1000);
                return;
            }

            const targetIndex = total - 1 - currentIndex;
            // Use specific selector to avoid NodeList index confusion and ensure element exists
            const itemEl = containerRef.current?.querySelector(`.cracker-item[data-index="${targetIndex}"]`) as HTMLElement;
            
            if (itemEl) {
                const rect = itemEl.getBoundingClientRect();
                const isEven = targetIndex % 2 === 0;
                // Match the rotation from CSS logic
                const initialRot = isEven ? -12 : 12;
                
                // Trigger explosion effect at the center of the cracker
                if (onExplode) {
                    onExplode(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }

                dropCracker(currentIndex, rect, initialRot);
                
                // Hide react item
                setVisibleItems(prev => prev.filter(i => i !== targetIndex));
            }
            
            setMainFuseHeight((1 - (currentIndex / total)) * 100);
            currentIndex++;
            setTimeout(explodeNext, 120);
        };
        
        setTimeout(explodeNext, 200);
    };

    useImperativeHandle(ref, () => ({
        ignite,
        getFuseRect: () => fuseRef.current?.getBoundingClientRect() || null
    }));

    return (
        <div 
            ref={containerRef}
            className={`
                absolute top-[15px] flex flex-col items-center z-15 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] transition-opacity duration-1000 ease-in
                scale-75 md:scale-100
                ${side === 'left' ? 'left-[2%] md:left-[3%] origin-top-left' : 'right-[2%] md:right-[3%] origin-top-right'}
            `}
            style={{ opacity }}
        >
            <div className="w-12 h-12 bg-[radial-gradient(circle_at_30%_30%,#f1c40f,#b7950b)] rounded-md text-center leading-[48px] text-[#5a0000] font-bold text-2xl shadow-lg border-2 border-gold-light relative z-[5]">
                {/* Hanger */}
                <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-1 h-[15px] bg-[#222]" />
                {label}
            </div>

            <div className="relative flex flex-col items-center mt-[-4px]">
                {/* Main Fuse */}
                <div 
                    className="w-[3px] bg-[#6d4c41] absolute top-0 left-1/2 -translate-x-1/2 z-[1] transition-[height] duration-100 linear"
                    style={{ height: `${mainFuseHeight}%` }}
                />

                {Array.from({length: 8}).map((_, i) => (
                    <div 
                        key={i} 
                        data-index={i}
                        className={`cracker-item w-[18px] h-[36px] bg-gradient-to-r from-[#8B0000] via-[#ff4d4d] to-[#8B0000] rounded-[3px] my-[2px] relative z-[2] shadow-sm transition-transform duration-100
                            ${i % 2 === 0 ? '-translate-x-[10px] -rotate-12' : 'translate-x-[10px] rotate-12'}
                        `}
                        style={{ opacity: visibleItems.includes(i) ? 1 : 0 }}
                    >
                         <div className="absolute top-1 left-0 w-full h-[3px] bg-[#f1c40f] opacity-90" />
                         <div className="absolute bottom-1 left-0 w-full h-[3px] bg-[#f1c40f] opacity-90" />
                    </div>
                ))}

                {/* Tail Fuse */}
                <div className={`w-[4px] h-[40px] bg-[#888] relative z-[1] -mt-[5px] transition-all duration-200 ${fuseLit ? '!bg-[#ff4500] shadow-[0_0_10px_#ff4500]' : ''} ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div ref={fuseRef} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40px] h-[40px] rounded-full z-10 cursor-pointer" onClick={ignite} />
                </div>
            </div>
        </div>
    );
});

export default Firecracker;