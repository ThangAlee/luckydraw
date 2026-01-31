
import React, { useState, useRef, useEffect } from 'react';
import { Participant, Prize } from '../types';
import { TET_COLORS } from '../constants';

interface WheelProps {
  participants: Participant[];
  prizes: Prize[];
  onSpinEnd: (winner: Participant, prize: Prize) => void;
}

const Wheel: React.FC<WheelProps> = ({ participants, prizes, onSpinEnd }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const listToUse = participants.length > 0 ? participants : [{ id: 'none', name: 'Thêm người chơi!' }];

  useEffect(() => {
    drawWheel();
  }, [listToUse, rotation]);

  // Helper to convert hex to rgba
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
    const radius = center - 10;
    const sliceAngle = (2 * Math.PI) / listToUse.length;

    ctx.clearRect(0, 0, size, size);

    listToUse.forEach((item, i) => {
      const startAngle = i * sliceAngle + (rotation * Math.PI) / 180;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      
      // Độ trong suốt của các nan vòng quay (0.5 - 0.6 là vừa đẹp để thấy nền)
      ctx.fillStyle = hexToRgba(TET_COLORS[i % TET_COLORS.length], 0.55);
      ctx.fill();
      
      // Viền các nan vẫn giữ độ đậm để tạo khối
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)'; 
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      
      // Đổ bóng đậm hơn cho chữ để chữ luôn rõ ràng trên mọi nền
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 0, 0, 1)';
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px Quicksand';
      ctx.fillText(item.name, radius - 25, 8);
      ctx.restore();
    });

    // Draw outer border (gold ring)
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Draw center pin
    ctx.beginPath();
    ctx.arc(center, center, 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Middle dot
    ctx.beginPath();
    ctx.arc(center, center, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#8b0000';
    ctx.fill();
  };

  const spin = () => {
    if (isSpinning || participants.length === 0 || prizes.length === 0) return;

    setIsSpinning(true);
    const spinDegrees = 1800 + Math.random() * 1800; // At least 5 full rotations
    const totalRotation = rotation + spinDegrees;

    const duration = 5000;
    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out cubic
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentRotation = rotation + spinDegrees * easeOut(progress);
      
      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const finalRotation = currentRotation % 360;
        const sliceAngle = 360 / listToUse.length;
        const adjustedRotation = (360 - (finalRotation % 360) + 270) % 360;
        const winnerIndex = Math.floor(adjustedRotation / sliceAngle) % listToUse.length;
        
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
        {/* Pointer */}
        <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[35px] border-t-yellow-400 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"></div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="rounded-full shadow-[0_0_40px_rgba(0,0,0,0.6)] border-4 border-yellow-500/30 bg-white/5 backdrop-blur-[2px]"
        />
      </div>

      <button
        onClick={spin}
        disabled={isSpinning || participants.length === 0}
        className={`mt-10 px-12 py-4 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-500 text-red-950 font-black text-2xl rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.3)] transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-header border-4 border-yellow-200/50 uppercase tracking-widest`}
      >
        {isSpinning ? 'Đang quay...' : 'QUAY NGAY!'}
      </button>
    </div>
  );
};

export default Wheel;
