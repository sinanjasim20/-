import React, { useState } from 'react';
import { Smartphone, Monitor, RotateCcw, Volume2, ShieldCheck, Sparkles } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const [isDeviceMockup, setIsDeviceMockup] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#E2E2E2] flex flex-col items-center justify-start p-0 sm:p-4 md:p-6 overflow-x-hidden">
      {/* Top Banner Control: Toggle Phone Frame vs Full Web Screen */}
      <div className="w-full max-w-4xl mb-3 hidden sm:flex items-center justify-between px-4 py-2.5 bg-[#12141C] backdrop-blur-md rounded-2xl border border-[#242731] shadow-lg select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-xs font-medium text-[#8A8D98]">
            تطبيق أندرويد للدروس التعليمية والفيديوهات (يوتيوب والرفع المباشر)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0A0B0E] p-1 rounded-xl border border-[#242731] text-xs">
            <button
              onClick={() => setIsDeviceMockup(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                isDeviceMockup
                  ? 'bg-[#D4AF37] text-[#0A0B0E] font-bold shadow-md shadow-[#D4AF37]/10'
                  : 'text-[#8A8D98] hover:text-[#E2E2E2]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>إطار هاتف أندرويد</span>
            </button>
            <button
              onClick={() => setIsDeviceMockup(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                !isDeviceMockup
                  ? 'bg-[#D4AF37] text-[#0A0B0E] font-bold shadow-md shadow-[#D4AF37]/10'
                  : 'text-[#8A8D98] hover:text-[#E2E2E2]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>شاشة واسعة متجاوبة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 relative flex justify-center ${
          isDeviceMockup ? 'max-w-[420px]' : 'max-w-4xl'
        }`}
      >
        {/* Device Frame Outer Shell if mockup mode */}
        {isDeviceMockup ? (
          <div className="w-full relative bg-[#0A0B0E] rounded-[48px] p-3 ring-1 ring-[#242731] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_30px_rgba(212,175,55,0.08)] border-4 border-[#1D212B]">
            {/* Side Volume and Power Buttons simulation */}
            <div className="absolute -left-[7px] top-28 w-[4px] h-12 bg-[#242731] rounded-l-md" />
            <div className="absolute -left-[7px] top-44 w-[4px] h-16 bg-[#242731] rounded-l-md" />
            <div className="absolute -right-[7px] top-32 w-[4px] h-16 bg-[#242731] rounded-r-md" />

            {/* Inner Screen Bezel */}
            <div className="w-full bg-[#0A0B0E] rounded-[38px] overflow-hidden flex flex-col min-h-[780px] max-h-[880px] relative ring-1 ring-[#242731]">
              {children}
            </div>
          </div>
        ) : (
          <div className="w-full bg-[#0A0B0E] rounded-2xl overflow-hidden min-h-[820px] shadow-2xl border border-[#242731] flex flex-col">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
