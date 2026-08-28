import React from 'react';
import { X, Bell, Check, Sparkles, Film, ArrowRight } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationDrawerProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onSelectNotificationLesson?: (lessonId: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  isOpen,
  onClose,
  onSelectNotificationLesson,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-start animate-fade-in">
      <div className="bg-[#12141C] border-b border-[#242731] rounded-b-3xl p-4 shadow-2xl space-y-3 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1D212B] text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/30">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-white font-['Cairo',sans-serif]">إشعارات وتحديثات التطبيق</h3>
              <span className="text-[10px] text-[#8A8D98]">مركز التنبيهات (Android Shade)</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onMarkAllAsRead}
              className="text-[10px] text-[#D4AF37] hover:text-[#F2D06B] font-bold px-2 py-1 bg-[#1D212B] rounded-lg border border-[#242731] transition-colors"
            >
              قراءة الكل
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#1D212B] hover:bg-[#242731] text-[#8A8D98] hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.lessonId && onSelectNotificationLesson) {
                    onSelectNotificationLesson(n.lessonId);
                    onClose();
                  }
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-[#0A0B0E] border-[#242731] text-[#8A8D98]'
                    : 'bg-[#1D212B] border-[#D4AF37]/40 text-[#E2E2E2] shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white font-['Cairo',sans-serif]">{n.title}</h4>
                  <span className="text-[10px] text-[#8A8D98] font-mono">{n.time}</span>
                </div>
                <p className="text-[11px] text-[#8A8D98] mt-1 leading-relaxed">{n.message}</p>
                {n.lessonId && (
                  <span className="text-[10px] text-[#D4AF37] font-bold flex items-center gap-1 mt-1.5">
                    <span>مشاهدة الدرس الآن ⏵</span>
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-[#8A8D98]">
              لا توجد إشعارات جديدة حالياً.
            </div>
          )}
        </div>

        {/* Bottom Handle */}
        <div className="w-16 h-1 bg-[#242731] rounded-full mx-auto" />
      </div>

      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
