
import React, { useState, useEffect } from 'react';
import Wheel from './components/Wheel';
import Settings from './components/Settings';
import FallingPetals from './components/FallingPetals';
import FloatingBanners from './components/FloatingBanners';
import ImageBubbles from './components/ImageBubbles';
import { Participant, Prize, TabType } from './types';
import { INITIAL_PARTICIPANTS, INITIAL_PRIZES } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('wheel');
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [prizes, setPrizes] = useState<Prize[]>(INITIAL_PRIZES);
  const [winner, setWinner] = useState<{ p: Participant; prize: Prize } | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [bubbleImages, setBubbleImages] = useState<(string | null)[]>([null, null, null, null, null]);

  // Persistence
  useEffect(() => {
    const savedP = localStorage.getItem('yep_participants');
    const savedPr = localStorage.getItem('yep_prizes');
    const savedBg = localStorage.getItem('yep_bg');
    const savedBubbles = localStorage.getItem('yep_bubbles');
    
    if (savedP) setParticipants(JSON.parse(savedP));
    if (savedPr) setPrizes(JSON.parse(savedPr));
    if (savedBg) setBackgroundImage(savedBg);
    if (savedBubbles) setBubbleImages(JSON.parse(savedBubbles));
  }, []);

  useEffect(() => {
    localStorage.setItem('yep_participants', JSON.stringify(participants));
    localStorage.setItem('yep_prizes', JSON.stringify(prizes));
    localStorage.setItem('yep_bubbles', JSON.stringify(bubbleImages));
    if (backgroundImage) {
      localStorage.setItem('yep_bg', backgroundImage);
    } else {
      localStorage.removeItem('yep_bg');
    }
  }, [participants, prizes, backgroundImage, bubbleImages]);

  const handleSpinEnd = (p: Participant, prize: Prize) => {
    setWinner({ p, prize });
    // Xóa tên người trúng khỏi danh sách để không trúng lần nữa
    setParticipants(prev => prev.filter(participant => participant.id !== p.id));
  };

  const closeWinnerModal = () => setWinner(null);

  const backgroundStyle = backgroundImage 
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(to bottom, #1a2a44, #3a506b, #1a2a44)' };

  return (
    <div 
      className={`relative min-h-screen w-full flex flex-col items-center overflow-hidden transition-all duration-500`}
      style={backgroundStyle}
    >
      {/* Overlay mờ để nổi bật nội dung nếu ảnh nền quá sáng */}
      {backgroundImage && <div className="absolute inset-0 bg-black/20 pointer-events-none" />}
      
      <FallingPetals />
      <FloatingBanners />
      <ImageBubbles images={bubbleImages} />

      <header className="relative z-20 py-6 text-center w-full px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-2">
             <span className="text-white font-header text-3xl font-bold tracking-[0.2em]">VINFAST</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-header text-yellow-500 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-bold tracking-tight mb-0">
            HV SYSTEM TEAM
          </h1>
          <p className="text-3xl md:text-5xl font-tet text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] -mt-2 mb-4">
            Year End Party
          </p>
          
          <div className="flex flex-col items-center gap-1 text-white/90 font-semibold tracking-wide text-sm md:text-lg">
            <div className="px-4 py-1 border-y border-yellow-500/50">
              Lucky draw
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 poster-20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
               </svg>
               <span>Hai Phong</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative z-30 flex gap-4 mb-6 bg-black/40 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-white/20">
        <button
          onClick={() => setActiveTab('wheel')}
          className={`px-8 py-2.5 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
            activeTab === 'wheel' ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-red-950 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'text-white hover:bg-white/10'
          }`}
        >
          Vòng Quay
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-8 py-2.5 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
            activeTab === 'settings' ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-red-950 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'text-white hover:bg-white/10'
          }`}
        >
          Cấu Hình
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-20 w-full flex flex-col items-center pb-12 px-4">
        {activeTab === 'wheel' ? (
          <div className="flex flex-col items-center">
            <Wheel
              participants={participants}
              prizes={prizes}
              onSpinEnd={handleSpinEnd}
            />
            {participants.length === 0 && (
              <div className="mt-8 animate-bounce bg-red-600/90 text-white font-bold px-6 py-3 rounded-full shadow-xl border-2 border-yellow-400 text-sm">
                🚀 Hãy thêm đồng đội để bắt đầu bữa tiệc!
              </div>
            )}
          </div>
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

      {/* Winner Modal */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-gradient-to-b from-red-700 via-red-800 to-red-950 p-1 md:p-1.5 rounded-[2.5rem] shadow-[0_0_50px_rgba(255,215,0,0.4)] border-4 border-yellow-500 text-center max-w-md w-full transform animate-in zoom-in duration-300">
            <div className="bg-transparent p-6 md:p-10 rounded-[2.2rem]">
              <div className="text-5xl mb-4">🏆</div>
              <h2 className="text-2xl md:text-3xl font-header text-yellow-400 mb-8 uppercase tracking-[0.15em] font-bold drop-shadow-md">
                CHÚC MỪNG CHIẾN THẮNG
              </h2>
              
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-10 border border-white/10 shadow-inner relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
                  {winner.p.name}
                </p>
                <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent w-32 mx-auto my-5 rounded-full" />
                <p className="text-2xl text-yellow-300 font-bold uppercase tracking-wider italic">
                  {winner.prize.name}
                </p>
              </div>
              
              <button
                onClick={closeWinnerModal}
                className="w-full py-5 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-500 text-red-950 font-black rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all transform active:scale-95 text-xl tracking-widest uppercase"
              >
                Xác Nhận & Tiếp Tục
              </button>
            </div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 90 + 5}%`,
                  left: `${Math.random() * 90 + 5}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: ['#FFD700', '#FFFFFF', '#D32F2F', '#F06292'][i % 4]
                }}
              />
            ))}
          </div>
        </div>
      )}

      <footer className="mt-auto w-full py-6 text-center text-yellow-200/50 text-xs z-10 font-tet text-xl tracking-widest">
        VinFast - Boundless Together © 2026
      </footer>
    </div>
  );
};

export default App;
