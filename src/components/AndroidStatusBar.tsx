import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Bell } from 'lucide-react';

interface AndroidStatusBarProps {
  hasNotifications?: boolean;
  onOpenNotifications?: () => void;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  hasNotifications = false,
  onOpenNotifications,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="android-status-bar"
      className="w-full h-8 px-5 flex items-center justify-between text-xs font-semibold select-none bg-[#12141C] backdrop-blur-md text-[#8A8D98] z-50 border-b border-[#242731]"
    >
      {/* Left side: Time & Notification Dot */}
      <div className="flex items-center gap-2">
        <span className="tracking-wide font-mono text-[13px] text-[#E2E2E2]">{time || '10:45'}</span>
        {hasNotifications && (
          <button
            onClick={onOpenNotifications}
            className="flex items-center text-[#D4AF37] hover:text-[#F2D06B] transition-colors"
            title="إشعارات جديدة"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse ml-0.5" />
          </button>
        )}
      </div>

      {/* Middle: Camera Hole Placeholder on mobile frame */}
      <div className="w-3.5 h-3.5 rounded-full bg-[#0A0B0E] ring-1 ring-[#242731] shadow-inner" />

      {/* Right side: 5G, Wi-Fi, Battery */}
      <div className="flex items-center gap-2 text-[#8A8D98]">
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-bold text-[#6C707E]">5G</span>
          <Signal className="w-3.5 h-3.5 text-[#8A8D98]" />
        </div>
        <Wifi className="w-3.5 h-3.5 text-[#8A8D98]" />
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-mono text-[#8A8D98]">92%</span>
          <Battery className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]/20" />
        </div>
      </div>
    </div>
  );
};
