import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { deduplicateProducts } from '../utils/productUtils';

export const WishlistView: React.FC = () => {
  const { wishlist, products, setActiveTab } = useStore();

  const favoriteProducts = deduplicateProducts(products.filter((p) => wishlist.includes(p.id)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <button
        onClick={() => setActiveTab('home')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-orange-400 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Əsas səhifəyə qayıt
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white flex items-center gap-2">
            <Heart className="w-7 h-7 text-red-500 fill-red-500" /> Sevimli Məhsullarım
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Bəyəndiyiniz <span className="font-bold text-orange-400">{favoriteProducts.length} məhsul</span> siyahıdadır
          </p>
        </div>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-[#0c1324] rounded-3xl p-12 text-center border border-white/10 max-w-md mx-auto shadow-xl">
          <div className="w-16 h-16 bg-red-500/15 text-red-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-red-500/30">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-black text-lg text-white mb-1">
            Sevimlilər siyahınız boşdur
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Bəyəndiyiniz məhsulların üzərindəki ürək ikonuna toxunaraq buraya əlavə edə bilərsiniz.
          </p>
          <button
            onClick={() => setActiveTab('home')}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl cursor-pointer shadow-[0_0_12px_rgba(255,85,0,0.35)] transition-all"
          >
            Məhsulları Kəşf Et
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
