import React, { useState } from 'react';
import { 
  Bookmark, 
  Download, 
  MessageSquarePlus, 
  Play, 
  Trash2, 
  HardDrive, 
  ExternalLink,
  CheckCircle2,
  Clock,
  ChevronLeft,
  Search,
  Sparkles,
  WifiOff,
  FolderDown,
  ShieldCheck
} from 'lucide-react';
import { Course, Lesson, LessonProgress, UserNote, DownloadedMediaInfo } from '../types';

interface SavedViewProps {
  courses: Course[];
  lessons: Lesson[];
  progress: Record<string, LessonProgress>;
  notes: UserNote[];
  downloads: Record<string, DownloadedMediaInfo>;
  onSelectLesson: (lessonId: string) => void;
  onRemoveBookmark: (lessonId: string) => void;
  onRemoveOfflineDownload: (lessonId: string) => void;
  onClearAllDownloads: () => void;
  onDeleteNote: (noteId: string) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  courses,
  lessons,
  progress,
  notes,
  downloads,
  onSelectLesson,
  onRemoveBookmark,
  onRemoveOfflineDownload,
  onClearAllDownloads,
  onDeleteNote,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'downloads' | 'bookmarks' | 'notes'>('downloads');
  const [searchFilter, setSearchFilter] = useState('');

  // Bookmarked lessons
  const bookmarkedLessons = lessons.filter((l) => progress[l.id]?.bookmarked);

  // Offline saved lessons
  const downloadedLessons = lessons.filter((l) => progress[l.id]?.savedOffline);

  // Storage calculation
  const totalDownloadSizeMb = downloadedLessons.reduce((sum, l) => {
    const info = downloads[l.id];
    return sum + (info?.fileSizeMb || 45);
  }, 0);

