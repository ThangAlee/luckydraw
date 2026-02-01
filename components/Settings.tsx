
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
  const [urlInput, setUrlInput] = useState(backgroundImage && !backgroundImage.startsWith('data:') ? backgroundImage : '');

  // Hàm chuyển đổi link Google Drive sang link trực tiếp
  const convertDriveLink = (url: string) => {
    const driveRegex = /\/file\/d\/(.+?)\/(view|edit|preview)/;
    const match = url.match(driveRegex);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

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
        setUrlInput('');
      };
      reader.readAsDataURL(file);
    }
  };

  const applyUrlBg = () => {
    if (urlInput.trim()) {
      const directUrl = convertDriveLink(urlInput.trim());
      setBackgroundImage(directUrl);
      setUrlInput(directUrl); // Cập nhật lại input để người dùng thấy link đã đổi
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
      <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border-t-4 border-blue-500">
        <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b pb-2 flex items-center gap-2">
          <span>🖼️</span> Giao diện & Ảnh nền
        </h2>
        
        <div className="space-y-6">
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-6">
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Dán Link ảnh nền (Hỗ trợ Google Drive)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Dán link Google Drive hoặc link ảnh tại đây..."
                  className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
                <button 
                  onClick={applyUrlBg}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold whitespace-nowrap"
                >
                  Áp dụng
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mt-2 italic">
                * Lưu ý: Nếu dùng Google Drive, hãy đảm bảo file đã được chỉnh chế độ <b>"Bất kỳ ai có đường liên kết đều có thể xem"</b>.
              </p>
            </div>

            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Hoặc Tải ảnh từ máy tính</label>
              <div className="flex gap-4 items-center">
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
                  <span className="text-blue-600 font-medium text-sm">Chọn file ảnh...</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
                </label>
                <button 
                  onClick={() => { setBackgroundImage(null); setUrlInput(''); }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium text-sm"
                >
                  Xóa ảnh
                </button>
              </div>
            </div>
            
            {backgroundImage && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg flex items-center gap-4 border">
                <div className="w-16 h-10 rounded overflow-hidden border bg-gray-200">
                  <img src={backgroundImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col overflow-hidden">
                   <span className="text-[10px] text-green-600 font-bold uppercase">Đang áp dụng:</span>
                   <span className="text-[11px] text-gray-600 truncate max-w-md">{backgroundImage.startsWith('data:') ? 'Ảnh tải lên từ máy' : backgroundImage}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">5 Bong bóng hình ảnh cá nhân</label>
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
                  <span className="text-[10px] text-gray-400 font-medium uppercase">Ảnh {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border-t-4 border-red-500">
          <h2 className="text-2xl font-bold mb-4 text-red-800 border-b pb-2 flex items-center gap-2">
            <span>👥</span> Người tham gia ({participants.length})
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
              placeholder="Tên đồng nghiệp..."
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
            <button onClick={addParticipant} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold">Thêm</button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1 pr-2">
            {participants.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg hover:bg-red-50 transition border border-transparent hover:border-red-200">
                <span className="font-semibold text-gray-700">{p.name}</span>
                <button onClick={() => removeParticipant(p.id)} className="text-red-400 hover:text-red-700 text-xl font-bold px-2">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border-t-4 border-yellow-500">
          <h2 className="text-2xl font-bold mb-4 text-yellow-800 border-b pb-2 flex items-center gap-2">
            <span>🎁</span> Cơ cấu giải thưởng ({prizes.length})
          </h2>
          <div className="flex flex-col gap-3 mb-4">
            <input
              type="text"
              value={newPrizeName}
              onChange={(e) => setNewPrizeName(e.target.value)}
              placeholder="Tên giải thưởng..."
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            />
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-gray-600 whitespace-nowrap">Độ ưu tiên:</label>
              <input
                type="number"
                value={newPrizeWeight}
                onChange={(e) => setNewPrizeWeight(Number(e.target.value))}
                min="1"
                className="w-full px-4 py-2 border rounded-lg outline-none"
              />
              <button onClick={addPrize} className="px-8 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-bold">Thêm</button>
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1 pr-2">
            {prizes.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg hover:bg-yellow-50 transition border border-transparent hover:border-yellow-200">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-700">{p.name}</span>
                  <span className="text-[10px] text-yellow-600 font-bold uppercase">Trọng số: {p.weight}</span>
                </div>
                <button onClick={() => removePrize(p.id)} className="text-red-400 hover:text-red-700 text-xl font-bold px-2">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
