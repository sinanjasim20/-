import React from 'react';
import { ArrowRight, Search, Bell, Sparkles, User, LogIn, ShieldCheck } from 'lucide-react';
import { AppUser } from '../types';

interface AndroidTopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  currentUser?: AppUser | null;
  onOpenProfile?: () => void;
  onOpenAuth?: () => void;
  rightAction?: React.ReactNode;
}

export const AndroidTopBar: React.FC<AndroidTopBarProps> = ({
  title = 'البعد السادس الهندسي',
  subtitle,
  showBack = false,
  onBack,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  currentUser,
  onOpenProfile,
  onOpenAuth,
  rightAction,
}) => {
  return (
    <header
      id="android-top-app-bar"
      className="w-full bg-[#12141C] backdrop-blur-md border-b border-[#242731] px-3.5 py-2.5 flex items-center justify-between sticky top-0 z-30 select-none shadow-md"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack ? (
          <button
            id="btn-top-back"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-[#1D212B] hover:bg-[#242731] text-[#E2E2E2] flex items-center justify-center transition-colors active:scale-95 border border-[#242731]"
            title="رجوع"
          >
            <ArrowRight className="w-5 h-5 text-[#E2E2E2]" />
          </button>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center text-[#0A0B0E] shadow-md shadow-[#D4AF37]/20 flex-shrink-0 font-bold">
            <Sparkles className="w-5 h-5 fill-[#0A0B0E]" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-extrabold text-white tracking-tight truncate leading-tight flex items-center gap-1 font-['Cairo',sans-serif]">
            {title}
          </h1>
          {subtitle && <p className="text-[11px] text-[#8A8D98] truncate">{subtitle}</p>}
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {rightAction ? (
          rightAction
        ) : (
          <>
            {onOpenSearch && (
              <button
                id="btn-top-search"
                onClick={onOpenSearch}
                className="w-8 h-8 rounded-xl text-[#8A8D98] hover:text-[#E2E2E2] hover:bg-[#1D212B] flex items-center justify-center transition-colors active:scale-95 border border-transparent hover:border-[#242731]"
                title="بحث في الدروس والدورات"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {onOpenNotifications && (
              <button
                id="btn-top-notifications"
                onClick={onOpenNotifications}
                className="w-8 h-8 rounded-xl text-[#8A8D98] hover:text-[#E2E2E2] hover:bg-[#1D212B] flex items-center justify-center transition-colors relative active:scale-95 border border-transparent hover:border-[#242731]"
                title="الإشعارات والتحديثات"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4AF37] rounded-full ring-2 ring-[#12141C]" />
                )}
              </button>
            )}

            {/* User Account Avatar / Login Button */}
            {currentUser ? (
              <button
                id="btn-top-user-profile"
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 p-1 pr-2 bg-[#1D212B] hover:bg-[#242731] rounded-xl border border-[#242731] hover:border-[#D4AF37]/40 transition-all"
                title={`حسابك: ${currentUser.fullName || currentUser.username}`}
              >
                <span className="text-[10px] font-bold text-white max-w-[65px] truncate hidden xs:inline">
                  {currentUser.username}
                </span>
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={currentUser.username}
                  className="w-6 h-6 rounded-lg object-cover ring-1 ring-[#D4AF37]/50"
                />
              </button>
            ) : (
              <button
                id="btn-top-login"
                onClick={onOpenAuth}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#D4AF37] hover:bg-[#F2D06B] text-[#0A0B0E] rounded-xl font-bold text-[11px] transition-all shadow-sm active:scale-95"
                title="تسجيل الدخول / إنشاء حساب"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>دخول</span>
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
};
