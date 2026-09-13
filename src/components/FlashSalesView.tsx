import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { deduplicateProducts } from '../utils/productUtils';
import {
  Zap,
  Flame,
  Clock,
  Sparkles,
  Percent,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { motion } from 'motion/react';

export const FlashSalesView: React.FC = () => {
  const { products, setActiveTab, setSelectedCategory } = useStore();
  const [filterType, setFilterType] = useState<'all' | 'flash_sale' | 'daily_deal' | 'discount'>('all');

  const flashProducts = deduplicateProducts(
    products.filter((p) => {
      if (filterType === 'flash_sale') return p.tags.includes('flash_sale');
      if (filterType === 'daily_deal') return p.tags.includes('daily_deal');
      if (filterType === 'discount') return p.discountPercent >= 40;
      return p.tags.includes('flash_sale') || p.tags.includes('daily_deal') || p.discountPercent >= 30;
    })
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Flash Sale Banner with Live Glow */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 p-6 sm:p-10 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-white">
            <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>Məhdud Sayda & Vaxtlı Fürsətlər</span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
            ⚡ Flaş Satışlar & Günün Fürsətləri
          </h1>
          <p className="text-sm text-white/90 leading-relaxed max-w-xl">
            Seçilmiş premium məhsullara 70%-dək xüsusi endirimlər! 35 AZN-dən yuxarı sifarişlərdə sürətli çatdırılma tamamilə pulsuzdur.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-mono font-bold tracking-wider">Bitməsinə: 08 saat : 42 dəq : 15 san</span>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'Bütün Flaş Təkliflər', icon: Sparkles },
            { id: 'flash_sale', label: '⚡ Flaş Satış (-50% və daha çox)', icon: Zap },
            { id: 'daily_deal', label: '🔥 Günün Fürsəti', icon: Flame },
            { id: 'discount', label: '🏷️ Super Endirim', icon: Percent }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = filterType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_15px_rgba(255,85,0,0.4)] scale-105'
                    : 'bg-[#0c1324] text-slate-300 hover:bg-[#131d36] border border-white/10 shadow-sm'
                }`}
              >
                <Icon className="w-4 h-4 text-orange-400" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {flashProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
