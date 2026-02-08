import React, { useState, useRef, useEffect } from 'react';
import FireworksLayer, { FireworksHandle } from './components/FireworksLayer';
import LanternRow from './components/LanternRow';
import TimePlaque from './components/TimePlaque';
import Couplets from './components/Couplets';
import CardPile from './components/CardPile';
import Background from './components/Background';
import Firecracker, { FirecrackerRef } from './components/Firecracker';
import MatchStick from './components/MatchStick';
import Controls from './components/Controls';
import { FortuneModal, WriteModal } from './components/Modals';
import { CardData } from './types';

// Replace this URL with your preferred Chinese New Year music
// Example: "https://music.163.com/song/media/outer/url?id=4875306.mp3" (Spring Festival Overture)
// Current: Upbeat instrumental
const BG_MUSIC_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const App: React.FC = () => {
    const [cards, setCards] = useState<CardData[]>([]);
    const [writeModalOpen, setWriteModalOpen] = useState(false);
    const [fortuneModalOpen, setFortuneModalOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const fireworksRef = useRef<FireworksHandle>(null);
    const leftCrackerRef = useRef<FirecrackerRef>(null);
    const rightCrackerRef = useRef<FirecrackerRef>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Initial Cards with delayed appearance effect
    useEffect(() => {
        const initialCards = [
            { id: '1', name: "小明", text: "马年大吉" },
            { id: '2', name: "Alice", text: "万事如意" },
            { id: '3', name: "老张", text: "身体健康" },
            { id: '4', name: "花花", text: "暴富！" }
        ];
        
        initialCards.forEach((c, i) => {
            setTimeout(() => addCard(c.name, c.text), i * 800);
        });
    }, []);

    // Set initial volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.4; // 40% volume
        }
    }, []);

    const addCard = (name: string, text: string) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Logic for flying in effect (simplified to random position setting for CardPile to render)
        // In the React version, we'll store the target style. The CardPile component handles the render.
        // To mimic the "fly in", we could use more complex state, but here we just place them.
        // For visual fidelity to the original, we generate random end coordinates.
        
        const r = (Math.random() - 0.5) * 30;
        const x = (Math.random() - 0.5) * 160;
        const y = (Math.random() - 0.5) * 80;

        const newCard: CardData = {
            id: Date.now().toString() + Math.random(),
            name,
            text,
            style: {
                transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
                zIndex: Math.floor(Math.random() * 10)
            }
        };

        setCards(prev => [...prev, newCard]);
    };

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play failed", e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleExplosion = (x: number, y: number) => {
        fireworksRef.current?.createBang(x, y);
    };

    return (
        <>
            <FireworksLayer ref={fireworksRef} />
            <Background />
            
            {/* Main Stage */}
            <div className="relative w-full h-full flex flex-col items-center z-10 pointer-events-none [&>*]:pointer-events-auto">
                <LanternRow />
                <TimePlaque />
                <Couplets onTrigger={() => fireworksRef.current?.launch(true)} />
                <CardPile cards={cards} />
            </div>

            <Firecracker side="left" label="福" ref={leftCrackerRef} onExplode={handleExplosion} />
            <Firecracker side="right" label="春" ref={rightCrackerRef} onExplode={handleExplosion} />
            
            <MatchStick firecrackers={[leftCrackerRef, rightCrackerRef]} />

            <Controls 
                onOpenWrite={() => setWriteModalOpen(true)}
                onStartFortune={() => setFortuneModalOpen(true)}
                onManualLaunch={() => fireworksRef.current?.launch(true)}
                onToggleMusic={toggleMusic}
                isPlaying={isPlaying}
            />

            <WriteModal 
                isOpen={writeModalOpen} 
                onClose={() => setWriteModalOpen(false)} 
                onSubmit={(n, t) => {
                    addCard(n, t);
                    setWriteModalOpen(false);
                    fireworksRef.current?.launch(true);
                }}
            />

            <FortuneModal 
                isOpen={fortuneModalOpen}
                onClose={() => setFortuneModalOpen(false)}
                onTriggerFireworks={() => {
                    fireworksRef.current?.launch(true);
                    fireworksRef.current?.launch(true);
                }}
            />

            <audio ref={audioRef} loop src={BG_MUSIC_URL} />
        </>
    );
};

export default App;