import React, { useState } from 'react';
import { 
  Video, 
  Plus, 
  Youtube, 
  UploadCloud, 
  BookOpen, 
  Trash2, 
  Edit3, 
  Layers, 
  BarChart3, 
  Download, 
  Upload, 
  Sparkles, 
  RotateCcw,
  CheckCircle2,
  HardDrive,
  Eye
} from 'lucide-react';
import { Course, Lesson, LessonProgress } from '../types';
import { AppStorageService } from '../services/storage';

interface PublisherStudioProps {
  courses: Course[];
  lessons: Lesson[];
  progress: Record<string, LessonProgress>;
  onOpenAddLessonModal: (courseId?: string) => void;
  onOpenAddCourseModal: () => void;
  onDeleteLesson: (lessonId: string) => void;
  onDeleteCourse: (courseId: string) => void;
  onSelectLesson: (lessonId: string) => void;
  onResetData: () => void;
  onImportData: (data: { courses: Course[]; lessons: Lesson[] }) => void;
}

export const PublisherStudio: React.FC<PublisherStudioProps> = ({
  courses,
  lessons,
  progress,
  onOpenAddLessonModal,
  onOpenAddCourseModal,
  onDeleteLesson,
  onDeleteCourse,
  onSelectLesson,
  onResetData,
  onImportData,
}) => {
  const [selectedFilterCourse, setSelectedFilterCourse] = useState<string>('all');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Filter lessons
  const filteredLessons = selectedFilterCourse === 'all'
    ? lessons
    : lessons.filter((l) => l.courseId === selectedFilterCourse);

  const youtubeCount = lessons.filter((l) => l.videoType === 'youtube').length;
  const uploadedCount = lessons.filter((l) => l.videoType === 'uploaded').length;
  const totalDuration = lessons.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);

  const handleExportJSON = () => {
    const exportData = {
      courses,
      lessons,
      exportedAt: new Date().toISOString(),
      app: 'Educational Android Studio',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `educational-courses-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.courses && parsed.lessons) {
          onImportData({ courses: parsed.courses, lessons: parsed.lessons });
          alert('تم استيراد الدورات والدروس بنجاح!');
        } else {
          alert('ملف غير صالح، يجب أن يحتوي على بيانات courses و lessons.');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar p-4 space-y-4 bg-[#0A0B0E]">
      {/* Studio Header Card */}
      <div className="bg-gradient-to-r from-[#1D212B] to-[#12141C] rounded-3xl p-4 border border-[#242731] shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#D4AF37] text-[#0A0B0E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 font-bold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white font-['Cairo',sans-serif]">استوديو النشر وإدارة المحتوى</h2>
              <p className="text-[11px] text-[#8A8D98]">نشر فيديوهات يوتيوب والرفع المباشر وتنسيق الدورات</p>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onOpenAddLessonModal()}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#D4AF37] hover:bg-[#F2D06B] text-[#0A0B0E] text-xs font-extrabold shadow-md shadow-[#D4AF37]/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>نشر درس جديد</span>
          </button>

          <button
            onClick={onOpenAddCourseModal}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#1D212B] hover:bg-[#242731] border border-[#242731] text-[#E2E2E2] text-xs font-extrabold transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            <span>إنشاء دورة / مسار</span>
          </button>
        </div>
      </div>

      {/* Analytics & Metrics Grid */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-[#12141C] p-2.5 rounded-2xl border border-[#242731] text-center space-y-0.5">
          <span className="text-[10px] text-[#8A8D98] font-bold block">إجمالي الدروس</span>
          <span className="text-base font-black text-[#D4AF37] font-mono">{lessons.length}</span>
        </div>

        <div className="bg-[#12141C] p-2.5 rounded-2xl border border-[#242731] text-center space-y-0.5">
          <span className="text-[10px] text-[#8A8D98] font-bold block">يوتيوب</span>
          <span className="text-base font-black text-rose-400 font-mono">{youtubeCount}</span>
        </div>

        <div className="bg-[#12141C] p-2.5 rounded-2xl border border-[#242731] text-center space-y-0.5">
          <span className="text-[10px] text-[#8A8D98] font-bold block">مرفوع محلياً</span>
          <span className="text-base font-black text-emerald-400 font-mono">{uploadedCount}</span>
        </div>

        <div className="bg-[#12141C] p-2.5 rounded-2xl border border-[#242731] text-center space-y-0.5">
          <span className="text-[10px] text-[#8A8D98] font-bold block">مجموع الساعات</span>
          <span className="text-base font-black text-[#F2D06B] font-mono">{(totalDuration / 60).toFixed(1)}h</span>
        </div>
      </div>

      {/* Filter by Course */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-[#E2E2E2]">الدروس المنشورة:</span>
        <select
          value={selectedFilterCourse}
          onChange={(e) => setSelectedFilterCourse(e.target.value)}
          className="bg-[#12141C] border border-[#242731] rounded-xl px-2.5 py-1 text-xs text-[#E2E2E2] focus:outline-none focus:border-[#D4AF37]"
        >
          <option value="all">كافة الدورات ({lessons.length})</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Published Lessons List */}
      <div className="space-y-2.5">
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson) => {
            const course = courses.find((c) => c.id === lesson.courseId);
            return (
              <div
                key={lesson.id}
                className="bg-[#12141C] rounded-2xl border border-[#242731] p-3 flex items-center justify-between gap-3 group hover:border-[#D4AF37]/40 transition-all"
              >
                <div
                  onClick={() => onSelectLesson(lesson.id)}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-[#1D212B] flex-shrink-0">
                    <img
                      src={lesson.thumbnailUrl}
                      alt={lesson.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1 right-1">
                      {lesson.videoType === 'youtube' ? (
                        <span className="p-0.5 bg-red-600 rounded text-white block shadow">
                          <Youtube className="w-2.5 h-2.5" />
                        </span>
                      ) : (
                        <span className="p-0.5 bg-[#1D212B] text-[#D4AF37] border border-[#D4AF37]/40 rounded block shadow">
                          <HardDrive className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37] truncate font-['Cairo',sans-serif]">
                      {lesson.title}
                    </h4>
                    <p className="text-[10px] text-[#8A8D98] truncate">
                      {course?.title || 'دورة غير محددة'}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-[#8A8D98] font-mono">
                      <span>{lesson.durationMinutes} دقيقة</span>
                      <span>•</span>
                      <span>الترتيب: {lesson.order}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onSelectLesson(lesson.id)}
                    className="p-1.5 rounded-lg bg-[#1D212B] hover:bg-[#242731] text-[#E2E2E2] border border-[#242731] transition-colors"
                    title="معاينة ومشاهدة الدرس"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف الدرس "${lesson.title}"؟`)) {
                        onDeleteLesson(lesson.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-[#1D212B] hover:bg-rose-950/80 text-[#8A8D98] hover:text-rose-400 border border-[#242731] transition-colors"
                    title="حذف الدرس"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 bg-[#12141C] rounded-3xl border border-[#242731] space-y-2">
            <Video className="w-8 h-8 text-[#8A8D98] mx-auto opacity-50" />
            <p className="text-xs text-[#8A8D98]">لا توجد دروس منشورة في هذا التصنيف.</p>
            <button
              onClick={() => onOpenAddLessonModal()}
              className="text-xs text-[#D4AF37] hover:text-[#F2D06B] font-bold"
            >
              + إضافة أول درس الآن
            </button>
          </div>
        )}
      </div>

      {/* Backup and Data Management Tools */}
      <div className="bg-[#12141C] rounded-2xl p-3.5 border border-[#242731] space-y-2.5">
        <h4 className="text-xs font-bold text-[#E2E2E2] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>أدوات النسخ الاحتياطي وإدارة البيانات</span>
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1D212B] hover:bg-[#242731] border border-[#242731] text-[#E2E2E2] text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>تصدير نسخة احتياطية</span>
          </button>

          <label className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1D212B] hover:bg-[#242731] border border-[#242731] text-[#E2E2E2] text-xs font-bold cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>استيراد دورات ودروس</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={() => {
            if (confirm('هل تريد إعادة تعيين المحتوى إلى الدروس الافتراضية الأولية؟')) {
              onResetData();
            }
          }}
          className="w-full py-1.5 text-[11px] text-[#8A8D98] hover:text-rose-400 transition-colors text-center block pt-1"
        >
          إعادة تعيين الدروس الافتراضية
        </button>
      </div>
    </div>
  );
};
