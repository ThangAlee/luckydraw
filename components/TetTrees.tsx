
import React from 'react';

const LiXi: React.FC<{ x: number, y: number, delay?: string }> = ({ x, y, delay = '0s' }) => (
  <g transform={`translate(${x}, ${y})`} className="animate-jiggle" style={{ animationDelay: delay }}>
    {/* Dây treo */}
    <line x1="0" y1="-8" x2="0" y2="0" stroke="#8B4513" strokeWidth="1" />
    {/* Bao lì xì */}
    <rect x="-6" y="0" width="12" height="18" fill="#D32F2F" rx="1" />
    {/* Họa tiết vàng */}
    <rect x="-3" y="4" width="6" height="6" fill="#FFD700" rx="0.5" />
    <text x="0" y="14" fontSize="6" textAnchor="middle" fill="#FFD700" fontWeight="bold" style={{ fontFamily: 'serif' }}>福</text>
  </g>
);

const Flower: React.FC<{ x: number, y: number, color: string, delay?: string }> = ({ x, y, color, delay = '0s' }) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle cx="0" cy="0" r="3.5" fill={color} className="opacity-90" />
    <circle cx="0" cy="0" r="1" fill="#FFF176" />
  </g>
);

export const TetTrees: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex justify-between items-end overflow-hidden">
      {/* Cây Đào */}
      <div className="relative w-[280px] h-[550px] mb-[-40px] ml-[-40px] md:ml-0 animate-sway">
        <svg viewBox="0 0 200 400" className="w-full h-full">
          <path d="M100 400 Q95 320 105 250 T110 100" fill="none" stroke="#4E342E" strokeWidth="10" strokeLinecap="round" />
          <path d="M105 300 Q150 260 170 200" fill="none" stroke="#4E342E" strokeWidth="6" strokeLinecap="round" />
          <path d="M105 240 Q60 200 40 140" fill="none" stroke="#4E342E" strokeWidth="5" strokeLinecap="round" />
          <path d="M110 180 Q160 140 150 60" fill="none" stroke="#4E342E" strokeWidth="4" strokeLinecap="round" />
          
          <Flower x={170} y={200} color="#F06292" />
          <Flower x={160} y={170} color="#F8BBD0" />
          <Flower x={180} y={210} color="#F06292" />
          <Flower x={40} y={140} color="#F06292" />
          <Flower x={150} y={60} color="#F06292" />

          <LiXi x={160} y={220} delay="0.5s" />
          <LiXi x={50} y={170} delay="1.2s" />
        </svg>
      </div>

      {/* Cây Mai */}
      <div className="relative w-[280px] h-[550px] mb-[-40px] mr-[-40px] md:mr-0 animate-sway" style={{ animationDelay: '-3s' }}>
        <svg viewBox="0 0 200 400" className="w-full h-full" style={{ transform: 'scaleX(-1)' }}>
          <path d="M100 400 Q105 320 95 250 T90 100" fill="none" stroke="#5D4037" strokeWidth="10" strokeLinecap="round" />
          <path d="M95 300 Q40 260 20 200" fill="none" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" />
          <path d="M95 240 Q140 200 160 140" fill="none" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" />
          <path d="M90 180 Q40 140 50 60" fill="none" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />

          <Flower x={20} y={200} color="#FFEB3B" />
          <Flower x={30} y={170} color="#FFF176" />
          <Flower x={160} y={140} color="#FFEB3B" />
          <Flower x={50} y={60} color="#FFEB3B" />

          <LiXi x={30} y={220} delay="0.2s" />
          <LiXi x={150} y={170} delay="1.5s" />
        </svg>
      </div>
    </div>
  );
};

export default TetTrees;
