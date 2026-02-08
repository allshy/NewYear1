import React from 'react';

const Background: React.FC = () => {
    return (
        <>
            {/* Border frame */}
            <div className="fixed top-3 left-3 right-3 bottom-3 border-2 border-[#fceabb]/20 rounded-lg pointer-events-none z-[5] shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] outline outline-1 outline-[#b78628]/10 -outline-offset-6" />

            {/* Horses */}
            <div className="fixed bottom-[20%] left-0 w-full h-[120px] z-[8] pointer-events-none overflow-hidden opacity-60 mask-linear-fade">
                 <div className="flex absolute -right-[800px] animate-gallop">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className={`text-[3rem] md:text-[5rem] mr-[-25px] origin-bottom animate-horse-run
                            ${i % 2 !== 0 ? 'mb-[15px] scale-75 opacity-60 z-[-1] brightness-0 sepia hue-rotate-0 saturate-200' : 'brightness-0 sepia hue-rotate-[5deg] saturate-[3] opacity-80'}
                            ${i % 3 === 0 ? 'mb-[-5px]' : ''}
                        `}
                        style={{
                             animationDuration: i % 2 !== 0 ? '0.52s' : '0.6s'
                        }}
                        >
                            🐎
                        </div>
                    ))}
                 </div>
            </div>
            
            <style>{`
                .mask-linear-fade {
                    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                }
            `}</style>
        </>
    );
};

export default Background;