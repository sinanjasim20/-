import React from 'react';
import { 
  Play, 
  Sparkles, 
  Clock, 
  Youtube, 
  HardDrive, 
  CheckCircle2, 
  ChevronLeft, 
  BookOpen, 
  TrendingUp,
  Bookmark,
  Layers,
  GraduationCap
} from 'lucide-react';
import { Course, Lesson, LessonProgress, AppCategory } from '../types';

interface HomeViewProps {
  courses: Course[];
  lessons: Lesson[];
  categories: AppCategory[];
  progress: Record<string, LessonProgress>;
  onSelectLesson: (lessonId: string) => void;
  onSelectCourse: (courseId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenPublisherModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  courses,
  lessons,
  categories,
  progress,
  onSelectLesson,
  onSelectCourse,
  onSelectCategory,
  onOpenPublisherModal,
}) => {
  // Find last unwatched or in-progress lesson
  const inProgressLesson = lessons.find((l) => progress[l.id]?.lastPositionSeconds > 0 && !progress[l.id]?.completed) || lessons[0];
  const inProgressCourse = inProgressLesson ? courses.find((c) => c.id === inProgressLesson.courseId) : null;

  // Latest lessons sorted by createdAt
  const latestLessons = [...lessons].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar space-y-5 p-4 bg-[#0A0B0E]">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#12141C] via-[#1D212B] to-[#12141C] p-5 text-white shadow-xl border border-[#242731]">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A0B0E]/80 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>البعد السادس الهندسي • المنصة التعليمية الذكية</span>
          </div>

          <h2 className="text-lg font-black tracking-tight leading-snug font-['Cairo',sans-serif]">
            تعلّم، انشر، وطوّر مهاراتك خطوة بخطوة
          </h2>

          <p className="text-xs text-[#8A8D98] leading-relaxed max-w-sm">
            شاهد الفيديوهات مباشرة من اليوتيوب أو ارفع دروسك الخاصة واستمتع بتجربة تطبيق أندرويد المتكاملة.
          </p>

          <div className="flex items-center gap-2 pt-1">
            {inProgressLesson && (
              <button
                onClick={() => onSelectLesson(inProgressLesson.id)}
                className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#0A0B0E] hover:bg-[#F2D06B] rounded-xl font-bold text-xs shadow-md shadow-[#D4AF37]/20 transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-[#0A0B0E]" />
                <span>متابعة الدرس الأخير</span>
              </button>
            )}

            <button
              onClick={onOpenPublisherModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1D212B] hover:bg-[#242731] text-[#E2E2E2] rounded-xl font-bold text-xs border border-[#242731] transition-colors"
            >
              <span>+ نشر فيديو</span>
            </button>
          </div>
        </div>
      </div>

      {/* Continue Watching / In-Progress Card */}
      {inProgressLesson && (
        <div className="bg-[#12141C] rounded-2xl p-3.5 border border-[#242731] shadow-md">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-[#E2E2E2] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>متابعة المشاهدة</span>
            </span>
            {inProgressCourse && (
              <span className="text-[10px] text-[#D4AF37] font-bold bg-[#1D212B] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                {inProgressCourse.title}
              </span>
            )}
          </div>

          <div
            onClick={() => onSelectLesson(inProgressLesson.id)}
            className="flex items-center gap-3 bg-[#0A0B0E] hover:bg-[#1D212B]/40 p-2.5 rounded-xl border border-[#242731] cursor-pointer transition-all group"
          >
            {/* Thumbnail */}
            <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-[#1D212B] flex-shrink-0">
              <img
                src={inProgressLesson.thumbnailUrl}
                alt={inProgressLesson.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-[#0A0B0E] flex items-center justify-center shadow-lg">
                  <Play className="w-3.5 h-3.5 fill-[#0A0B0E] translate-x-0.5" />
                </div>
              </div>
            </div>

            {/* Title & Details */}
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-xs font-bold text-white truncate group-hover:text-[#D4AF37] transition-colors">
                {inProgressLesson.title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-[#8A8D98]">
                <span>{inProgressLesson.durationMinutes} دقيقة</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  {inProgressLesson.videoType === 'youtube' ? (
                    <Youtube className="w-3 h-3 text-red-500" />
                  ) : (
                    <HardDrive className="w-3 h-3 text-[#D4AF37]" />
                  )}
                  {inProgressLesson.videoType === 'youtube' ? 'YouTube' : 'مرفوع'}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-[#1D212B] rounded-full overflow-hidden">
                <div className="w-2/5 h-full bg-[#D4AF37] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Carousel */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#E2E2E2] flex items-center gap-1.5 font-['Cairo',sans-serif]">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>التصنيفات والمجالات</span>
          </h3>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#12141C] hover:bg-[#1D212B] border border-[#242731] text-xs font-bold text-[#E2E2E2] transition-all flex-shrink-0 hover:border-[#D4AF37]/40 active:scale-95"
            >
              <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat.color}`} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Courses Tracks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#E2E2E2] flex items-center gap-1.5 font-['Cairo',sans-serif]">
            <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
            <span>المسارات التعليمية الموصى بها</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {courses.slice(0, 2).map((course) => {
            const courseLessons = lessons.filter((l) => l.courseId === course.id);
            const completedCount = courseLessons.filter((l) => progress[l.id]?.completed).length;
            const progressPercent = courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course.id)}
                className="bg-[#12141C] hover:bg-[#1D212B]/80 rounded-2xl p-3.5 border border-[#242731] shadow-md cursor-pointer transition-all group space-y-3 hover:border-[#D4AF37]/30"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-20 h-20 rounded-xl object-cover ring-1 ring-[#242731] flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#D4AF37] bg-[#1D212B] px-2 py-0.5 rounded-md border border-[#D4AF37]/30">
                        {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                      </span>
                      <span className="text-[10px] text-[#8A8D98]">{courseLessons.length} دروس</span>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug">
                      {course.title}
                    </h4>

                    <p className="text-[11px] text-[#8A8D98] truncate">
                      بواسطة: {course.instructorName}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-[#8A8D98]">
                    <span>نسبة الإنجاز</span>
                    <span className="font-mono font-bold text-[#D4AF37]">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1D212B] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Latest Published Lessons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#E2E2E2] flex items-center gap-1.5 font-['Cairo',sans-serif]">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            <span>أحدث الدروس والفيديوهات</span>
          </h3>
          <span className="text-[11px] text-[#8A8D98]">{latestLessons.length} درساً</span>
        </div>

        <div className="space-y-2.5">
          {latestLessons.map((l) => {
            const c = courses.find((crs) => crs.id === l.courseId);
            const isCompleted = progress[l.id]?.completed;

            return (
              <div
                key={l.id}
                onClick={() => onSelectLesson(l.id)}
                className="bg-[#12141C] hover:bg-[#1D212B] p-3 rounded-2xl border border-[#242731] flex items-center justify-between gap-3 cursor-pointer transition-all group hover:border-[#D4AF37]/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Small thumb */}
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-[#1D212B] flex-shrink-0">
                    <img
                      src={l.thumbnailUrl}
                      alt={l.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 fill-white text-white" />
                    </div>
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37] truncate transition-colors">
                      {l.title}
                    </h4>
                    <p className="text-[10px] text-[#8A8D98] truncate">
                      {c ? c.title : 'دورة تعليمية'}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-[#6C707E] font-mono">
                      <span>{l.durationMinutes} دقيقة</span>
                      <span>•</span>
                      <span>{l.videoType === 'youtube' ? 'YouTube' : 'محلي'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" title="مكتمل" />
                  )}
                  <ChevronLeft className="w-4 h-4 text-[#8A8D98] group-hover:text-white transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
