import React, { useState } from 'react';
import { CardData } from '../types';

interface CardPileProps {
    cards: CardData[];
}

const CardPile: React.FC<CardPileProps> = ({ cards }) => {
    const [activeId, setActiveId] = useState<string | null>(null);

    const hasActive = activeId !== null;

    return (
        <div 
            className={`absolute top-[55%] left-0 right-0 mx-auto w-[90vw] max-w-[400px] h-[200px] pointer-events-none flex justify-center items-center transition-all duration-300 ${hasActive ? 'z-[100]' : 'z-10'}`}
        >
            {/* Backdrop Layer */}
            <div 
                className={`fixed inset-0 bg-black/70 backdrop-blur-[3px] transition-opacity duration-500 ease-in-out pointer-events-auto ${hasActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setActiveId(null)}
            />

            {cards.map((card) => {
                const isActive = activeId === card.id;
                
                return (
                    <div
                        key={card.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveId(isActive ? null : card.id);
                        }}
                        className={`
                            absolute min-h-[110px] w-[150px] md:w-[180px] p-4 rounded-lg border-2 
                            shadow-[0_4px_15px_rgba(0,0,0,0.3)] text-gold-light cursor-pointer
                            flex flex-col justify-center items-center text-center
                            transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                            origin-center pointer-events-auto select-none
                            ${isActive 
                                ? 'bg-[#a30000] border-[#f1c40f] shadow-[0_25px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(241,196,15,0.2)] z-50' 
                                : 'bg-gradient-to-br from-[#d32f2f] to-[#b71c1c] border-[#f1c40f]/30 hover:scale-105 hover:brightness-110 hover:-translate-y-2'
                            }
                        `}
                        style={{
                            // If active, we override the random transform with a fixed centered one.
                            // -120px on Y axis roughly centers it on screen relative to the pile's position (which is at 55% viewport height)
                            transform: isActive 
                                ? 'translate(0, -120px) scale(1.6) rotate(0deg)' 
                                : card.style?.transform,
                            zIndex: isActive ? 100 : (card.style?.zIndex as number || 1)
                        }}
                    >
                        {/* Decorative Corners for Active State */}
                        <div className={`absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#f1c40f] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                        <div className={`absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#f1c40f] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                        <div className={`absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#f1c40f] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                        <div className={`absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#f1c40f] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                         <div className={`w-full text-[0.85rem] mb-2 border-b border-white/20 pb-1 transition-opacity ${isActive ? 'opacity-90' : 'opacity-70'}`}>
                            From: {card.name}
                         </div>
                         <div className={`font-bold leading-snug break-words max-w-full ${isActive ? 'tracking-widest' : ''}`}>
                            {card.text}
                         </div>

                         {isActive && (
                             <div className="absolute -bottom-10 text-xs text-white/60 animate-pulse whitespace-nowrap">
                                 点击背景关闭
                             </div>
                         )}
                    </div>
                );
            })}
        </div>
    );
};

export default CardPile;