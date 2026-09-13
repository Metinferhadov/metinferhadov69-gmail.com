import React, { useState, useEffect } from 'react';
import { HomeSection, Product } from '../types';
import { ProductCard } from './ProductCard';
import { SECTION_ICONS, THEME_PRESETS } from './HomeSectionsManager';
import { ChevronRight, Clock, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { deduplicateProducts } from '../utils/productUtils';

interface DynamicHomeSectionProps {
  section: HomeSection;
  onFilterTagSelect?: (tag: string) => void;
}

export const DynamicHomeSection: React.FC<DynamicHomeSectionProps> = ({
  section,
  onFilterTagSelect
}) => {
  const { products, setSelectedCategory, setSearchQuery, setActiveTab } = useStore();

  // Real-time Countdown calculation
  const [timeLeft, setTimeLeft] = useState<{ hours: string; minutes: string; seconds: string } | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!section.hasCountdown || !section.countdownEndTime) {
      setTimeLeft(null);
      setIsExpired(false);
      return;
    }

    const calculateTime = () => {
      const targetTime = new Date(section.countdownEndTime!).getTime();
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
      setIsExpired(false);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [section.hasCountdown, section.countdownEndTime]);

  // If section is inactive or expired and action is 'hide'
  if (!section.isActive) return null;
  if (section.hasCountdown && isExpired && section.countdownExpiredAction === 'hide') {
    return null;
  }

  // Prevent duplicate upper catalog list: all products are displayed solely in the bottom "Bütün Məhsullar" section
  if (
    section.id === 'sec-for-you-new' ||
    section.title === 'Bütün Məhsullar' ||
    section.title?.includes('Sənin Üçün Seçdik') ||
    (section.title?.includes('Yeni Gələnlər') && section.title?.includes('Seçdik'))
  ) {
    return null;
  }

  // Get matching products
  let displayProducts: Product[] = [];
  if (section.productSource === 'manual' && section.productIds && section.productIds.length > 0) {
    const map = new Map(products.map((p) => [p.id, p]));
    displayProducts = section.productIds
      .map((id) => map.get(id))
      .filter((p): p is Product => p !== undefined);
  } else if (section.productSource === 'tag' && section.productTag) {
    displayProducts = products.filter((p) => Array.isArray(p.tags) && p.tags.includes(section.productTag as any));
  } else {
    displayProducts = products;
  }

  // Deduplicate products to guarantee each product appears only once in this section
  const uniqueDisplayProducts = deduplicateProducts(displayProducts);

  // Apply max products limit
  const limitedProducts = uniqueDisplayProducts.slice(0, section.maxProductsCount || 6);

  if (limitedProducts.length === 0) {
    return null;
  }

  const iconObj = SECTION_ICONS[section.iconName] || SECTION_ICONS.zap;
  const IconComponent = iconObj.icon;
  const theme = THEME_PRESETS[section.themeColor] || THEME_PRESETS.red_orange;

  const displayTitle = section.title;
  const displaySubtitle = section.subtitle;
  const displayBadgeText = section.badgeText;

  const handleActionClick = () => {
    if (!section.buttonLink) return;

    if (section.buttonLink === 'all') {
      setSelectedCategory(null);
      setSearchQuery('');
      if (onFilterTagSelect) onFilterTagSelect('all');
    } else if (['flash_sale', 'daily_deal', 'best_seller', 'new_arrival', 'for_you', 'discount'].includes(section.buttonLink)) {
      if (onFilterTagSelect) {
        onFilterTagSelect(section.buttonLink);
      }
    } else if (['cart', 'chat', 'profile', 'orders', 'categories'].includes(section.buttonLink)) {
      setActiveTab(section.buttonLink as any);
    } else {
      if (onFilterTagSelect) {
        onFilterTagSelect(section.buttonLink);
      }
    }
  };

  // 1. If section uses Dark/Gradient Card style (like Flash Sale red_orange or slate_dark)
  if (theme.isDarkBg) {
    return (
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className={`bg-gradient-to-r ${theme.gradient} rounded-3xl p-4 sm:p-6 text-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7)] border border-white/10 relative overflow-hidden`}>
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl ${theme.iconBg} flex items-center justify-center font-black shadow-lg`}>
                <IconComponent className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight drop-shadow-sm">
                    {displayTitle}
                  </h2>
                  {displayBadgeText ? (
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white backdrop-blur-xs border border-white/15">
                      {displayBadgeText}
                    </span>
                  ) : null}
                </div>
                {displaySubtitle ? (
                  <p className="text-xs text-orange-100 font-medium">{displaySubtitle}</p>
                ) : null}
              </div>
            </div>

            {/* Right Header items: Countdown or Action Button */}
            <div className="flex items-center gap-3">
              {section.hasCountdown && timeLeft && (
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-300">
                    {section.countdownTitle || 'Bitməsinə qaldı:'}
                  </span>
                  <div className="flex items-center gap-1 font-mono font-black text-xs">
                    <span className="bg-[#060913] px-2 py-0.5 rounded-md text-white border border-white/10">{timeLeft.hours}</span>:
                    <span className="bg-[#060913] px-2 py-0.5 rounded-md text-white border border-white/10">{timeLeft.minutes}</span>:
                    <span className="bg-[#060913] px-2 py-0.5 rounded-md text-amber-400 border border-white/10 animate-pulse">{timeLeft.seconds}</span>
                  </div>
                </div>
              )}

              {section.showButton && section.buttonText && (
                <button
                  onClick={handleActionClick}
                  className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer backdrop-blur-md active:scale-95 border border-white/20 shadow-sm"
                >
                  {section.buttonText} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {limitedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 2. Standard Rich Header Card Style
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-2xl ${theme.iconBg} flex items-center justify-center shadow-[0_0_12px_rgba(255,85,0,0.25)] border border-white/10`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-lg sm:text-xl text-white drop-shadow-sm">
                {displayTitle}
              </h3>
              {displayBadgeText ? (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${theme.badgeBg}`}>
                  {displayBadgeText}
                </span>
              ) : null}
            </div>
            {displaySubtitle ? (
              <p className="text-xs text-slate-400 font-medium">{displaySubtitle}</p>
            ) : null}
          </div>
        </div>

        {/* Right side: Countdown or Action Button */}
        <div className="flex items-center gap-2.5">
          {section.hasCountdown && timeLeft && (
            <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/30">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-300 hidden sm:inline">
                {section.countdownTitle || 'Bitməsinə qaldı:'}
              </span>
              <span className="font-mono font-black text-xs text-amber-300">
                {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
              </span>
            </div>
          )}

          {section.showButton && section.buttonText && (
            <button
              onClick={handleActionClick}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {section.buttonText} <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {limitedProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};
