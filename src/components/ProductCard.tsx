import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, ShoppingBag, Heart, Zap, Truck, Flame, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isWishlisted
  } = useStore();

  const isFavorite = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.25 }}
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-gradient-to-b from-[#111827] via-[#0d1526] to-[#090e1c] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-400/50 shadow-lg hover:shadow-[0_18px_38px_-8px_rgba(0,0,0,0.8),0_0_22px_rgba(0,240,255,0.18)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Media Container */}
      <div className="relative w-full aspect-square bg-[#050811] overflow-hidden flex items-center justify-center">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for 3D depth and subtle neon ambient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090e1c]/80 via-transparent to-black/20 opacity-40 group-hover:opacity-10 transition-opacity" />

        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white text-[10px] sm:text-[11px] font-black px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl shadow-[0_2px_10px_rgba(255,85,0,0.45)] flex items-center gap-0.5 sm:gap-1 border border-white/20">
            <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" />
            -{product.discountPercent}%
          </div>
        )}

        {/* Wishlist Heart Toggle */}
        <button
          onClick={handleFavorite}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer border ${
            isFavorite
              ? 'bg-red-500 text-white border-red-400 scale-105 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
              : 'bg-[#090e1c]/80 hover:bg-[#111827] text-slate-300 hover:text-red-400 border-white/15'
          }`}
          aria-label="Sevimlilərə əlavə et"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Free delivery small tag */}
        {product.isFreeDelivery && (
          <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-3 bg-[#090e1c]/90 backdrop-blur-md text-emerald-400 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg flex items-center gap-1 border border-emerald-500/30 shadow-xs">
            <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Pulsuz
          </div>
        )}

        {/* Video available indicator */}
        {product.videos && product.videos.length > 0 && (
          <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-3 bg-gradient-to-r from-cyan-500 to-blue-600 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg flex items-center gap-1 shadow-[0_0_12px_rgba(0,240,255,0.4)] border border-cyan-400/30">
            <Play className="w-2.5 h-2.5 fill-white" /> Video
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Social proof banner if available */}
          {product.recentOrdersCount && product.recentOrdersCount > 50 && (
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-orange-400 mb-1">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-orange-400 flex-shrink-0" />
              <span className="truncate">Son 24s-də {product.recentOrdersCount}+ alınıb</span>
            </div>
          )}

          {/* Product Title */}
          <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-100 line-clamp-2 group-hover:text-cyan-300 transition-colors leading-snug break-words">
            {product.title}
          </h3>

          {/* Rating & Sales */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 text-[11px] sm:text-xs flex-wrap">
            <div className="flex items-center gap-0.5 sm:gap-1 bg-amber-500/10 text-amber-300 font-bold px-1.5 py-0.5 rounded-md sm:rounded-lg border border-amber-500/30 text-[10px] sm:text-xs shadow-2xs">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
            <span className="text-slate-400 text-[10px] sm:text-[11px]">({product.reviewsCount})</span>
            <span className="text-slate-600 hidden sm:inline">&bull;</span>
            <span className="text-slate-400 font-medium text-[10px] sm:text-[11px] truncate">
              {(product.salesCount ?? 0) >= 1000 ? `${((product.salesCount ?? 0) / 1000).toFixed(1)}k+` : (product.salesCount ?? 0)} satıldı
            </span>
          </div>

          {/* Stock Scarcity Warning */}
          {(product.stock ?? 10) <= 10 && (
            <div className="mt-1.5 sm:mt-2.5">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-red-400 mb-0.5">
                <span>⚡ Yalnız {product.stock ?? 10} ədəd!</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1 sm:h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                  style={{ width: `${Math.min(100, ((product.stock ?? 10) / 15) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Actions */}
        <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10">
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
            <span className="font-heading font-black text-base sm:text-xl text-orange-400 drop-shadow-[0_0_10px_rgba(255,100,0,0.3)]">
              {(product.price ?? 0).toFixed(2)} <span className="text-xs sm:text-sm font-bold text-orange-300">AZN</span>
            </span>
            {(product.oldPrice ?? 0) > (product.price ?? 0) && (
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 line-through">
                {(product.oldPrice ?? 0).toFixed(2)} AZN
              </span>
            )}
          </div>

          <div>
            <button
              onClick={handleAddToCart}
              className="w-full py-2 sm:py-2.5 px-2 sm:px-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-[11px] sm:text-xs rounded-xl shadow-[0_4px_16px_rgba(255,85,0,0.35)] hover:shadow-[0_4px_22px_rgba(255,85,0,0.5)] border border-orange-400/30 flex items-center justify-center gap-1 sm:gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Səbətə at
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
