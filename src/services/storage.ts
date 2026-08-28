import { Course, Lesson, LessonProgress, UserNote, AppCategory, AppNotification, TutorialComment, LessonInteraction, DownloadedMediaInfo, AppUser } from '../types';

const COURSES_STORAGE_KEY = 'edu_app_courses_v2';
const LESSONS_STORAGE_KEY = 'edu_app_lessons_v2';
const PROGRESS_STORAGE_KEY = 'edu_app_progress_v2';
const NOTES_STORAGE_KEY = 'edu_app_notes_v2';
const NOTIFICATIONS_STORAGE_KEY = 'edu_app_notifications_v2';
const COMMENTS_STORAGE_KEY = 'edu_app_comments_v2';
const INTERACTIONS_STORAGE_KEY = 'edu_app_interactions_v2';
const DOWNLOADS_STORAGE_KEY = 'edu_app_downloads_v2';
const USERS_STORAGE_KEY = 'edu_app_users_v2';
const CURRENT_USER_STORAGE_KEY = 'edu_app_current_user_v2';

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'user-sinan',
    username: 'sinan_eng',
    fullName: 'م. سنان جاسم',
    email: 'sinan.jasim20@gmail.com',
    password: 'password123',
    role: 'engineer',
    specialty: 'الهندسة والتقنيات الذكية',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'user-demo-student',
    username: 'student2026',
    fullName: 'أحمد التميمي',
    email: 'student@example.com',
    password: '123456',
    role: 'student',
    specialty: 'هندسة البرمجيات والذكاء الاصطناعي',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 10,
  }
];