  const filterLessons = (items: Lesson[]) => {
    if (!searchFilter.trim()) return items;
    const q = searchFilter.toLowerCase();
    return items.filter((item) => item.title.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q));
  };

  const filterNotes = (items: UserNote[]) => {
    if (!searchFilter.trim()) return items;
    const q = searchFilter.toLowerCase();
    return items.filter((item) => item.text.toLowerCase().includes(q) || item.timeFormatted.includes(q));
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar p-4 space-y-4 bg-[#0A0B0E]">
      {/* Sub Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#12141C] border border-[#242731] rounded-2xl">
        <button
          onClick={() => setActiveSubTab('downloads')}
          className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'downloads'
              ? 'bg-[#D4AF37] text-[#0A0B0E] shadow-sm font-extrabold'
              : 'text-[#8A8D98] hover:text-[#E2E2E2]'
          }`}
        >
          <FolderDown className="w-3.5 h-3.5" />
          <span>التنزيلات ({downloadedLessons.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bookmarks')}
          className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'bookmarks'
              ? 'bg-[#D4AF37] text-[#0A0B0E] shadow-sm font-extrabold'
              : 'text-[#8A8D98] hover:text-[#E2E2E2]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>المفضلة ({bookmarkedLessons.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notes')}
          className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'notes'
              ? 'bg-[#D4AF37] text-[#0A0B0E] shadow-sm font-extrabold'
              : 'text-[#8A8D98] hover:text-[#E2E2E2]'
          }`}
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>ملاحظاتي ({notes.length})</span>
        </button>
      </div>

      {/* Optional Search Filter in saved view */}
      <div className="relative">
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="ابحث في العناصر المحفوظة والتنزيلات..."
          className="w-full bg-[#12141C] border border-[#242731] rounded-2xl pr-9 pl-4 py-2 text-xs text-white placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37]"
        />
        <Search className="w-3.5 h-3.5 text-[#8A8D98] absolute right-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* 1. DOWNLOADED OFFLINE SECTION */}
      {activeSubTab === 'downloads' && (
        <div className="space-y-4">
          {/* Storage Meter Card */}
          <div className="bg-[#12141C] border border-[#242731] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-['Cairo',sans-serif]">
                    مساحة التخزين غير المتصل (Offline Storage)
                  </h3>
                  <span className="text-[10px] text-[#8A8D98]">
                    {downloadedLessons.length} دروس مُنزلة على الذاكرة
                  </span>
                </div>
              </div>

              {downloadedLessons.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAllDownloads}
                  className="text-[10px] font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 transition-colors"
                >
                  تفريغ التنزيلات
                </button>
              )}
            </div>

            {/* Storage Bar Indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-400 font-bold">
                  {totalDownloadSizeMb.toFixed(1)} MB مستخدمة
                </span>
                <span className="text-[#8A8D98]">32 GB السعة الكلية</span>
              </div>
              <div className="w-full bg-[#0A0B0E] h-2 rounded-full overflow-hidden border border-[#242731]">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-[#D4AF37] h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(4, (totalDownloadSizeMb / 500) * 100))}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-emerald-300 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
              <WifiOff className="w-3.5 h-3.5 flex-shrink-0" />
              <span>يمكنك تشغيل هذه الفيديوهات في وضع الطيران وبدون الحاجة لشبكة Wi-Fi أو بيانات خلوية.</span>
            </div>
          </div>

          {/* Downloaded List */}
          {downloadedLessons.length > 0 ? (
            <div className="space-y-3">
              {filterLessons(downloadedLessons).map((lesson) => {
                const course = courses.find((c) => c.id === lesson.courseId);
                const info = downloads[lesson.id];
                const sizeMb = info?.fileSizeMb || 45;
                const quality = info?.quality || '1080p HD';

                return (
                  <div
                    key={lesson.id}
                    className="bg-[#12141C] rounded-2xl border border-[#242731] p-3 flex items-center justify-between gap-3 group transition-all hover:border-emerald-500/40"
                  >
                    <div
                      onClick={() => onSelectLesson(lesson.id)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-[#1D212B] flex-shrink-0">
                        <img
                          src={lesson.thumbnailUrl}
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                        </div>
                        <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-mono px-1 rounded text-white">
                          {lesson.durationMinutes} د
                        </span>
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30 flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>جاهز للأوفلاين</span>
                          </span>
                          <span className="text-[9px] font-mono text-[#D4AF37] bg-[#1D212B] px-1.5 py-0.2 rounded">
                            {quality}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37] truncate font-['Cairo',sans-serif]">
                          {lesson.title}
                        </h4>

                        <div className="flex items-center gap-2 text-[10px] text-[#8A8D98]">
                          <span>{course?.title}</span>
                          <span>•</span>
                          <span className="font-mono">{sizeMb} MB</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveOfflineDownload(lesson.id)}
                      className="text-[#8A8D98] hover:text-rose-400 p-2 rounded-xl hover:bg-[#1D212B] transition-colors flex-shrink-0"
                      title="حذف من التنزيلات المحلية"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#12141C] rounded-3xl border border-[#242731] space-y-2">
              <Download className="w-10 h-10 text-[#8A8D98] mx-auto opacity-40" />
              <p className="text-xs font-bold text-white">لا توجد دروس مُنزلة حالياً في الذاكرة</p>
              <p className="text-[11px] text-[#8A8D98] max-w-xs mx-auto">
                انقر على زر "تنزيل أوفلاين" بجانب أي فيديو لتحميله ومشاهدته في أي وقت بدون إنترنت.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. BOOKMARKED LESSONS SECTION */}
      {activeSubTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarkedLessons.length > 0 ? (
            filterLessons(bookmarkedLessons).map((lesson) => {
              const course = courses.find((c) => c.id === lesson.courseId);
              return (
                <div
                  key={lesson.id}
                  className="bg-[#12141C] rounded-2xl border border-[#242731] p-3 flex items-center justify-between gap-3 group transition-all hover:border-[#D4AF37]/40"
                >
                  <div
                    onClick={() => onSelectLesson(lesson.id)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-[#1D212B] flex-shrink-0">
                      <img
                        src={lesson.thumbnailUrl}
                        alt={lesson.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-mono px-1 rounded text-white">
                        {lesson.durationMinutes} د
                      </span>
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37] truncate font-['Cairo',sans-serif]">
                        {lesson.title}
                      </h4>
                      <p className="text-[10px] text-[#8A8D98] truncate">{course?.title || 'دورة تعليمية'}</p>
                      <span className="text-[10px] text-[#D4AF37] font-mono">
                        {lesson.durationMinutes} دقيقة
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveBookmark(lesson.id)}
                    className="text-[#8A8D98] hover:text-rose-400 p-2 rounded-xl hover:bg-[#1D212B] transition-colors flex-shrink-0"
                    title="إزالة من المفضلة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-[#12141C] rounded-3xl border border-[#242731] space-y-2">
              <Bookmark className="w-10 h-10 text-[#8A8D98] mx-auto opacity-40" />
              <p className="text-xs font-bold text-white">لم تقم بإضافة أي دروس إلى قائمة المفضلة بعد</p>
              <p className="text-[11px] text-[#8A8D98]">انقر على زر "حفظ" أثناء مشاهدة أي فيديو لإضافته هنا.</p>
            </div>
          )}
        </div>
      )}

      {/* 3. USER TIMESTAMPS NOTEBOOK SECTION */}
      {activeSubTab === 'notes' && (
        <div className="space-y-3">
          {notes.length > 0 ? (
            filterNotes(notes).map((note) => {
              const lesson = lessons.find((l) => l.id === note.lessonId);
              return (
                <div
                  key={note.id}
                  className="bg-[#12141C] rounded-2xl border border-[#242731] p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#1D212B] px-2 py-0.5 rounded-md border border-[#D4AF37]/30">
                        {note.timeFormatted}
                      </span>
                      <span className="text-xs font-bold text-[#E2E2E2] truncate max-w-[200px]">
                        {lesson?.title || 'درس تعليمي'}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="text-[#8A8D98] hover:text-rose-400 p-1"
                      title="حذف الملاحظة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-[#E2E2E2] leading-relaxed whitespace-pre-line bg-[#0A0B0E] p-2.5 rounded-xl border border-[#242731]">
                    {note.text}
                  </p>

                  {lesson && (
                    <button
                      onClick={() => onSelectLesson(lesson.id)}
                      className="text-[11px] text-[#D4AF37] hover:text-[#F2D06B] font-bold flex items-center gap-1 pt-1"
                    >
                      <span>الانتقال للدرس وتشغيل الفيديو ⏵</span>
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-[#12141C] rounded-3xl border border-[#242731] space-y-2">
              <MessageSquarePlus className="w-10 h-10 text-[#8A8D98] mx-auto opacity-40" />
              <p className="text-xs font-bold text-white">دفتر الملاحظات فارغ حالياً</p>
              <p className="text-[11px] text-[#8A8D98]">يمكنك كتابة وتثبيت الملاحظات مع توقيت الفيديو أثناء التعلم.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
