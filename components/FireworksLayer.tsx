import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { FireworkProjectile, Particle, TextParticle } from '../types';

export interface FireworksHandle {
    launch: (userAction?: boolean) => void;
    createBang: (x: number, y: number) => void;
}

const idioms = ["马到成功", "一马当先", "龙马精神", "万马奔腾", "立马发财", "天马行空", "马上暴富", "马上脱单", "金马玉堂", "马年大吉"];

const FireworksLayer = forwardRef<FireworksHandle, {}>((props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const projectiles = useRef<FireworkProjectile[]>([]);
    const particles = useRef<Particle[]>([]);
    const textParticles = useRef<TextParticle[]>([]);
    const animationFrameId = useRef<number>(0);

    const createExplosion = (x: number, y: number, hue: number, showText: boolean) => {
        // Particles
        for (let i = 0; i < 120; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            particles.current.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                hue: hue + Math.random() * 40 - 20,
                alpha: 1,
                life: 100 + Math.random() * 50,
                gravity: 0.1,
                drag: 0.96,
                type: 'firework',
                size: Math.random() * 2 + 1
            });
        }
        // Text
        if (showText) {
            textParticles.current.push({
                x, y,
                text: idioms[Math.floor(Math.random() * idioms.length)],
                color: `hsl(${hue}, 100%, 85%)`,
                alpha: 1,
                life: 150,
                vy: -0.5,
                scale: 0.1
            });
        }
    };

    const createBang = (x: number, y: number) => {
        // Small explosion for firecrackers
        // Sparks
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 3;
            particles.current.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                hue: Math.random() > 0.6 ? 45 : 0, // Gold or Red
                alpha: 1,
                life: 30 + Math.random() * 20,
                gravity: 0.2,
                drag: 0.9,
                type: 'firework',
                size: Math.random() * 2 + 1
            });
        }
        // Flash smoke/cloud
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2;
            particles.current.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                hue: 0, // Red tint for smoke
                alpha: 0.6,
                life: 20 + Math.random() * 10,
                gravity: -0.05, // Float up slightly
                drag: 0.9,
                type: 'firework',
                size: Math.random() * 8 + 4
            });
        }
    };

    const launch = (userAction = false) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        projectiles.current.push({
            x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
            y: canvas.height,
            targetY: canvas.height * 0.15 + Math.random() * 150,
            speed: 18,
            hue: Math.random() * 360,
            userAction
        });
    };

    useImperativeHandle(ref, () => ({
        launch,
        createBang
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'lighter';

            // Projectiles
            for (let i = projectiles.current.length - 1; i >= 0; i--) {
                const p = projectiles.current[i];
                p.y -= p.speed;
                p.speed *= 0.98;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${p.hue}, 100%, 70%)`;
                ctx.fill();

                if (p.y <= p.targetY || p.speed < 2) {
                    createExplosion(p.x, p.y, p.hue, p.userAction);
                    projectiles.current.splice(i, 1);
                }
            }

            // Particles
            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.type === 'firework') {
                    p.vx *= p.drag;
                    p.vy *= p.drag;
                    p.vy += p.gravity;
                    p.alpha -= 0.015;
                    
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    // Use hue for color, if it's smoke (larger size) make it more transparent/white-ish if needed
                    // But here we just use the existing logic which is fine for stylized firecrackers
                    ctx.fillStyle = `hsla(${p.hue}, 100%, ${p.size > 4 ? '80%' : '60%'}, ${p.alpha})`;
                    ctx.fill();
                } else {
                    // Confetti logic if needed, reusing particle struct
                }

                if (p.alpha <= 0) particles.current.splice(i, 1);
            }

            // Text
            for (let i = textParticles.current.length - 1; i >= 0; i--) {
                const tp = textParticles.current[i];
                tp.y += tp.vy;
                tp.alpha -= 0.008;
                if (tp.scale < 1) tp.scale += 0.05;

                ctx.save();
                ctx.globalAlpha = Math.max(0, tp.alpha);
                ctx.font = "bold 40px 'Ma Shan Zheng'";
                ctx.fillStyle = tp.color;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.shadowColor = tp.color;
                ctx.shadowBlur = 20;
                ctx.translate(tp.x, tp.y);
                ctx.scale(tp.scale, tp.scale);
                ctx.fillText(tp.text, 0, 0);
                ctx.restore();

                if (tp.alpha <= 0) textParticles.current.splice(i, 1);
            }

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        // Auto launch occasionally
        const interval = setInterval(() => {
            if (Math.random() > 0.7) launch(false);
        }, 1500);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId.current);
            clearInterval(interval);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            id="fireworks-canvas" 
            className="fixed top-0 left-0 w-full h-full z-[1] pointer-events-none mix-blend-screen"
        />
    );
});

export default FireworksLayer;