import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { deduplicateProducts } from '../utils/productUtils';
import {
  Grid,
  Sparkles,
  Search,
  SlidersHorizontal,
  Zap,
  Tag
} from 'lucide-react';
import { motion } from 'motion/react';

export const CategoriesView: React.FC = () => {
  const {
    categories,
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setActiveTab
  } = useStore();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  // Deduplicate products so each product appears only once
  const uniqueProducts = deduplicateProducts(products);

  // Filter products by selected category and optional tag or search
  const filteredProducts = deduplicateProducts(
    uniqueProducts.filter((p) => {
      if (selectedCategory) {
        if (selectedCategory === 'fashion') {
          const isClothing =
            p.categoryId === 'fashion' ||
            p.categoryId === 'clothing_kids' ||
            p.categoryId === 'clothing_girls' ||
            p.categoryId === 'clothing_men';
          if (!isClothing) return false;
        } else if (p.categoryId !== selectedCategory) {
          return false;
        }
      }
      if (selectedTag && !p.tags.includes(selectedTag as any)) return false;
      if (localSearch.trim()) {
        const q = localSearch.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
        );
      }
      return true;
    })
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Category Explorer Header */}
      <div className="bg-gradient-to-r from-[#070b16] via-[#101b38] to-[#070b16] rounded-3xl p-5 sm:p-8 text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9)] border border-white/15 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-cyan-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-cyan-400/20 shadow-sm">
              <Grid className="w-3.5 h-3.5" /> Bütün Bölmələr və Kateqoriyalar
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-white drop-shadow-md">
              {activeCategoryObj ? activeCategoryObj.name : 'Məhsul Kataloqu'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {activeCategoryObj
                ? `${activeCategoryObj.name} bölməsində mövcud olan ən son və keyfiyyətli məhsullar`
                : 'İstədiyiniz kateqoriyanı seçərək minlərlə çeşid arasından sizə uyğun olanı tapın'}
            </p>
          </div>

          {/* Quick Search inside Categories */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Bölmə daxilində axtar..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Horizontal Category Cards Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-black text-base sm:text-lg text-white flex items-center gap-2 drop-shadow-sm">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" /> Kateqoriyaları Seçin
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 hover:underline cursor-pointer transition-colors"
            >
              Hamısını göstər
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {/* All categories pill/card */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'bg-[#0c1324]/85 text-slate-200 border-white/10 hover:border-cyan-400/30 hover:bg-[#121c35] shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">✨</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedCategory === null ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-300'
                }`}
              >
                {uniqueProducts.length}
              </span>
            </div>
            <span className="font-heading font-bold text-xs">Bütün Məhsullar</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const categoryProductCount = uniqueProducts.filter((p) => p.categoryId === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400/40 shadow-[0_0_15px_rgba(255,85,0,0.4)]'
                    : 'bg-[#0c1324]/85 text-slate-200 border-white/10 hover:border-orange-400/30 hover:bg-[#121c35] shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {categoryProductCount}
                  </span>
                </div>
                <span className="font-heading font-bold text-xs truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Geyim alt-kateqoriya seçimi: Uşaq / Qız / Kişi */}
      {(selectedCategory === 'fashion' ||
        selectedCategory === 'clothing_kids' ||
        selectedCategory === 'clothing_girls' ||
        selectedCategory === 'clothing_men') && (
        <div className="bg-[#0c1324]/90 border border-white/10 rounded-2xl p-3 mb-4 flex flex-wrap items-center gap-2 shadow-lg">
          <span className="text-xs font-black text-slate-200 flex items-center gap-1 mr-1">
            👕 Geyim Bölməsi:
          </span>
          <button
            onClick={() => setSelectedCategory('clothing_kids')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedCategory === 'clothing_kids'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_12px_rgba(255,85,0,0.35)]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>👦</span>
            <span>Uşaq Geyimləri</span>
          </button>
          <button
            onClick={() => setSelectedCategory('clothing_girls')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedCategory === 'clothing_girls'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_12px_rgba(255,85,0,0.35)]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>👧</span>
            <span>Qız Geyimləri</span>
          </button>
          <button
            onClick={() => setSelectedCategory('clothing_men')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedCategory === 'clothing_men'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_12px_rgba(255,85,0,0.35)]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>👨</span>
            <span>Kişi Geyimləri</span>
          </button>
          <button
            onClick={() => setSelectedCategory('fashion')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'fashion'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_12px_rgba(255,85,0,0.35)]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            Bütün Geyimlər
          </button>
        </div>
      )}

      {/* Filter tags */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedTag === null
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(0,240,255,0.4)] border border-cyan-400/30'
              : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
          }`}
        >
          Bütün Teqlər
        </button>
        <button
          onClick={() => setSelectedTag(selectedTag === 'flash_sale' ? null : 'flash_sale')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
            selectedTag === 'flash_sale'
              ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)] border border-red-500/30'
              : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
          }`}
        >
          <Zap className="w-3 h-3" /> Flaş Satış
        </button>
        <button
          onClick={() => setSelectedTag(selectedTag === 'top_seller' ? null : 'top_seller')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
            selectedTag === 'top_seller'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)] border border-amber-500/30'
              : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20'
          }`}
        >
          <Sparkles className="w-3 h-3" /> Ən Çox Satılanlar
        </button>
        <button
          onClick={() => setSelectedTag(selectedTag === 'for_you' ? null : 'for_you')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
            selectedTag === 'for_you'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] border border-purple-500/30'
              : 'bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/20'
          }`}
        >
          <Tag className="w-3 h-3" /> Sənin Üçün
        </button>
      </div>

      {/* Product Grid Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-black text-lg text-white drop-shadow-sm">
            Məhsullar ({filteredProducts.length})
          </h3>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-[#0c1324]/80 rounded-3xl p-10 text-center border border-white/10 shadow-lg">
            <p className="text-slate-400 text-sm">Bu seçimə uyğun heç bir məhsul tapılmadı.</p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedTag(null);
                setLocalSearch('');
              }}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-xl cursor-pointer hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,85,0,0.35)]"
            >
              Filtirləri sıfırla
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
