import React from 'react';

interface CoupletsProps {
    onTrigger: () => void;
}

const Couplets: React.FC<CoupletsProps> = ({ onTrigger }) => {
    const chars = ["新", "年", "快", "乐"];

    return (
        <div className="flex gap-3 md:gap-4 mt-[4vh] z-20 transform scale-100 md:scale-110">
            {chars.map((char, index) => (
                <div 
                    key={index}
                    onClick={onTrigger}
                    className={`
                        w-12 h-12 md:w-[75px] md:h-[75px] bg-[#800000] border-2 border-gold-dark
                        flex justify-center items-center
                        rotate-45 cursor-pointer relative
                        shadow-[inset_0_0_10px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.6)]
                        transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                        hover:!rotate-45 hover:scale-115 hover:brightness-125
                    `}
                >
                    <div className="absolute inset-1 border border-gold-light/30 pointer-events-none" />
                    <span className="text-[2rem] md:text-[3.2rem] -rotate-45 bg-gradient-to-b from-[#fff8dc] to-[#f1c40f] bg-clip-text text-transparent drop-shadow-[1px_1px_0px_rgba(0,0,0,0.8)] select-none">
                        {char}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Couplets;