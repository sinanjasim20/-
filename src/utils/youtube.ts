/**
 * Utility functions for handling YouTube URLs and Video duration parsing
 */

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  // Clean URL
  const trimmed = url.trim();

  // Pattern matches:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/v/VIDEO_ID
  // - https://m.youtube.com/watch?v=VIDEO_ID
  // - VIDEO_ID directly (11 chars)

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  // Check if user provided just the 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function getYouTubeEmbedUrl(urlOrId: string, autoplay: boolean = false, startSeconds?: number): string {
  const id = extractYouTubeId(urlOrId) || urlOrId;
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    enablejsapi: '1',
  });

  if (startSeconds && startSeconds > 0) {
    params.set('start', Math.floor(startSeconds).toString());
  }

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export function getYouTubeThumbnail(urlOrId: string, quality: 'max' | 'hq' | 'mq' | 'default' = 'hq'): string {
  const id = extractYouTubeId(urlOrId);
  if (!id) {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
  }

  switch (quality) {
    case 'max':
      return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    case 'hq':
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    case 'mq':
      return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    default:
      return `https://img.youtube.com/vi/${id}/default.jpg`;
  }
}

export function formatTimeSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function parseFormattedTimeToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 2) {
    return (isNaN(parts[0]) ? 0 : parts[0]) * 60 + (isNaN(parts[1]) ? 0 : parts[1]);
  }
  if (parts.length === 3) {
    return (
      (isNaN(parts[0]) ? 0 : parts[0]) * 3600 +
      (isNaN(parts[1]) ? 0 : parts[1]) * 60 +
      (isNaN(parts[2]) ? 0 : parts[2])
    );
  }
  return parseInt(timeStr, 10) || 0;
}
