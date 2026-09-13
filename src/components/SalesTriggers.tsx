import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Flame,
  Zap,
  Sparkles,
  Award,
  Gift,
  Percent,
  Clock,
  ChevronRight
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { deduplicateProducts } from '../utils/productUtils';

export const SalesTriggers: React.FC = () => {
  const {
    flashSaleConfig,
    setActiveTab,
    setSelectedTagFilter,
    selectedTagFilter,
    products
  } = useStore();

  // If section is disabled or deleted from Admin Panel, do not render anything
  if (!flashSaleConfig || !flashSaleConfig.isActive || (flashSaleConfig as any).isDeleted) {
    return null;
  }

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: flashSaleConfig.timerHours ?? 5,
    minutes: flashSaleConfig.timerMinutes ?? 42,
    seconds: flashSaleConfig.timerSeconds ?? 18
  });

  useEffect(() => {
    if (!flashSaleConfig.hasTimer) return;

    if (flashSaleConfig.timerMode === 'target_datetime' && flashSaleConfig.targetEndTime) {
      const updateFromTarget = () => {
        const target = new Date(flashSaleConfig.targetEndTime!).getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, target - now);
        const totalSec = Math.floor(diff / 1000);
        const hours = Math.floor(totalSec / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const seconds = totalSec % 60;
        setTimeLeft({ hours, minutes, seconds });
      };
      updateFromTarget();
      const interval = setInterval(updateFromTarget, 1000);
      return () => clearInterval(interval);
    } else {
      // Continuous countdown
      setTimeLeft({
        hours: flashSaleConfig.timerHours ?? 5,
        minutes: flashSaleConfig.timerMinutes ?? 42,
        seconds: flashSaleConfig.timerSeconds ?? 18
      });

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: 59, seconds: 59 };
          } else if (prev.hours > 0) {
            return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
          }
          return {
            hours: flashSaleConfig.dailyResetHours ?? 6,
            minutes: 0,
            seconds: 0
          };
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [
    flashSaleConfig.hasTimer,
    flashSaleConfig.timerMode,
    flashSaleConfig.targetEndTime,
    flashSaleConfig.timerHours,
    flashSaleConfig.timerMinutes,
    flashSaleConfig.timerSeconds,
    flashSaleConfig.dailyResetHours
  ]);

  // Icon selector
  const renderIcon = () => {
    const iconClass = 'w-5 h-5 text-amber-300 fill-amber-300 animate-pulse';
    switch (flashSaleConfig.bannerIcon) {
      case 'zap':
        return <Zap className={iconClass} />;
      case 'sparkles':
        return <Sparkles className={iconClass} />;
      case 'award':
        return <Award className={iconClass} />;
      case 'gift':
        return <Gift className={iconClass} />;
      case 'percent':
        return <Percent className={iconClass} />;
      case 'flame':
      default:
        return <Flame className={iconClass} />;
    }
  };

  // Products to display in showcase
  let showcaseProducts: Product[] = [];
  if (flashSaleConfig.showProducts) {
    if (flashSaleConfig.productSource === 'manual' && flashSaleConfig.productIds?.length) {
      const map = new Map(products.map((p) => [p.id, p]));
      showcaseProducts = flashSaleConfig.productIds
        .map((id) => map.get(id))
        .filter((p): p is Product => p !== undefined);
    } else if (flashSaleConfig.productSource === 'tag' && flashSaleConfig.productTag) {
      showcaseProducts = products.filter(
        (p) => Array.isArray(p.tags) && p.tags.includes(flashSaleConfig.productTag as any)
      );
    } else {
      // default: products with flash_sale tag or with discount
      showcaseProducts = products.filter(
        (p) => (Array.isArray(p.tags) && p.tags.includes('flash_sale')) || p.discountPercent >= 20
      );
    }
    showcaseProducts = deduplicateProducts(showcaseProducts).slice(0, flashSaleConfig.maxProductsCount || 8);
  }

  const bgStyle: React.CSSProperties = flashSaleConfig.backgroundImageUrl
    ? {}
    : {
        background: `linear-gradient(135deg, ${flashSaleConfig.gradientFrom || '#ea580c'}, ${
          flashSaleConfig.gradientVia || '#dc2626'
        }, ${flashSaleConfig.gradientTo || '#d97706'})`
      };

  return (
    <div id="flash-sale-section" className="w-full max-w-7xl mx-auto px-3 sm:px-4 my-6">
      {/* Flash Sale Countdown Card */}
      <div
        style={bgStyle}
        className="rounded-3xl p-4 sm:p-6 text-white shadow-[0_15px_40px_-10px_rgba(255,85,0,0.35)] border border-orange-500/30 relative overflow-hidden flex flex-col justify-between"
      >
        {/* Background Image & Overlay if configured */}
        {flashSaleConfig.backgroundImageUrl && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${flashSaleConfig.backgroundImageUrl})` }}
            />
            <div
              className="absolute inset-0 bg-slate-950"
              style={{
                opacity: (flashSaleConfig.backgroundOverlayOpacity ?? 70) / 100
              }}
            />
          </>
        )}

        {/* Decorative Glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="p-1.5 bg-white/20 backdrop-blur-xs rounded-xl flex items-center justify-center">
                {renderIcon()}
              </span>
              <span className="font-heading font-black text-xl sm:text-2xl uppercase tracking-wider text-white">
                {flashSaleConfig.title || 'Günün Flaş Endirimləri'}
              </span>
              {flashSaleConfig.discountPercent > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider">
                  {flashSaleConfig.discountBadgeText || `${flashSaleConfig.discountPercent}%-dək Endirim`}
                </span>
              )}
            </div>
            {flashSaleConfig.subtitle && (
              <p className="text-xs sm:text-sm text-orange-100 font-medium max-w-2xl">
                {flashSaleConfig.subtitle}
              </p>
            )}
          </div>

          {/* 3D Countdown Box (only if hasTimer is true) */}
          {flashSaleConfig.hasTimer && (
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-inner flex-shrink-0 self-start sm:self-auto">
              <Clock className="w-4 h-4 text-amber-300 ml-1" />
              <div className="flex items-center gap-1 font-mono font-bold text-base">
                <div className="bg-slate-950 px-2.5 py-1 rounded-lg text-white shadow-md border border-white/10">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-amber-300 font-bold">:</span>
                <div className="bg-slate-950 px-2.5 py-1 rounded-lg text-white shadow-md border border-white/10">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-amber-300 font-bold">:</span>
                <div className="bg-slate-950 px-2.5 py-1 rounded-lg text-amber-400 shadow-md border border-white/10 animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Filter Tag Buttons */}
        {flashSaleConfig.buttons && flashSaleConfig.buttons.length > 0 && (
          <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2 pt-3 border-t border-white/20">
            <span className="text-xs font-bold text-amber-200 mr-1">Filtirlə:</span>
            {flashSaleConfig.buttons.map((btn) => {
              const isSelected =
                (btn.tagFilter && selectedTagFilter === btn.tagFilter) ||
                (btn.actionType === 'all_products' && selectedTagFilter === null);

              return (
                <button
                  key={btn.id}
                  onClick={() => {
                    if (btn.actionType === 'all_products' || btn.tagFilter === 'all') {
                      setSelectedTagFilter(null);
                      setActiveTab('home');
                    } else if (btn.actionType === 'tab' && btn.targetTab) {
                      setActiveTab(btn.targetTab);
                    } else {
                      setSelectedTagFilter(btn.tagFilter || null);
                      setActiveTab('home');
                    }
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer backdrop-blur-xs active:scale-95 flex items-center gap-1 ${
                    isSelected
                      ? 'bg-white text-slate-950 shadow-md ring-2 ring-amber-300'
                      : 'bg-white/20 hover:bg-white text-white hover:text-slate-900'
                  }`}
                >
                  {btn.label}
                  {btn.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-slate-950 font-black">
                      {btn.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Showcase Products (if showProducts is enabled) */}
        {flashSaleConfig.showProducts && showcaseProducts.length > 0 && (
          <div className="relative z-10 mt-6 pt-5 border-t border-white/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                Flaş Endirimli Məhsullar
              </h3>
              <button
                onClick={() => {
                  setSelectedTagFilter('flash_sale');
                  setActiveTab('home');
                }}
                className="text-xs font-bold text-orange-200 hover:text-white flex items-center gap-0.5 cursor-pointer"
              >
                Hamısına bax <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {showcaseProducts.map((product) => (
                <div key={product.id} className="rounded-2xl overflow-hidden shadow-lg">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
