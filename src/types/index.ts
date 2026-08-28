export type VideoType = 'youtube' | 'uploaded' | 'direct_url';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';

export interface TimestampMark {
  id: string;
  timeSeconds: number;
  timeFormatted: string; // e.g. "02:45"
  title: string;
  description?: string;
}

export interface LessonAttachment {
  id: string;
  name: string;
  url?: string;
  size?: string;
  type: 'pdf' | 'code' | 'zip' | 'link' | 'image';
}

export interface UserNote {
  id: string;
  lessonId: string;
  timeSeconds: number;
  timeFormatted: string;
  text: string;
  createdAt: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoType: VideoType;
  videoUrl: string; // YouTube URL or Direct Video URL or Object URL key
  videoBlobId?: string; // Stored in IndexedDB for uploaded files
  videoFileName?: string;
  videoFileSize?: string;
  thumbnailUrl: string;
  durationMinutes: number;
  order: number;
  summaryNotes?: string[];
  keyPoints?: string[];
  timestamps: TimestampMark[];
  attachments: LessonAttachment[];
  isFreePreview?: boolean;
  createdAt: number;
  viewsCount: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  thumbnailUrl: string;
  bannerUrl?: string;
  instructorName: string;
  instructorTitle?: string;
  instructorAvatar?: string;
  createdAt: number;
  tags: string[];
  colorGradient?: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: number;
  lastPositionSeconds: number;
  savedOffline: boolean;
  bookmarked: boolean;
  rating?: number;
}

export interface AppCategory {
  id: string;
  name: string;
  iconName: string;
  color: string;
  description?: string;
}

export type ActiveTab = 'home' | 'courses' | 'saved' | 'studio';

export interface CommentReply {
  id: string;
  commentId: string;
  userName: string;
  userAvatar?: string;
  isCreator: boolean;
  creatorTitle?: string;
  text: string;
  createdAt: number;
  likesCount: number;
  dislikesCount: number;
  userVote?: 'like' | 'dislike';
}

export interface TutorialComment {
  id: string;
  lessonId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: number;
  timeSeconds?: number;
  timeFormatted?: string;
  likesCount: number;
  dislikesCount: number;
  userVote?: 'like' | 'dislike';
  isCreator?: boolean;
  replies: CommentReply[];
}

export interface LessonInteraction {
  lessonId: string;
  likesCount: number;
  dislikesCount: number;
  userVote?: 'like' | 'dislike';
}

export interface DownloadedMediaInfo {
  lessonId: string;
  downloadedAt: number;
  fileSizeMb: number;
  quality: string;
  offlineReady: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  lessonId?: string;
}

export interface AppUser {
  id: string;
  username: string; // اسم الحساب
  email: string; // البريد الإلكتروني
  password?: string; // كلمة المرور
  fullName?: string;
  avatar?: string;
  role?: 'student' | 'engineer' | 'instructor';
  specialty?: string;
  createdAt: number;
}
