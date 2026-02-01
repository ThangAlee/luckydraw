
import React, { useState, useEffect, useRef } from 'react';
import Wheel from './components/Wheel';
import SlotMachine from './components/SlotMachine';
import Settings from './components/Settings';
import FallingPetals from './components/FallingPetals';
import FloatingBanners from './components/FloatingBanners';
import ImageBubbles from './components/ImageBubbles';
import Fireworks from './components/Fireworks';
import { Participant, Prize, TabType, DisplayMode } from './types';
import { INITIAL_PARTICIPANTS, INITIAL_PRIZES } from './constants';
import { audioService } from './services/audioService';

const DEFAULT_BG = "https://drive.google.com/uc?export=view&id=1WJxek5651kBrNCmsisRKXW5Y36lGVP4e";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('wheel');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('slot');
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [prizes, setPrizes] = useState<Prize[]>(INITIAL_PRIZES);
  const [winner, setWinner] = useState<{ p: Participant; prize: Prize } | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [bubbleImages, setBubbleImages] = useState<(string | null)[]>([null, null, null, null, null]);
  const [localMusicUrl, setLocalMusicUrl] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const savedP = localStorage.getItem('yep_participants');
    const savedPr = localStorage.getItem('yep_prizes');
    const savedBg = localStorage.getItem('yep_bg');
    const savedBubbles = localStorage.getItem('yep_bubbles');
    const savedMode = localStorage.getItem('yep_display_mode');
    const savedMusic = localStorage.getItem('yep_local_music');
    
    if (savedP) setParticipants(JSON.parse(savedP));
    if (savedPr) setPrizes(JSON.parse(savedPr));
    if (savedBubbles) setBubbleImages(JSON.parse(savedBubbles));
    if (savedMode) setDisplayMode(savedMode as DisplayMode);
    if (savedMusic) setLocalMusicUrl(savedMusic);
    
    setBackgroundImage(savedBg || DEFAULT_BG);
  }, []);

  useEffect(() => {
    localStorage.setItem('yep_participants', JSON.stringify(participants));
    localStorage.setItem('yep_prizes', JSON.stringify(prizes));
    localStorage.setItem('yep_bubbles', JSON.stringify(bubbleImages));
    localStorage.setItem('yep_display_mode', displayMode);
    if (backgroundImage) localStorage.setItem('yep_bg', backgroundImage);
    if (localMusicUrl) {
      try {
        localStorage.setItem('yep_local_music', localMusicUrl);
      } catch (e) {
        console.warn("Music file too large to save in localStorage");
      }
    }
  }, [participants, prizes, backgroundImage, bubbleImages, displayMode, localMusicUrl]);

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.play().catch(err => console.error("Playback failed", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying, localMusicUrl]);

  const handleSpinEnd = (p: Participant, prize: Prize) => {
    audioService.playWin();
    audioService.playConfetti();
    setWinner({ p, prize });
    setParticipants(prev => prev.filter(participant => participant.id !== p.id));
  };

  const closeWinnerModal = () => setWinner(null);

  const backgroundStyle = { 
    backgroundImage: `url(${backgroundImage || DEFAULT_BG})`, 
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    backgroundAttachment: 'fixed',
    backgroundColor: '#1a2a44' 
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden transition-all duration-500" style={backgroundStyle}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none" />
      
      <FallingPetals />
      <FloatingBanners />
      <ImageBubbles images={bubbleImages} />
      
      {/* Local Music Player */}
      {localMusicUrl && (
        <audio ref={audioRef} src={localMusicUrl} loop />
      )}

      <header className="relative z-20 py-8 text-center w-full px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-1">
             <span className="text-white font-header text-3xl font-extrabold tracking-[0.3em] drop-shadow-lg">VINFAST</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-header text-yellow-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] font-bold tracking-tight mb-0 uppercase">HV SYSTEM TEAM</h1>
          <p className="text-3xl md:text-5xl font-tet text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] -mt-2 mb-4">Year End Party 2025</p>
          <div className="flex gap-4">
            <div className="px-6 py-1 bg-red-600/80 rounded-full border border-yellow-400/50 shadow-lg text-white font-bold tracking-widest text-sm md:text-lg uppercase">LUCKY DRAW</div>
          </div>
        </div>
      </header>

      <nav className="relative z-30 flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="flex gap-2 bg-black/50 backdrop-blur-xl p-1.5 rounded-full shadow-2xl border border-white/20">
            <button onClick={() => setActiveTab('wheel')} className={`px-8 py-2.5 rounded-full font-bold transition-all ${activeTab === 'wheel' ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-red-950 shadow-lg' : 'text-white hover:bg-white/10'}`}>Trò Chơi</button>
            <button onClick={() => setActiveTab('settings')} className={`px-8 py-2.5 rounded-full font-bold transition-all ${activeTab === 'settings' ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-red-950 shadow-lg' : 'text-white hover:bg-white/10'}`}>Cấu Hình</button>
        </div>
        
        {activeTab === 'wheel' && (
            <div className="flex gap-2 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10">
                <button onClick={() => setDisplayMode('wheel')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${displayMode === 'wheel' ? 'bg-white text-red-900' : 'text-white/60'}`}>Vòng Quay</button>
                <button onClick={() => setDisplayMode('slot')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${displayMode === 'slot' ? 'bg-white text-red-900' : 'text-white/60'}`}>Máy Quay Số</button>
            </div>
        )}
      </nav>

      <main className="relative z-20 w-full flex flex-col items-center pb-20 px-4">
        {activeTab === 'wheel' ? (
          displayMode === 'wheel' ? (
            <Wheel participants={participants} prizes={prizes} onSpinEnd={handleSpinEnd} />
          ) : (
            <SlotMachine participants={participants} prizes={prizes} onSpinEnd={handleSpinEnd} />
          )
        ) : (
          <Settings
            participants={participants} prizes={prizes} setParticipants={setParticipants} setPrizes={setPrizes}
            backgroundImage={backgroundImage} setBackgroundImage={setBackgroundImage}
            bubbleImages={bubbleImages} setBubbleImages={setBubbleImages}
            localMusicUrl={localMusicUrl} setLocalMusicUrl={setLocalMusicUrl}
          />
        )}
      </main>

      {/* Music Toggle */}
      {localMusicUrl && (
        <button 
          onClick={() => {
            audioService.playTick(); 
            setIsMusicPlaying(!isMusicPlaying);
          }}
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl hover:scale-110 transition-all font-bold text-xl flex items-center gap-2 border-2 border-white ${isMusicPlaying ? 'bg-red-600 text-white' : 'bg-yellow-400 text-red-950'}`}
        >
          {isMusicPlaying ? '⏸️ Tắt Nhạc' : '▶️ Bật Nhạc'}
        </button>
      )}

      {/* Winner Modal & Fireworks */}
      {winner && (
        <>
          <Fireworks />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-gradient-to-b from-red-700 to-red-900 p-1 rounded-[2rem] border-4 border-yellow-500 text-center max-w-sm w-full shadow-[0_0_80px_rgba(234,179,8,0.5)] transform animate-in zoom-in duration-300">
              <div className="p-6">
                <div className="text-4xl mb-2 animate-bounce">🏆</div>
                <h2 className="text-xl md:text-2xl font-header text-yellow-400 mb-4 uppercase tracking-[0.2em] font-bold drop-shadow-md">XIN CHÚC MỪNG!</h2>
                <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 mb-6 border border-white/20">
                  <p className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-xl tracking-tight">{winner.p.name}</p>
                  <div className="h-0.5 bg-yellow-500/50 w-16 mx-auto my-3" />
                  <p className="text-lg md:text-xl text-yellow-300 font-bold uppercase tracking-widest italic">🎁 {winner.prize.name}</p>
                </div>
                <button onClick={closeWinnerModal} className="w-full py-4 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-red-950 font-black rounded-xl shadow-xl transition-all transform active:scale-95 text-lg uppercase tracking-tighter">Xác nhận</button>
              </div>
            </div>
          </div>
        </>
      )}

      <footer className="mt-auto w-full py-8 text-center text-white/70 font-tet text-2xl tracking-[0.2em] z-10 drop-shadow-md">VinFast - Boundless Together © 2026</footer>
    </div>
  );
};

export default App;
