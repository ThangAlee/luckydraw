
import React from 'react';

interface ImageBubblesProps {
  images: (string | null)[];
}

const ImageBubbles: React.FC<ImageBubblesProps> = ({ images }) => {
  // Fixed positions for the 5 bubbles to stay "around" the wheel
  const positions = [
    { top: '15%', left: '10%', size: '120px', delay: '0s' },
    { top: '60%', left: '12%', size: '140px', delay: '-2s' },
    { top: '20%', right: '10%', size: '130px', delay: '-4s' },
    { top: '65%', right: '12%', size: '110px', delay: '-6s' },
    { top: '40%', left: '20%', size: '100px', delay: '-1s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {positions.map((pos, index) => {
        const image = images[index];
        if (!image) return null;

        return (
          <div
            key={index}
            className="absolute animate-bubble"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              width: pos.size,
              height: pos.size,
              animationDelay: pos.delay,
            }}
          >
            <div className="w-full h-full rounded-full border-4 border-yellow-400/60 p-1 bg-white/10 backdrop-blur-sm shadow-[0_0_20px_rgba(255,215,0,0.3)] overflow-hidden">
              <img
                src={image}
                alt={`Bubble ${index + 1}`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImageBubbles;
