
import React, { useState } from 'react';
import { Participant, Prize } from '../types';

interface SettingsProps {
  participants: Participant[];
  prizes: Prize[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  setPrizes: React.Dispatch<React.SetStateAction<Prize[]>>;
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;
  bubbleImages: (string | null)[];
  setBubbleImages: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  localMusicUrl: string | null;
  setLocalMusicUrl: (url: string | null) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  participants, 
  prizes, 
  setParticipants, 
  setPrizes,
  backgroundImage,
  setBackgroundImage,
  bubbleImages,
  setBubbleImages,
  localMusicUrl,
  setLocalMusicUrl
}) => {
  const [newName, setNewName] = useState('');
  const [newPrizeName, setNewPrizeName] = useState('');
  const [newPrizeWeight, setNewPrizeWeight] = useState(1);

  const addParticipant = () => {
    if (!newName.trim()) return;
    setParticipants([...participants, { id: Date.now().toString(), name: newName.trim() }]);
    setNewName('');
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const addPrize = () => {
    if (!newPrizeName.trim()) return;
    setPrizes([...prizes, { id: Date.now().toString(), name: newPrizeName.trim(), weight: newPrizeWeight }]);
    setNewPrizeName('');
    setNewPrizeWeight(1);
  };

  const removePrize = (id: string) => {
    setPrizes(prizes.filter(p => p.id !== id));
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalMusicUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBubbleUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newBubbles = [...bubbleImages];
        newBubbles[index] = reader.result as string;
        setBubbleImages(newBubbles);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl p-4">
      
      {/* Theme & Music Setting */}
      <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border-t-4 border-blue-500">
        <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b pb-2 flex items-center gap-2">
          <span>🎵</span> Giao diện & Âm nhạc
        </h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Music Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">Tải nhạc nền từ máy (.mp3)</label>
              <div className="flex gap-4 items-center">
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-red-500 hover:bg-red-50 cursor-pointer transition-all">
                  <span className="text-red-600 font-bold text-sm">{localMusicUrl ? '✓ Đã tải nhạc' : 'Chọn file nhạc...'}</span>
                  <input type="file" accept="audio/*" className="hidden" onChange={handleMusicUpload} />
                </label>
                {localMusicUrl && (
                  <button onClick={() => setLocalMusicUrl(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium text-sm">Xóa nhạc</button>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500 italic">* Hỗ trợ file MP3, WAV, OGG...</p>
            </div>

            {/* Background Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">Tải ảnh nền mới</label>
              <div className="flex gap-4 items-center">
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
                  <span className="text-blue-600 font-bold text-sm">Chọn file ảnh...</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
                </label>
                <button onClick={() => setBackgroundImage(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium text-sm">Xóa ảnh</button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Bong bóng hình ảnh (5 ảnh tải từ máy)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {bubbleImages.map((img, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <label className={`relative group w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden ${img ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
                    {img ? <img src={img} className="w-full h-full object-cover" /> : <span className="text-xl text-gray-400 group-hover:text-blue-500">+</span>}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBubbleUpload(idx, e)} />
                  </label>
                  {img && <button onClick={() => { const b = [...bubbleImages]; b[idx] = null; setBubbleImages(b); }} className="text-[10px] text-red-500 font-bold hover:underline">Xóa</button>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border-t-4 border-red-500">
          <h2 className="text-2xl font-bold mb-4 text-red-800 border-b pb-2 flex items-center gap-2"><span>👥</span> Người tham gia ({participants.length})</h2>
          <div className="flex gap-2 mb-4">
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addParticipant()} placeholder="Tên..." className="flex-1 px-4 py-2 border rounded-lg outline-none" />
            <button onClick={addParticipant} className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold">Thêm</button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {participants.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-transparent hover:border-red-200">
                <span className="font-semibold text-gray-700">{p.name}</span>
                <button onClick={() => removeParticipant(p.id)} className="text-red-400 hover:text-red-700 font-bold px-2">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border-t-4 border-yellow-500">
          <h2 className="text-2xl font-bold mb-4 text-yellow-800 border-b pb-2 flex items-center gap-2"><span>🎁</span> Giải thưởng ({prizes.length})</h2>
          <div className="flex flex-col gap-3 mb-4">
            <input type="text" value={newPrizeName} onChange={(e) => setNewPrizeName(e.target.value)} placeholder="Tên giải..." className="px-4 py-2 border rounded-lg outline-none" />
            <div className="flex items-center gap-3">
              <input type="number" value={newPrizeWeight} onChange={(e) => setNewPrizeWeight(Number(e.target.value))} min="1" className="w-20 px-4 py-2 border rounded-lg outline-none" />
              <button onClick={addPrize} className="flex-1 py-2 bg-yellow-600 text-white rounded-lg font-bold">Thêm</button>
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {prizes.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-transparent hover:border-yellow-200">
                <span className="font-bold text-gray-700">{p.name} (x{p.weight})</span>
                <button onClick={() => removePrize(p.id)} className="text-red-400 hover:text-red-700 font-bold px-2">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
