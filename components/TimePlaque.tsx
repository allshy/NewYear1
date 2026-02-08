import React, { useState, useEffect } from 'react';

const TimePlaque: React.FC = () => {
    const [timeStr, setTimeStr] = useState('');
    const [dateStr, setDateStr] = useState('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
            const timeOptions: Intl.DateTimeFormatOptions = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
            setDateStr(now.toLocaleDateString('zh-CN', dateOptions));
            setTimeStr(now.toLocaleTimeString('zh-CN', timeOptions));
        };
        const timer = setInterval(updateClock, 1000);
        updateClock();
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative z-30 mt-6 min-w-[200px] md:min-w-[240px] p-2.5 px-6 md:px-8 rounded-md bg-gradient-to-b from-[#5c1818] to-[#3a0a0a] border-2 border-transparent bg-clip-padding shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
            {/* Border gradient trick */}
            <div className="absolute -inset-[2px] bg-gradient-to-b from-gold-light to-gold-dark z-[-1] rounded-lg" />
            
            {/* Nail */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,var(--gold-dark))] border border-[#5c1818] shadow-md z-10" />

            <div className="font-courier text-[1.8rem] md:text-[2.2rem] font-bold leading-tight tracking-widest bg-gradient-to-b from-white to-[#fceabb] bg-clip-text text-transparent drop-shadow-sm text-center">
                {timeStr}
            </div>
            <div className="mt-1 text-xs md:text-sm text-gold-light opacity-80 tracking-widest text-center font-ma-shan">
                {dateStr}
            </div>
        </div>
    );
};

export default TimePlaque;