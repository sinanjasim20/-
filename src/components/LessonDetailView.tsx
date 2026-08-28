import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  FileText, 
  ListOrdered, 
  MessageSquare, 
  MessageSquarePlus, 
  Paperclip, 
  Share2, 
  ChevronRight, 
  ChevronLeft, 
  Trash2, 
  Plus, 
  Download, 
  ExternalLink,
  BookOpen,
  Award,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Check,
  Lock,
  LogIn
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, Lesson, LessonProgress, UserNote, TutorialComment, LessonInteraction, AppUser } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { TutorialCommentsSection } from './TutorialCommentsSection';
import { formatTimeSeconds, parseFormattedTimeToSeconds } from '../utils/youtube';

interface LessonDetailViewProps {
  lesson: Lesson;
  course: Course;
  allCourseLessons: Lesson[];
  progress: LessonProgress;
  userNotes: UserNote[];
  comments: TutorialComment[];
  interactions: Record<string, LessonInteraction>;
  currentUser?: AppUser | null;
  onRequireLogin?: () => void;
  onBack: () => void;
  onSelectLesson: (lessonId: string) => void;
  onToggleComplete: (lessonId: string) => void;
  onToggleSavedOffline: (lessonId: string) => void;
  onToggleBookmark: (lessonId: string) => void;
  onVoteInteraction: (lessonId: string, voteType: 'like' | 'dislike') => void;
  onAddComment: (lessonId: string, text: string, timeSeconds?: number) => void;
  onAddReply: (commentId: string, text: string, isCreator: boolean) => void;
  onVoteComment: (commentId: string, voteType: 'like' | 'dislike') => void;
  onVoteReply: (commentId: string, replyId: string, voteType: 'like' | 'dislike') => void;
  onDeleteComment: (commentId: string) => void;
  onAddUserNote: (lessonId: string, text: string, timeSeconds: number) => void;
  onDeleteUserNote: (noteId: string) => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({
  lesson,
  course,
  allCourseLessons,
  progress,
  userNotes,
  comments,
  interactions,
  currentUser,
  onRequireLogin,
  onBack,
  onSelectLesson,
  onToggleComplete,
  onToggleSavedOffline,
  onToggleBookmark,
  onVoteInteraction,
  onAddComment,
  onAddReply,
  onVoteComment,
  onVoteReply,
  onDeleteComment,
  onAddUserNote,
  onDeleteUserNote,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'chapters' | 'notes' | 'playlist' | 'resources'>('overview');
  const [seekTimeSeconds, setSeekTimeSeconds] = useState<number | null>(null);
  const [currentPlaybackSeconds, setCurrentPlaybackSeconds] = useState<number>(0);
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [newNoteCustomTime, setNewNoteCustomTime] = useState<string>('');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Filter notes & comments for this lesson
  const currentLessonNotes = userNotes.filter((n) => n.lessonId === lesson.id);
  const currentLessonComments = comments.filter((c) => c.lessonId === lesson.id);
  const lessonInteraction = interactions[lesson.id] || {
    lessonId: lesson.id,
    likesCount: 50,
    dislikesCount: 1,
  };

  // Find previous and next lessons
  const sortedLessons = [...allCourseLessons].sort((a, b) => a.order - b.order);
  const currentIndex = sortedLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null;

  const handleTimestampClick = (seconds: number) => {
    setSeekTimeSeconds(seconds);
    setTimeout(() => setSeekTimeSeconds(null), 800);
  };

  const handleToggleCompleteWithConfetti = () => {
    const willBeCompleted = !progress?.completed;
    onToggleComplete(lesson.id);

    if (willBeCompleted) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#10b981', '#f59e0b', '#ec4899'],
      });
    }
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser && onRequireLogin) {
      onRequireLogin();
      return;
    }
    if (!newNoteText.trim()) return;

    let targetSeconds = currentPlaybackSeconds;
    if (newNoteCustomTime.trim()) {
      targetSeconds = parseFormattedTimeToSeconds(newNoteCustomTime.trim());
    }

    onAddUserNote(lesson.id, newNoteText.trim(), targetSeconds);
    setNewNoteText('');
    setNewNoteCustomTime('');
  };

  const handleShareLesson = () => {
    if (navigator.share) {
      navigator
        .share({
          title: lesson.title,
          text: `شاهد درس "${lesson.title}" في دورة "${course.title}"`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0A0B0E] overflow-y-auto pb-24 no-scrollbar">
      {/* Video Player */}
      <VideoPlayer
        lesson={lesson}
        seekTimeSeconds={seekTimeSeconds}
        onTimeUpdate={(sec) => setCurrentPlaybackSeconds(sec)}
        isSavedOffline={progress?.savedOffline}
        onToggleSavedOffline={() => {
          if (!currentUser && onRequireLogin) {
            onRequireLogin();
            return;
          }
          onToggleSavedOffline(lesson.id);
        }}
        isBookmarked={progress?.bookmarked}
        onToggleBookmark={() => {
          if (!currentUser && onRequireLogin) {
            onRequireLogin();
            return;
          }
          onToggleBookmark(lesson.id);
        }}
        isLocked={!currentUser}
        onRequireLogin={onRequireLogin}
      />

      {/* Lesson Header & User Interaction Action Bar */}
      <div className="p-4 bg-[#12141C] border-b border-[#242731] space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <span className="text-[11px] font-bold text-[#D4AF37] bg-[#1D212B] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30 mb-1.5 inline-block">
              {course.title}
            </span>
            <h2 className="text-base font-extrabold text-white leading-snug font-['Cairo',sans-serif]">
              {lesson.title}
            </h2>
          </div>

          <button
            onClick={handleShareLesson}
            className="p-2 rounded-xl bg-[#1D212B] hover:bg-[#242731] text-[#E2E2E2] border border-[#242731] transition-colors flex-shrink-0"
            title="مشاركة رابط الدرس"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {copiedNotification && (
          <div className="text-xs bg-emerald-950 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-800/60 text-center animate-fade-in">
            تم نسخ رابط الدرس إلى الحافظة!
          </div>
        )}

        {/* Video Reactions & Like/Dislike Row */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#242731]/60">
          {/* Likes / Dislikes pill */}
          <div className="flex items-center bg-[#0A0B0E] border border-[#242731] rounded-xl p-1 gap-1">
            <button
              onClick={() => {
                if (!currentUser && onRequireLogin) {
                  onRequireLogin();
                  return;
                }
                onVoteInteraction(lesson.id, 'like');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                lessonInteraction.userVote === 'like'
                  ? 'bg-[#D4AF37] text-[#0A0B0E] shadow-sm'
                  : 'text-[#8A8D98] hover:text-white hover:bg-[#1D212B]'
              }`}
              title="إعجاب بالفيديو"
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${lessonInteraction.userVote === 'like' ? 'fill-[#0A0B0E]' : ''}`} />
              <span>{lessonInteraction.likesCount}</span>
            </button>

            <div className="w-[1px] h-4 bg-[#242731]" />

            <button
              onClick={() => {
                if (!currentUser && onRequireLogin) {
                  onRequireLogin();
                  return;
                }
                onVoteInteraction(lesson.id, 'dislike');
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                lessonInteraction.userVote === 'dislike'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-[#8A8D98] hover:text-white hover:bg-[#1D212B]'
              }`}
              title="لم يعجبني"
            >
              <ThumbsDown className={`w-3.5 h-3.5 ${lessonInteraction.userVote === 'dislike' ? 'fill-rose-400' : ''}`} />
              {lessonInteraction.dislikesCount > 0 && <span>{lessonInteraction.dislikesCount}</span>}
            </button>
          </div>

          {/* Quick Offline Download Toggle button */}
          <button
            onClick={() => onToggleSavedOffline(lesson.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              progress?.savedOffline
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-[#0A0B0E] border border-[#242731] text-[#8A8D98] hover:text-[#E2E2E2] hover:bg-[#1D212B]'
            }`}
          >
            {progress?.savedOffline ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>تم التنزيل (أوفلاين)</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>تنزيل أوفلاين</span>
              </>
            )}
          </button>
        </div>

        {/* Completion Action Button */}
        <div className="flex items-center justify-between pt-1 gap-2">
          <button
            onClick={handleToggleCompleteWithConfetti}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold text-xs transition-all active:scale-98 ${
              progress?.completed
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/30'
                : 'bg-[#D4AF37] text-[#0A0B0E] hover:bg-[#F2D06B] shadow-md shadow-[#D4AF37]/20 font-extrabold'
            }`}
          >
            {progress?.completed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]/20" />
                <span>تم إكمال هذا الدرس بنجاح ✓</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                <span>تعيين الدرس كمكتمل</span>
              </>
            )}
          </button>

          {/* Quick Prev / Next Lesson Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => prevLesson && onSelectLesson(prevLesson.id)}
              disabled={!prevLesson}
              className={`p-2 rounded-xl border text-xs flex items-center justify-center transition-colors ${
                prevLesson
                  ? 'bg-[#1D212B] text-[#E2E2E2] border-[#242731] hover:bg-[#242731]'
                  : 'bg-[#12141C] text-[#6C707E] border-[#242731] cursor-not-allowed'
              }`}
              title={prevLesson ? `الدرس السابق: ${prevLesson.title}` : 'لا يوجد درس سابق'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => nextLesson && onSelectLesson(nextLesson.id)}
              disabled={!nextLesson}
              className={`p-2 rounded-xl border text-xs flex items-center justify-center transition-colors ${
                nextLesson
                  ? 'bg-[#1D212B] text-[#E2E2E2] border-[#242731] hover:bg-[#242731]'
                  : 'bg-[#12141C] text-[#6C707E] border-[#242731] cursor-not-allowed'
              }`}
              title={nextLesson ? `الدرس التالي: ${nextLesson.title}` : 'نهاية الدروس'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center border-b border-[#242731] bg-[#12141C] sticky top-0 z-20 overflow-x-auto no-scrollbar px-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'overview'
              ? 'text-[#D4AF37] border-[#D4AF37]'
              : 'text-[#8A8D98] border-transparent hover:text-[#E2E2E2]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>الوصف والملخص</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'comments'
              ? 'text-[#D4AF37] border-[#D4AF37]'
              : 'text-[#8A8D98] border-transparent hover:text-[#E2E2E2]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>التعليقات ({currentLessonComments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('chapters')}
          className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'chapters'
              ? 'text-[#D4AF37] border-[#D4AF37]'
              : 'text-[#8A8D98] border-transparent hover:text-[#E2E2E2]'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>الفهرس ({lesson.timestamps?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'notes'
              ? 'text-[#D4AF37] border-[#D4AF37]'
              : 'text-[#8A8D98] border-transparent hover:text-[#E2E2E2]'
          }`}
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>ملاحظاتي ({currentLessonNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('playlist')}
          className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'playlist'
              ? 'text-[#D4AF37] border-[#D4AF37]'
              : 'text-[#8A8D98] border-transparent hover:text-[#E2E2E2]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>محتويات الدورة</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'resources'
              ? 'text-[#D4AF37] border-[#D4AF37]'
              : 'text-[#8A8D98] border-transparent hover:text-[#E2E2E2]'
          }`}
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span>المرفقات ({lesson.attachments?.length || 0})</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Instructor Profile Card */}
            <div className="bg-[#12141C] p-4 rounded-2xl border border-[#242731] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={course.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={course.instructorName}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-[#D4AF37]/50"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white font-['Cairo',sans-serif]">
                      {course.instructorName}
                    </h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <p className="text-[10px] text-[#8A8D98]">
                    {course.instructorTitle || 'منشئ المحتوى ومقدم الدورة'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('comments')}
                className="px-3 py-1.5 bg-[#1D212B] hover:bg-[#242731] border border-[#242731] text-xs font-bold text-[#D4AF37] rounded-xl transition-colors"
              >
                اسأل المحاضر 💬
              </button>
            </div>

            {/* Description */}
            <div className="bg-[#12141C] p-4 rounded-2xl border border-[#242731]">
              <h3 className="text-xs font-bold text-[#E2E2E2] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>عن هذا الدرس</span>
              </h3>
              <p className="text-xs leading-relaxed text-[#8A8D98] whitespace-pre-line">
                {lesson.description || 'لا يوجد وصف مفصل لهذا الدرس بعد.'}
              </p>
            </div>

            {/* Key Takeaways / Points */}
            {lesson.keyPoints && lesson.keyPoints.length > 0 && (
              <div className="bg-[#12141C] p-4 rounded-2xl border border-[#242731]">
                <h3 className="text-xs font-bold text-[#E2E2E2] mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span>أهم المهارات والنقاط المستفادة</span>
                </h3>
                <ul className="space-y-2">
                  {lesson.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#E2E2E2]">
                      <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Smart Summary Notes */}
            {lesson.summaryNotes && lesson.summaryNotes.length > 0 && (
              <div className="bg-[#12141C] p-4 rounded-2xl border border-[#242731] space-y-2.5">
                <h3 className="text-xs font-bold text-[#E2E2E2] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>الملخص السريع (Quick Takeaways)</span>
                </h3>
                <div className="space-y-2">
                  {lesson.summaryNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#0A0B0E] rounded-xl border border-[#242731] text-xs text-[#8A8D98] leading-relaxed"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMMENTS & COMMUNITY INTERACTION */}
        {activeTab === 'comments' && (
          <TutorialCommentsSection
            lessonId={lesson.id}
            comments={comments}
            currentPlaybackSeconds={currentPlaybackSeconds}
            instructorName={course.instructorName}
            instructorAvatar={course.instructorAvatar}
            instructorTitle={course.instructorTitle}
            currentUser={currentUser}
            onRequireLogin={onRequireLogin}
            onAddComment={(lId, text, timeSec) => {
              if (!currentUser && onRequireLogin) {
                onRequireLogin();
                return;
              }
              onAddComment(lId, text, timeSec);
            }}
            onAddReply={(cId, text, isCreator) => {
              if (!currentUser && onRequireLogin) {
                onRequireLogin();
                return;
              }
              onAddReply(cId, text, isCreator);
            }}
            onVoteComment={(cId, vote) => {
              if (!currentUser && onRequireLogin) {
                onRequireLogin();
                return;
              }
              onVoteComment(cId, vote);
            }}
            onVoteReply={(cId, rId, vote) => {
              if (!currentUser && onRequireLogin) {
                onRequireLogin();
                return;
              }
              onVoteReply(cId, rId, vote);
            }}
            onDeleteComment={onDeleteComment}
            onSeekToTimestamp={handleTimestampClick}
          />
        )}

        {/* TAB 3: TIMESTAMPS / CHAPTERS */}
        {activeTab === 'chapters' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#E2E2E2] block mb-1">
              فهرس المحتوى والانتقال السريع
            </span>

            {lesson.timestamps && lesson.timestamps.length > 0 ? (
              <div className="space-y-2">
                {lesson.timestamps.map((ts) => (
                  <button
                    key={ts.id}
                    onClick={() => handleTimestampClick(ts.timeSeconds)}
                    className="w-full bg-[#12141C] hover:bg-[#1D212B] p-3 rounded-xl border border-[#242731] hover:border-[#D4AF37]/50 flex items-center justify-between gap-3 text-right transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#1D212B] group-hover:bg-[#D4AF37] group-hover:text-[#0A0B0E] px-2 py-1 rounded-md border border-[#D4AF37]/30 transition-colors">
                        {ts.timeFormatted}
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-[#D4AF37]">
                        {ts.title}
                      </span>
                    </div>

                    <span className="text-[11px] text-[#8A8D98] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>تشغيل ⏵</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-[#12141C] rounded-2xl border border-[#242731]">
                <Clock className="w-8 h-8 text-[#8A8D98] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[#8A8D98]">لا توجد فهارس زمنية مسجلة لهذا الدرس.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: USER NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <form onSubmit={handleCreateNote} className="bg-[#12141C] p-3.5 rounded-2xl border border-[#242731] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageSquarePlus className="w-4 h-4 text-[#D4AF37]" />
                  <span>تدوين ملاحظة جديدة</span>
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#8A8D98]">التوقيت الحالي:</span>
                  <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#1D212B] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                    {formatTimeSeconds(Math.floor(currentPlaybackSeconds))}
                  </span>
                </div>
              </div>

              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="اكتب ملاحظاتك الخاصة، الأفكار المهمة، أو كود للتطبيق لاحقاً..."
                rows={2}
                className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl p-2.5 text-xs text-[#E2E2E2] placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37] resize-none"
              />

              <div className="flex items-center justify-between pt-1">
                <input
                  type="text"
                  value={newNoteCustomTime}
                  onChange={(e) => setNewNoteCustomTime(e.target.value)}
                  placeholder="توقيت مخصص (مثال: 04:30)"
                  className="bg-[#0A0B0E] border border-[#242731] rounded-lg px-2.5 py-1 text-[11px] text-[#E2E2E2] placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37] w-36"
                />

                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    newNoteText.trim()
                      ? 'bg-[#D4AF37] text-[#0A0B0E] hover:bg-[#F2D06B]'
                      : 'bg-[#1D212B] text-[#6C707E] cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>حفظ الملاحظة</span>
                </button>
              </div>
            </form>

            {currentLessonNotes.length > 0 ? (
              <div className="space-y-2.5">
                {currentLessonNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-[#12141C] p-3.5 rounded-2xl border border-[#242731] flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTimestampClick(note.timeSeconds)}
                          className="font-mono text-xs font-bold text-[#D4AF37] bg-[#1D212B] hover:bg-[#D4AF37] hover:text-[#0A0B0E] px-2 py-0.5 rounded border border-[#D4AF37]/30 transition-colors"
                        >
                          {note.timeFormatted} ⏵
                        </button>
                        <span className="text-[10px] text-[#8A8D98]">
                          {new Date(note.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                      <p className="text-xs text-[#E2E2E2] leading-relaxed whitespace-pre-line">
                        {note.text}
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteUserNote(note.id)}
                      className="text-[#8A8D98] hover:text-rose-400 p-1 transition-colors"
                      title="حذف الملاحظة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-[#12141C] rounded-2xl border border-[#242731]">
                <p className="text-xs text-[#8A8D98]">لا توجد ملاحظات مسجلة لهذا الدرس بعد.</p>
                <p className="text-[11px] text-[#6C707E] mt-1">سجل ملاحظاتك الخاصة للرجوع إليها أثناء المذاكرة.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PLAYLIST */}
        {activeTab === 'playlist' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#E2E2E2]">دروس {course.title}</span>
              <span className="text-[11px] text-[#8A8D98]">{sortedLessons.length} درساً</span>
            </div>

            {sortedLessons.map((l, index) => {
              const isCurrent = l.id === lesson.id;
              return (
                <button
                  key={l.id}
                  onClick={() => onSelectLesson(l.id)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between gap-3 text-right transition-all ${
                    isCurrent
                      ? 'bg-[#1D212B] border-[#D4AF37]/80 ring-1 ring-[#D4AF37]/40 text-white'
                      : 'bg-[#12141C] border-[#242731] text-[#8A8D98] hover:bg-[#1D212B] hover:text-[#E2E2E2]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isCurrent
                          ? 'bg-[#D4AF37] text-[#0A0B0E]'
                          : 'bg-[#1D212B] text-[#8A8D98]'
                      }`}
                    >
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-[#D4AF37]' : 'text-[#E2E2E2]'}`}>
                        {l.title}
                      </h4>
                      <span className="text-[10px] text-[#8A8D98] font-mono">
                        {l.durationMinutes} دقيقة • {l.videoType === 'youtube' ? 'YouTube' : 'مرفوع'}
                      </span>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="text-[10px] font-bold text-[#D4AF37] bg-[#1D212B] px-2 py-0.5 rounded-full border border-[#D4AF37]/40">
                      قيد التشغيل ⏵
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}

        {/* TAB 6: RESOURCES / ATTACHMENTS */}
        {activeTab === 'resources' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#E2E2E2] block mb-1">
              الملفات والمراجع المرفقة مع الدرس
            </span>

            {lesson.attachments && lesson.attachments.length > 0 ? (
              <div className="space-y-2">
                {lesson.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="bg-[#12141C] p-3 rounded-xl border border-[#242731] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#1D212B] text-[#D4AF37] border border-[#242731] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#E2E2E2] truncate">{att.name}</h4>
                        {att.size && <span className="text-[10px] text-[#8A8D98] font-mono">{att.size}</span>}
                      </div>
                    </div>

                    {att.url ? (
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-bold text-[#D4AF37] bg-[#1D212B] hover:bg-[#242731] px-3 py-1.5 rounded-lg border border-[#242731] transition-colors flex-shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>فتح الرابط</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => alert(`بدء تحميل الملف: ${att.name}`)}
                        className="flex items-center gap-1 text-xs font-bold text-[#D4AF37] bg-[#1D212B] hover:bg-[#242731] px-3 py-1.5 rounded-lg border border-[#242731] transition-colors flex-shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تحميل</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-[#12141C] rounded-2xl border border-[#242731]">
                <Paperclip className="w-8 h-8 text-[#8A8D98] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[#8A8D98]">لا توجد ملفات مرفقة لهذا الدرس.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
