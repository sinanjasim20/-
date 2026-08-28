import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Clock, 
  Video, 
  Layers, 
  Sparkles, 
  Download, 
  Play, 
  ChevronLeft, 
  Tag, 
  Filter,
  CheckCircle,
  ThumbsUp,
  FolderOpen
} from 'lucide-react';
import { Course, Lesson, LessonProgress, AppCategory } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  lessons: Lesson[];
  categories: AppCategory[];
  progress: Record<string, LessonProgress>;
  onSelectLesson: (lesson: Lesson) => void;
  onSelectCourse: (course: Course) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  courses,
  lessons,
  categories,
  progress,
  onSelectLesson,
  onSelectCourse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFilterType, setSelectedFilterType] = useState<'all' | 'youtube' | 'downloaded'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'باستا',
    'React',
    'تصليح شاشة',
    'UI Design',
    'إنجليزي',
  ]);

  if (!isOpen) return null;

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const parentCourse = courses.find((c) => c.id === lesson.courseId);
      const courseCategory = parentCourse ? parentCourse.category : '';

      // Category filter
      if (selectedCategory !== 'all' && courseCategory !== selectedCategory) {
        return false;
      }

      // Downloaded / Type filter
      if (selectedFilterType === 'downloaded') {
        const isDownloaded = progress[lesson.id]?.savedOffline;
        if (!isDownloaded) return false;
      } else if (selectedFilterType === 'youtube') {
        if (lesson.videoType !== 'youtube') return false;
      }

      // Keyword query
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = lesson.title.toLowerCase().includes(q);
      const matchDesc = lesson.description.toLowerCase().includes(q);
      const matchSummary = lesson.summaryNotes?.some((n) => n.toLowerCase().includes(q));
      const matchKeyPoints = lesson.keyPoints?.some((k) => k.toLowerCase().includes(q));
      const matchCourse = parentCourse?.title.toLowerCase().includes(q) || parentCourse?.tags.some((t) => t.toLowerCase().includes(q));

      return matchTitle || matchDesc || matchSummary || matchKeyPoints || matchCourse;
    });
  }, [lessons, courses, progress, searchQuery, selectedCategory, selectedFilterType]);

  // Filter courses
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim() && selectedCategory === 'all') return [];

    return courses.filter((course) => {
      if (selectedCategory !== 'all' && course.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchDesc = course.description.toLowerCase().includes(q);
      const matchTags = course.tags.some((t) => t.toLowerCase().includes(q));
      const matchInstructor = course.instructorName.toLowerCase().includes(q);

      return matchTitle || matchDesc || matchTags || matchInstructor;
    });
  }, [courses, searchQuery, selectedCategory]);

  const handleApplyRecent = (term: string) => {
    setSearchQuery(term);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-[#0A0B0E] border border-[#242731] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Search Header Bar */}
        <div className="p-4 bg-[#12141C] border-b border-[#242731] flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#D4AF37] absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن درس، طبخ، صيانة، برمجة، أو كلمة مفتاحية..."
              className="w-full bg-[#0A0B0E] border border-[#242731] rounded-2xl pr-9 pl-9 py-2.5 text-xs text-[#E2E2E2] placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8D98] hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1D212B] hover:bg-[#242731] text-[#8A8D98] hover:text-[#E2E2E2] border border-[#242731] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Horizontal Carousel Filter */}
        <div className="px-4 py-2.5 bg-[#12141C]/60 border-b border-[#242731] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#D4AF37] text-[#0A0B0E] shadow-sm'
                : 'bg-[#1D212B] text-[#8A8D98] hover:text-[#E2E2E2] border border-[#242731]'
            }`}
          >
            الكل ({lessons.length})
          </button>
          {categories.map((cat) => {
            const count = lessons.filter((l) => {
              const c = courses.find((crs) => crs.id === l.courseId);
              return c?.category === cat.id;
            }).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#D4AF37] text-[#0A0B0E] shadow-sm'
                    : 'bg-[#1D212B] text-[#8A8D98] hover:text-[#E2E2E2] border border-[#242731]'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter Sub-bar (All / Downloaded / YouTube) */}
        <div className="px-4 py-2 bg-[#0A0B0E] border-b border-[#242731] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#8A8D98] ml-1">التصفية:</span>
            <button
              type="button"
              onClick={() => setSelectedFilterType('all')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                selectedFilterType === 'all' ? 'bg-[#242731] text-[#E2E2E2]' : 'text-[#8A8D98]'
              }`}
            >
              الكل
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterType('downloaded')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                selectedFilterType === 'downloaded' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-[#8A8D98]'
              }`}
            >
              <Download className="w-3 h-3 text-emerald-400" />
              <span>المنزلة أوفلاين</span>
            </button>
          </div>

          <span className="text-[11px] text-[#D4AF37] font-bold font-mono">
            {filteredLessons.length} درس متطابق
          </span>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Recent Search Suggestions if Query is Empty */}
          {!searchQuery && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#8A8D98]">
                <span>عمليات بحث سريعة وشائعة:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleApplyRecent(term)}
                    className="px-2.5 py-1 rounded-xl bg-[#12141C] hover:bg-[#1D212B] text-[#E2E2E2] text-xs border border-[#242731] flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Courses (if any) */}
          {filteredCourses.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-[#8A8D98] flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>المسارات والدورات التدريبية ({filteredCourses.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredCourses.map((crs) => (
                  <div
                    key={crs.id}
                    onClick={() => {
                      onSelectCourse(crs);
                      onClose();
                    }}
                    className="p-2.5 bg-[#12141C] hover:bg-[#1D212B] border border-[#242731] hover:border-[#D4AF37]/50 rounded-2xl cursor-pointer transition-all flex items-center gap-2.5"
                  >
                    <img
                      src={crs.thumbnailUrl}
                      alt={crs.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-white truncate font-['Cairo',sans-serif]">
                        {crs.title}
                      </h5>
                      <span className="text-[10px] text-[#D4AF37] block">
                        {crs.instructorName}
                      </span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-[#8A8D98]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Lessons List */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-[#8A8D98] flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>الدروس والفيديوهات ({filteredLessons.length})</span>
            </h4>

            {filteredLessons.length > 0 ? (
              <div className="space-y-2">
                {filteredLessons.map((lesson) => {
                  const parentCourse = courses.find((c) => c.id === lesson.courseId);
                  const isOffline = progress[lesson.id]?.savedOffline;
                  const isCompleted = progress[lesson.id]?.completed;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => {
                        onSelectLesson(lesson);
                        onClose();
                      }}
                      className="p-3 bg-[#12141C] hover:bg-[#1D212B] border border-[#242731] hover:border-[#D4AF37]/50 rounded-2xl cursor-pointer transition-all flex items-start gap-3 group"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-black">
                        <img
                          src={lesson.thumbnailUrl}
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                        </div>
                        <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-mono px-1 rounded text-white">
                          {lesson.durationMinutes} د
                        </span>
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          {parentCourse && (
                            <span className="text-[10px] font-bold text-[#D4AF37] bg-[#1D212B] px-2 py-0.5 rounded-md border border-[#242731]">
                              {parentCourse.title.split(' ')[0]} {parentCourse.title.split(' ')[1]}
                            </span>
                          )}
                          {isOffline && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-0.5">
                              <CheckCircle className="w-2.5 h-2.5" />
                              <span>أوفلاين</span>
                            </span>
                          )}
                          {isCompleted && (
                            <span className="text-[9px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                              مكتمل
                            </span>
                          )}
                        </div>

                        <h5 className="text-xs font-bold text-[#E2E2E2] group-hover:text-white line-clamp-1 font-['Cairo',sans-serif]">
                          {lesson.title}
                        </h5>

                        <p className="text-[11px] text-[#8A8D98] line-clamp-1">
                          {lesson.description}
                        </p>
                      </div>

                      <ChevronLeft className="w-4 h-4 text-[#8A8D98] group-hover:text-[#D4AF37] self-center transition-colors" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-[#12141C] rounded-2xl border border-[#242731] space-y-2">
                <Search className="w-8 h-8 text-[#8A8D98] mx-auto opacity-40" />
                <p className="text-xs text-[#E2E2E2] font-bold">لا توجد دروس مطابقة لبحثك</p>
                <p className="text-[11px] text-[#8A8D98]">جرب البحث بكلمات أخرى أو اختر فئة مختلفة من الأعلى.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
