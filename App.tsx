
import React, { useState, useEffect } from 'react';
import Wheel from './components/Wheel';
import Settings from './components/Settings';
import FallingPetals from './components/FallingPetals';
import FloatingBanners from './components/FloatingBanners';
import ImageBubbles from './components/ImageBubbles';
import { Participant, Prize, TabType } from './types';
import { INITIAL_PARTICIPANTS, INITIAL_PRIZES } from './constants';

const DEFAULT_BG = "https://drive.google.com/uc?export=view&id=1WJxek5651kBrNCmsisRKXW5Y36lGVP4e";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('wheel');
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [prizes, setPrizes] = useState<Prize[]>(INITIAL_PRIZES);
  const [winner, setWinner] = useState<{ p: Participant; prize: Prize } | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [bubbleImages, setBubbleImages] = useState<(string | null)[]>([null, null, null, null, null]);

  // Persistence & Initial Load
  useEffect(() => {
    const savedP = localStorage.getItem('yep_participants');
    const savedPr = localStorage.getItem('yep_prizes');
    const savedBg = localStorage.getItem('yep_bg');
    const savedBubbles = localStorage.getItem('yep_bubbles');
    
    if (savedP) setParticipants(JSON.parse(savedP));
    if (savedPr) setPrizes(JSON.parse(savedPr));
    if (savedBubbles) setBubbleImages(JSON.parse(savedBubbles));
    
    // Nếu có ảnh đã lưu thì dùng, không thì dùng ảnh VinFast mặc định
    setBackgroundImage(savedBg || DEFAULT_BG);
  }, []);

  useEffect(() => {
    localStorage.setItem('yep_participants', JSON.stringify(participants));
    localStorage.setItem('yep_prizes', JSON.stringify(prizes));
    localStorage.setItem('yep_bubbles', JSON.stringify(bubbleImages));
    if (backgroundImage) {
      localStorage.setItem('yep_bg', backgroundImage);
    }
  }, [participants, prizes, backgroundImage, bubbleImages]);

  const handleSpinEnd = (p: Participant, prize: Prize) => {
    setWinner({ p, prize });
    setParticipants(prev => prev.filter(participant => participant.id !== p.id));
  };

  const closeWinnerModal = () => setWinner(null);

  const currentBg = backgroundImage || DEFAULT_BG;
  const backgroundStyle = { 
    backgroundImage: `url(${currentBg})`, 
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    backgroundAttachment: 'fixed',
    backgroundColor: '#1a2a44' 
  };

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden transition-all duration-500"
      style={backgroundStyle}
    >
      {/* Lớp phủ mờ tối nhẹ ở trên để chữ trắng nổi bật, nhưng vẫn giữ độ rực rỡ của pháo hoa */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none" />
      
      <FallingPetals />
      <FloatingBanners />
      <ImageBubbles images={bubbleImages} />

      <header className="relative z-20 py-8 text-center w-full px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-1">
             <span className="text-white font-header text-3xl font-extrabold tracking-[0.3em] drop-shadow-lg">VINFAST</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-header text-yellow-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] font-bold tracking-tight mb-0">
            HV SYSTEM TEAM
          </h1>
          <p className="text-3xl md:text-5xl font-tet text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] -mt-2 mb-4">
            Year End Party 2025
          </p>
          <div className="flex flex-col items-center gap-1 text-white font-bold tracking-widest text-sm md:text-lg">
             <div className="px-6 py-1 bg-red-600/80 rounded-full border border-yellow-400/50 shadow-lg">
               LUCKY DRAW
             </div>
          </div>
        </div>
      </header>

      <nav className="relative z-30 flex gap-4 mb-8 bg-black/50 backdrop-blur-xl p-1.5 rounded-full shadow-2xl border border-white/20">
        <button
          onClick={() => setActiveTab('wheel')}
          className={`px-8 py-2.5 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
            activeTab === 'wheel' ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-red-950 shadow-lg' : 'text-white hover:bg-white/10'
          }`}
        >
          Vòng Quay
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-8 py-2.5 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
            activeTab === 'settings' ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-red-950 shadow-lg' : 'text-white hover:bg-white/10'
          }`}
        >
          Cấu Hình
        </button>
      </nav>

      <main className="relative z-20 w-full flex flex-col items-center pb-20 px-4">
        {activeTab === 'wheel' ? (
          <Wheel
            participants={participants}
            prizes={prizes}
            onSpinEnd={handleSpinEnd}
          />
        ) : (
          <Settings
            participants={participants}
            prizes={prizes}
            setParticipants={setParticipants}
            setPrizes={setPrizes}
            backgroundImage={backgroundImage}
            setBackgroundImage={setBackgroundImage}
            bubbleImages={bubbleImages}
            setBubbleImages={setBubbleImages}
          />
        )}
      </main>

      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-gradient-to-b from-red-700 to-red-950 p-1 rounded-[2.5rem] border-4 border-yellow-500 text-center max-w-md w-full shadow-[0_0_50px_rgba(234,179,8,0.4)] transform animate-in zoom-in duration-300">
            <div className="p-8">
              <div className="text-6xl mb-4 animate-bounce">🏆</div>
              <h2 className="text-2xl md:text-3xl font-header text-yellow-400 mb-8 uppercase tracking-[0.2em] font-bold drop-shadow-md">WINNER!</h2>
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 mb-10 border border-white/20 shadow-inner">
                <p className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-xl">{winner.p.name}</p>
                <div className="h-0.5 bg-yellow-500/50 w-24 mx-auto my-4" />
                <p className="text-2xl text-yellow-300 font-bold uppercase tracking-widest italic">{winner.prize.name}</p>
              </div>
              <button
                onClick={closeWinnerModal}
                className="w-full py-5 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-red-950 font-black rounded-2xl shadow-2xl transition-all transform active:scale-95 text-xl uppercase tracking-tighter"
              >
                Xác nhận & Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto w-full py-8 text-center text-white/70 font-tet text-2xl tracking-[0.2em] z-10 drop-shadow-md">
        VinFast - Boundless Together © 2026
      </footer>
    </div>
  );
};

export default App;