export const INITIAL_CATEGORIES: AppCategory[] = [
  {
    id: 'programming',
    name: 'البرمجة والتطوير',
    iconName: 'Code',
    color: 'from-blue-500 to-indigo-600',
    description: 'دروس تطوير الويب، التطبيقات والذكاء الاصطناعي',
  },
  {
    id: 'cooking',
    name: 'الطبخ وفنون الطهي',
    iconName: 'UtensilsCrossed',
    color: 'from-orange-500 to-rose-600',
    description: 'أسرار المطبخ الإيطالي والشرقي والمخبوزات الاحترافية',
  },
  {
    id: 'diy',
    name: 'الأعمال اليدوية والصيانة (DIY)',
    iconName: 'Wrench',
    color: 'from-amber-500 to-yellow-600',
    description: 'إصلاح الأجهزة الإلكترونية، النجارة المنزلية والديكور',
  },
  {
    id: 'design',
    name: 'التصميم والمونتاج',
    iconName: 'Palette',
    color: 'from-fuchsia-500 to-pink-600',
    description: 'واجهات المستخدم، الجرافيك والمؤثرات البصرية',
  },
  {
    id: 'languages',
    name: 'اللغات والترجمة',
    iconName: 'Languages',
    color: 'from-emerald-500 to-teal-600',
    description: 'تعلم الإنجليزية والمحادثة والقواعد',
  },
  {
    id: 'business',
    name: 'الريادة والأعمال',
    iconName: 'Briefcase',
    color: 'from-violet-500 to-purple-600',
    description: 'إدارة المشاريع والتسويق الرقمي',
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-web-dev',
    title: 'دورة تطوير تطبيقات الويب الحديثة والذكاء الاصطناعي',
    description: 'دورة تطبيقية شاملة خطوة بخطوة من الصفر حتى الاحتراف لبناء واجهات تفاعلية ودمج نماذج الذكاء الاصطناعي في مشاريع حقيقية.',
    category: 'programming',
    level: 'intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    instructorName: 'م. أحمد الخالدي',
    instructorTitle: 'مطور برمجيات أول ومؤسس أكاديمية التقنية',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 10,
    tags: ['React', 'TypeScript', 'Tailwind', 'AI API', 'Node.js', 'برمجة'],
    colorGradient: 'from-blue-600 to-indigo-900',
  },
  {
    id: 'course-cooking-mastery',
    title: 'فنون الطهي الإيطالي وصناعة الباستا والمخبوزات المنزلية',
    description: 'تعلم أسرار المطبخ الإيطالي الأصيل، إعداد عجينة الباستا الطازجة يدوياً، وصنع الصلصات الكلاسيكية والبيتزا بطرق احترافية.',
    category: 'cooking',
    level: 'beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&auto=format&fit=crop&q=80',
    instructorName: 'الشيف ريم العلي',
    instructorTitle: 'شيف تنفيذية ومدربة فنون طهي دولية',
    instructorAvatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 15,
    tags: ['طبخ', 'باستا', 'مطبخ إيطالي', 'عجائن', 'صلصات'],
    colorGradient: 'from-orange-600 to-red-900',
  },
  {
    id: 'course-diy-repair',
    title: 'دليل الأشغال اليدوية والصيانة المنزلية الذكية (DIY)',
    description: 'تعلم تصليح الأجهزة الإلكترونية المنزلية، استخدام أدوات النجارة البسيطة، وصنع قطع ديكور وتنظيم مكتبية مبتكرة من الصفر.',
    category: 'diy',
    level: 'beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=1200&auto=format&fit=crop&q=80',
    instructorName: 'م. حسام النجار',
    instructorTitle: 'خبير صيانة ومبتكر أعمال يدوية DIY',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 18,
    tags: ['DIY', 'أعمال يدوية', 'صيانة منزلية', 'إلكترونيات', 'نجارة'],
    colorGradient: 'from-amber-600 to-yellow-900',
  },
  {
    id: 'course-ui-ux',
    title: 'أسرار تصميم واجهات وتجربة المستخدم UI/UX الاحترافية',
    description: 'تعلم مبادئ سيكولوجية المستخدم، بناء Design Systems المتناسقة، ونمذجة التطبيقات باستخدام Figma بأحدث المعايير العالمية.',
    category: 'design',
    level: 'beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&auto=format&fit=crop&q=80',
    instructorName: 'سارة المنصور',
    instructorTitle: 'كبيرة مصممي المنتجات الرقمية',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 20,
    tags: ['Figma', 'UI Design', 'تصميم', 'Wireframing', 'واجهات'],
    colorGradient: 'from-fuchsia-600 to-purple-900',
  },
  {
    id: 'course-english-pro',
    title: 'اللغة الإنجليزية لبيئة العمل والمحادثة اليومية',
    description: 'تطوير الطلاقة في التحدث، كتابة الإيميلات المهنية، واجتياز مقابلات العمل باللغة الإنجليزية بكل ثقة واحترافية.',
    category: 'languages',
    level: 'all',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80',
    instructorName: 'أ. طارق عبد الرحمن',
    instructorTitle: 'مدرب لغوي معتمد دولياً (CELTA)',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000 * 30,
    tags: ['English', 'Business', 'لغات', 'Speaking', 'إنجليزي'],
    colorGradient: 'from-emerald-600 to-teal-900',
  },
];

