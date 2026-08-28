import React, { useState } from 'react';
import { X, BookPlus, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { Course, CourseLevel, AppCategory } from '../types';

interface AddCourseModalProps {
  categories: AppCategory[];
  onClose: () => void;
  onSaveCourse: (course: Course) => void;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  categories,
  onClose,
  onSaveCourse,
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>(categories[0]?.id || 'programming');
  const [level, setLevel] = useState<CourseLevel>('beginner');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [instructorName, setInstructorName] = useState<string>('م. سنان جاسم');
  const [instructorTitle, setInstructorTitle] = useState<string>('مدرب ومحاضر تقني');
  const [tagsInput, setTagsInput] = useState<string>('دروس, تعليم, يوتيوب');

  const presetThumbnails = [
    { label: 'برمجة', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80' },
    { label: 'تصميم', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80' },
    { label: 'لغات', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80' },
    { label: 'أعمال', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('يرجى كتابة اسم الدورة.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newCourse: Course = {
      id: 'course-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      category,
      level,
      thumbnailUrl: thumbnailUrl.trim() || presetThumbnails[0].url,
      instructorName: instructorName.trim() || 'المحاضر',
      instructorTitle: instructorTitle.trim(),
      createdAt: Date.now(),
      tags: tags.length > 0 ? tags : ['تعليم'],
    };

    onSaveCourse(newCourse);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#12141C] border border-[#242731] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl my-auto animate-fade-in flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#242731] flex items-center justify-between bg-[#12141C]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1D212B] text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/30">
              <BookPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white font-['Cairo',sans-serif]">إنشاء مسار / دورة تعليمية جديدة</h3>
              <p className="text-[11px] text-[#8A8D98]">تنظيم الفيديوهات والدروس في مسار متكامل</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1D212B] hover:bg-[#242731] text-[#8A8D98] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto max-h-[75vh] no-scrollbar bg-[#12141C]">
          <div>
            <label className="block text-xs font-bold text-[#E2E2E2] mb-1 font-['Cairo',sans-serif]">
              اسم الدورة أو المسار
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: دورة تعليم لغة بايثون من الصفر"
              className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#E2E2E2] mb-1">
              وصف الدورة وأهدافها
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب نبذة مختصرة عن الدورة والجمهور المستهدف..."
              rows={2}
              className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl p-2.5 text-xs text-white placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#E2E2E2] mb-1">
                التصنيف
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#E2E2E2] mb-1">
                المستوى
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as CourseLevel)}
                className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="beginner">مبتدئ</option>
                <option value="intermediate">متوسط</option>
                <option value="advanced">متقدم</option>
                <option value="all">كافة المستويات</option>
              </select>
            </div>
          </div>

          {/* Instructor Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#E2E2E2] mb-1">
                اسم المحاضر
              </label>
              <input
                type="text"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#E2E2E2] mb-1">
                الصفة / المسمى
              </label>
              <input
                type="text"
                value={instructorTitle}
                onChange={(e) => setInstructorTitle(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Thumbnail Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#E2E2E2]">
              صورة الغلاف (رابط مباشر أو اختيار صورة افتراضية)
            </label>
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37] font-mono"
            />

            <div className="grid grid-cols-4 gap-2 pt-1">
              {presetThumbnails.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setThumbnailUrl(preset.url)}
                  className="relative rounded-xl overflow-hidden aspect-video border border-[#242731] hover:border-[#D4AF37] transition-all group"
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-[#E2E2E2] mb-1">
              الكلمات الدلالية (مفصولة بفاصلة)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="React, CSS, برمجة"
              className="w-full bg-[#0A0B0E] border border-[#242731] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8A8D98] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </form>

        {/* Footer */}
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
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#F2D06B] text-[#0A0B0E] shadow-md shadow-[#D4AF37]/20 transition-all flex items-center gap-1.5 font-extrabold"
          >
            <Check className="w-4 h-4" />
            <span>حفظ الدورة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
