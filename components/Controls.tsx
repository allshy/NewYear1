import React from 'react';

interface ControlsProps {
    onOpenWrite: () => void;
    onStartFortune: () => void;
    onManualLaunch: () => void;
    onToggleMusic: () => void;
    isPlaying: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onOpenWrite, onStartFortune, onManualLaunch, onToggleMusic, isPlaying }) => {
    const btnClass = `
        w-14 h-14 md:w-[75px] md:h-[75px] rounded-full 
        bg-gradient-to-br from-[#3e1010] to-[#250505]
        border-2 border-[#b78628] text-[#f1c40f]
        flex flex-col items-center justify-center
        shadow-[0_8px_20px_rgba(0,0,0,0.6)] drop-shadow-md
        transition-all duration-200
        active:scale-95 active:border-white active:bg-[#5e1515]
    `;

    return (
        <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 md:gap-6 z-50 w-max max-w-full px-2">
            <button className={btnClass} onClick={onOpenWrite}>
                <span className="text-[1.4rem] md:text-[1.8rem] mb-0.5 md:mb-1 drop-shadow-[0_0_5px_#f1c40f]">🖋️</span>
                <span className="text-[10px] md:text-xs">写福</span>
            </button>
            <button className={btnClass} onClick={onStartFortune}>
                <span className="text-[1.4rem] md:text-[1.8rem] mb-0.5 md:mb-1 drop-shadow-[0_0_5px_#f1c40f]">🏮</span>
                <span className="text-[10px] md:text-xs">抽签</span>
            </button>
            <button className={btnClass} onClick={onManualLaunch}>
                <span className="text-[1.4rem] md:text-[1.8rem] mb-0.5 md:mb-1 drop-shadow-[0_0_5px_#f1c40f]">🎆</span>
                <span className="text-[10px] md:text-xs">点火</span>
            </button>
            <button className={btnClass} onClick={onToggleMusic}>
                <span className="text-[1.4rem] md:text-[1.8rem] mb-0.5 md:mb-1 drop-shadow-[0_0_5px_#f1c40f]">
                    {isPlaying ? '⏸️' : '🎵'}
                </span>
                <span className="text-[10px] md:text-xs">听曲</span>
            </button>
        </div>
    );
};

export default Controls;