import React from 'react';

const LanternRow: React.FC = () => {
    const chars = ["马", "年", "大", "吉", "利"];
    
    return (
        <div className="relative z-20 mt-[6vh] flex gap-2 md:gap-4 pt-5">
            {/* Horizontal Rope */}
            <div className="absolute top-5 -left-[15%] -right-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#8B4513] to-transparent z-[-1] shadow-sm" />
            {/* Vertical Supports */}
            <div className="absolute top-[-100px] bottom-[26px] -left-[10%] -right-[10%] border-l-2 border-r-2 border-[#5d4037] z-[-2] opacity-60" />

            {chars.map((char, index) => (
                <div 
                    key={index}
                    className={`
                        w-[42px] h-[38px] md:w-[52px] md:h-[46px] rounded-xl md:rounded-2xl
                        bg-[radial-gradient(circle_at_35%_30%,#ff6b6b,#a80000)]
                        border-t-2 md:border-t-4 border-b-2 md:border-b-4 border-royal-red
                        flex justify-center items-center
                        text-[#fff8dc] text-lg md:text-2xl font-bold shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_0_10px_rgba(255,0,0,0.5)]
                        relative text-shadow-sm
                        origin-top
                        animate-sway
                    `}
                    style={{
                        animationDuration: index % 2 === 0 ? '3.2s' : '2.8s',
                        animationDelay: index % 2 === 0 ? '0s' : '0.5s',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.6)'
                    }}
                >
                    {/* Lantern Details */}
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/10" />
                    <div className="absolute -top-[15px] left-1/2 w-[2px] h-[15px] bg-[#d35400]" />
                    {char}
                </div>
            ))}
        </div>
    );
};

export default LanternRow;