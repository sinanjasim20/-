import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  CornerDownLeft, 
  Clock, 
  Trash2, 
  Send, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Flame, 
  ArrowUpDown,
  Pin,
  Lock,
  LogIn
} from 'lucide-react';
import { TutorialComment, CommentReply, AppUser } from '../types';
import { formatTimeSeconds } from '../utils/youtube';

interface TutorialCommentsSectionProps {
  lessonId: string;
  comments: TutorialComment[];
  currentPlaybackSeconds: number;
  instructorName: string;
  instructorAvatar?: string;
  instructorTitle?: string;
  currentUser?: AppUser | null;
  onRequireLogin?: () => void;
  onAddComment: (lessonId: string, text: string, timeSeconds?: number) => void;
  onAddReply: (commentId: string, text: string, isCreator: boolean) => void;
  onVoteComment: (commentId: string, voteType: 'like' | 'dislike') => void;
  onVoteReply: (commentId: string, replyId: string, voteType: 'like' | 'dislike') => void;
  onDeleteComment: (commentId: string) => void;
  onSeekToTimestamp?: (seconds: number) => void;
}

export const TutorialCommentsSection: React.FC<TutorialCommentsSectionProps> = ({
  lessonId,
  comments,
  currentPlaybackSeconds,
  instructorName,
  instructorAvatar,
  instructorTitle,
  currentUser,
  onRequireLogin,
  onAddComment,
  onAddReply,
  onVoteComment,
  onVoteReply,
  onDeleteComment,
  onSeekToTimestamp,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [attachTimestamp, setAttachTimestamp] = useState(false);
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyAsCreator, setReplyAsCreator] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'top_liked' | 'creator_replies'>('newest');

  const lessonComments = comments.filter((c) => c.lessonId === lessonId);

  // Sorting
  const sortedComments = [...lessonComments].sort((a, b) => {
    if (sortBy === 'top_liked') {
      return (b.likesCount - b.dislikesCount) - (a.likesCount - a.dislikesCount);
    }
    if (sortBy === 'creator_replies') {
      const aHasCreator = a.replies.some((r) => r.isCreator) ? 1 : 0;
      const bHasCreator = b.replies.some((r) => r.isCreator) ? 1 : 0;
      if (bHasCreator !== aHasCreator) return bHasCreator - aHasCreator;
      return b.createdAt - a.createdAt;
    }
    return b.createdAt - a.createdAt;
  });

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(
      lessonId,
      newCommentText.trim(),
      attachTimestamp ? Math.floor(currentPlaybackSeconds) : undefined
    );
    setNewCommentText('');
    setAttachTimestamp(false);
  };

  const handleCreateReply = (commentId: string) => {
    if (!replyText.trim()) return;
    onAddReply(commentId, replyText.trim(), replyAsCreator);
    setReplyText('');
    setReplyingCommentId(null);
    setReplyAsCreator(false);
  };

  const timeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  return (
    <div className="space-y-4">
      {/* Header & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-[#242731]">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-xs font-bold text-white font-['Cairo',sans-serif]">
            التعليقات والمناقشات ({lessonComments.length})
          </h3>
        </div>

        {/* Sort Filter */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSortBy('newest')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
              sortBy === 'newest'
                ? 'bg-[#D4AF37] text-[#0A0B0E]'
                : 'text-[#8A8D98] hover:text-[#E2E2E2] bg-[#1D212B]'
            }`}
          >
            الأحدث
          </button>
          <button
            type="button"
            onClick={() => setSortBy('top_liked')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
              sortBy === 'top_liked'
                ? 'bg-[#D4AF37] text-[#0A0B0E]'
                : 'text-[#8A8D98] hover:text-[#E2E2E2] bg-[#1D212B]'
            }`}
          >
            الأكثر تفاعلاً
          </button>
          <button
            type="button"
            onClick={() => setSortBy('creator_replies')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
              sortBy === 'creator_replies'
                ? 'bg-[#D4AF37] text-[#0A0B0E]'
                : 'text-[#8A8D98] hover:text-[#E2E2E2] bg-[#1D212B]'
            }`}
          >
            ردود المحاضر ⭐
          </button>
        </div>
      </div>

      {/* Write Comment Box */}
      {!currentUser ? (
        <div className="bg-[#12141C] p-4 rounded-2xl border border-[#242731] flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1D212B] text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">تسجيل الدخول مطلوب للمشاركة بالتعليقات</p>
              <p className="text-[10px] text-[#8A8D98]">سجل دخولك باسم المستخدم لطرح الأسئلة ومناقشة المحاضر</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRequireLogin}
            className="py-1.5 px-3 bg-[#D4AF37] hover:bg-[#F2D06B] text-[#0A0B0E] font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>تسجيل</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleCreateComment} className="bg-[#12141C] p-3.5 rounded-2xl border border-[#242731] space-y-2.5 shadow-md">
          <div className="flex items-start gap-2.5">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser.username}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#D4AF37] flex-shrink-0"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white">
                  التعليق باسم: <span className="text-[#D4AF37]">{currentUser.fullName || currentUser.username}</span>
                </span>
                <span className="text-[10px] text-[#8A8D98]">@{currentUser.username}</span>
              </div>
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="اكتب استفسارك أو رأيك في هذا الدرس للمحاضر والمجتمع..."
                rows={2}
                className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl p-2.5 text-xs text-[#E2E2E2] placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37] resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#242731]/60">
            <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#8A8D98] hover:text-[#E2E2E2] select-none">
              <input
                type="checkbox"
                checked={attachTimestamp}
                onChange={(e) => setAttachTimestamp(e.target.checked)}
                className="rounded accent-[#D4AF37] w-3.5 h-3.5 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>إرفاق التوقيت الحالي:</span>
                <span className="font-mono text-[#D4AF37] font-bold">
                  {formatTimeSeconds(Math.floor(currentPlaybackSeconds))}
                </span>
              </span>
            </label>

            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                newCommentText.trim()
                  ? 'bg-[#D4AF37] text-[#0A0B0E] hover:bg-[#F2D06B] active:scale-95'
                  : 'bg-[#1D212B] text-[#6C707E] cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>نشر التعليق</span>
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {sortedComments.length > 0 ? (
          sortedComments.map((comment) => {
            const isReplying = replyingCommentId === comment.id;
            const hasCreatorReply = comment.replies.some((r) => r.isCreator);

            return (
              <div
                key={comment.id}
                className={`bg-[#12141C] p-3.5 rounded-2xl border transition-all ${
                  hasCreatorReply
                    ? 'border-[#D4AF37]/40 ring-1 ring-[#D4AF37]/20 shadow-md'
                    : 'border-[#242731]'
                }`}
              >
                {/* Main Comment Header */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={comment.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                      alt={comment.userName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-[#242731]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-['Cairo',sans-serif]">
                          {comment.userName}
                        </span>
                        {comment.timeSeconds !== undefined && onSeekToTimestamp && (
                          <button
                            type="button"
                            onClick={() => onSeekToTimestamp(comment.timeSeconds!)}
                            className="font-mono text-[10px] font-bold text-[#D4AF37] bg-[#1D212B] px-1.5 py-0.5 rounded border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-[#0A0B0E] transition-colors"
                            title="الانتقال إلى توقيت الفيديو"
                          >
                            ⏱ {comment.timeFormatted || formatTimeSeconds(comment.timeSeconds)} ⏵
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-[#8A8D98]">{timeAgo(comment.createdAt)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteComment(comment.id)}
                    className="text-[#6C707E] hover:text-rose-400 p-1 transition-colors"
                    title="حذف التعليق"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Comment Text */}
                <p className="text-xs text-[#E2E2E2] leading-relaxed mt-2 mr-9 whitespace-pre-line">
                  {comment.text}
                </p>

                {/* Main Comment Actions (Likes, Dislikes, Reply trigger) */}
                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#242731]/60 mr-9">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onVoteComment(comment.id, 'like')}
                      className={`flex items-center gap-1 text-[11px] font-bold transition-colors ${
                        comment.userVote === 'like'
                          ? 'text-[#D4AF37]'
                          : 'text-[#8A8D98] hover:text-[#E2E2E2]'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${comment.userVote === 'like' ? 'fill-[#D4AF37]' : ''}`} />
                      <span>{comment.likesCount}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onVoteComment(comment.id, 'dislike')}
                      className={`flex items-center gap-1 text-[11px] font-bold transition-colors ${
                        comment.userVote === 'dislike'
                          ? 'text-rose-400'
                          : 'text-[#8A8D98] hover:text-[#E2E2E2]'
                      }`}
                    >
                      <ThumbsDown className={`w-3.5 h-3.5 ${comment.userVote === 'dislike' ? 'fill-rose-400' : ''}`} />
                      <span>{comment.dislikesCount > 0 ? comment.dislikesCount : ''}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setReplyingCommentId(isReplying ? null : comment.id);
                      setReplyText('');
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#D4AF37] hover:text-[#F2D06B] px-2 py-0.5 rounded-lg bg-[#1D212B] transition-colors"
                  >
                    <CornerDownLeft className="w-3 h-3" />
                    <span>رد على التعليق</span>
                  </button>
                </div>

                {/* Reply Form Box */}
                {isReplying && (
                  <div className="mt-3 mr-4 p-3 bg-[#0A0B0E] border border-[#D4AF37]/30 rounded-xl space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#E2E2E2]">إضافة رد:</span>
                      {/* Toggle Reply as Creator */}
                      <label className="flex items-center gap-1.5 cursor-pointer bg-[#1D212B] px-2 py-0.5 rounded-md border border-[#D4AF37]/40 text-[10px] text-[#D4AF37] font-bold select-none">
                        <input
                          type="checkbox"
                          checked={replyAsCreator}
                          onChange={(e) => setReplyAsCreator(e.target.checked)}
                          className="accent-[#D4AF37] w-3 h-3 cursor-pointer"
                        />
                        <span>الرد بصفتي المحاضر ({instructorName}) 🎓</span>
                      </label>
                    </div>

                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={
                        replyAsCreator
                          ? `اكتب رد المحاضر المباشر لتوجيه المتعلم...`
                          : 'اكتب ردك هنا...'
                      }
                      rows={2}
                      className="w-full bg-[#12141C] border border-[#242731] rounded-lg p-2 text-xs text-[#E2E2E2] placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37] resize-none"
                    />

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingCommentId(null);
                          setReplyText('');
                        }}
                        className="px-2.5 py-1 text-[11px] text-[#8A8D98] hover:text-[#E2E2E2] rounded-lg"
                      >
                        إلغاء
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCreateReply(comment.id)}
                        disabled={!replyText.trim()}
                        className="px-3.5 py-1 rounded-lg text-[11px] font-bold bg-[#D4AF37] text-[#0A0B0E] hover:bg-[#F2D06B] transition-all disabled:opacity-50"
                      >
                        إرسال الرد
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing Replies List */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 mr-4 space-y-2 pt-2 border-t border-[#242731]/40">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-2.5 rounded-xl border text-xs space-y-1.5 ${
                          reply.isCreator
                            ? 'bg-[#1D212B] border-[#D4AF37]/50 shadow-sm ring-1 ring-[#D4AF37]/20'
                            : 'bg-[#0A0B0E] border-[#242731]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                reply.isCreator
                                  ? (instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80')
                                  : (reply.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80')
                              }
                              alt={reply.userName}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-[#D4AF37]"
                            />
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-[11px]">
                                {reply.userName}
                              </span>
                              {reply.isCreator && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold bg-[#D4AF37] text-[#0A0B0E] px-1.5 py-0.2 rounded-md">
                                  <ShieldCheck className="w-3 h-3 fill-[#0A0B0E] text-[#D4AF37]" />
                                  <span>{reply.creatorTitle || 'المحاضر'}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="text-[9px] text-[#8A8D98]">
                            {timeAgo(reply.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs text-[#E2E2E2] leading-relaxed pr-7 whitespace-pre-line">
                          {reply.text}
                        </p>

                        <div className="flex items-center justify-start gap-3 pr-7 pt-1">
                          <button
                            type="button"
                            onClick={() => onVoteReply(comment.id, reply.id, 'like')}
                            className={`flex items-center gap-1 text-[10px] font-bold ${
                              reply.userVote === 'like' ? 'text-[#D4AF37]' : 'text-[#8A8D98] hover:text-[#E2E2E2]'
                            }`}
                          >
                            <ThumbsUp className={`w-3 h-3 ${reply.userVote === 'like' ? 'fill-[#D4AF37]' : ''}`} />
                            <span>{reply.likesCount > 0 ? reply.likesCount : ''}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onVoteReply(comment.id, reply.id, 'dislike')}
                            className={`flex items-center gap-1 text-[10px] font-bold ${
                              reply.userVote === 'dislike' ? 'text-rose-400' : 'text-[#8A8D98] hover:text-[#E2E2E2]'
                            }`}
                          >
                            <ThumbsDown className={`w-3 h-3 ${reply.userVote === 'dislike' ? 'fill-rose-400' : ''}`} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 bg-[#12141C] rounded-2xl border border-[#242731] space-y-1.5">
            <MessageSquare className="w-8 h-8 text-[#8A8D98] mx-auto opacity-40" />
            <p className="text-xs text-[#E2E2E2] font-bold">كن أول من يترك تعليقاً على هذا الدرس!</p>
            <p className="text-[11px] text-[#8A8D98]">شارك أسئلتك للمحاضر وسيتجاوب معك مباشرة.</p>
          </div>
        )}
      </div>
    </div>
  );
};
