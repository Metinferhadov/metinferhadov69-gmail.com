import React, { useEffect, useState, Component, ErrorInfo, ReactNode } from 'react';
import { getCachedVideoUrl, resolveVideoUrl } from '../utils/mediaStorage';
import { AlertCircle, Film, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class SafeVideoPlayerErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('SafeVideoPlayer error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center bg-slate-900 text-slate-400 text-xs p-4 text-center rounded-2xl">
            <AlertCircle className="w-6 h-6 text-amber-400 mb-1" />
            <span className="font-semibold text-slate-300">Video pleyer yüklənə bilmədi</span>
            <span className="text-[11px] text-slate-500 mt-1">Fayl formatını yoxlayın (MP4, MOV, WEBM)</span>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

interface SafeVideoPlayerProps {
  src: string | { url?: string } | any;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  poster?: string;
  onClick?: (e: React.MouseEvent<HTMLVideoElement>) => void;
}

function getMimeType(url: string): string {
  if (!url) return 'video/mp4';
  const clean = url.split('?')[0].toLowerCase();
  if (clean.endsWith('.mov')) return 'video/quicktime';
  if (clean.endsWith('.webm')) return 'video/webm';
  if (clean.endsWith('.mp4')) return 'video/mp4';
  return 'video/mp4';
}

function normalizeSrc(raw: any): string {
  if (!raw) return '';
  if (typeof raw === 'string') return raw.trim();
  if (typeof raw === 'object') {
    if (typeof raw.url === 'string') return raw.url.trim();
    if (typeof raw.src === 'string') return raw.src.trim();
    if (typeof raw.dataUrl === 'string') return raw.dataUrl.trim();
  }
  return String(raw).trim();
}

const SafeVideoPlayerInner: React.FC<SafeVideoPlayerProps> = ({
  src: rawSrc,
  className = 'w-full h-full object-contain',
  controls = true,
  autoPlay = false,
  muted,
  playsInline = true,
  preload = 'metadata',
  poster,
  onClick
}) => {
  const src = normalizeSrc(rawSrc);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Initialize immediately with in-memory blob cache or raw src
  const [resolvedSrc, setResolvedSrc] = useState<string>(() => {
    if (!src) return '';
    if (src.startsWith('blob:') || src.startsWith('data:')) {
      return src;
    }
    const cached = getCachedVideoUrl(src);
    if (cached) return cached;
    return src;
  });

  useEffect(() => {
    let isCurrent = true;

    if (!src) {
      setResolvedSrc('');
      return;
    }

    if (src.startsWith('blob:') || src.startsWith('data:')) {
      setResolvedSrc(src);
      return;
    }

    const cached = getCachedVideoUrl(src);
    if (cached) {
      setResolvedSrc(cached);
      return;
    }

    // Resolve URL in background (IndexedDB cache or Firestore chunks)
    resolveVideoUrl(src)
      .then((url) => {
        if (isCurrent && url && url !== resolvedSrc) {
          setResolvedSrc(url);
          if (videoRef.current && videoRef.current.src !== url) {
            videoRef.current.src = url;
            videoRef.current.load();
          }
        }
      })
      .catch((err) => {
        console.warn('SafeVideoPlayer URL resolution error:', err);
      });

    return () => {
      isCurrent = false;
    };
  }, [src]);

  // Proactive recovery if HTML video element encounters a 404 from static host
  const handleMediaError = async (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const mediaError = (e.currentTarget as HTMLVideoElement).error;
    if (mediaError && mediaError.code === 1) {
      // MEDIA_ERR_ABORTED - normal during component unmount or re-render
      return;
    }
    console.warn('HTML video element reported media error, resolving cloud source:', mediaError);
    try {
      const cloudUrl = await resolveVideoUrl(src, { forceCloud: true });
      if (cloudUrl && cloudUrl !== resolvedSrc) {
        setResolvedSrc(cloudUrl);
        if (videoRef.current) {
          videoRef.current.src = cloudUrl;
          videoRef.current.load();
        }
      }
    } catch (_) {}
  };

  if (!src) {
    return (
      <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center bg-black text-slate-500 text-xs p-4">
        <Film className="w-6 h-6 mb-1 opacity-50" />
        <span>Video seçilməyib</span>
      </div>
    );
  }

  const effectiveSrc = resolvedSrc || src;

  return (
    <video
      ref={videoRef}
      key={effectiveSrc}
      src={effectiveSrc}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted ?? autoPlay}
      playsInline={playsInline}
      preload={preload}
      poster={poster}
      onClick={onClick}
      onError={handleMediaError}
      className={className}
    >
      <source src={effectiveSrc} type={getMimeType(effectiveSrc)} />
      Video formatı bu brauzerdə dəstəklənmir.
    </video>
  );
};


export const SafeVideoPlayer: React.FC<SafeVideoPlayerProps> = (props) => {
  return (
    <SafeVideoPlayerErrorBoundary>
      <SafeVideoPlayerInner {...props} />
    </SafeVideoPlayerErrorBoundary>
  );
};
