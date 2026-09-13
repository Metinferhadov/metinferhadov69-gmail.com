import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, Zap, Shield, Truck, Sparkles, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HeroBanner: React.FC = () => {
  const { banners, setActiveTab, triggerConfetti, showToast, applyCoupon } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [claimedCoupon, setClaimedCoupon] = useState(false);

  const activeBanners = banners
    .filter((b) => b.active && !(b as any).isDeleted)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  // Ensure index is within range
  const safeIndex = activeBanners.length > 0 ? currentIndex % activeBanners.length : 0;
  const currentBanner = activeBanners[safeIndex];

  const handleClaimBonus = () => {
    applyCoupon('MMZ2026');
    setClaimedCoupon(true);
    triggerConfetti();
    showToast('Təbriklər! 20% Endirim Kuponu profilinizə əlavə olundu!', 'success');
  };

  const handleBannerAction = () => {
    if (!currentBanner) return;
    const link = (currentBanner.categoryLink || '').trim();
    if (!link) {
      setActiveTab('categories');
      return;
    }
    if (['home', 'categories', 'flash_sales', 'cart', 'orders', 'chat', 'profile', 'wishlist'].includes(link)) {
      setActiveTab(link as any);
      return;
    }
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
      return;
    }
    setActiveTab('categories');
  };

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-2">
      {/* 3D Main Carousel Container */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] border border-white/15 group min-h-[290px] sm:min-h-[340px] md:min-h-[420px] flex items-center bg-[#070b16]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-r ${currentBanner.bgColor} flex items-center`}
          >
            {/* Background Texture & Ambient Lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-black/80 mix-blend-overlay" />
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              className="absolute right-0 top-0 w-full md:w-3/5 h-full object-cover object-center opacity-35 md:opacity-55 mix-blend-luminosity filter blur-[0.5px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060913]/95 via-[#060913]/70 to-transparent" />

            {/* Banner Content */}
            <div className="relative z-10 max-w-2xl p-4 sm:p-6 md:p-12 text-white">
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-[10px] sm:text-xs font-black rounded-full uppercase tracking-wider mb-2 sm:mb-3 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
              >
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-slate-950" />
                {currentBanner.badge}
              </motion.span>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-heading font-black text-xl sm:text-3xl md:text-5xl leading-tight tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] mb-2 sm:mb-3 break-words"
              >
                {currentBanner.title}
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs sm:text-base md:text-lg text-slate-200 font-medium mb-4 sm:mb-6 leading-relaxed max-w-lg drop-shadow line-clamp-2 sm:line-clamp-none"
              >
                {currentBanner.subtitle || currentBanner.description}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-2 sm:gap-3"
              >
                <button
                  onClick={handleBannerAction}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-[0_4px_20px_rgba(255,85,0,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer border border-orange-400/40"
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {currentBanner.buttonText || 'İndi Kəşf Et'}
                </button>

                {!claimedCoupon ? (
                  <button
                    onClick={handleClaimBonus}
                    className="px-3.5 py-2 sm:px-5 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl border border-white/25 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:border-cyan-400/40 shadow-sm"
                  >
                    <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
                    20% Kupon Al
                  </button>
                ) : (
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2.5 bg-emerald-500/90 text-white text-[11px] sm:text-xs font-bold rounded-xl sm:rounded-2xl flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400/50">
                    ✓ Kupon Aktivdir (MMZ2026)
                  </span>
                )}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Arrow Controls - Only show if > 1 banner */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
              className="absolute left-2 sm:left-3 p-1.5 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 opacity-80 hover:opacity-100 transition-all cursor-pointer z-20"
              aria-label="Əvvəlki banner"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
              className="absolute right-2 sm:right-3 p-1.5 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 opacity-80 hover:opacity-100 transition-all cursor-pointer z-20"
              aria-label="Növbəti banner"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                  i === safeIndex ? 'w-6 sm:w-8 bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.7)]' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Trust & Guarantee Micro-Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-3 sm:mt-4">
        <div className="flex items-center gap-3 p-3 sm:p-3.5 bg-[#0c1324]/85 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg hover:border-cyan-400/30 transition-all">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(255,85,0,0.25)]">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Sürətli Çatdırılma</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Bakı daxili 2 saatda</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 sm:p-3.5 bg-[#0c1324]/85 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg hover:border-emerald-400/30 transition-all">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">100% Orijinal Mallar</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Rəsmi MMZ Keyfiyyəti</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 sm:p-3.5 bg-[#0c1324]/85 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg hover:border-cyan-400/30 transition-all">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">24/7 Canlı Dəstək</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Operativ yardım və çat</p>
          </div>
        </div>
      </div>
    </div>
  );
};
