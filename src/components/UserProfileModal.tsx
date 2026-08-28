import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  ShieldCheck, 
  GraduationCap, 
  LogOut, 
  Bookmark, 
  CheckCircle2, 
  HardDrive, 
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import { AppUser, Course, Lesson, LessonProgress, UserNote } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  user: AppUser | null;
  courses: Course[];
  lessons: Lesson[];
  progress: Record<string, LessonProgress>;
  userNotes: UserNote[];
  onClose: () => void;
  onLogout: () => void;
  onOpenAuthModal: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  user,
  courses,
  lessons,
  progress,
  userNotes,
  onClose,
  onLogout,
  onOpenAuthModal,
}) => {
  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
        <div className="w-full max-w-sm bg-[#12141C] border border-[#242731] rounded-3xl p-5 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-[#1D212B] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto">
            <User className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">أنت تتصفح كـ "زائر"</h3>
            <p className="text-xs text-[#8A8D98]">
              قم بتسجيل الدخول أو إنشاء حساب جديد للوصول لجميع الفيديوهات والملاحظات والتنزيلات.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenAuthModal();
              }}
              className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#F2D06B] text-[#0A0B0E] font-bold text-xs rounded-xl transition-all shadow-md shadow-[#D4AF37]/20"
            >
              تسجيل الدخول / إنشاء حساب
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 bg-[#1D212B] hover:bg-[#242731] text-[#8A8D98] hover:text-white text-xs rounded-xl transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const progressList = Object.values(progress) as LessonProgress[];
  const completedLessonsCount = progressList.filter((p) => p && p.completed).length;
  const savedOfflineCount = progressList.filter((p) => p && p.savedOffline).length;
  const bookmarkedCount = progressList.filter((p) => p && p.bookmarked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div 
        id="user-profile-card"
        className="w-full max-w-md bg-[#12141C] border border-[#242731] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Banner */}
        <div className="relative p-5 bg-gradient-to-br from-[#1D212B] to-[#0A0B0E] border-b border-[#242731] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                alt={user.fullName || user.username}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#D4AF37] shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#12141C] rounded-full" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-white truncate font-['Cairo',sans-serif]">
                  {user.fullName || user.username}
                </h3>
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
              </div>
              <p className="text-xs font-mono text-[#D4AF37]">@{user.username}</p>
              <p className="text-[11px] text-[#8A8D98] truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1D212B] hover:bg-[#242731] text-[#8A8D98] hover:text-white flex items-center justify-center transition-colors self-start"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Badges and Details */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-4 flex-1">
          {/* Engineering Role & Specialty */}
          <div className="bg-[#0A0B0E] p-3.5 rounded-2xl border border-[#242731] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#8A8D98] block">الصفة والتخصص:</span>
                <span className="text-xs font-bold text-white">
                  {user.role === 'engineer' ? 'مهندس مختص' : user.role === 'instructor' ? 'محاضر ومدرب' : 'طالب / متدرب'} • {user.specialty || 'الهندسة والتقنيات'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              حساب نشط
            </span>
          </div>

          {/* Account Learning Stats Grid */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[#E2E2E2]">إحصائيات التعلم والإنجاز</span>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#1D212B] p-3 rounded-2xl border border-[#242731] text-center space-y-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                <span className="text-base font-black text-white font-mono block">
                  {completedLessonsCount}
                </span>
                <span className="text-[10px] text-[#8A8D98] block">دروس مكتملة</span>
              </div>

              <div className="bg-[#1D212B] p-3 rounded-2xl border border-[#242731] text-center space-y-1">
                <HardDrive className="w-4 h-4 text-sky-400 mx-auto" />
                <span className="text-base font-black text-white font-mono block">
                  {savedOfflineCount}
                </span>
                <span className="text-[10px] text-[#8A8D98] block">تنزيلات أوفلاين</span>
              </div>

              <div className="bg-[#1D212B] p-3 rounded-2xl border border-[#242731] text-center space-y-1">
                <Bookmark className="w-4 h-4 text-[#D4AF37] mx-auto" />
                <span className="text-base font-black text-white font-mono block">
                  {bookmarkedCount}
                </span>
                <span className="text-[10px] text-[#8A8D98] block">المفضلة</span>
              </div>
            </div>
          </div>

          {/* User Account Info box */}
          <div className="bg-[#1D212B] p-3.5 rounded-2xl border border-[#242731] space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#8A8D98]">
              <span>اسم الحساب المسجل:</span>
              <span className="font-bold text-white">{user.username}</span>
            </div>
            <div className="flex items-center justify-between text-[#8A8D98]">
              <span>البريد الإلكتروني:</span>
              <span className="font-mono text-white text-[11px]">{user.email}</span>
            </div>
            <div className="flex items-center justify-between text-[#8A8D98]">
              <span>تاريخ إنشاء الحساب:</span>
              <span className="text-white">
                {new Date(user.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0A0B0E] border-t border-[#242731] flex items-center gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenAuthModal();
            }}
            className="flex-1 py-2.5 bg-[#1D212B] hover:bg-[#242731] text-white text-xs font-bold rounded-xl border border-[#242731] transition-colors flex items-center justify-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>تبديل الحساب</span>
          </button>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold rounded-xl border border-rose-500/30 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
};
