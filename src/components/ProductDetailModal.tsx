import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Plus,
  Minus,
  Check,
  Zap,
  Share2,
  ThumbsUp,
  Send,
  Sparkles,
  Play,
  Film,
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductCard } from './ProductCard';
import { deduplicateProducts } from '../utils/productUtils';
import { SafeVideoPlayer } from './SafeVideoPlayer';

interface ProductDetailModalProps {
  product?: Product;
  onClose?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product: propProduct, onClose: propOnClose }) => {
  const {
    selectedProduct: contextProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setActiveTab,
    products,
    showToast,
    sendChatMessage
  } = useStore();

  const selectedProduct = propProduct || contextProduct;

  const handleClose = () => {
    try {
      localStorage.removeItem('mmz_active_product_id');
      if (typeof window !== 'undefined' && window.location.hash.startsWith('#product-')) {
        window.history.back();
      }
    } catch (_) {}

    if (propOnClose) {
      propOnClose();
    } else {
      setSelectedProduct(null);
    }
  };

  // Prevent background scrolling, handle URL sync and phone back button
  useEffect(() => {
    if (!selectedProduct) return;

    // Lock background scrolling completely and prevent any horizontal overflow
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyOverflowX = document.body.style.overflowX;
    const originalHtmlOverflowX = document.documentElement.style.overflowX;

    document.body.style.overflow = 'hidden';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';

    // Sync URL hash
    const targetHash = `#product-${selectedProduct.id}`;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mmz_active_product_id', selectedProduct.id);
        if (window.location.hash !== targetHash) {
          window.history.pushState({ productId: selectedProduct.id }, '', targetHash);
        }
      } catch (_) {}
    }

    // Phone back button listener
    const handlePopState = () => {
      if (typeof window !== 'undefined' && !window.location.hash.startsWith('#product-')) {
        if (propOnClose) {
          propOnClose();
        } else {
          setSelectedProduct(null);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.overflowX = originalBodyOverflowX;
      document.documentElement.style.overflowX = originalHtmlOverflowX;
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedProduct, propOnClose, setSelectedProduct]);

  if (!selectedProduct) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [mediaMode, setMediaMode] = useState<'images' | 'videos'>('images');
  const [selectedColor, setSelectedColor] = useState<string>(
    selectedProduct.colors && selectedProduct.colors.length > 0 ? selectedProduct.colors[0] : ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    selectedProduct.sizes && selectedProduct.sizes.length > 0 ? selectedProduct.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveInfoTab] = useState<'desc' | 'specs' | 'reviews' | 'videos' | 'similar'>('desc');
  const [is3DMode, setIs3DMode] = useState<boolean>(false);

  const productVideos = React.useMemo(() => {
    const list: string[] = [];
    if (Array.isArray(selectedProduct.videos)) {
      list.push(...selectedProduct.videos.filter((v): v is string => typeof v === 'string' && v.trim().length > 0));
    }
    if (typeof (selectedProduct as any)?.video === 'string' && (selectedProduct as any).video.trim().length > 0) {
      const single = (selectedProduct as any).video.trim();
      if (!list.includes(single)) {
        list.push(single);
      }
    }
    return list;
  }, [selectedProduct]);
  const hasVideos = productVideos.length > 0;

  // New review form state
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState('');

  const isFavorite = isWishlisted(selectedProduct.id);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedColor, selectedSize);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedProduct.title,
        text: selectedProduct.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Məhsul linki kopyalandı!', 'success');
    }
  };

  const handleAskVendor = () => {
    sendChatMessage(
      `Salam! "${selectedProduct.title}" məhsulu haqqında əlavə sualım var.`,
      undefined,
      selectedProduct
    );
    setSelectedProduct(null);
    setActiveTab('chat');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      userName: newReviewName.trim() || 'Müştəri',
      rating: newReviewRating,
      date: 'İndicə',
      comment: newReviewText.trim(),
      verifiedPurchase: true,
      likes: 0
    };

    if (!selectedProduct.reviews) {
      selectedProduct.reviews = [];
    }
    selectedProduct.reviews.unshift(newRev);
    selectedProduct.reviewsCount += 1;

    setNewReviewText('');
    setNewReviewName('');
    showToast('Rəyiniz uğurla əlavə edildi! Təşəkkür edirik.', 'success');
  };

  const similarProducts = deduplicateProducts(
    products.filter((p) => p.categoryId === selectedProduct.categoryId && p.id !== selectedProduct.id)
  ).slice(0, 4);

  return (
    <AnimatePresence>
      <motion.div
        key="fullscreen-product-detail"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        id="product-detail-fullscreen-view"
        className="fixed inset-0 z-[120] w-screen max-w-[100vw] h-full min-h-screen bg-[#060913] overflow-y-auto overflow-x-hidden overscroll-contain flex flex-col text-slate-100 box-border"
        style={{ width: '100vw', maxWidth: '100vw', boxSizing: 'border-box', overflowX: 'hidden' }}
      >
        {/* Top Sticky Full-Width Navigation Header */}
        <header className="sticky top-0 z-40 w-full max-w-full bg-[#070b16]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden box-border">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 box-border">
            {/* Left: Back button & Breadcrumbs */}
            <div className="flex items-center gap-1.5 sm:gap-4 min-w-0 flex-1 overflow-hidden">
              <button
                onClick={handleClose}
                id="product-detail-back-button"
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-200 hover:text-orange-400 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/40 transition-all flex items-center gap-1.5 font-bold text-xs sm:text-sm cursor-pointer shadow-sm group flex-shrink-0"
                title="Geri qayıt"
                aria-label="Geri"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5 text-slate-300 group-hover:text-orange-400" />
                <span className="hidden sm:inline">Geri</span>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-400 font-medium truncate min-w-0">
                <span className="font-bold text-white truncate">{selectedProduct.brand || 'MMZ ONLINE'}</span>
                <span>/</span>
                <span className="text-orange-400 font-semibold truncate">{selectedProduct.category}</span>
              </div>
            </div>

            {/* Right: Share, Wishlist & Clear Prominent "X" Close Button */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              <button
                onClick={handleShare}
                id="product-detail-share-btn"
                className="p-2 sm:p-2.5 text-slate-300 hover:text-orange-400 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors cursor-pointer"
                title="Paylaş"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                id="product-detail-wishlist-btn"
                className={`p-2 sm:p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'text-red-400 bg-red-500/15 border-red-500/30'
                    : 'text-slate-300 hover:text-red-400 bg-white/5 hover:bg-white/10 border-white/10'
                }`}
                title="Sevimlilərə əlavə et"
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-red-400' : ''}`} />
              </button>

              {/* Clear, High-Contrast "X" Close Button */}
              <button
                onClick={handleClose}
                id="product-detail-close-x-btn"
                className="flex items-center gap-1.5 px-2.5 py-2 sm:px-4 sm:py-2.5 bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-slate-200 rounded-xl border border-white/15 hover:border-red-500/40 transition-all font-bold text-xs sm:text-sm cursor-pointer shadow-sm group"
                title="Bağla və əvvəlki səhifəyə qayıt"
                aria-label="Bağla"
              >
                <X className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-slate-300 group-hover:text-red-400 transition-colors" />
                <span className="font-bold text-xs sm:text-sm">Bağla</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Full-Screen Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10 space-y-6 sm:space-y-8 overflow-x-hidden box-border">
          {/* Top Showcase: Media Gallery on Left & Buying Details on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start max-w-full">
            {/* Left Column: Media Gallery (Images, 3D, Videos) */}
            <div className="lg:col-span-7 space-y-4 max-w-full overflow-hidden">
              {/* Media Type Switcher (if video exists) */}
              {hasVideos && (
                <div className="flex items-center gap-2 p-1.5 bg-[#0c1324] border border-white/10 rounded-2xl w-fit shadow-md">
                  <button
                    type="button"
                    onClick={() => setMediaMode('images')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mediaMode === 'images'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_12px_rgba(255,85,0,0.4)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Şəkillər ({selectedProduct.images?.length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaMode('videos')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      mediaMode === 'videos'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.4)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    Videolar ({productVideos.length})
                  </button>
                </div>
              )}

              {/* Main Media Box */}
              {mediaMode === 'images' ? (
                <div
                  className={`relative aspect-square sm:aspect-4/3 lg:aspect-square rounded-3xl bg-[#0b1120] overflow-hidden border border-white/10 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7)] flex items-center justify-center ${
                    is3DMode ? 'animate-float ring-2 ring-orange-500 shadow-orange-500/20' : ''
                  }`}
                >
                  <img
                    src={selectedProduct.images?.[activeImageIndex] || selectedProduct.images?.[0] || ''}
                    alt={selectedProduct.title}
                    className="w-full h-full object-contain p-4 sm:p-6 transition-all duration-300"
                  />

                  {/* 3D View Toggle Badge */}
                  <button
                    onClick={() => setIs3DMode(!is3DMode)}
                    className="absolute top-4 right-4 px-3.5 py-2 bg-[#060913]/85 hover:bg-[#060913] text-white backdrop-blur-md text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg border border-white/15 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {is3DMode ? '3D Rejimi Aktivdir' : '3D Baxış'}
                  </button>

                  {/* Discount badge */}
                  {selectedProduct.discountPercent > 0 && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center gap-1 border border-red-500/30">
                      <Zap className="w-4 h-4 fill-white" />
                      -{selectedProduct.discountPercent}% ENDİRİM
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square rounded-3xl bg-black overflow-hidden border border-white/15 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8)] flex items-center justify-center">
                  <SafeVideoPlayer
                    key={productVideos[activeVideoIndex]}
                    src={productVideos[activeVideoIndex]}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Thumbnails row for images */}
              {mediaMode === 'images' && selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#0b1120] border-2 transition-all cursor-pointer flex-shrink-0 p-1 ${
                        activeImageIndex === idx
                          ? 'border-orange-500 ring-2 ring-orange-500/30 shadow-[0_0_12px_rgba(255,85,0,0.4)] scale-105'
                          : 'border-white/10 hover:border-cyan-400/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Video pills if multiple videos */}
              {mediaMode === 'videos' && productVideos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {productVideos.map((_, vIdx) => (
                    <button
                      key={vIdx}
                      onClick={() => setActiveVideoIndex(vIdx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeVideoIndex === vIdx
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-[#0c1324] border border-white/10 text-slate-300 hover:bg-[#121c35]'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" /> Video #{vIdx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Purchasing & Stock Controls Card */}
            <div className="lg:col-span-5 bg-[#0c1324]/90 backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-white/10 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7)] space-y-6 max-w-full overflow-hidden box-border">
              <div>
                {/* Rating & Review Counter */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 bg-amber-500/15 text-amber-300 font-black text-xs px-2.5 py-1 rounded-lg border border-amber-500/30">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{selectedProduct.rating}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    ({selectedProduct.reviewsCount} müştəri rəyi)
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                    ✓ {selectedProduct.salesCount} ədəd satılıb
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-white leading-tight drop-shadow-sm">
                  {selectedProduct.title}
                </h1>
                {selectedProduct.subtitle && (
                  <p className="text-sm text-slate-400 mt-1.5 font-medium">
                    {selectedProduct.subtitle}
                  </p>
                )}

                {/* Pricing Box */}
                <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 via-[#101b38]/40 to-slate-900/60 border border-orange-500/30 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 max-w-full box-border shadow-inner">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                      Flaş Endirimli Qiymət
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-heading font-black text-3xl sm:text-4xl text-orange-400 drop-shadow-[0_0_12px_rgba(255,85,0,0.3)]">
                        {(selectedProduct.price ?? 0).toFixed(2)}{' '}
                        <span className="text-lg font-bold">AZN</span>
                      </span>
                      {(selectedProduct.oldPrice ?? 0) > (selectedProduct.price ?? 0) && (
                        <span className="text-sm sm:text-base text-slate-500 line-through font-semibold">
                          {(selectedProduct.oldPrice ?? 0).toFixed(2)} AZN
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm text-emerald-300 font-bold bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-xl">
                      Qənaət: {Math.max(0, (selectedProduct.oldPrice ?? 0) - (selectedProduct.price ?? 0)).toFixed(2)} AZN
                    </span>
                  </div>
                </div>

                {/* Color Selector */}
                {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                  <div className="mt-5">
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      Rəng Seçimi: <span className="text-orange-400 font-extrabold">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                            selectedColor === c
                              ? 'border-orange-500 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_12px_rgba(255,85,0,0.4)]'
                              : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          {selectedColor === c && <Check className="w-3.5 h-3.5" />}
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="mt-5">
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      Ölçü / Model Seçimi:{' '}
                      <span className="text-orange-400 font-extrabold">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
                            selectedSize === s
                              ? 'border-orange-500 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_12px_rgba(255,85,0,0.4)]'
                              : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Stock Counter */}
                <div className="mt-5 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Məhsul Sayı:
                    </label>
                    <div className="flex items-center border border-white/15 rounded-xl bg-[#070b16] p-1 shadow-inner">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-300 cursor-pointer transition-colors"
                        title="Azalt"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-heading font-black text-base text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                        className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-slate-300 cursor-pointer transition-colors"
                        title="Artır"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-medium block">Mövcud Stok:</span>
                    <span className="font-heading font-black text-sm sm:text-base text-white">
                      {selectedProduct.stock} ədəd anbarda
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">
                      ✓ Dərhal göndərişə hazır
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <button
                  onClick={handleAddToCart}
                  id="product-detail-add-to-cart-btn"
                  className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base sm:text-lg rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(255,85,0,0.4)] transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
                >
                  <ShoppingBag className="w-6 h-6" /> Səbətə Əlavə Et
                </button>

                <button
                  onClick={handleAskVendor}
                  id="product-detail-ask-vendor-btn"
                  className="w-full py-2.5 text-xs sm:text-sm font-bold text-slate-400 hover:text-cyan-400 hover:underline transition-colors text-center cursor-pointer"
                >
                  💬 Satıcı və ya MMZ Dəstək ilə canlı sual-cavab et
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Tabs Card: Description, Specs, Reviews, Videos, Similar Products */}
          <div className="bg-[#0c1324]/90 backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-white/10 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7)] max-w-full overflow-hidden box-border">
            <div className="flex border-b border-white/10 gap-3 sm:gap-8 overflow-x-auto no-scrollbar max-w-full">
              <button
                onClick={() => setActiveInfoTab('desc')}
                className={`pb-3 text-sm sm:text-base font-bold whitespace-nowrap cursor-pointer transition-all relative ${
                  activeTab === 'desc'
                    ? 'text-orange-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Məhsul Haqqında
                {activeTab === 'desc' && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 shadow-[0_0_8px_rgba(255,85,0,0.6)] rounded-full"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveInfoTab('specs')}
                className={`pb-3 text-sm sm:text-base font-bold whitespace-nowrap cursor-pointer transition-all relative ${
                  activeTab === 'specs'
                    ? 'text-orange-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Xüsusiyyətlər
                {activeTab === 'specs' && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 shadow-[0_0_8px_rgba(255,85,0,0.6)] rounded-full"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveInfoTab('reviews')}
                className={`pb-3 text-sm sm:text-base font-bold whitespace-nowrap cursor-pointer transition-all relative ${
                  activeTab === 'reviews'
                    ? 'text-orange-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Müştəri Rəyləri ({selectedProduct.reviewsCount})
                {activeTab === 'reviews' && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 shadow-[0_0_8px_rgba(255,85,0,0.6)] rounded-full"
                  />
                )}
              </button>

              {hasVideos && (
                <button
                  onClick={() => setActiveInfoTab('videos')}
                  className={`pb-3 text-sm sm:text-base font-bold whitespace-nowrap cursor-pointer transition-all relative ${
                    activeTab === 'videos'
                      ? 'text-orange-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Məhsul Videosu ({productVideos.length})
                  {activeTab === 'videos' && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 shadow-[0_0_8px_rgba(255,85,0,0.6)] rounded-full"
                    />
                  )}
                </button>
              )}

              <button
                onClick={() => setActiveInfoTab('similar')}
                className={`pb-3 text-sm sm:text-base font-bold whitespace-nowrap cursor-pointer transition-all relative ${
                  activeTab === 'similar'
                    ? 'text-orange-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Oxşar Məhsullar
                {activeTab === 'similar' && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 shadow-[0_0_8px_rgba(255,85,0,0.6)] rounded-full"
                  />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="py-6">
              {activeTab === 'desc' && (
                <div className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
                  <p className="whitespace-pre-line">{selectedProduct.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
                      <Truck className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Çatdırılma Müddəti</h4>
                        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                          {selectedProduct.deliveryDays || '1-2 iş günü ərzində ünvana çatdırılma'}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
                      <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white">100% Orijinal Məhsul</h4>
                        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                          Rəsmi MMZ Keyfiyyət Sertifikatı və Qarantiyası
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                  <dl className="divide-y divide-white/10">
                    {Object.entries(selectedProduct.specs || {})
                      .filter(([key, val]) => {
                        const k = String(key).toLowerCase();
                        const v = String(val || '').toLowerCase();
                        return (
                          !k.includes('zəmanət') &&
                          !k.includes('zemanet') &&
                          !v.includes('zəmanət') &&
                          !v.includes('zemanet') &&
                          !v.includes('12 ay') &&
                          !v.includes('14 gün')
                        );
                      })
                      .map(([key, val]) => (
                        <div key={key} className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                          <dt className="font-bold text-slate-400">{key}</dt>
                          <dd className="font-semibold text-white sm:col-span-2">{val}</dd>
                        </div>
                      ))}
                  </dl>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Add new review form */}
                  <form onSubmit={handleAddReview} className="bg-white/5 p-4 sm:p-6 rounded-2xl border border-white/10 space-y-4">
                    <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                      Bu məhsula rəy və qiymət verin:
                    </h4>
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="flex items-center gap-1 bg-[#070b16] p-2 rounded-xl border border-white/10">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReviewRating(star)}
                            className="p-1 cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= newReviewRating
                                    ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Adınız (məs: Rəşad Ə.)"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="px-4 py-2.5 bg-white/10 border border-white/15 text-white placeholder-slate-400 rounded-xl text-xs sm:text-sm flex-1 max-w-xs focus:outline-none focus:border-cyan-400 shadow-inner"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <textarea
                        placeholder="Məhsul haqqında fikirlərinizi və təəssüratlarınızı qeyd edin..."
                        rows={3}
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        className="w-full p-3.5 bg-white/10 border border-white/15 text-white placeholder-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-400 shadow-inner"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_12px_rgba(255,85,0,0.35)]"
                      >
                        <Send className="w-4 h-4" /> Göndər
                      </button>
                    </div>
                  </form>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                      selectedProduct.reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                                {rev.userName.charAt(0)}
                              </div>
                              <div>
                                <h5 className="text-xs sm:text-sm font-bold text-white">{rev.userName}</h5>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <div className="flex">
                                    {Array.from({ length: rev.rating }).map((_, i) => (
                                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    ))}
                                  </div>
                                  <span className="text-[10px] text-slate-400">&bull; {rev.date}</span>
                                </div>
                              </div>
                            </div>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] sm:text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                ✓ Təsdiqlənmiş Alış
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">{rev.comment}</p>
                          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{rev.likes || 0} nəfər bu rəyi faydalı hesab etdi</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs sm:text-sm text-slate-400 text-center py-6">
                        Bu məhsula hələ heç bir rəy yazılmayıb. İlk rəyi siz yazın!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'videos' && hasVideos && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-black text-sm sm:text-base text-white flex items-center gap-2">
                      <Film className="w-4 h-4 text-purple-400" />
                      Real Məhsul Videoları və Təqdimat
                    </h4>
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                      Cihazda rahat izləmək üçün tam ekran düyməsindən istifadə edə bilərsiniz
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {productVideos.map((vUrl, idx) => (
                      <div
                        key={idx}
                        className="bg-black rounded-3xl overflow-hidden shadow-lg border border-white/10"
                      >
                        <div className="aspect-video relative">
                          <SafeVideoPlayer
                            src={vUrl}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="p-3 bg-[#0c1324] text-white text-xs font-bold flex items-center justify-between border-t border-white/10">
                          <span className="flex items-center gap-1.5 text-purple-400">
                            <Play className="w-3.5 h-3.5" /> Video Təqdimat #{idx + 1}
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">
                            Oynatmaq üçün vurun
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'similar' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {similarProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Mobile Quick Sticky Bottom Cart Bar */}
        <div className="lg:hidden sticky bottom-0 z-30 w-full max-w-full bg-[#070b16]/95 backdrop-blur-xl border-t border-white/10 p-3 sm:p-4 flex items-center justify-between gap-3 shadow-[0_-10px_25px_rgba(0,0,0,0.7)] box-border overflow-hidden">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Cəmi Qiymət</span>
            <span className="font-heading font-black text-lg sm:text-xl text-orange-400 drop-shadow-[0_0_8px_rgba(255,85,0,0.4)]">
              {((selectedProduct.price ?? 0) * quantity).toFixed(2)} AZN
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            id="mobile-quick-add-to-cart-btn"
            className="flex-1 py-3 px-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,85,0,0.35)] active:scale-98 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" /> Səbətə Əlavə Et
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
