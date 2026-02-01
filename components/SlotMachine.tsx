
import React, { useState, useRef, useEffect } from 'react';
import { Participant, Prize } from '../types';
import { audioService } from '../services/audioService';

interface SlotMachineProps {
  participants: Participant[];
  prizes: Prize[];
  onSpinEnd: (winner: Participant, prize: Prize) => void;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ participants, prizes, onSpinEnd }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [offset, setOffset] = useState(0);
  const requestRef = useRef<number>(0);
  
  const ITEM_HEIGHT = 80; // Chiều cao mỗi ô tên
  const VISIBLE_ITEMS = 3; // Số lượng tên hiển thị
  const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS; // 240px
  
  // Khung định vị nằm ở giữa (ô thứ 2). 
  // Để ô thứ 2 (index 1) nằm đúng giữa khung, offset cần trừ đi 1 item height.
  const CENTER_OFFSET_ITEMS = 1; 

  const spin = () => {
    if (isSpinning || participants.length === 0 || prizes.length === 0) return;
    setIsSpinning(true);

    const duration = 7000;
    const startTime = performance.now();
    
    // 1. Chọn người thắng và giải thưởng ngay từ đầu để đảm bảo tính nhất quán
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[winnerIndex];

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

    // 2. Tính toán quãng đường di chuyển (targetOffset)
    const totalSpins = 6; 
    const L = participants.length * ITEM_HEIGHT;
    // targetOffset đưa winnerIndex về vị trí CENTER_OFFSET_ITEMS
    const targetOffset = (totalSpins * participants.length + winnerIndex - CENTER_OFFSET_ITEMS) * ITEM_HEIGHT;
    const startOffset = offset % L;

    let lastTickItem = -1;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Hàm easing Out: chạy nhanh rồi chậm dần cực mượt
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 5);
      
      const currentMove = (targetOffset - startOffset) * easeOut(progress);
      const currentTotalOffset = startOffset + currentMove;
      
      setOffset(currentTotalOffset);

      // Hiệu ứng âm thanh tick
      const currentItemIndex = Math.floor(currentTotalOffset / ITEM_HEIGHT);
      if (currentItemIndex !== lastTickItem) {
        audioService.playTick();
        lastTickItem = currentItemIndex;
      }

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        // Gọi callback kết thúc sau một khoảng nghỉ ngắn để người xem kịp nhìn tên
        setTimeout(() => onSpinEnd(winner, selectedPrize), 800);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Tạo danh sách hiển thị lặp lại để tạo hiệu ứng cuộn vô tận
  const displayList = [...participants, ...participants, ...participants];

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      {/* Container chính: Đã giảm opacity nền từ 90 xuống 40 và tăng cường backdrop-blur */}
      <div className="relative w-full md:w-[500px] h-[240px] bg-red-950/40 rounded-[2.5rem] border-[8px] border-yellow-500 shadow-[0_0_60px_rgba(0,0,0,0.6),inset_0_0_30px_rgba(0,0,0,0.3)] overflow-hidden backdrop-blur-lg">
        
        {/* Đèn nháy */}
        <div className="absolute inset-0 pointer-events-none z-20">
            {[...Array(10)].map((_, i) => (
                <div key={i} className={`absolute w-3 h-3 rounded-full bg-yellow-300 shadow-[0_0_12px_#fff700] ${isSpinning ? 'animate-pulse' : ''}`}
                     style={{
                         top: i < 4 ? '4px' : i < 5 ? '50%' : i < 9 ? 'calc(100% - 16px)' : '50%',
                         left: i < 4 ? `${i*33}%` : i === 4 ? 'calc(100% - 16px)' : i < 9 ? `${(8-i)*33}%` : '4px'
                     }}
                />
            ))}
        </div>

        {/* Khung định vị (TRỌNG TÂM - Chỉ 1 ô ở giữa) */}
        <div className="absolute top-1/2 left-0 right-0 h-[80px] -translate-y-1/2 border-y-2 border-yellow-400/60 bg-yellow-400/10 z-10 pointer-events-none flex items-center justify-between px-2">
           <div className="w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-l-[24px] border-l-yellow-400 drop-shadow-lg"></div>
           <div className="w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-r-[24px] border-r-yellow-400 drop-shadow-lg"></div>
        </div>

        {/* Danh sách tên cuộn */}
        <div className="absolute inset-0 flex flex-col items-center" 
             style={{ 
               transform: `translateY(-${(offset % (participants.length * ITEM_HEIGHT)) + (participants.length * ITEM_HEIGHT)}px)`,
               willChange: 'transform'
             }}>
          {displayList.map((p, idx) => (
            <div key={idx} 
                 className="flex items-center justify-center w-full min-h-[80px] text-white font-black text-2xl md:text-5xl tracking-tighter uppercase drop-shadow-[0_4px_6px_rgba(0,0,0,1)]"
                 style={{ height: ITEM_HEIGHT }}>
              {p.name}
            </div>
          ))}
        </div>

        {/* Lớp phủ Gradient tạo chiều sâu: Giảm độ đậm từ 90 xuống 60 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none z-10"></div>
      </div>

      <button 
        onClick={spin} 
        disabled={isSpinning || participants.length === 0} 
        className="mt-12 px-20 py-5 bg-gradient-to-r from-red-700 via-red-500 to-red-700 hover:from-red-600 hover:to-red-600 text-white font-black text-4xl rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.4)] transform transition hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-[0.1em] border-4 border-yellow-400/50"
      >
        {isSpinning ? 'ĐANG QUAY...' : 'MỘT TRÙY'}
      </button>

      <div className="mt-4 text-yellow-400/70 font-bold tracking-widest text-xs uppercase italic drop-shadow-sm">HV SYSTEM - LUCK IS COMING</div>
    </div>
  );
};

export default SlotMachine;
