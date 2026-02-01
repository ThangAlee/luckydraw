
import React, { useState, useRef, useEffect } from 'react';
import { Participant, Prize } from '../types';
import { TET_COLORS } from '../constants';
import { audioService } from '../services/audioService';

interface WheelProps {
  participants: Participant[];
  prizes: Prize[];
  onSpinEnd: (winner: Participant, prize: Prize) => void;
}

const Wheel: React.FC<WheelProps> = ({ participants, prizes, onSpinEnd }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTickRotationRef = useRef(0);

  const listToUse = participants.length > 0 ? participants : [{ id: 'none', name: 'Trống!' }];

  useEffect(() => {
    drawWheel();
  }, [listToUse, rotation]);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 15;
    const sliceAngle = (2 * Math.PI) / listToUse.length;

    ctx.clearRect(0, 0, size, size);

    listToUse.forEach((item, i) => {
      const startAngle = i * sliceAngle + (rotation * Math.PI) / 180;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.fillStyle = hexToRgba(TET_COLORS[i % TET_COLORS.length], 0.6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'; 
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#000000';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px Quicksand';
      ctx.fillText(item.name, radius - 30, 8);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.stroke();
  };

  const spin = () => {
    if (isSpinning || participants.length === 0 || prizes.length === 0) return;
    setIsSpinning(true);
    
    const spinDegrees = 2500 + Math.random() * 3000;
    const duration = 6000;
    const start = performance.now();
    const sliceAngleDeg = 360 / listToUse.length;
    lastTickRotationRef.current = rotation;

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
      const currentRotation = rotation + spinDegrees * easeOut(progress);
      
      // Top pointer is at 270 degrees.
      // We calculate current slice index pointing to the pointer
      const normalizedRotation = (currentRotation % 360 + 360) % 360;
      const pointingAt = (360 - normalizedRotation + 270) % 360;
      const currentSliceIndex = Math.floor(pointingAt / sliceAngleDeg);
      
      const prevNormalizedRotation = (lastTickRotationRef.current % 360 + 360) % 360;
      const prevPointingAt = (360 - prevNormalizedRotation + 270) % 360;
      const prevSliceIndex = Math.floor(prevPointingAt / sliceAngleDeg);

      if (currentSliceIndex !== prevSliceIndex) {
        audioService.playTick();
      }
      
      lastTickRotationRef.current = currentRotation;
      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const finalRotation = currentRotation % 360;
        const adjustedRotation = (360 - (finalRotation % 360) + 270) % 360;
        const winnerIndex = Math.floor(adjustedRotation / sliceAngleDeg) % listToUse.length;
        const winner = listToUse[winnerIndex] as Participant;
        
        const totalWeight = prizes.reduce((acc, p) => acc + p.weight, 0);
        let randomWeight = Math.random() * totalWeight;
        let selectedPrize = prizes[0];
        for (const p of prizes) {
          if (randomWeight < p.weight) {
            selectedPrize = p;
            break;
          }
          randomWeight -= p.weight;
        }
        onSpinEnd(winner, selectedPrize);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="absolute top-[-25px] left-1/2 transform -translate-x-1/2 z-30">
          <div className="w-0 h-0 border-l-[22px] border-l-transparent border-r-[22px] border-r-transparent border-t-[45px] border-t-yellow-400 drop-shadow-[0_6px_8px_rgba(0,0,0,0.6)]"></div>
          <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full opacity-50 shadow-inner"></div>
        </div>
        <canvas ref={canvasRef} width={520} height={520} className="rounded-full shadow-[0_0_80px_rgba(0,0,0,0.8)] border-4 border-yellow-500/30 bg-white/5 backdrop-blur-[2px]" />
      </div>
      <button onClick={spin} disabled={isSpinning || participants.length === 0} className="mt-12 px-20 py-5 bg-gradient-to-r from-red-700 via-red-500 to-red-700 hover:from-red-600 hover:to-red-600 text-white font-black text-4xl rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.4)] transform transition hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] border-4 border-yellow-400/50">
        {isSpinning ? 'ĐANG QUAY...' : 'Một Trùy'}
      </button>
    </div>
  );
};

export default Wheel;
