import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BannerManager } from './BannerManager';
import { HomeSectionsManager } from './HomeSectionsManager';
import { FlashSalesManager } from './FlashSalesManager';
import { DynamicHomeSection } from './DynamicHomeSection';
import { HeroBanner } from './HeroBanner';
import {
  Sliders,
  Layers,
  Zap,
  Eye,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Flame,
  Award,
  ArrowRight,
  ShieldCheck,
  LayoutTemplate
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomeManagementPanelProps {
  initialSubTab?: 'banners' | 'sections' | 'flash_sales' | 'preview';
}

export const HomeManagementPanel: React.FC<HomeManagementPanelProps> = ({
  initialSubTab = 'sections'
}) => {
  const {
    banners,
    homeSections,
    flashSaleConfig,
    setActiveTab,
    refreshHomeData,
    showToast
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'banners' | 'sections' | 'flash_sales' | 'preview'>(
    initialSubTab
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeBannersCount = banners.filter((b) => b.active).length;
  const activeSectionsCount = homeSections.filter((s) => s.isActive).length;

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (refreshHomeData) {
        await refreshHomeData();
      }
      showToast('Ana Səhifə məlumatları Firestore ilə tam sinxronlaşdırıldı!', 'success');
    } catch (err) {
      showToast('Sinxronlaşma zamanı xəta baş verdi', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Single Source of Truth & Live Synchronization Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-700/60 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500 text-white shadow-xs flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Ana Səhifəni İdarə Et
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Vahid Database ilə Real-Vaxtda Sinxron
              </span>
            </div>

            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
              Ana Səhifə İdarəetmə Paneli
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Bu bölmədə etdiyiniz bütün dəyişikliklər — <strong>Bannerlərin mətni, şəkli, linki, sırası</strong> və{' '}
              <strong>Ana Səhifə bölmələri (Günün Fürsətləri, Flaş Satışlar, Ən Çox Satılanlar və s.)</strong> real
              olaraq istifadəçilərin gördüyü Ana Səhifədə avtomatik tətbiq olunur.
            </p>
          </div>

          {/* Quick Actions & Live Stats */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              title="Firestore bazasından yenidən yüklə"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-400' : 'text-slate-300'}`} />
              <span>{isRefreshing ? 'Yenilənir...' : 'Baza ilə Sinxronlaşdır'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Eye className="w-4 h-4" />
              <span>Ana Səhifəyə Bax</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60 text-xs">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-slate-400 font-medium text-[11px]">Karusel Bannerləri</div>
            <div className="text-lg font-black text-white mt-0.5">
              {banners.length} <span className="text-[11px] font-bold text-emerald-400">({activeBannersCount} aktiv)</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-slate-400 font-medium text-[11px]">Ana Səhifə Bölmələri</div>
            <div className="text-lg font-black text-white mt-0.5">
              {homeSections.length} <span className="text-[11px] font-bold text-emerald-400">({activeSectionsCount} aktiv)</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-slate-400 font-medium text-[11px]">Flaş Satış Rejimi</div>
            <div className="text-lg font-black mt-0.5">
              {flashSaleConfig.isActive ? (
                <span className="text-emerald-400 font-bold">Aktiv (90%-dək)</span>
              ) : (
                <span className="text-slate-400 font-bold">Deaktiv</span>
              )}
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <div className="text-slate-400 font-medium text-[11px]">Sinxron Mənbə</div>
            <div className="text-lg font-black text-white mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-200">Firestore Cloud DB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200">
        {[
          {
            id: 'sections',
            label: '📑 Ana Səhifə Bölmələri',
            badge: `${activeSectionsCount}/${homeSections.length} aktiv`,
            desc: 'Günün Fürsətləri, Flaş Satışlar, Ən Çox Satılanlar, Sənin Üçün Seçdik'
          },
          {
            id: 'banners',
            label: '🎨 Karusel Bannerləri',
            badge: `${activeBannersCount}/${banners.length} aktiv`,
            desc: 'Şəkillər, başlıqlar, düymə mətni və linkləri'
          },
          {
            id: 'flash_sales',
            label: '⚡ Flaş Satış Konfiqurasiyası',
            badge: flashSaleConfig.isActive ? 'Aktiv' : 'Deaktiv',
            desc: 'Flaş satış taymeri və xüsusi endirim faizi'
          },
          {
            id: 'preview',
            label: '📱 Canlı Mini Önizləmə',
            badge: 'İnteraktiv',
            desc: 'İstifadəçi gözü ilə anında baxış'
          }
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-3 rounded-2xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                isActive
                  ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* SubTab Content */}
      <div>
        {activeSubTab === 'sections' && (
          <div>
            <HomeSectionsManager />
          </div>
        )}

        {activeSubTab === 'banners' && (
          <div>
            <BannerManager />
          </div>
        )}

        {activeSubTab === 'flash_sales' && (
          <div>
            <FlashSalesManager />
          </div>
        )}

        {activeSubTab === 'preview' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                  <LayoutTemplate className="w-5 h-5 text-orange-600" />
                  İstifadəçilərin Gördüyü Canlı Ana Səhifə (Canlı Önizləmə)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aşağıda istifadəçilərin saytda real olaraq gördüyü Karusel Banneri və Vitrin Bölmələri əks olunur.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('home')}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Real Sayta Keç
              </button>
            </div>

            {/* Live Banner View */}
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 px-1">
                1. Karusel Banner Bölməsi (Yuxarı Vitrin)
              </div>
              <HeroBanner />
            </div>

            {/* Live Sections View */}
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-8">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
                2. Dinamik Vitrin Bölmələri (Ardıcıllıqla)
              </div>

              {homeSections
                .filter((s) => s.isActive)
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <DynamicHomeSection key={section.id} section={section} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
