import React, { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, Download, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatImageModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  imageName?: string;
  onClose: () => void;
}

export const ChatImageModal: React.FC<ChatImageModalProps> = ({
  isOpen,
  imageUrl,
  imageName,
  onClose
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset zoom on image change or close
  useEffect(() => {
    if (!isOpen) {
      setIsZoomed(false);
    }
  }, [isOpen, imageUrl]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = imageName || `mmz-chat-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <AnimatePresence>
      <div
        id="chat-image-modal-overlay"
        className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 select-none"
        onClick={onClose}
      >
        {/* Top Control Bar */}
        <div
          className="flex items-center justify-between w-full max-w-6xl mx-auto py-2 px-3 sm:px-4 bg-slate-900/80 rounded-2xl border border-white/10 shadow-lg text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs sm:text-sm font-bold truncate text-slate-200">
              {imageName || 'Şəkilə baxış'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom toggle button */}
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-slate-200"
              title={isZoomed ? 'Kiçilt' : 'Böyüt'}
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              <span className="hidden sm:inline">{isZoomed ? 'Kiçilt' : 'Böyüt'}</span>
            </button>

            {/* Download button */}
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-slate-200"
              title="Yüklə"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Yüklə</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              id="btn-close-image-modal"
              onClick={onClose}
              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 ml-1"
              title="Bağla (Esc)"
            >
              <X className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">Bağla</span>
            </button>
          </div>
        </div>

        {/* Center Image Container */}
        <div
          className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-auto min-h-0"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center justify-center max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl}
              alt={imageName || 'Böyük şəkil'}
              className={`object-contain rounded-2xl shadow-2xl transition-all duration-300 ring-1 ring-white/20 ${
                isZoomed
                  ? 'scale-125 sm:scale-150 cursor-zoom-out max-h-[85vh] max-w-[90vw]'
                  : 'max-h-[75vh] sm:max-h-[82vh] max-w-[95vw] sm:max-w-[85vw] cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          </motion.div>
        </div>

        {/* Bottom instruction hint */}
        <div className="text-center py-1">
          <span className="text-[11px] sm:text-xs text-slate-400 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
            💡 Böyütmək/kiçiltmək üçün şəklin üzərinə klikləyin • Bağlamaq üçün kənara və ya ESC düyməsinə basın
          </span>
        </div>
      </div>
    </AnimatePresence>
  );
};
