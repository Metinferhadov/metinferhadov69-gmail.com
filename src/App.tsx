import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ToastContainer } from './components/ToastContainer';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroBanner } from './components/HeroBanner';
import { SalesTriggers } from './components/SalesTriggers';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { OrdersView } from './components/OrdersView';
import { ChatView } from './components/ChatView';
import { ProfileView } from './components/ProfileView';
import { AdminPanel } from './components/AdminPanel';
import { WishlistView } from './components/WishlistView';
import { FAQView } from './components/FAQView';
import { ReturnsPolicyView } from './components/ReturnsPolicyView';
import { FlashSalesView } from './components/FlashSalesView';
import { CategoriesView } from './components/CategoriesView';
import { AuthModal } from './components/AuthModal';
import { AuthRequiredModal } from './components/AuthRequiredModal';
import { Footer } from './components/Footer';
import { DynamicHomeSection } from './components/DynamicHomeSection';
import { AIFloatingChatWidget } from './components/AIFloatingChatWidget';
import { deduplicateProducts } from './utils/productUtils';
import {
  Zap,
  Flame,
  Award,
  Sparkles,
  Percent,
  SlidersHorizontal,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  Package,
  Grid
} from 'lucide-react';
import { motion } from 'motion/react';

const MainHomeContent: React.FC = () => {
  const {
    products,
    categories,
    homeSections,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setActiveTab
  } = useStore();

  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating' | 'discount'>('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [activeSectionTag, setActiveSectionTag] = useState<string>('all');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Active sorted home sections managed by admin (excluding the upper duplicate catalog section since all products are displayed in the bottom Bütün Məhsullar section)
  const sortedActiveSections = [...homeSections]
    .filter(
      (sec) =>
        sec.isActive &&
        !(sec as any).isDeleted &&
        sec.id !== 'sec-for-you-new' &&
        sec.title !== 'Bütün Məhsullar' &&
        !sec.title?.includes('Sənin Üçün Seçdik')
    )
    .sort((a, b) => a.order - b.order);

  // Filter products by category, search query, section tag, price range, and rating
  let filteredProducts = products.filter((p) => {
    // Category match
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
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchBrand = p.brand?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCategory && !matchBrand) return false;
    }
    // Section tag match
    if (activeSectionTag !== 'all') {
      if (!p.tags.includes(activeSectionTag as any)) return false;
    }
    // Price range
    if (priceRange && (p.price < (priceRange[0] ?? 0) || p.price > (priceRange[1] ?? 99999))) return false;
    // Min rating
    if (p.rating < minRating) return false;

    return true;
  });

  // Sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
    // default popular
    return b.salesCount - a.salesCount;
  });

  // Deduplicate filtered products to ensure no product is duplicated
  filteredProducts = deduplicateProducts(filteredProducts);

  // Deduplicated products list for guaranteed single render
  const uniqueProducts = deduplicateProducts(products);

  // Dedicated sections for Home feed
  const flashSaleProducts = uniqueProducts.filter((p) => p.tags.includes('flash_sale'));
  const dailyDealsProducts = uniqueProducts.filter((p) => p.tags.includes('daily_deal'));
  const bestSellersProducts = uniqueProducts.filter((p) => p.tags.includes('best_seller'));
  const newArrivalsProducts = uniqueProducts.filter((p) => p.tags.includes('new_arrival'));
  const forYouProducts = uniqueProducts.filter((p) => p.tags.includes('for_you'));

  const isFilteringOrSearching = !!selectedCategory || !!searchQuery.trim() || activeSectionTag !== 'all';

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Urgency Sales Triggers (Top ribbon & live purchase alerts) */}
      <SalesTriggers />

      {/* 2. 3D Hero Carousel (Shown on default feed) */}
      {!isFilteringOrSearching && <HeroBanner />}

      {/* 3. Section Tag Pills */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-2">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'Bütün Təkliflər', icon: Sparkles },
              { id: 'flash_sale', label: '⚡ Flaş Satış', icon: Zap },
              { id: 'daily_deal', label: '🔥 Günün Fürsəti', icon: Flame },
              { id: 'best_seller', label: '👑 Çox Satılanlar', icon: Award },
              { id: 'new_arrival', label: '✨ Yeni Gələnlər', icon: Sparkles },
              { id: 'discount', label: '🏷️ Super Endirim', icon: Percent }
            ].map((tag) => {
              const Icon = tag.icon;
              const isActive = activeSectionTag === tag.id;
              return (
                <button
                  key={tag.id}
                  onClick={() => {
                    setActiveSectionTag(tag.id);
                  }}
                  className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_15px_rgba(255,85,0,0.4)] scale-105'
                      : 'bg-[#0c1324] text-slate-300 hover:bg-[#131d36] border border-white/10 shadow-sm'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tag.label}
                </button>
              );
            })}
          </div>

          {/* Sort & Filter Toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[#0c1324] border border-white/15 rounded-2xl text-xs font-bold text-slate-200 shadow-sm focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="popular">Ən Populyar</option>
              <option value="price_asc">Qiymət: Ucuzdan Bahaya</option>
              <option value="price_desc">Qiymət: Bahadan Ucuza</option>
              <option value="rating">Reytinqə Görə</option>
              <option value="discount">Ən Yüksək Endirim</option>
            </select>
          </div>
        </div>
      </div>

      {/* If User is Searching or Filter is active, display uniform Search Grid */}
      {isFilteringOrSearching ? (
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-black text-lg sm:text-2xl text-white">
                {searchQuery
                  ? `"${searchQuery}" axtarış nəticələri`
                  : categories.find((c) => c.id === selectedCategory)?.name || 'Seçilmiş Məhsullar'}
              </h2>
              <p className="text-xs text-slate-400">
                Tapıldı: <strong className="text-orange-400">{filteredProducts.length} məhsul</strong>
              </p>
            </div>

            {(selectedCategory || searchQuery || activeSectionTag !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                  setActiveSectionTag('all');
                }}
                className="text-xs font-bold text-red-400 hover:underline cursor-pointer"
              >
                Filtrləri sıfırla ✕
              </button>
            )}
          </div>

          {/* Geyim alt-kateqoriya seçimi: Uşaq / Qız / Kişi */}
          {(selectedCategory === 'fashion' ||
            selectedCategory === 'clothing_kids' ||
            selectedCategory === 'clothing_girls' ||
            selectedCategory === 'clothing_men') && (
            <div className="flex items-center gap-2 mb-5 overflow-x-auto no-scrollbar py-1 bg-[#0c1324] border border-white/10 p-2 rounded-2xl">
              <span className="text-xs font-bold text-slate-300 whitespace-nowrap pl-1">👕 Geyim:</span>
              <button
                onClick={() => setSelectedCategory('clothing_kids')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCategory === 'clothing_kids'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                    : 'bg-[#101932] text-slate-300 hover:bg-[#162244] border border-white/10'
                }`}
              >
                <span>👦</span>
                <span>Uşaq Geyimləri</span>
              </button>
              <button
                onClick={() => setSelectedCategory('clothing_girls')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCategory === 'clothing_girls'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                    : 'bg-[#101932] text-slate-300 hover:bg-[#162244] border border-white/10'
                }`}
              >
                <span>👧</span>
                <span>Qız Geyimləri</span>
              </button>
              <button
                onClick={() => setSelectedCategory('clothing_men')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  selectedCategory === 'clothing_men'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                    : 'bg-[#101932] text-slate-300 hover:bg-[#162244] border border-white/10'
                }`}
              >
                <span>👨</span>
                <span>Kişi Geyimləri</span>
              </button>
              <button
                onClick={() => setSelectedCategory('fashion')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === 'fashion'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                    : 'bg-[#101932] text-slate-300 hover:bg-[#162244] border border-white/10'
                }`}
              >
                Bütün Geyimlər
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="bg-[#0c1324] rounded-3xl p-12 text-center border border-white/10 max-w-md mx-auto shadow-xl">
              <Search className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="font-heading font-black text-base text-white">
                Uyğun məhsul tapılmadı
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Axtarış sözünü dəyişməyə və ya filtrləri təmizləməyə çalışın.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                  setActiveSectionTag('all');
                }}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-[0_0_12px_rgba(255,85,0,0.35)]"
              >
                Bütün Məhsullara Bax
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Dynamic Home Feed Managed Fully by Admin Panel */
        <div className="space-y-12">
          {sortedActiveSections.map((section) => (
            <DynamicHomeSection
              key={section.id}
              section={section}
              onFilterTagSelect={(tag) => setActiveSectionTag(tag)}
            />
          ))}

          {/* Real-time Synchronized Full Catalog Grid on Home Page */}
          <section className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/15 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                    Canlı Kataloq
                  </span>
                </div>
                <h2 className="font-heading font-black text-xl sm:text-2xl text-white flex items-center gap-2">
                  <Package className="w-6 h-6 text-orange-400" /> Bütün Məhsullar
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Admin Panelindən dərhal sinxronlaşan çeşidlər • Cəmi{' '}
                  <strong className="text-white font-bold">{uniqueProducts.length} məhsul</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('categories')}
                  className="px-4 py-2 bg-[#0c1324] hover:bg-[#131d36] text-slate-200 font-bold text-xs rounded-xl border border-white/10 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Grid className="w-3.5 h-3.5 text-cyan-400" /> Kateqoriyalar üzrə
                </button>
              </div>
            </div>

            {uniqueProducts.length === 0 ? (
              <div className="bg-[#0c1324] rounded-3xl p-10 text-center border border-white/10 max-w-md mx-auto shadow-xl">
                <Package className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="font-heading font-black text-base text-white">
                  Hələlik heç bir məhsul yoxdur
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Admin Panelindən yeni məhsul əlavə etdikdə burada avtomatik görünəcək.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {uniqueProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, hasAdminRights, isAuthLoading, selectedProduct, setSelectedProduct } = useStore();

  useEffect(() => {
    // If a non-admin tries to navigate to admin tab via URL hash (#admin), redirect immediately to home
    if (activeTab === 'admin' && !hasAdminRights && !isAuthLoading) {
      setActiveTab('home');
    }
  }, [activeTab, hasAdminRights, isAuthLoading, setActiveTab]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#060913] text-slate-100 selection:bg-orange-500 selection:text-white font-sans antialiased">
      {/* Fixed Toast Container */}
      <ToastContainer />

      {/* Main Header with Search & Navigation */}
      <Header />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 w-full max-w-full pb-20 md:pb-8">
        {activeTab === 'home' && <MainHomeContent />}
        {activeTab === 'categories' && <CategoriesView />}
        {activeTab === 'cart' && <CartView />}
        {activeTab === 'checkout' && <CheckoutView />}
        {(activeTab === 'orders' || activeTab === 'order_detail') && <OrdersView />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'admin' && hasAdminRights && <AdminPanel />}
        {activeTab === 'wishlist' && <WishlistView />}
        {activeTab === 'flash_sales' && <FlashSalesView />}
        {activeTab === 'faq' && <FAQView />}
        {activeTab === 'returns' && <ReturnsPolicyView />}
      </main>

      {/* Auth Modal for protected actions like Live Support */}
      <AuthModal />
      <AuthRequiredModal />

      {/* 3D Interactive Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Fixed Tab Bar */}
      <MobileBottomNav />

      {/* Floating AI & Live Support Assistant Widget */}
      <AIFloatingChatWidget />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