export const INITIAL_LESSONS: Lesson[] = [
  // Web Dev Course Lessons
  {
    id: 'lesson-web-1',
    courseId: 'course-web-dev',
    title: '1. مقدمة شاملة وإعداد بيئة التطوير الحديثة',
    description: 'في هذا الدرس التأسيسي، سنتعرف على خارطة طريق الدورة، تثبيت الأدوات اللازمة (Node.js, VS Code, Extensions) وبناء أول مشروع تفاعلي.',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 18,
    order: 1,
    viewsCount: 1420,
    createdAt: Date.now() - 86400000 * 9,
    summaryNotes: [
      'تجهيز محرّر الأكواد VS Code مع الإضافات الضرورية لسرعة الإنتاجية.',
      'فهم هيكلية ملفات المشروع وكيفية إدارة المكتبات عبر npm.',
      'أساسيات كتابة كود نظيف وقابل للتوسّع مع TypeScript.',
    ],
    keyPoints: [
      'تثبيت بيئة التشغيل Node.js وضبط المتغيرات',
      'تهيئة مشروع React باستخدام Vite لسرعة فائقة',
      'فهم منظومة Tailwind CSS وتوزيع الألوان',
    ],
    timestamps: [
      { id: 't1', timeSeconds: 0, timeFormatted: '00:00', title: 'مقدمة الترحيب والأهداف' },
      { id: 't2', timeSeconds: 150, timeFormatted: '02:30', title: 'تحميل الأدوات وتجهيز البيئة' },
      { id: 't3', timeSeconds: 480, timeFormatted: '08:00', title: 'إنشاء أول مشروع وتشغيله محلياً' },
      { id: 't4', timeSeconds: 840, timeFormatted: '14:00', title: 'نصائح مهمة وتلخيص الدرس' },
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'ملف أوامر التثبيت والإعدادات السريعة.pdf',
        size: '1.4 MB',
        type: 'pdf',
      },
      {
        id: 'att-2',
        name: 'مستودع الكود المصدري على GitHub',
        url: 'https://github.com',
        type: 'link',
      },
    ],
  },
  {
    id: 'lesson-web-2',
    courseId: 'course-web-dev',
    title: '2. بناء مكونات الواجهة والتصميم التفاعلي مع Tailwind',
    description: 'كيفية إنشاء مكونات قابلة لإعادة الاستخدام (Reusable Components)، التعامل مع الحالات (States) وتنسيق بطاقات متجاوبة مع كافة الشاشات.',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=dFgzHOX84xQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 24,
    order: 2,
    viewsCount: 980,
    createdAt: Date.now() - 86400000 * 8,
    summaryNotes: [
      'استخدام utility classes لتحقيق التوافق التام مع الشاشات الصغيرة والكبيرة.',
      'تطبيق تأثيرات الانتقال والحركة باستخدام motion/react.',
      'توزيع العناصر بمرونة عبر Flexbox و CSS Grid.',
    ],
    keyPoints: [
      'تصميم نظام البطاقات والأزرار الموحدة',
      'إدارة الحالة التفاعلية في React Hooks',
      'تطبيق مبادئ Mobile-First في التصميم',
    ],
    timestamps: [
      { id: 't2-1', timeSeconds: 0, timeFormatted: '00:00', title: 'مراجعة المفاهيم السابقة' },
      { id: 't2-2', timeSeconds: 210, timeFormatted: '03:30', title: 'بناء بطاقة الدرس المتجاوبة' },
      { id: 't2-3', timeSeconds: 660, timeFormatted: '11:00', title: 'إضافة الحركات والتأثيرات التفاعلية' },
      { id: 't2-4', timeSeconds: 1100, timeFormatted: '18:20', title: 'تجربة الشاشات والـ Breakpoints' },
    ],
    attachments: [
      {
        id: 'att-2-1',
        name: 'دليل اختصارات Tailwind CSS الشامل.pdf',
        size: '2.8 MB',
        type: 'pdf',
      },
    ],
  },
  {
    id: 'lesson-web-3',
    courseId: 'course-web-dev',
    title: '3. ربط وتكامل الذكاء الاصطناعي مع التطبيق',
    description: 'شرح طريقة استدعاء نماذج Gemini AI لتوليد ملخصات الدروس، استخراج الكلمات المفتاحية واختبارات فهم سريعة للمتعلمين.',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=jV8B24rSN5o',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 30,
    order: 3,
    viewsCount: 1680,
    createdAt: Date.now() - 86400000 * 6,
    summaryNotes: [
      'طريقة حماية مفاتيح API عبر الخادم واستخدام مكتبة @google/genai.',
      'هندسة الأوامر (Prompt Engineering) للحصول على مخرجات JSON منظمة بدقة.',
      'معالجة حالات الانتظار والأخطاء بأسلوب مرن وتفاعلي.',
    ],
    keyPoints: [
      'إنشاء endpoint لمعالجة استفسارات الذكاء الاصطناعي',
      'توليد تلخيص فوري لمحتوى الفيديو الدراسي',
      'حفظ الملاحظات في قاعدة البيانات المحلية',
    ],
    timestamps: [
      { id: 't3-1', timeSeconds: 0, timeFormatted: '00:00', title: 'نظرة عامة على نموذج الذكاء الاصطناعي' },
      { id: 't3-2', timeSeconds: 240, timeFormatted: '04:00', title: 'كتابة برومبت التلخيص التلقائي' },
      { id: 't3-3', timeSeconds: 780, timeFormatted: '13:00', title: 'ربط الواجهة الأمامية بالخادم' },
      { id: 't3-4', timeSeconds: 1400, timeFormatted: '23:20', title: 'التجربة الحية وفحص النتائج' },
    ],
    attachments: [
      {
        id: 'att-3-1',
        name: 'كود التوصيل وتوليد الملخصات.zip',
        size: '850 KB',
        type: 'zip',
      },
    ],
  },

  // Cooking Course Lessons
  {
    id: 'lesson-cook-1',
    courseId: 'course-cooking-mastery',
    title: '1. سر عجينة الباستا الطازجة يدوياً بدون آلات',
    description: 'خطوات إعداد عجينة الباستا الإيطالية الكلاسيكية باستخدام طحين السميد والبيض، وكيفية فردها وتقطيعها إلى Fettuccine مثالية في المنزل.',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=J_1s_l6zE_E',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 16,
    order: 1,
    viewsCount: 3100,
    createdAt: Date.now() - 86400000 * 14,
    summaryNotes: [
      'نسبة الطحين إلى البيض: لكل 100 جرام طحين سمولينا بيضة واحدة متوسطة.',
      'فترة راحة العجينة (Resting) لا تقل عن 30 دقيقة مغطاة بإحكام لتطوير الجلوتين.',
      'سلق الباستا الطازجة يستغرق من دقيقتين إلى 3 دقائق فقط (Al Dente).',
    ],
    keyPoints: [
      'عجن الباستا حتى تصبح ناعمة كالحرير',
      'فرد العجينة بالنشابة الخشبية لسمك 1-2 مم',
      'الحفاظ على ماء سلق الباستا الغني بالنشا لربط الصلصة',
    ],
    timestamps: [
      { id: 'ck-1', timeSeconds: 0, timeFormatted: '00:00', title: 'المقادير ونوع الطحين المثالي' },
      { id: 'ck-2', timeSeconds: 180, timeFormatted: '03:00', title: 'طريقة العجن الصحيحة باليد' },
      { id: 'ck-3', timeSeconds: 480, timeFormatted: '08:00', title: 'فرد العجينة وتقطيع الفيتوتشيني' },
      { id: 'ck-4', timeSeconds: 780, timeFormatted: '13:00', title: 'السلق والتذوق النهائي' },
    ],
    attachments: [
      {
        id: 'att-ck-1',
        name: 'بطاقة مقادير الباستا والصلصات الإيطالية.pdf',
        size: '1.2 MB',
        type: 'pdf',
      },
    ],
  },
  {
    id: 'lesson-cook-2',
    courseId: 'course-cooking-mastery',
    title: '2. صلصة الطماطم الإيطالية التقليدية وقوارب الريحان',
    description: 'كيفية صنع صلصة المارينارا الأصلية بدون سكر مضاف، واستخراج الحلاوة الطبيعية من طماطم سان مارزانو مع زيت الزيتون البكر.',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=4uT_1yFk3mE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 14,
    order: 2,
    viewsCount: 2150,
    createdAt: Date.now() - 86400000 * 12,
    summaryNotes: [
      'قلي الثوم على نار هادئة جداً لتفادي المرارة.',
      'إضافة الريحان الطازج في آخر دقيقة للحفاظ على الزيوت العطرية.',
    ],
    keyPoints: [
      'اختيار الطماطم المقشرة المعلبة بجودة عالية',
      'تعديل حموضة الصلصة بزيت الزيتون والملح الخشن',
    ],
    timestamps: [
      { id: 'ck2-1', timeSeconds: 0, timeFormatted: '00:00', title: 'مقدمة الصلصات الإيطالية' },
      { id: 'ck2-2', timeSeconds: 150, timeFormatted: '02:30', title: 'تحمير الثوم والأعشاب العطرية' },
      { id: 'ck2-3', timeSeconds: 520, timeFormatted: '08:40', title: 'الطهي البطيء ودمج النكهات' },
    ],
    attachments: [],
  },

  // DIY Lessons
  {
    id: 'lesson-diy-1',
    courseId: 'course-diy-repair',
    title: '1. تبديل شاشة وبطارية الهاتف الذكي بنفسك في المنزل',
    description: 'شرح مفصل لطريقة فك الهاتف بأمان، استخدام مسدس الهواء الساخن، وإعادة تركيب الشاشة الجديدة دون إتلاف الأسلاك الدقيقة.',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=0j3B0y4kG_w',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 22,
    order: 1,
    viewsCount: 4200,
    createdAt: Date.now() - 86400000 * 17,
    summaryNotes: [
      'فصل موصل البطارية دائماً قبل البدء بأي فك للأجزاء الأخرى.',
      'ترتيب المسامير على ورقة ممغنطة لتجنب ثقب اللوحة الأم بالخطأ.',
    ],
    keyPoints: [
      'أدوات الفك الأساسية (Prying tools, Suction cup)',
      'تسخين الحواف بدرجة حرارة 80 مئوية فقط لتليين الغراء',
      'فحص حساسية اللمس قبل التثبيت النهائي',
    ],
    timestamps: [
      { id: 'diy-1', timeSeconds: 0, timeFormatted: '00:00', title: 'تجهيز الأدوات ومساحة العمل' },
      { id: 'diy-2', timeSeconds: 200, timeFormatted: '03:20', title: 'فك الشاشة القديمة بحذر' },
      { id: 'diy-3', timeSeconds: 700, timeFormatted: '11:40', title: 'تنظيف الحواف وتطبيق المادة اللاصقة' },
      { id: 'diy-4', timeSeconds: 1080, timeFormatted: '18:00', title: 'التجميع والاختبار النهائي' },
    ],
    attachments: [
      {
        id: 'att-diy-1',
        name: 'قائمة أدوات الصيانة ودرجات الحرارة الموصى بها.pdf',
        size: '1.8 MB',
        type: 'pdf',
      },
    ],
  },
  {
    id: 'lesson-diy-2',
    courseId: 'course-diy-repair',
    title: '2. صناعة منظم مكتب خشبي فاخر بأبسط الأدوات اليدوية',
    description: 'مشروع DIY عملي لصنع حامل هاتف وأقلام خشبي أنيق مع شاحن لاسلكي مدمج بتكلفة بسيطة جداً ولمسة احترافية.',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=Gk7f1c1YF5E',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 19,
    order: 2,
    viewsCount: 1850,
    createdAt: Date.now() - 86400000 * 16,
    summaryNotes: [
      'صنفرة الخشب بتدرج حبيبات 120 ثم 240 ثم 400 للحصول على ملمس فائق النعومة.',
      'دهن الخشب بزيت بذر الكتان الطبيعي لحماية الخشب وإبراز عروقه الجميلة.',
    ],
    keyPoints: [
      'أخذ القياسات ورسم المخطط على الخشب',
      'القص اليدوي بالمنشار الدقيق',
      'تثبيت ملف الشاحن اللاسلكي من الخلف',
    ],
    timestamps: [
      { id: 'diy2-1', timeSeconds: 0, timeFormatted: '00:00', title: 'المخطط الهندسي واختيار نوع الخشب' },
      { id: 'diy2-2', timeSeconds: 240, timeFormatted: '04:00', title: 'القص والتشكيل الأولي' },
      { id: 'diy2-3', timeSeconds: 650, timeFormatted: '10:50', title: 'حفر مجرى الأسلاك والصنفرة' },
    ],
    attachments: [],
  },

  // Design Course Lessons
  {
    id: 'lesson-design-1',
    courseId: 'course-ui-ux',
    title: '1. أسس ومبادئ تصميم واجهات الهاتف الذكي (Mobile UI)',
    description: 'كيف تصمم تجربة مستخدم مريحة للإبهام، قواعد الهرمية البصرية، واختيار الخطوط والألوان المناسبة للتطبيقات التعليمية.',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 20,
    order: 1,
    viewsCount: 890,
    createdAt: Date.now() - 86400000 * 18,
    summaryNotes: [
      'منطقة الإبهام (Thumb Zone) وكيفية ترتيب العناصر الأساسية في شريط التنقل السفلي.',
      'نسب التباين والخطوط العربية في شاشات AMOLED.',
    ],
    keyPoints: [
      'توزيع المساحات السلبية (Negative Space)',
      'اختيار مقياس الخطوط المتوازن (Type Scales)',
      'تصميم الوضعين الفاتح والداكن بانسيابية',
    ],
    timestamps: [
      { id: 'td1', timeSeconds: 0, timeFormatted: '00:00', title: 'مقدمة في تصميم الموبايل' },
      { id: 'td2', timeSeconds: 300, timeFormatted: '05:00', title: 'الهندسة البصرية ومسافات التباعد' },
      { id: 'td3', timeSeconds: 800, timeFormatted: '13:20', title: 'تطبيق عملي في فيغما' },
    ],
    attachments: [
      {
        id: 'att-d-1',
        name: 'قالب فيغما المفتوح لتطبيق الأندرويد.fig',
        size: '4.2 MB',
        type: 'code',
      },
    ],
  },

  // Languages Course Lessons
  {
    id: 'lesson-eng-1',
    courseId: 'course-english-pro',
    title: '1. أسرار التحدث بطلاقة وتجاوز التردد في الاجتماعات',
    description: 'تقنيات عملية وتمارين صوتية لكسر حاجز الخوف، وتراكيب لغوية جاهزة للاستخدام الفوري في الحوارات اليومية.',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=Fj-yRj8xP_s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 15,
    order: 1,
    viewsCount: 2310,
    createdAt: Date.now() - 86400000 * 25,
    summaryNotes: [
      'التركيز على إيصال الفكرة بدلاً من القلق بشأن القواعد المعقدة.',
      'استخدام عبارات التمهيد الاحترافية (Fillers & Linking Phrases).',
    ],
    keyPoints: [
      'تمارين الظل الصوتي (Shadowing Technique)',
      'أهم 50 تعبير في بيئة العمل الرقمية',
      'كيف تسأل وتجيب بأسلوب مؤدب واحترافي',
    ],
    timestamps: [
      { id: 'te1', timeSeconds: 0, timeFormatted: '00:00', title: 'لماذا نتردد أثناء التحدث؟' },
      { id: 'te2', timeSeconds: 180, timeFormatted: '03:00', title: 'أهم 10 تراكيب تبدأ بها كلامك' },
      { id: 'te3', timeSeconds: 540, timeFormatted: '09:00', title: 'تطبيق حواري مع الترجمة' },
    ],
    attachments: [
      {
        id: 'att-e-1',
        name: 'كتيب العبارات الإنجليزية الأكثر استخداماً.pdf',
        size: '1.1 MB',
        type: 'pdf',
      },
    ],
  },
];

