
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
}

const Settings: React.FC<SettingsProps> = ({ 
  participants, 
  prizes, 
  setParticipants, 
  setPrizes,
  backgroundImage,
  setBackgroundImage,
  bubbleImages,
  setBubbleImages
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

  const resetBubble = (index: number) => {
    const newBubbles = [...bubbleImages];
    newBubbles[index] = null;
    setBubbleImages(newBubbles);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl p-4">
      
      {/* Theme Setting */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border-t-4 border-blue-500">
        <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b pb-2 flex items-center gap-2">
          <span>🖼️</span> Giao diện & Bong bóng
        </h2>
        
        <div className="space-y-6">
          {/* Background Upload */}
          <div className="flex flex-col md:flex-row gap-6 items-center border-b border-gray-100 pb-6">
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Hình nền chủ đạo</label>
              <div className="flex gap-4">
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
                  <span className="text-blue-600 font-medium">Tải ảnh nền...</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
                </label>
                <button 
                  onClick={() => setBackgroundImage(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
                >
                  Mặc định
                </button>
              </div>
            </div>
            {backgroundImage && (
              <div className="w-full md:w-32 h-20 rounded-lg overflow-hidden border-2 border-white shadow-md">
                <img src={backgroundImage} alt="Background Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Bubble Uploads */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">5 Bong bóng hình ảnh bay bổng</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {bubbleImages.map((img, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <label className={`relative group w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden ${img ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
                    {img ? (
                      <img src={img} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl text-gray-400 group-hover:text-blue-500">+</span>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBubbleUpload(idx, e)} />
                  </label>
                  {img && (
                    <button onClick={() => resetBubble(idx)} className="text-[10px] text-red-500 font-bold hover:underline">Xóa</button>
                  )}
                  <span className="text-[10px] text-gray-400 font-medium uppercase">Vị trí {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Participants List */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border-t-4 border-red-500">
          <h2 className="text-2xl font-bold mb-4 text-red-800 border-b pb-2 flex items-center gap-2">
            <span>👥</span> Danh sách người tham gia ({participants.length})
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
              placeholder="Nhập tên..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={addParticipant}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Thêm
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {participants.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition">
                <span className="font-medium text-gray-700">{p.name}</span>
                <button
                  onClick={() => removeParticipant(p.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  ✕
                </button>
              </div>
            ))}
            {participants.length === 0 && <p className="text-gray-400 italic text-center py-4">Chưa có người tham gia</p>}
          </div>
        </div>

        {/* Prizes List */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border-t-4 border-yellow-500">
          <h2 className="text-2xl font-bold mb-4 text-yellow-800 border-b pb-2 flex items-center gap-2">
            <span>🎁</span> Danh sách phần quà ({prizes.length})
          </h2>
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newPrizeName}
                onChange={(e) => setNewPrizeName(e.target.value)}
                placeholder="Tên phần quà..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button
                onClick={addPrize}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
              >
                Thêm
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Tỉ lệ (Weight):</label>
              <input
                type="number"
                value={newPrizeWeight}
                onChange={(e) => setNewPrizeWeight(Number(e.target.value))}
                min="1"
                max="100"
                className="w-20 px-4 py-1 border rounded-lg"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {prizes.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition">
                <div>
                  <span className="font-medium text-gray-700">{p.name}</span>
                  <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">TL: {p.weight}</span>
                </div>
                <button
                  onClick={() => removePrize(p.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  ✕
                </button>
              </div>
            ))}
            {prizes.length === 0 && <p className="text-gray-400 italic text-center py-4">Chưa có phần quà</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
