
import React from 'react';

const MESSAGES = [
  "VINFAST",
  "HV SYSTEM TEAM",
  "YEP 2026",
  "Boundless Together",
  "Hải Phòng",
  "Chúc Mừng Năm Mới"
];

const FloatingBanners: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Left Side Banners */}
      {[...Array(6)].map((_, i) => {
        const text = MESSAGES[i % MESSAGES.length];
        const left = 2 + Math.random() * 12; // 2% to 14%
        const delay = Math.random() * 20;
        const duration = 18 + Math.random() * 12;
        const fontSize = 16 + Math.random() * 12;
        const opacity = 0.2 + Math.random() * 0.3;

        return (
          <div
            key={`left-${i}`}
            className="absolute font-tet text-yellow-400/60 whitespace-nowrap select-none italic font-bold tracking-widest"
            style={{
              left: `${left}%`,
              fontSize: `${fontSize}px`,
              opacity: opacity,
              animation: `float-left ${duration}s ease-in-out infinite`,
              animationDelay: `-${delay}s`,
              textShadow: '0 0 10px rgba(255, 230, 0, 0.2)'
            }}
          >
            {text}
          </div>
        );
      })}

      {/* Right Side Banners */}
      {[...Array(6)].map((_, i) => {
        const text = MESSAGES[i % MESSAGES.length];
        const right = 2 + Math.random() * 12; // 2% to 14% from right
        const delay = Math.random() * 20;
        const duration = 20 + Math.random() * 15;
        const fontSize = 16 + Math.random() * 12;
        const opacity = 0.2 + Math.random() * 0.3;

        return (
          <div
            key={`right-${i}`}
            className="absolute font-tet text-yellow-400/60 whitespace-nowrap select-none italic font-bold tracking-widest"
            style={{
              right: `${right}%`,
              fontSize: `${fontSize}px`,
              opacity: opacity,
              animation: `float-right ${duration}s ease-in-out infinite`,
              animationDelay: `-${delay}s`,
              textShadow: '0 0 10px rgba(255, 230, 0, 0.2)'
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
};

export default FloatingBanners;