export const INITIAL_INTERACTIONS: Record<string, LessonInteraction> = {
  'lesson-web-1': {
    lessonId: 'lesson-web-1',
    likesCount: 142,
    dislikesCount: 3,
    userVote: 'like',
  },
  'lesson-web-2': {
    lessonId: 'lesson-web-2',
    likesCount: 95,
    dislikesCount: 1,
  },
  'lesson-cook-1': {
    lessonId: 'lesson-cook-1',
    likesCount: 320,
    dislikesCount: 4,
    userVote: 'like',
  },
  'lesson-diy-1': {
    lessonId: 'lesson-diy-1',
    likesCount: 410,
    dislikesCount: 8,
  },
  'lesson-design-1': {
    lessonId: 'lesson-design-1',
    likesCount: 88,
    dislikesCount: 2,
  },
  'lesson-eng-1': {
    lessonId: 'lesson-eng-1',
    likesCount: 215,
    dislikesCount: 5,
  },
};

export const INITIAL_COMMENTS: TutorialComment[] = [
  // Comments on Web Dev 1
  {
    id: 'comm-web-1',
    lessonId: 'lesson-web-1',
    userName: 'خالد السعدي',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    text: 'درس رائع ومبسط جداً! هل تنصح باستخدام pnpm بدلاً من npm العادي لتسريع تنزيل الحزم في المشاريع الكبيرة؟',
    timeSeconds: 480,
    timeFormatted: '08:00',
    createdAt: Date.now() - 86400000 * 3,
    likesCount: 18,
    dislikesCount: 0,
    userVote: 'like',
    replies: [
      {
        id: 'reply-web-1',
        commentId: 'comm-web-1',
        userName: 'م. أحمد الخالدي',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        isCreator: true,
        creatorTitle: 'مقدم الدورة',
        text: 'أهلاً بك يا خالد! نعم بالتأكيد، pnpm يوفر مساحة كبيرة ويسرع التثبيت بفضل نظام الـ Symlinks. يمكنك اعتماده بدون أي مشكلة.',
        createdAt: Date.now() - 86400000 * 2,
        likesCount: 12,
        dislikesCount: 0,
      },
    ],
  },
  {
    id: 'comm-web-2',
    lessonId: 'lesson-web-1',
    userName: 'نورة التميمي',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    text: 'شرح احترافي وواضح، طبقت الخطوات واشتغل السيرفر فوراً على بورت 3000!',
    createdAt: Date.now() - 86400000 * 1,
    likesCount: 9,
    dislikesCount: 0,
    replies: [],
  },

  // Comments on Cooking 1
  {
    id: 'comm-cook-1',
    lessonId: 'lesson-cook-1',
    userName: 'مريم الصالح',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    text: 'جربت الوصفة اليوم والباستا طلعت ألذ بمليون مرة من الجاهزة! هل يمكن استبدال طحين السمولينا بطحين القمح العادي؟',
    timeSeconds: 180,
    timeFormatted: '03:00',
    createdAt: Date.now() - 86400000 * 5,
    likesCount: 24,
    dislikesCount: 1,
    replies: [
      {
        id: 'reply-cook-1',
        commentId: 'comm-cook-1',
        userName: 'الشيف ريم العلي',
        userAvatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&auto=format&fit=crop&q=80',
        isCreator: true,
        creatorTitle: 'صاحبة القناة والشيف',
        text: 'صحة وألف عافية يا مريم! يمكن استخدام طحين القمح (All Purpose) لكن يفضل خلطه بنسبة 50% مع السميد حتى تظل متماسكة ولها قوام إيطالي حقيقي (Al Dente).',
        createdAt: Date.now() - 86400000 * 4,
        likesCount: 19,
        dislikesCount: 0,
      },
    ],
  },

  // Comments on DIY 1
  {
    id: 'comm-diy-1',
    lessonId: 'lesson-diy-1',
    userName: 'فهد المطيري',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    text: 'أهم نصيحة هي فصل البطارية أول شيء، وفرت عليّ تكلفة الصيانة بمحلات الجوالات! شكراً مهندس حسام.',
    timeSeconds: 200,
    timeFormatted: '03:20',
    createdAt: Date.now() - 86400000 * 6,
    likesCount: 31,
    dislikesCount: 0,
    replies: [
      {
        id: 'reply-diy-1',
        commentId: 'comm-diy-1',
        userName: 'م. حسام النجار',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        isCreator: true,
        creatorTitle: 'صاحب الدرس والخبير',
        text: 'العفو يا فهد! فخور جداً بتطبيقك الناجح، هذا الهدف الحقيقي من ثقافة اصنعها بنفسك DIY.',
        createdAt: Date.now() - 86400000 * 5,
        likesCount: 15,
        dislikesCount: 0,
      },
    ],
  },
];

