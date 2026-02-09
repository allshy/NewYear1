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

// 🎵 音乐播放列表配置
// 如何添加本地音乐：
// 1. 将您的 .mp3 文件复制到项目的根目录（即 index.html 所在的文件夹）
// 2. 修改下方的 PLAYLIST 数组，将文件名填入，例如: ["./gongxi.mp3", "./chunjie.mp3"]
// 3. 现在的链接是网络演示音乐，您可以直接替换为您自己的文件路径
const PLAYLIST = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
];

const App: React.FC = () => {
    const [cards, setCards] = useState<CardData[]>([]);
    const [writeModalOpen, setWriteModalOpen] = useState(false);
    const [fortuneModalOpen, setFortuneModalOpen] = useState(false);
    
    // Music state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

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

    // Effect to handle track changes while playing
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            // When track index changes, src updates, we need to play again
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log("Auto-play next track failed (browser policy or load error)", e);
                });
            }
        }
    }, [currentTrackIndex]); // Only re-run when track index changes

    const addCard = (name: string, text: string) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        
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

    const handleSongEnd = () => {
        // Move to next track, loop back to 0 if at end
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
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

            {/* Audio Player with Playlist Support */}
            <audio 
                ref={audioRef} 
                src={PLAYLIST[currentTrackIndex]} 
                onEnded={handleSongEnd}
            />
        </>
    );
};

export default App;