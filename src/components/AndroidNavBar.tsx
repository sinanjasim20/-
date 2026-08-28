import React from 'react';
import { Home, BookOpen, BookmarkCheck, PlusCircle, Video } from 'lucide-react';
import { ActiveTab } from '../types';

interface AndroidNavBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  savedCount?: number;
  newLessonsCount?: number;
  onOpenPublisherModal: () => void;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  activeTab,
  onSelectTab,
  savedCount = 0,
  onOpenPublisherModal,
}) => {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      label: 'الرئيسية',
      icon: Home,
    },
    {
      id: 'courses' as ActiveTab,
      label: 'الدورات والمسارات',
      icon: BookOpen,
    },
    {
      id: 'saved' as ActiveTab,
      label: 'المحفوظات',
      icon: BookmarkCheck,
      badge: savedCount > 0 ? savedCount : undefined,
    },
    {
      id: 'studio' as ActiveTab,
      label: 'استوديو النشر',
      icon: Video,
      highlight: true,
    },
  ];

  return (
    <div
      id="android-bottom-nav"
      className="w-full bg-[#12141C] backdrop-blur-xl border-t border-[#242731] px-2 pt-2 pb-4 select-none z-40"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 group relative transition-all duration-200"
            >
              {/* Material Pill Indicator */}
              <div
                className={`relative px-4 py-1.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? 'bg-[#1D212B] text-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-sm shadow-[#D4AF37]/10'
                    : 'text-[#8A8D98] hover:text-[#E2E2E2] hover:bg-[#1D212B]/60'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-[#D4AF37]' : 'group-hover:scale-105'
                  }`}
                />

                {/* Badge if available */}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0A0B0E] font-bold text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-[#12141C]">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] mt-1 transition-colors font-medium ${
                  isActive ? 'text-[#D4AF37] font-bold' : 'text-[#8A8D98]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Quick Add Floating Trigger in Nav (Creator Shortcut) */}
        <button
          id="btn-quick-publish-fab"
          onClick={onOpenPublisherModal}
          title="نشر درس أو فيديو جديد"
          className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#D4AF37] hover:bg-[#F2D06B] text-[#0A0B0E] p-3 rounded-full shadow-lg shadow-[#D4AF37]/30 ring-4 ring-[#0A0B0E] hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
        >
          <PlusCircle className="w-6 h-6 text-[#0A0B0E] group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Android Hardware Pill Gesture Bar */}
      <div className="w-32 h-1 bg-[#242731] rounded-full mx-auto mt-2.5" />
    </div>
  );
};