export const INITIAL_DOWNLOADS: Record<string, DownloadedMediaInfo> = {
  'lesson-web-1': {
    lessonId: 'lesson-web-1',
    downloadedAt: Date.now() - 86400000 * 2,
    fileSizeMb: 48.5,
    quality: '1080p HD',
    offlineReady: true,
  },
  'lesson-cook-1': {
    lessonId: 'lesson-cook-1',
    downloadedAt: Date.now() - 86400000 * 1,
    fileSizeMb: 42.1,
    quality: '1080p HD',
    offlineReady: true,
  },
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'رد من المحاضر على تعليقك 💬',
    message: 'قام م. أحمد الخالدي بالرد على سؤالك بخصوص حزم pnpm في دورة تطوير الويب.',
    time: 'منذ ساعتين',
    read: false,
    lessonId: 'lesson-web-1',
  },
  {
    id: 'notif-2',
    title: 'اكتمل التنزيل بدون اتصال 📥',
    message: 'تم تنزيل درس "سر عجينة الباستا الطازجة" بنجاح، يمكنك مشاهدته الآن بدون إنترنت.',
    time: 'منذ 5 ساعات',
    read: false,
    lessonId: 'lesson-cook-1',
  },
  {
    id: 'notif-3',
    title: 'درس جديد في الطبخ والـ DIY 🌟',
    message: 'تمت إضافة دروس جديدة في صناعة الباستا وتصليح الإلكترونيات المنزلية.',
    time: 'أمس',
    read: true,
  },
];

