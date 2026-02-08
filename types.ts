import React from 'react';

export interface CardData {
    id: string;
    name: string;
    text: string;
    style?: React.CSSProperties; // For random positioning
}

export interface Fortune {
    title: string;
    content: string;
}

export interface FireworkProjectile {
    x: number;
    y: number;
    targetY: number;
    speed: number;
    hue: number;
    userAction: boolean;
}

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    hue?: number;
    color?: string;
    alpha: number;
    life: number;
    gravity: number;
    drag: number;
    type: 'firework' | 'confetti';
    size: number;
    rot?: number;
    rotS?: number;
}

export interface TextParticle {
    x: number;
    y: number;
    text: string;
    color: string;
    alpha: number;
    life: number;
    vy: number;
    scale: number;
}