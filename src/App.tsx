/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Course, 
  Lesson, 
  LessonProgress, 
  UserNote, 
  ActiveTab, 
  AppNotification,
  TutorialComment,
  LessonInteraction,
  DownloadedMediaInfo,
  AppUser
} from './types';
import { 
  AppStorageService, 
  INITIAL_CATEGORIES 
} from './services/storage';
import { AndroidFrame } from './components/AndroidFrame';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidTopBar } from './components/AndroidTopBar';
import { AndroidNavBar } from './components/AndroidNavBar';
import { HomeView } from './components/HomeView';
import { CoursesView } from './components/CoursesView';
import { SavedView } from './components/SavedView';
import { PublisherStudio } from './components/PublisherStudio';
import { LessonDetailView } from './components/LessonDetailView';
import { AddLessonModal } from './components/AddLessonModal';
import { AddCourseModal } from './components/AddCourseModal';
import { SearchModal } from './components/SearchModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { formatTimeSeconds } from './utils/youtube';

export default function App() {
  // Core Data States
  const [courses, setCourses] = useState<Course[]>(() => AppStorageService.getCourses());
  const [lessons, setLessons] = useState<Lesson[]>(() => AppStorageService.getLessons());
  const [progress, setProgress] = useState<Record<string, LessonProgress>>(() => AppStorageService.getProgress());
  const [userNotes, setUserNotes] = useState<UserNote[]>(() => AppStorageService.getNotes());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => AppStorageService.getNotifications());
  const [comments, setComments] = useState<TutorialComment[]>(() => AppStorageService.getComments());
  const [interactions, setInteractions] = useState<Record<string, LessonInteraction>>(() => AppStorageService.getInteractions());
  const [downloads, setDownloads] = useState<Record<string, DownloadedMediaInfo>>(() => AppStorageService.getDownloads());

  // User & Authentication States
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => AppStorageService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalReason, setAuthModalReason] = useState<string>('لمشاهدة محتوى الدروس والفيديوهات، يرجى تسجيل الدخول أو إنشاء حساب جديد.');
  const [isUserProfileOpen, setIsUserProfileOpen] = useState<boolean>(false);
  const [pendingLessonIdToPlay, setPendingLessonIdToPlay] = useState<string | null>(null);

  // Navigation & View States
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);

  // Modals & Drawers
  const [isAddLessonOpen, setIsAddLessonOpen] = useState<boolean>(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [initialCourseForLesson, setInitialCourseForLesson] = useState<string | undefined>(undefined);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Persist changes to LocalStorage
  useEffect(() => {
    AppStorageService.saveCourses(courses);
  }, [courses]);

  useEffect(() => {
    AppStorageService.saveLessons(lessons);
  }, [lessons]);

  useEffect(() => {
    AppStorageService.saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    AppStorageService.saveNotes(userNotes);
  }, [userNotes]);

  useEffect(() => {
    AppStorageService.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    AppStorageService.saveComments(comments);
  }, [comments]);

  useEffect(() => {
    AppStorageService.saveInteractions(interactions);
  }, [interactions]);

  useEffect(() => {
    AppStorageService.saveDownloads(downloads);
  }, [downloads]);

  // Handler: Select and play lesson
  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    if (!currentUser) {
      setPendingLessonIdToPlay(lessonId);
      setAuthModalReason('لمشاهدة هذا الدرس والفيديو بالكامل، يرجى تسجيل الدخول أو إنشاء حسابك بالاسم والبريد وكلمة المرور.');
      setIsAuthModalOpen(true);
    }
  };

  // Auth Handlers
  const handleAuthSuccess = (user: AppUser) => {
    AppStorageService.saveCurrentUser(user);
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    if (pendingLessonIdToPlay) {
      setActiveLessonId(pendingLessonIdToPlay);
      setPendingLessonIdToPlay(null);
    }
  };

  const handleLogout = () => {
    AppStorageService.saveCurrentUser(null);
    setCurrentUser(null);
    setIsUserProfileOpen(false);
  };

  // Handler: Select course from Home
  const handleSelectCourse = (courseId: string) => {
    setActiveTab('courses');
  };

  // Handler: Select category filter
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setActiveTab('courses');
  };

  // Handler: Toggle Lesson Completion
  const handleToggleComplete = (lessonId: string) => {
    setProgress((prev) => {
      const current = prev[lessonId] || {
        lessonId,
        completed: false,
        lastPositionSeconds: 0,
        savedOffline: false,
        bookmarked: false,
      };
      return {
        ...prev,
        [lessonId]: {
          ...current,
          completed: !current.completed,
          completedAt: !current.completed ? Date.now() : undefined,
        },
      };
    });
  };

  // Handler: Toggle Offline download status with realistic download info
  const handleToggleSavedOffline = (lessonId: string) => {
    const isCurrentlySaved = progress[lessonId]?.savedOffline;
    const targetLesson = lessons.find((l) => l.id === lessonId);

    setProgress((prev) => {
      const current = prev[lessonId] || {
        lessonId,
        completed: false,
        lastPositionSeconds: 0,
        savedOffline: false,
        bookmarked: false,
      };
      return {
        ...prev,
        [lessonId]: {
          ...current,
          savedOffline: !current.savedOffline,
        },
      };
    });

    if (!isCurrentlySaved) {
      // Add to downloads info
      setDownloads((prev) => ({
        ...prev,
        [lessonId]: {
          lessonId,
          downloadedAt: Date.now(),
          fileSizeMb: Math.floor(35 + Math.random() * 25),
          quality: '1080p HD',
          offlineReady: true,
        },
      }));

      // Trigger notification in drawer
      const newNotif: AppNotification = {
        id: 'notif-dl-' + Date.now(),
        title: 'اكتمل التنزيل بدون إنترنت 📥',
        message: `تم تنزيل درس "${targetLesson?.title || 'الدرس'}" بنجاح في قسم التنزيلات.`,
        time: 'الآن',
        read: false,
        lessonId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    } else {
      // Remove from downloads info
      setDownloads((prev) => {
        const next = { ...prev };
        delete next[lessonId];
        return next;
      });
    }
  };

  // Handler: Clear All Downloads
  const handleClearAllDownloads = () => {
    setProgress((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = { ...next[key], savedOffline: false };
      });
      return next;
    });
    setDownloads({});
  };

  // Handler: Toggle Bookmark status
  const handleToggleBookmark = (lessonId: string) => {
    setProgress((prev) => {
      const current = prev[lessonId] || {
        lessonId,
        completed: false,
        lastPositionSeconds: 0,
        savedOffline: false,
        bookmarked: false,
      };
      return {
        ...prev,
        [lessonId]: {
          ...current,
          bookmarked: !current.bookmarked,
        },
      };
    });
  };

  // Handler: Tutorial Lesson Reaction (Like / Dislike)
  const handleVoteInteraction = (lessonId: string, voteType: 'like' | 'dislike') => {
    setInteractions((prev) => {
      const current = prev[lessonId] || {
        lessonId,
        likesCount: 50,
        dislikesCount: 1,
      };

      let newLikes = current.likesCount;
      let newDislikes = current.dislikesCount;
      let newVote: 'like' | 'dislike' | undefined = voteType;

      if (current.userVote === voteType) {
        // Toggle off
        newVote = undefined;
        if (voteType === 'like') newLikes = Math.max(0, newLikes - 1);
        if (voteType === 'dislike') newDislikes = Math.max(0, newDislikes - 1);
      } else {
        // Switching or first vote
        if (current.userVote === 'like') newLikes = Math.max(0, newLikes - 1);
        if (current.userVote === 'dislike') newDislikes = Math.max(0, newDislikes - 1);

        if (voteType === 'like') newLikes += 1;
        if (voteType === 'dislike') newDislikes += 1;
      }

      return {
        ...prev,
        [lessonId]: {
          ...current,
          likesCount: newLikes,
          dislikesCount: newDislikes,
          userVote: newVote,
        },
      };
    });
  };

  // Handler: Add Comment
  const handleAddComment = (lessonId: string, text: string, timeSeconds?: number) => {
    const newComment: TutorialComment = {
      id: 'comm-' + Date.now(),
      lessonId,
      userName: 'أنت (المتعلم)',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      text,
      timeSeconds,
      timeFormatted: timeSeconds !== undefined ? formatTimeSeconds(timeSeconds) : undefined,
      createdAt: Date.now(),
      likesCount: 0,
      dislikesCount: 0,
      replies: [],
    };

    setComments((prev) => [newComment, ...prev]);
  };

  // Handler: Add Creator/User Reply
  const handleAddReply = (commentId: string, text: string, isCreator: boolean) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id !== commentId) return comment;

        const targetLesson = lessons.find((l) => l.id === comment.lessonId);
        const targetCourse = targetLesson ? courses.find((c) => c.id === targetLesson.courseId) : null;

        const newReply = {
          id: 'reply-' + Date.now(),
          commentId,
          userName: isCreator ? (targetCourse?.instructorName || 'المحاضر') : 'مشارك في الدورة',
          userAvatar: isCreator
            ? (targetCourse?.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80')
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          isCreator,
          creatorTitle: isCreator ? (targetCourse?.instructorTitle || 'مقدم الدورة وصاحب الفيديو') : undefined,
          text,
          createdAt: Date.now(),
          likesCount: 0,
          dislikesCount: 0,
        };

        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      })
    );
  };

  // Handler: Vote on Comment
  const handleVoteComment = (commentId: string, voteType: 'like' | 'dislike') => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;

        let newLikes = c.likesCount;
        let newDislikes = c.dislikesCount;
        let newVote: 'like' | 'dislike' | undefined = voteType;

        if (c.userVote === voteType) {
          newVote = undefined;
          if (voteType === 'like') newLikes = Math.max(0, newLikes - 1);
          if (voteType === 'dislike') newDislikes = Math.max(0, newDislikes - 1);
        } else {
          if (c.userVote === 'like') newLikes = Math.max(0, newLikes - 1);
          if (c.userVote === 'dislike') newDislikes = Math.max(0, newDislikes - 1);

          if (voteType === 'like') newLikes += 1;
          if (voteType === 'dislike') newDislikes += 1;
        }

        return {
          ...c,
          likesCount: newLikes,
          dislikesCount: newDislikes,
          userVote: newVote,
        };
      })
    );
  };

  // Handler: Vote on Reply
  const handleVoteReply = (commentId: string, replyId: string, voteType: 'like' | 'dislike') => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;

        const updatedReplies = c.replies.map((r) => {
          if (r.id !== replyId) return r;

          let newLikes = r.likesCount;
          let newDislikes = r.dislikesCount;
          let newVote: 'like' | 'dislike' | undefined = voteType;

          if (r.userVote === voteType) {
            newVote = undefined;
            if (voteType === 'like') newLikes = Math.max(0, newLikes - 1);
            if (voteType === 'dislike') newDislikes = Math.max(0, newDislikes - 1);
          } else {
            if (r.userVote === 'like') newLikes = Math.max(0, newLikes - 1);
            if (r.userVote === 'dislike') newDislikes = Math.max(0, newDislikes - 1);

            if (voteType === 'like') newLikes += 1;
            if (voteType === 'dislike') newDislikes += 1;
          }

          return {
            ...r,
            likesCount: newLikes,
            dislikesCount: newDislikes,
            userVote: newVote,
          };
        });

        return { ...c, replies: updatedReplies };
      })
    );
  };

  // Handler: Delete Comment
  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  // Handler: Add User Note with timestamp
  const handleAddUserNote = (lessonId: string, text: string, timeSeconds: number) => {
    const newNote: UserNote = {
      id: 'note-' + Date.now(),
      lessonId,
      timeSeconds,
      timeFormatted: formatTimeSeconds(timeSeconds),
      text,
      createdAt: Date.now(),
    };
    setUserNotes((prev) => [newNote, ...prev]);
  };

  // Handler: Delete Note
  const handleDeleteUserNote = (noteId: string) => {
    setUserNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  // Handler: Save New Lesson from Publisher modal
  const handleSaveLesson = (newLesson: Lesson) => {
    setLessons((prev) => [newLesson, ...prev]);
    setIsAddLessonOpen(false);

    // Add notification
    const newNotification: AppNotification = {
      id: 'notif-' + Date.now(),
      title: 'تم نشر درسك بنجاح! 🚀',
      message: `تم نشر درس "${newLesson.title}" وأصبح متاحاً للمشاهدة الآن.`,
      time: 'الآن',
      read: false,
      lessonId: newLesson.id,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    // Navigate to preview the newly published lesson
    setActiveLessonId(newLesson.id);
  };

  // Handler: Save New Course
  const handleSaveCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
    setIsAddCourseOpen(false);
  };

  // Handler: Delete Lesson
  const handleDeleteLesson = (lessonId: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    if (activeLessonId === lessonId) {
      setActiveLessonId(null);
    }
  };

  // Handler: Delete Course
  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setLessons((prev) => prev.filter((l) => l.courseId !== courseId));
  };

  // Handler: Reset to Defaults
  const handleResetData = () => {
    AppStorageService.resetToDefault();
    setCourses(AppStorageService.getCourses());
    setLessons(AppStorageService.getLessons());
    setProgress(AppStorageService.getProgress());
    setUserNotes([]);
    setNotifications(AppStorageService.getNotifications());
    setComments(AppStorageService.getComments());
    setInteractions(AppStorageService.getInteractions());
    setDownloads(AppStorageService.getDownloads());
    setActiveLessonId(null);
  };

  // Handler: Import Backup
  const handleImportData = (data: { courses: Course[]; lessons: Lesson[] }) => {
    setCourses(data.courses);
    setLessons(data.lessons);
  };

  // Active Lesson detail object
  const activeLesson = activeLessonId ? lessons.find((l) => l.id === activeLessonId) : null;
  const activeLessonCourse = activeLesson ? courses.find((c) => c.id === activeLesson.courseId) : null;
  const allActiveCourseLessons = activeLesson ? lessons.filter((l) => l.courseId === activeLesson.courseId) : [];

  // Saved count for navigation badge
  const savedCount = (Object.values(progress) as LessonProgress[]).filter((p) => p?.savedOffline || p?.bookmarked).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AndroidFrame>
      {/* Android Status Bar */}
      <AndroidStatusBar
        hasNotifications={unreadNotificationsCount > 0}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Top Bar (Changes title based on current screen) */}
      <AndroidTopBar
        title={
          activeLesson
            ? activeLesson.title
            : activeTab === 'home'
            ? 'البعد السادس الهندسي'
            : activeTab === 'courses'
            ? 'الدورات والتصنيفات'
            : activeTab === 'saved'
            ? 'التنزيلات والمحفوظات'
            : 'استوديو النشر'
        }
        subtitle={
          activeLesson
            ? activeLessonCourse?.title
            : activeTab === 'home'
            ? 'المنصة التعليمية للدروس والدورات الذكية'
            : undefined
        }
        showBack={Boolean(activeLesson)}
        onBack={() => setActiveLessonId(null)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        currentUser={currentUser}
        onOpenProfile={() => setIsUserProfileOpen(true)}
        onOpenAuth={() => {
          setAuthModalReason('سجل دخولك باسم المستخدم والبريد لمتابعة الدروس والتفاعل والمزامنة.');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 relative overflow-hidden bg-[#0A0B0E]">
        {activeLesson && activeLessonCourse ? (
          <LessonDetailView
            lesson={activeLesson}
            course={activeLessonCourse}
            allCourseLessons={allActiveCourseLessons}
            progress={
              progress[activeLesson.id] || {
                lessonId: activeLesson.id,
                completed: false,
                lastPositionSeconds: 0,
                savedOffline: false,
                bookmarked: false,
              }
            }
            userNotes={userNotes}
            comments={comments}
            interactions={interactions}
            currentUser={currentUser}
            onRequireLogin={() => {
              setPendingLessonIdToPlay(activeLesson.id);
              setAuthModalReason('لمشاهدة هذا الدرس بالكامل وتدوين الملاحظات، يرجى تسجيل الدخول أو إنشاء حسابك.');
              setIsAuthModalOpen(true);
            }}
            onBack={() => setActiveLessonId(null)}
            onSelectLesson={(id) => setActiveLessonId(id)}
            onToggleComplete={handleToggleComplete}
            onToggleSavedOffline={handleToggleSavedOffline}
            onToggleBookmark={handleToggleBookmark}
            onVoteInteraction={handleVoteInteraction}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
            onVoteComment={handleVoteComment}
            onVoteReply={handleVoteReply}
            onDeleteComment={handleDeleteComment}
            onAddUserNote={handleAddUserNote}
            onDeleteUserNote={handleDeleteUserNote}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                courses={courses}
                lessons={lessons}
                categories={INITIAL_CATEGORIES}
                progress={progress}
                onSelectLesson={handleSelectLesson}
                onSelectCourse={handleSelectCourse}
                onSelectCategory={handleSelectCategory}
                onOpenPublisherModal={() => {
                  setInitialCourseForLesson(undefined);
                  setIsAddLessonOpen(true);
                }}
              />
            )}

            {activeTab === 'courses' && (
              <CoursesView
                courses={courses}
                lessons={lessons}
                categories={INITIAL_CATEGORIES}
                progress={progress}
                selectedCategoryId={selectedCategoryId}
                onSelectLesson={handleSelectLesson}
                onOpenAddCourseModal={() => setIsAddCourseOpen(true)}
                onOpenAddLessonModal={(courseId) => {
                  setInitialCourseForLesson(courseId);
                  setIsAddLessonOpen(true);
                }}
              />
            )}

            {activeTab === 'saved' && (
              <SavedView
                courses={courses}
                lessons={lessons}
                progress={progress}
                notes={userNotes}
                downloads={downloads}
                onSelectLesson={handleSelectLesson}
                onRemoveBookmark={handleToggleBookmark}
                onRemoveOfflineDownload={handleToggleSavedOffline}
                onClearAllDownloads={handleClearAllDownloads}
                onDeleteNote={handleDeleteUserNote}
              />
            )}

            {activeTab === 'studio' && (
              <PublisherStudio
                courses={courses}
                lessons={lessons}
                progress={progress}
                onOpenAddLessonModal={(courseId) => {
                  setInitialCourseForLesson(courseId);
                  setIsAddLessonOpen(true);
                }}
                onOpenAddCourseModal={() => setIsAddCourseOpen(true)}
                onDeleteLesson={handleDeleteLesson}
                onDeleteCourse={handleDeleteCourse}
                onSelectLesson={handleSelectLesson}
                onResetData={handleResetData}
                onImportData={handleImportData}
              />
            )}
          </>
        )}
      </main>

      {/* Android Bottom Navigation Bar */}
      <AndroidNavBar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveLessonId(null);
          setActiveTab(tab);
        }}
        savedCount={savedCount}
        onOpenPublisherModal={() => {
          setInitialCourseForLesson(undefined);
          setIsAddLessonOpen(true);
        }}
      />

      {/* Unified Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        courses={courses}
        lessons={lessons}
        categories={INITIAL_CATEGORIES}
        progress={progress}
        onSelectLesson={(lesson) => {
          handleSelectLesson(lesson.id);
          setIsSearchOpen(false);
        }}
        onSelectCourse={(course) => {
          setActiveTab('courses');
          setIsSearchOpen(false);
        }}
      />

      {/* Publisher Add Lesson Modal */}
      {isAddLessonOpen && (
        <AddLessonModal
          courses={courses}
          initialCourseId={initialCourseForLesson}
          onClose={() => setIsAddLessonOpen(false)}
          onSaveLesson={handleSaveLesson}
        />
      )}

      {/* Create Course Modal */}
      {isAddCourseOpen && (
        <AddCourseModal
          categories={INITIAL_CATEGORIES}
          onClose={() => setIsAddCourseOpen(false)}
          onSaveCourse={handleSaveCourse}
        />
      )}

      {/* Notification Shade */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        notifications={notifications}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectNotificationLesson={(lessonId) => {
          handleSelectLesson(lessonId);
          setIsNotificationsOpen(false);
        }}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
      />

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        reasonMessage={authModalReason}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        user={currentUser}
        courses={courses}
        lessons={lessons}
        progress={progress}
        userNotes={userNotes}
        onClose={() => setIsUserProfileOpen(false)}
        onLogout={handleLogout}
        onOpenAuthModal={() => {
          setIsUserProfileOpen(false);
          setAuthModalReason('تسجيل الدخول أو التبديل لحساب آخر');
          setIsAuthModalOpen(true);
        }}
      />
    </AndroidFrame>
  );
}
