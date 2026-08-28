import React, { useState } from 'react';
import { 
  X, 
  Youtube, 
  UploadCloud, 
  Clock, 
  Plus, 
  Trash2, 
  FileText, 
  Sparkles, 
  Check, 
  Film, 
  BookOpen, 
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import { Course, Lesson, TimestampMark, LessonAttachment, VideoType } from '../types';
import { extractYouTubeId, getYouTubeThumbnail, parseFormattedTimeToSeconds, formatTimeSeconds } from '../utils/youtube';
import { saveVideoFileToDB } from '../services/indexedDb';

interface AddLessonModalProps {
  courses: Course[];
  initialCourseId?: string;
  onClose: () => void;
  onSaveLesson: (lesson: Lesson) => void;
}

export const AddLessonModal: React.FC<AddLessonModalProps> = ({
  courses,
  initialCourseId,
  onClose,
  onSaveLesson,
}) => {
  const [videoType, setVideoType] = useState<VideoType>('youtube');
  const [courseId, setCourseId] = useState<string>(initialCourseId || (courses[0]?.id || ''));
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [order, setOrder] = useState<number>(1);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  
  // Local file upload states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);

  // Key takeaways & summary
  const [keyPointsInput, setKeyPointsInput] = useState<string>('');
  const [summaryInput, setSummaryInput] = useState<string>('');

  // Timestamps
  const [timestamps, setTimestamps] = useState<TimestampMark[]>([
    { id: 'ts-init-1', timeSeconds: 0, timeFormatted: '00:00', title: 'مقدمة الدرس' },
  ]);
  const [newTsTime, setNewTsTime] = useState<string>('');
  const [newTsTitle, setNewTsTitle] = useState<string>('');

  // Attachments
  const [attachments, setAttachments] = useState<LessonAttachment[]>([]);
  const [newAttName, setNewAttName] = useState<string>('');
  const [newAttUrl, setNewAttUrl] = useState<string>('');

  // Auto-detect YouTube thumbnail when URL changes
  const detectedYouTubeId = extractYouTubeId(youtubeUrl);
  const detectedThumb = detectedYouTubeId ? getYouTubeThumbnail(youtubeUrl, 'hq') : null;

  const handleAddTimestamp = () => {
    if (!newTsTitle.trim()) return;
    const timeFormatted = newTsTime.trim() || '00:00';
    const timeSeconds = parseFormattedTimeToSeconds(timeFormatted);

    const newMark: TimestampMark = {
      id: 'ts-' + Date.now(),
      timeSeconds,
      timeFormatted,
      title: newTsTitle.trim(),
    };

    setTimestamps([...timestamps, newMark].sort((a, b) => a.timeSeconds - b.timeSeconds));
    setNewTsTitle('');
    setNewTsTime('');
  };

  const handleRemoveTimestamp = (id: string) => {
    setTimestamps(timestamps.filter((t) => t.id !== id));
  };

  const handleAddAttachment = () => {
    if (!newAttName.trim()) return;
    const newAtt: LessonAttachment = {
      id: 'att-' + Date.now(),
      name: newAttName.trim(),
      url: newAttUrl.trim() || undefined,
      type: newAttUrl.trim() ? 'link' : 'pdf',
      size: '1.5 MB',
    };
    setAttachments([...attachments, newAtt]);
    setNewAttName('');
    setNewAttUrl('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId) {
      alert('يرجى كتابة عنوان الدرس وتحديد الدورة التابع لها.');
      return;
    }

    let finalVideoUrl = youtubeUrl;
    let videoBlobId: string | undefined = undefined;
    let finalThumbnail = thumbnailUrl || detectedThumb || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';

    if (videoType === 'uploaded') {
      if (!uploadedFile) {
        alert('يرجى اختيار ملف فيديو لرفعه.');
        return;
      }
      setUploadProgress(true);
      const generatedId = 'vid-blob-' + Date.now();
      try {
        await saveVideoFileToDB(generatedId, uploadedFile, uploadedFile.name);
        videoBlobId = generatedId;
        finalVideoUrl = '';
      } catch (err) {
        console.error('Failed to store video in IndexedDB', err);
      }
      setUploadProgress(false);
    }

    const keyPoints = keyPointsInput
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const summaryNotes = summaryInput
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newLesson: Lesson = {
      id: 'lesson-' + Date.now(),
      courseId,
      title: title.trim(),
      description: description.trim(),
      videoType,
      videoUrl: finalVideoUrl,
      videoBlobId,
      videoFileName: uploadedFile?.name,
      videoFileSize: uploadedFile ? `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB` : undefined,
      thumbnailUrl: finalThumbnail,
      durationMinutes: Number(durationMinutes) || 10,
      order: Number(order) || 1,
      keyPoints: keyPoints.length > 0 ? keyPoints : undefined,
      summaryNotes: summaryNotes.length > 0 ? summaryNotes : undefined,
      timestamps,
      attachments,
      createdAt: Date.now(),
      viewsCount: 0,
    };

    onSaveLesson(newLesson);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#12141C] border border-[#242731] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-auto animate-fade-in flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#242731] flex items-center justify-between bg-[#12141C] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1D212B] text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/30">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white font-['Cairo',sans-serif]">نشر درس أو فيديو تعليمي جديد</h3>
              <p className="text-[11px] text-[#8A8D98]">إضافة المحتوى من اليوتيوب أو الرفع المباشر</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1D212B] hover:bg-[#242731] text-[#8A8D98] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 no-scrollbar bg-[#12141C]">
          {/* Source Selector: YouTube vs Direct File Upload */}
          <div>
            <label className="block text-xs font-bold text-[#E2E2E2] mb-1.5 font-['Cairo',sans-serif]">
              مصدر الفيديو
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVideoType('youtube')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  videoType === 'youtube'
                    ? 'bg-rose-950/40 border-rose-500/80 text-rose-300 ring-1 ring-rose-500/40'
                    : 'bg-[#0A0B0E] border-[#242731] text-[#8A8D98] hover:bg-[#1D212B]'
                }`}
              >
                <Youtube className="w-4 h-4 text-rose-500" />
                <span>رابط من اليوتيوب</span>
              </button>

              <button
                type="button"
                onClick={() => setVideoType('uploaded')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  videoType === 'uploaded'
                    ? 'bg-[#1D212B] border-[#D4AF37] text-[#D4AF37] ring-1 ring-[#D4AF37]/40'
                    : 'bg-[#0A0B0E] border-[#242731] text-[#8A8D98] hover:bg-[#1D212B]'
                }`}
              >
                <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
                <span>رفع فيديو من الجهاز</span>
              </button>
            </div>
          </div>

          {/* YouTube Link Field */}
          {videoType === 'youtube' && (
            <div className="space-y-2 bg-[#0A0B0E] p-3 rounded-2xl border border-[#242731]">
              <label className="block text-xs font-bold text-[#E2E2E2]">
                رابط الفيديو على اليوتيوب (URL أو المعرّف)
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-[#12141C] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37] font-mono"
              />

              {detectedThumb && (
                <div className="mt-2 flex items-center gap-3 bg-[#12141C] p-2 rounded-xl border border-[#242731]">
                  <img
                    src={detectedThumb}
                    alt="معاينة مصغرة"
                    className="w-20 h-12 object-cover rounded-lg border border-[#242731]"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم التعرف على الفيديو بنجاح!</span>
                    </span>
                    <p className="text-[10px] text-[#8A8D98] font-mono truncate">معرف: {detectedYouTubeId}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Direct File Upload Field */}
          {videoType === 'uploaded' && (
            <div className="space-y-2 bg-[#0A0B0E] p-3 rounded-2xl border border-[#242731]">
              <label className="block text-xs font-bold text-[#E2E2E2]">
                اختر ملف الفيديو (MP4, WebM, MOV)
              </label>
              <label className="border-2 border-dashed border-[#242731] hover:border-[#D4AF37] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-[#12141C]">
                <UploadCloud className="w-8 h-8 text-[#D4AF37] mb-1" />
                <span className="text-xs font-bold text-[#E2E2E2]">
                  {uploadedFile ? uploadedFile.name : 'انقر لاختيار فيديو من جهازك'}
                </span>
                <span className="text-[10px] text-[#8A8D98] mt-0.5">
                  {uploadedFile
                    ? `الحجم: ${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB`
                    : 'يتم حفظ الفيديو بأمان في قاعدة البيانات المحلية للمشاهدة بدون إنترنت'}
                </span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Course Selection & Order */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#E2E2E2] mb-1">
                الدورة التعليمية
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#E2E2E2] mb-1">
                  المدة (دقائق)
                </label>
                <input
                  type="number"
                  min={1}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] text-center font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#E2E2E2] mb-1">
                  ترتيب الدرس
                </label>
                <input
                  type="number"
                  min={1}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] text-center font-mono"
                />
              </div>
            </div>
          </div>

          {/* Lesson Title */}
          <div>
            <label className="block text-xs font-bold text-[#E2E2E2] mb-1">
              عنوان الدرس التعليمي
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: 1. أساسيات وتطبيق عملي..."
              className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#E2E2E2] mb-1">
              شرح وتفاصيل الدرس
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب نبذة واضحة عن محتوى الدرس..."
              rows={3}
              className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl p-2.5 text-xs text-white placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Timestamps Creator (Chapters) */}
          <div className="bg-[#0A0B0E] p-3 rounded-2xl border border-[#242731] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#E2E2E2] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>فهرس ومحطات الفيديو (Timestamps)</span>
              </label>
              <span className="text-[10px] text-[#8A8D98]">تمكين القفز المباشر</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="02:30"
                value={newTsTime}
                onChange={(e) => setNewTsTime(e.target.value)}
                className="w-20 bg-[#12141C] border border-[#242731] rounded-xl px-2 py-1.5 text-xs text-center font-mono text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]"
                title="التوقيت دقيقة:ثانية"
              />
              <input
                type="text"
                placeholder="عنوان المحطة (مثال: الشرح العملي)"
                value={newTsTitle}
                onChange={(e) => setNewTsTitle(e.target.value)}
                className="flex-1 bg-[#12141C] border border-[#242731] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="button"
                onClick={handleAddTimestamp}
                className="p-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#F2D06B] text-[#0A0B0E] transition-colors"
                title="إضافة محطة"
              >
                <Plus className="w-4 h-4 font-bold" />
              </button>
            </div>

            {/* List of Timestamps */}
            {timestamps.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {timestamps.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between bg-[#12141C] px-2.5 py-1.5 rounded-lg border border-[#242731] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#D4AF37] font-bold text-[11px] bg-[#1D212B] px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
                        {t.timeFormatted}
                      </span>
                      <span className="text-[#E2E2E2]">{t.title}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTimestamp(t.id)}
                      className="text-[#8A8D98] hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Key Points Takeaways */}
          <div>
            <label className="block text-xs font-bold text-[#E2E2E2] mb-1">
              النقاط المستفادة (كل نقطة في سطر جديد)
            </label>
            <textarea
              value={keyPointsInput}
              onChange={(e) => setKeyPointsInput(e.target.value)}
              placeholder="النقطة الأولى&#10;النقطة الثانية&#10;النقطة الثالثة"
              rows={2}
              className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl p-2.5 text-xs text-white placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Attachments Section */}
          <div className="bg-[#0A0B0E] p-3 rounded-2xl border border-[#242731] space-y-2">
            <label className="text-xs font-bold text-[#E2E2E2] flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>إرفاق ملفات أو روابط إضافية</span>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="اسم الملف (مثال: ملخص الدرس.pdf)"
                value={newAttName}
                onChange={(e) => setNewAttName(e.target.value)}
                className="flex-1 bg-[#12141C] border border-[#242731] rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37]"
              />
              <input
                type="text"
                placeholder="رابط خارجي (اختياري)"
                value={newAttUrl}
                onChange={(e) => setNewAttUrl(e.target.value)}
                className="w-32 bg-[#12141C] border border-[#242731] rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37] font-mono"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="p-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#F2D06B] text-[#0A0B0E] transition-colors"
              >
                <Plus className="w-4 h-4 font-bold" />
              </button>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between bg-[#12141C] px-2.5 py-1.5 rounded-lg border border-[#242731] text-xs"
                  >
                    <span className="text-[#E2E2E2] truncate">{att.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachments(attachments.filter((a) => a.id !== att.id))}
                      className="text-[#8A8D98] hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-[#242731] bg-[#12141C] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#8A8D98] hover:text-white bg-[#1D212B] hover:bg-[#242731] transition-colors"
          >
            إلغاء
          </button>

          <button
            onClick={handleSubmit}
            disabled={uploadProgress}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#F2D06B] text-[#0A0B0E] shadow-md shadow-[#D4AF37]/20 transition-all flex items-center gap-1.5 font-extrabold"
          >
            {uploadProgress ? (
              <>
                <span className="w-3 h-3 border-2 border-[#0A0B0E] border-t-transparent rounded-full animate-spin" />
                <span>جارٍ حفظ الفيديو...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>نشر الدرس الآن</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
