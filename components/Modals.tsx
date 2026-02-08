import React, { useState, useEffect } from 'react';
import { Fortune } from '../types';

interface ModalsProps {
    writeOpen: boolean;
    fortuneOpen: boolean;
    onCloseWrite: () => void;
    onCloseFortune: () => void;
    onSubmitBlessing: (name: string, text: string) => void;
    onDrawFortune: () => void;
}

const fortunes: Fortune[] = [
    { title: "上上签", content: "鸿运当头" },
    { title: "平安签", content: "岁岁平安" },
    { title: "发财签", content: "财源滚滚" },
    { title: "桃花签", content: "天赐良缘" },
    { title: "事业签", content: "步步高升" }
];

export const FortuneModal: React.FC<{ isOpen: boolean; onClose: () => void; onTriggerFireworks: () => void }> = ({ isOpen, onClose, onTriggerFireworks }) => {
    const [stage, setStage] = useState<'shaking' | 'falling' | 'result'>('shaking');
    const [result, setResult] = useState<Fortune | null>(null);

    useEffect(() => {
        if (isOpen) {
            setStage('shaking');
            // Pre-calculate result
            const selectedFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
            setResult(selectedFortune);

            // Shaking phase
            const timer1 = setTimeout(() => {
                setStage('falling');
                // Rising/Reveal phase
                const timer2 = setTimeout(() => {
                     setStage('result');
                     onTriggerFireworks();
                }, 800);
                return () => clearTimeout(timer2);
            }, 1200);
            return () => clearTimeout(timer1);
        }
    }, [isOpen, onTriggerFireworks]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[200] flex flex-col justify-center items-center">
            {stage !== 'result' && (
                <div className={`relative w-[140px] h-[220px] flex justify-center items-end mb-8 perspective-[600px] ${stage === 'shaking' ? 'animate-shake' : ''}`}>
                    {/* Back */}
                    <div className="absolute bottom-0 w-[100px] h-[160px] bg-gradient-to-r from-[#3e2008] to-[#5d300b] rounded-b-2xl z-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-5 before:bg-[#251203] before:rounded-full before:scale-y-40" />
                    
                    {/* Stick */}
                    <div 
                        className={`w-[18px] h-[160px] bg-gradient-to-r from-[#fceabb] to-[#fccd4d] border border-[#d4ac0d] absolute bottom-5 left-1/2 -ml-[9px] z-20 rounded shadow flex justify-center pt-4 text-xs font-bold text-[#784212] writing-vertical-rl transition-transform duration-500 ease-out
                            ${stage === 'falling' ? '-translate-y-[110px]' : 'translate-y-0'}
                        `}
                    >
                        {result?.title || '求签'}
                    </div>

                    {/* Front */}
                    <div className="absolute bottom-0 w-[100px] h-[160px] bg-gradient-to-r from-[rgba(93,48,11,0.2)] via-[#8B4513] to-[rgba(93,48,11,0.2)] rounded-b-2xl z-30 shadow-2xl border-x-2 border-b-2 border-[#502808] flex justify-center items-center">
                         <div className="border-2 border-[#3e1e03] p-3 py-4 text-[#2e1202] text-3xl writing-vertical-rl bg-white/10 shadow-inner">
                            求签
                         </div>
                    </div>
                </div>
            )}

            <div 
                className={`
                    bg-[#fffdf5] w-[85%] max-w-[340px] p-8 border-4 border-[#c0392b] outline outline-4 outline-[#f1c40f] rounded-xl text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] relative transition-transform duration-400 ease-spring
                    bg-[radial-gradient(#f0e6c8_10%,transparent_11%)] bg-[length:20px_20px]
                    ${stage === 'result' ? 'scale-100' : 'scale-0'}
                `}
            >
                {/* Scroll ends */}
                <div className="absolute top-1/2 -left-6 w-5 h-[110%] bg-[#8B0000] rounded-lg -translate-y-1/2 shadow-md border border-[#f1c40f]" />
                <div className="absolute top-1/2 -right-6 w-5 h-[110%] bg-[#8B0000] rounded-lg -translate-y-1/2 shadow-md border border-[#f1c40f]" />

                {result && (
                    <>
                        <div className="text-[#c0392b] text-[2.5rem] mb-2 font-bold shadow-text">{result.title}</div>
                        <div className="text-[#5d4037] text-[1.4rem] mb-6 font-bold">{result.content}</div>
                        <button 
                            onClick={onClose}
                            className="bg-gradient-to-br from-[#e74c3c] to-[#c0392b] text-white border-none py-3 px-10 text-lg rounded-full shadow-lg active:scale-95 transition-transform"
                        >
                            收下祝福
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export const WriteModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (n: string, t: string) => void }> = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [text, setText] = useState('');

    if (!isOpen) return null;

    return (
         <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[200] flex justify-center items-center">
            <div className="bg-[#fffdf5] w-[85%] max-w-[340px] p-8 border-4 border-[#c0392b] outline outline-4 outline-[#f1c40f] rounded-xl text-center shadow-2xl relative bg-[radial-gradient(#f0e6c8_10%,transparent_11%)] bg-[length:20px_20px]">
                 <div className="absolute top-1/2 -left-6 w-5 h-[110%] bg-[#8B0000] rounded-lg -translate-y-1/2 shadow-md border border-[#f1c40f]" />
                 <div className="absolute top-1/2 -right-6 w-5 h-[110%] bg-[#8B0000] rounded-lg -translate-y-1/2 shadow-md border border-[#f1c40f]" />

                 <div className="text-[#c0392b] text-[1.8rem] mb-5 font-bold">✍️ 写福卡</div>
                 <div className="mb-5 text-left">
                     <label className="block text-[#8B0000] mb-2 font-bold">署名</label>
                     <input 
                        className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-[#f1c40f] outline-none transition-colors"
                        placeholder="请输入你的名字" 
                        maxLength={6}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                     />
                 </div>
                 <div className="mb-5 text-left">
                     <label className="block text-[#8B0000] mb-2 font-bold">祝福</label>
                     <input 
                        className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-800 focus:border-[#f1c40f] outline-none transition-colors"
                        placeholder="写一句吉祥话..." 
                        maxLength={12}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                     />
                 </div>
                 <button onClick={() => { onSubmit(name || '神秘人', text || '新年快乐'); setName(''); setText(''); }} className="bg-gradient-to-br from-[#e74c3c] to-[#c0392b] text-white border-none py-3 px-8 text-lg rounded-full shadow-lg active:scale-95 transition-transform mr-2">
                    挂上福卡
                 </button>
                 <button onClick={onClose} className="bg-transparent border border-gray-400 text-gray-500 py-3 px-6 text-lg rounded-full active:scale-95 transition-transform">
                    取消
                 </button>
            </div>
         </div>
    );
};