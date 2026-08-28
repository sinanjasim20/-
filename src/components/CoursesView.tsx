import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  Award,
  Layers,
  Sparkles,
  Plus
} from 'lucide-react';
import { Course, Lesson, LessonProgress, AppCategory, CourseLevel } from '../types';

interface CoursesViewProps {
  courses: Course[];
  lessons: Lesson[];
  categories: AppCategory[];
  progress: Record<string, LessonProgress>;
  selectedCategoryId?: string;
  onSelectLesson: (lessonId: string) => void;
  onOpenAddCourseModal: () => void;
  onOpenAddLessonModal: (courseId?: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  lessons,
  categories,
  progress,
  selectedCategoryId,
  onSelectLesson,
  onOpenAddCourseModal,
  onOpenAddLessonModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategoryId || 'all');
  const [activeLevel, setActiveLevel] = useState<CourseLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
    const matchesLevel = activeLevel === 'all' || course.level === activeLevel;
    const matchesSearch =
      !searchQuery.trim() ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar p-4 space-y-4 bg-[#0A0B0E]">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن دورة أو مهارة أو موضوع..."
          className="w-full bg-[#12141C] border border-[#242731] rounded-2xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37] shadow-sm"
        />
        <Search className="w-4 h-4 text-[#8A8D98] absolute right-3.5 top-3" />
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-[#D4AF37] text-[#0A0B0E] shadow-sm font-extrabold'
              : 'bg-[#12141C] border border-[#242731] text-[#8A8D98] hover:text-[#E2E2E2]'
          }`}
        >
          الكل ({courses.length})
        </button>

        {categories.map((cat) => {
          const count = courses.filter((c) => c.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#D4AF37] text-[#0A0B0E] shadow-sm font-extrabold'
                  : 'bg-[#12141C] border border-[#242731] text-[#8A8D98] hover:text-[#E2E2E2]'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Level Filter Pills */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#8A8D98] font-bold">تصفية حسب المستوى:</span>
        <div className="flex items-center gap-1">
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                activeLevel === lvl
                  ? 'bg-[#1D212B] text-[#D4AF37] border border-[#D4AF37]/50'
                  : 'text-[#8A8D98] hover:text-[#E2E2E2]'
              }`}
            >
              {lvl === 'all' ? 'الكل' : lvl === 'beginner' ? 'مبتدئ' : lvl === 'intermediate' ? 'متوسط' : 'متقدم'}
            </button>
          ))}
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-3.5">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const courseLessons = lessons.filter((l) => l.courseId === course.id).sort((a, b) => a.order - b.order);
            const completedCount = courseLessons.filter((l) => progress[l.id]?.completed).length;
            const progressPercent = courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;
            const isExpanded = expandedCourseId === course.id;

            return (
              <div
                key={course.id}
                className="bg-[#12141C] rounded-2xl border border-[#242731] overflow-hidden shadow-lg transition-all"
              >
                {/* Course Header */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-20 h-20 rounded-xl object-cover ring-1 ring-[#242731] flex-shrink-0"
                    />

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#D4AF37] bg-[#1D212B] px-2 py-0.5 rounded-md border border-[#D4AF37]/30">
                          {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                        </span>
                        <span className="text-[11px] text-[#8A8D98] font-mono">
                          {courseLessons.length} دروس
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-white leading-snug font-['Cairo',sans-serif]">
                        {course.title}
                      </h3>

                      <p className="text-[11px] text-[#8A8D98] line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress & Actions */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] text-[#8A8D98]">
                      <span>إنجاز المسار ({completedCount}/{courseLessons.length})</span>
                      <span className="font-mono font-bold text-[#D4AF37]">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1D212B] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Toggle Lessons / Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#242731]">
                    <button
                      onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                      className="flex items-center gap-1 text-xs font-bold text-[#D4AF37] hover:text-[#F2D06B] transition-colors"
                    >
                      <span>{isExpanded ? 'إخفاء قائمة الدروس' : 'استعراض محتويات الدورة'}</span>
                      <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? '-rotate-90' : ''}`} />
                    </button>

                    <button
                      onClick={() => onOpenAddLessonModal(course.id)}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#E2E2E2] hover:text-white bg-[#1D212B] hover:bg-[#242731] px-2.5 py-1 rounded-lg border border-[#242731] transition-colors"
                      title="إضافة درس جديد لهذه الدورة"
                    >
                      <Plus className="w-3 h-3 text-[#D4AF37]" />
                      <span>+ إضافة درس</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Lessons List */}
                {isExpanded && (
                  <div className="bg-[#0A0B0E] border-t border-[#242731] p-3 space-y-2">
                    <div className="flex items-center justify-between px-1 mb-1">
                      <span className="text-[11px] font-bold text-[#E2E2E2]">دروس هذه الدورة:</span>
                    </div>

                    {courseLessons.length > 0 ? (
                      courseLessons.map((lesson, idx) => {
                        const isDone = progress[lesson.id]?.completed;
                        return (
                          <div
                            key={lesson.id}
                            onClick={() => onSelectLesson(lesson.id)}
                            className="bg-[#12141C] hover:bg-[#1D212B] p-2.5 rounded-xl border border-[#242731] flex items-center justify-between gap-3 cursor-pointer transition-all group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-[#1D212B] text-[#D4AF37] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-[#E2E2E2] group-hover:text-[#D4AF37] truncate">
                                  {lesson.title}
                                </h4>
                                <span className="text-[10px] text-[#8A8D98] font-mono">
                                  {lesson.durationMinutes} دقيقة • {lesson.videoType === 'youtube' ? 'YouTube' : 'مرفوع'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                              ) : (
                                <Play className="w-3.5 h-3.5 text-[#8A8D98] group-hover:text-[#D4AF37]" />
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-xs text-[#8A8D98]">
                        لا توجد دروس مضافة لهذه الدورة بعد. انقر على "+ إضافة درس" بالأعلى.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-[#12141C] rounded-3xl border border-[#242731] space-y-3">
            <BookOpen className="w-10 h-10 text-[#8A8D98] mx-auto opacity-50" />
            <p className="text-xs text-[#8A8D98]">لا توجد دورات تطابق خيارات البحث والتصفية.</p>
          </div>
        )}
      </div>

      {/* Create Course Button */}
      <div className="pt-3">
        <button
          onClick={onOpenAddCourseModal}
          className="w-full py-3 rounded-2xl bg-[#12141C] hover:bg-[#1D212B] border border-[#242731] text-[#D4AF37] hover:text-[#F2D06B] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 hover:border-[#D4AF37]/40"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء مسار / دورة تعليمية جديدة</span>
        </button>
      </div>
    </div>
  );
};