export class AppStorageService {
  static getCourses(): Course[] {
    try {
      const data = localStorage.getItem(COURSES_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      this.saveCourses(INITIAL_COURSES);
      return INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  }

  static saveCourses(courses: Course[]): void {
    try {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
    } catch (e) {
      console.error('Failed to save courses:', e);
    }
  }

  static getLessons(): Lesson[] {
    try {
      const data = localStorage.getItem(LESSONS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      this.saveLessons(INITIAL_LESSONS);
      return INITIAL_LESSONS;
    } catch {
      return INITIAL_LESSONS;
    }
  }

  static saveLessons(lessons: Lesson[]): void {
    try {
      localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(lessons));
    } catch (e) {
      console.error('Failed to save lessons:', e);
    }
  }

  static getProgress(): Record<string, LessonProgress> {
    try {
      const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (data) return JSON.parse(data);
      
      const defaultProgress: Record<string, LessonProgress> = {
        'lesson-web-1': {
          lessonId: 'lesson-web-1',
          completed: true,
          lastPositionSeconds: 840,
          savedOffline: true,
          bookmarked: true,
        },
        'lesson-cook-1': {
          lessonId: 'lesson-cook-1',
          completed: false,
          lastPositionSeconds: 320,
          savedOffline: true,
          bookmarked: true,
        },
      };
      this.saveProgress(defaultProgress);
      return defaultProgress;
    } catch {
      return {};
    }
  }

  static saveProgress(progress: Record<string, LessonProgress>): void {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }

  static getNotes(): UserNote[] {
    try {
      const data = localStorage.getItem(NOTES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveNotes(notes: UserNote[]): void {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes:', e);
    }
  }

  static getComments(): TutorialComment[] {
    try {
      const data = localStorage.getItem(COMMENTS_STORAGE_KEY);
      if (data) return JSON.parse(data);
      this.saveComments(INITIAL_COMMENTS);
      return INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  }

  static saveComments(comments: TutorialComment[]): void {
    try {
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
    } catch (e) {
      console.error('Failed to save comments:', e);
    }
  }

  static getInteractions(): Record<string, LessonInteraction> {
    try {
      const data = localStorage.getItem(INTERACTIONS_STORAGE_KEY);
      if (data) return JSON.parse(data);
      this.saveInteractions(INITIAL_INTERACTIONS);
      return INITIAL_INTERACTIONS;
    } catch {
      return INITIAL_INTERACTIONS;
    }
  }

  static saveInteractions(interactions: Record<string, LessonInteraction>): void {
    try {
      localStorage.setItem(INTERACTIONS_STORAGE_KEY, JSON.stringify(interactions));
    } catch (e) {
      console.error('Failed to save interactions:', e);
    }
  }

  static getDownloads(): Record<string, DownloadedMediaInfo> {
    try {
      const data = localStorage.getItem(DOWNLOADS_STORAGE_KEY);
      if (data) return JSON.parse(data);
      this.saveDownloads(INITIAL_DOWNLOADS);
      return INITIAL_DOWNLOADS;
    } catch {
      return INITIAL_DOWNLOADS;
    }
  }

  static saveDownloads(downloads: Record<string, DownloadedMediaInfo>): void {
    try {
      localStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(downloads));
    } catch (e) {
      console.error('Failed to save downloads:', e);
    }
  }

  static getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  static saveNotifications(notifications: AppNotification[]): void {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications:', e);
    }
  }

  static getUsers(): AppUser[] {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (data) return JSON.parse(data);
      this.saveUsers(INITIAL_USERS);
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  static saveUsers(users: AppUser[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users:', e);
    }
  }

  static getCurrentUser(): AppUser | null {
    try {
      const data = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static saveCurrentUser(user: AppUser | null): void {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save current user:', e);
    }
  }

  static resetToDefault(): void {
    localStorage.removeItem(COURSES_STORAGE_KEY);
    localStorage.removeItem(LESSONS_STORAGE_KEY);
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    localStorage.removeItem(NOTES_STORAGE_KEY);
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    localStorage.removeItem(COMMENTS_STORAGE_KEY);
    localStorage.removeItem(INTERACTIONS_STORAGE_KEY);
    localStorage.removeItem(DOWNLOADS_STORAGE_KEY);
    localStorage.removeItem(USERS_STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }
}
