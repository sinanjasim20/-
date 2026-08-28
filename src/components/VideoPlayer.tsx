import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Download, 
  Check, 
  Sparkles, 
  Youtube, 
  HardDrive, 
  Gauge, 
  Bookmark,
  Lock,
  LogIn,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { Lesson, VideoType } from '../types';
import { getYouTubeEmbedUrl, formatTimeSeconds } from '../utils/youtube';
import { getVideoBlobFromDB } from '../services/indexedDb';

interface VideoPlayerProps {
  lesson: Lesson;
  seekTimeSeconds?: number | null;
  onTimeUpdate?: (seconds: number) => void;
  onToggleSavedOffline?: () => void;
  isSavedOffline?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  isLocked?: boolean;
  onRequireLogin?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  lesson,
  seekTimeSeconds,
  onTimeUpdate,
  onToggleSavedOffline,
  isSavedOffline = false,
  isBookmarked = false,
  onToggleBookmark,
  isLocked = false,
  onRequireLogin,
}) => {
  const [blobVideoUrl, setBlobVideoUrl] = useState<string | null>(null);
  const [loadingBlob, setLoadingBlob] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // HTML5 Video Player state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(lesson.durationMinutes * 60 || 0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Load IndexedDB blob if this is an uploaded local video
  useEffect(() => {
    let active = true;
    let createdUrl: string | null = null;

    if (lesson.videoType === 'uploaded' && lesson.videoBlobId) {
      setLoadingBlob(true);
      getVideoBlobFromDB(lesson.videoBlobId)
        .then((blob) => {
          if (active && blob) {
            createdUrl = URL.createObjectURL(blob);
            setBlobVideoUrl(createdUrl);
          }
          if (active) setLoadingBlob(false);
        })
        .catch((err) => {
          console.error('Error loading video blob:', err);
          if (active) setLoadingBlob(false);
        });
    } else {
      setBlobVideoUrl(null);
      setLoadingBlob(false);
    }

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [lesson.id, lesson.videoType, lesson.videoBlobId]);

  // Handle seeking from external timestamps
  useEffect(() => {
    if (seekTimeSeconds !== undefined && seekTimeSeconds !== null) {
      if (videoRef.current && (lesson.videoType === 'uploaded' || lesson.videoType === 'direct_url')) {
        videoRef.current.currentTime = seekTimeSeconds;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [seekTimeSeconds, lesson.videoType]);

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    setShowSpeedMenu(false);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleHTML5TimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);
    if (onTimeUpdate) {
      onTimeUpdate(current);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeekSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const embedUrl = getYouTubeEmbedUrl(
    lesson.videoUrl,
    false,
    seekTimeSeconds !== null && seekTimeSeconds !== undefined ? seekTimeSeconds : undefined
  );

  return (
    <div ref={containerRef} className="w-full bg-[#0A0B0E] flex flex-col relative group select-none shadow-xl border-b border-[#242731]">
      {/* Video Display Area */}
      <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
        {isLocked ? (
          /* LOCKED STATE OVERLAY */
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Background Thumbnail with heavy blur and dark overlay */}
            <img
              src={lesson.thumbnailUrl}
              alt={lesson.title}
              className="absolute inset-0 w-full h-full object-cover filter blur-md brightness-[0.25] scale-105"
            />
            
            <div className="relative z-10 p-5 text-center flex flex-col items-center max-w-sm mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shadow-lg shadow-[#D4AF37]/10 animate-pulse">
                <Lock className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-wider bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/20 inline-block">
                  المحتوى مقيد بالأعضاء
                </span>
                <h3 className="text-sm sm:text-base font-black text-white font-['Cairo',sans-serif] leading-tight">
                  تسجيل الدخول مطلوب للمشاهدة
                </h3>
                <p className="text-[11px] text-[#A0A3B1] leading-relaxed">
                  يتطلب تطبيق البعد السادس الهندسي تسجيل حسابك (اسم المستخدم، البريد، كلمة المرور) لمشاهدة الفيديو والوصول للشروحات والملاحظات.
                </p>
              </div>

              <button
                onClick={onRequireLogin}
                className="py-2.5 px-5 bg-[#D4AF37] hover:bg-[#F2D06B] text-[#0A0B0E] font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#D4AF37]/25 hover:scale-105 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول أو إنشاء حساب</span>
              </button>
            </div>
          </div>
        ) : lesson.videoType === 'youtube' ? (
          <iframe
            key={`${lesson.id}-${seekTimeSeconds || 0}`}
            src={embedUrl}
            title={lesson.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : loadingBlob ? (
          <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
            <div className="w-10 h-10 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#8A8D98]">جارٍ قراءة الفيديو المخزن محلياً...</p>
          </div>
        ) : blobVideoUrl || lesson.videoUrl ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              src={blobVideoUrl || lesson.videoUrl}
              className="w-full h-full object-contain"
              onTimeUpdate={handleHTML5TimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              muted={isMuted}
              playsInline
            />

            {/* Custom Overlay Controls for HTML5 Video */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              {/* Top info */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white bg-[#12141C]/90 px-2.5 py-1 rounded-md backdrop-blur-sm border border-[#242731]">
                  {lesson.videoFileName || 'فيديو مرفوع محلياً'}
                </span>
                <span className="text-xs text-[#8A8D98] font-mono">
                  {formatTimeSeconds(currentTime)} / {formatTimeSeconds(duration)}
                </span>
              </div>

              {/* Center Play/Pause button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={handleTogglePlay}
                  className="w-14 h-14 rounded-full bg-[#D4AF37] text-[#0A0B0E] flex items-center justify-center hover:bg-[#F2D06B] hover:scale-110 active:scale-95 transition-all shadow-xl font-bold"
                >
                  {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-[#0A0B0E] translate-x-0.5" />}
                </button>
              </div>

              {/* Bottom Scrubber & Buttons */}
              <div className="flex flex-col gap-1.5">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeekSlider}
                  className="w-full h-1.5 bg-[#242731] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />

                <div className="flex items-center justify-between text-white text-xs pt-1">
                  <div className="flex items-center gap-3">
                    <button onClick={handleTogglePlay} className="hover:text-[#D4AF37] text-white">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)} className="hover:text-[#D4AF37] text-white">
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleFullscreen}
                      className="hover:text-[#D4AF37] text-white p-1"
                      title="ملء الشاشة"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-[#8A8D98] gap-2">
            <Youtube className="w-10 h-10 text-[#6C707E]" />
            <p className="text-xs">لم يتم تحديد رابط فيديو صالح</p>
          </div>
        )}

        {/* Source Badge on Top Right */}
        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
          {lesson.videoType === 'youtube' ? (
            <span className="flex items-center gap-1 text-[11px] font-bold bg-red-600/90 text-white px-2 py-0.5 rounded-md shadow-md backdrop-blur-sm">
              <Youtube className="w-3 h-3" />
              <span>YouTube</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-bold bg-[#1D212B] text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded-md shadow-md backdrop-blur-sm">
              <HardDrive className="w-3 h-3 text-[#D4AF37]" />
              <span>مرفوع محلياً</span>
            </span>
          )}
        </div>
      </div>

      {/* Playback Action Bar */}
      <div className="px-3.5 py-2.5 bg-[#12141C] flex items-center justify-between border-t border-[#242731]">
        {/* Speed and Quality controls */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#1D212B] hover:bg-[#242731] text-[#E2E2E2] border border-[#242731] transition-colors"
          >
            <Gauge className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{playbackRate}x السرعة</span>
          </button>

          {showSpeedMenu && (
            <div className="absolute bottom-9 right-0 bg-[#12141C] border border-[#242731] rounded-xl p-1 shadow-2xl z-30 flex flex-col gap-0.5 min-w-[100px]">
              {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`text-xs px-3 py-1.5 rounded-lg text-right transition-colors ${
                    playbackRate === speed
                      ? 'bg-[#D4AF37] text-[#0A0B0E] font-bold'
                      : 'text-[#8A8D98] hover:text-[#E2E2E2] hover:bg-[#1D212B]'
                  }`}
                >
                  {speed}x {speed === 1 && '(عادي)'}
                </button>
              ))}
            </div>
          )}

          <span className="text-[11px] text-[#8A8D98] font-mono">
            {lesson.durationMinutes} دقيقة
          </span>
        </div>

        {/* Action Buttons (Save Offline, Bookmark) */}
        <div className="flex items-center gap-2">
          {onToggleBookmark && (
            <button
              onClick={onToggleBookmark}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                isBookmarked
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50'
                  : 'bg-[#1D212B] text-[#8A8D98] hover:text-[#E2E2E2] hover:bg-[#242731] border border-[#242731]'
              }`}
              title={isBookmarked ? 'محفوظ في المفضلة' : 'حفظ في المفضلة'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
              <span className="text-[11px] hidden xs:inline">{isBookmarked ? 'محفوظ' : 'حفظ'}</span>
            </button>
          )}

          {onToggleSavedOffline && (
            <button
              onClick={onToggleSavedOffline}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                isSavedOffline
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-[#1D212B] text-[#8A8D98] hover:text-[#E2E2E2] hover:bg-[#242731] border border-[#242731]'
              }`}
              title={isSavedOffline ? 'تم التنزيل بدون إنترنت' : 'تنزيل للمشاهدة بدون إنترنت'}
            >
              {isSavedOffline ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px]">مُنزّل (Offline)</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#8A8D98]" />
                  <span className="text-[11px]">تنزيل</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
