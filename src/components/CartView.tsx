import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  X
} from 'lucide-react';
import { motion } from 'motion/react';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    minOrderAmount,
    isMinOrderMet,
    remainingForMinOrder,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActiveTab,
    products,
    setSelectedProduct,
    isUserLoggedIn,
    openAuthModal,
    openAuthRequiredModal
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  const minOrderProgressPercent = Math.min(100, (cartSubtotal / minOrderAmount) * 100);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-orange-500 mb-4 shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="font-heading font-black text-2xl text-slate-900 mb-2">
          Səbətiniz boşdur
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Günün flaş endirimlərindən və xüsusi təkliflərdən yararlanaraq alış-verişə başlayın!
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          Alış-verişə Başla &rarr;
        </button>

        {/* Recommended Mini Grid */}
        <div className="mt-12 text-left">
          <h3 className="font-heading font-bold text-base text-slate-800 mb-4">
            🔥 Sənin üçün Tövsiyə Olunan Məhsullar:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {products.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md cursor-pointer transition-all"
              >
                <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'} alt={p.title} className="w-full aspect-square object-cover rounded-xl mb-2" />
                <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{p.title}</h4>
                <p className="text-orange-600 font-extrabold text-xs mt-1">{(p.price ?? 0).toFixed(2)} AZN</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
            Alış-veriş Səbəti
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Səbətinizdə <span className="font-bold text-orange-600">{cart.length} növ</span> məhsul var
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline cursor-pointer"
        >
          Səbəti təmizlə
        </button>
      </div>

      {/* Auth Banner if not logged in */}
      {!isUserLoggedIn && (
        <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-300/80 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-black text-sm text-slate-900 mb-0.5">
                Giriş Tələb Olunur
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Sifariş vermək üçün əvvəlcə hesabınıza daxil olun və ya qeydiyyatdan keçin.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => openAuthModal(() => setActiveTab('cart'), 'login')}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Giriş et
            </button>
            <button
              type="button"
              onClick={() => openAuthModal(() => setActiveTab('cart'), 'register')}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-all cursor-pointer"
            >
              Qeydiyyatdan keç
            </button>
          </div>
        </div>
      )}

      {/* Minimum Order & Delivery Progress Header */}
      <div className={`mb-6 p-4 sm:p-5 rounded-3xl border transition-all ${
        isMinOrderMet
          ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border-emerald-200/80'
          : 'bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border-orange-200/80'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {isMinOrderMet ? (
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="font-heading font-black text-sm text-slate-900 block">
                {isMinOrderMet ? (
                  <span className="text-emerald-700">🎉 Minimum sifariş məbləği tamamlandı!</span>
                ) : (
                  <span className="text-orange-700">Minimum sifariş məbləği: 35.00 AZN</span>
                )}
              </span>
              <p className="text-xs text-slate-600">
                {isMinOrderMet ? (
                  <span>Sifarişinizi indi rəsmiləşdirə bilərsiniz və çatdırılma <strong>PULSUZDUR</strong>.</span>
                ) : (
                  <span>
                    Sifarişi tamamlamaq üçün daha <strong className="text-orange-600 font-black">{(remainingForMinOrder ?? 0).toFixed(2)} AZN</strong> məhsul əlavə edin.
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="text-right sm:text-right flex items-center sm:block gap-2 text-xs">
            <span className="text-slate-500 block">Hədəf:</span>
            <span className="font-heading font-black text-slate-800">{minOrderAmount}.00 AZN</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-200/90 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isMinOrderMet
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-orange-500 to-amber-400'
            }`}
            style={{ width: `${minOrderProgressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => (
            <motion.div
              key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
              layout
              className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-center sm:items-stretch gap-4"
            >
              {/* Product Image */}
              <div
                onClick={() => setSelectedProduct(item.product)}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 cursor-pointer"
              >
                <img
                  src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'}
                  alt={item.product?.title || 'Məhsul'}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between w-full">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.product.brand}
                    </span>
                    <h3
                      onClick={() => setSelectedProduct(item.product)}
                      className="font-heading font-bold text-sm sm:text-base text-slate-900 hover:text-orange-600 transition-colors cursor-pointer line-clamp-1"
                    >
                      {item.product.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.selectedColor && (
                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium">
                          Rəng: <strong>{item.selectedColor}</strong>
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium">
                          Ölçü: <strong>{item.selectedSize}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                    }
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Səbətdən sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Price & Quantity stepper */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-black text-lg text-orange-600">
                      {(((item.product?.price ?? 0) * (item.quantity ?? 1))).toFixed(2)} AZN
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      ({(item.product?.price ?? 0).toFixed(2)} AZN / ədəd)
                    </span>
                  </div>

                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                    <button
                      onClick={() =>
                        updateCartQuantity(
                          item.product.id,
                          item.quantity - 1,
                          item.selectedColor,
                          item.selectedSize
                        )
                      }
                      className="w-7 h-7 rounded-lg bg-white shadow-xs hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center font-heading font-bold text-xs text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCartQuantity(
                          item.product.id,
                          item.quantity + 1,
                          item.selectedColor,
                          item.selectedSize
                        )
                      }
                      className="w-7 h-7 rounded-lg bg-white shadow-xs hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="space-y-4">
          {/* Coupon input */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <h4 className="font-heading font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-orange-500" /> Promo Kod / Kupon
            </h4>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="font-mono font-black text-xs text-emerald-800 uppercase">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-[11px] text-emerald-600">{appliedCoupon.description}</p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Məs: MMZ2026 və ya TEMU90"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError(null);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Tətbiq et
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-500 font-medium">{couponError}</p>}
                <p className="text-[11px] text-slate-400">
                  İpucu: <strong>MMZ2026</strong> (20% endirim) və ya <strong>TEMU90</strong>
                </p>
              </form>
            )}
          </div>

          {/* Checkout Summary Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
            <h3 className="font-heading font-black text-base text-slate-900 pb-3 border-b border-slate-100">
              Sifariş Xülasəsi
            </h3>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Məhsulların cəmi:</span>
                <span className="font-bold text-slate-900">{(cartSubtotal ?? 0).toFixed(2)} AZN</span>
              </div>

              {(cartDiscount ?? 0) > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Kupon endirimi:</span>
                  <span>-{(cartDiscount ?? 0).toFixed(2)} AZN</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Çatdırılma xidməti:</span>
                <span className="font-bold text-slate-900">
                  {cartDeliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">PULSUZ</span>
                  ) : (
                    `${(cartDeliveryFee ?? 0).toFixed(2)} AZN`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-heading font-black text-base text-slate-900">
                  Yekun Məbləğ:
                </span>
                <span className="font-heading font-black text-2xl text-orange-600">
                  {(cartTotal ?? 0).toFixed(2)} AZN
                </span>
              </div>
            </div>

            {/* Minimum Order Check Card inside Summary */}
            {!isMinOrderMet ? (
              <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-800 font-heading font-black text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Minimum Sifariş Şərti</span>
                </div>
                <p className="text-[12px] text-amber-900 leading-snug">
                  Minimum sifariş məbləği <strong>35.00 AZN</strong>-dir.
                </p>
                <p className="text-[11px] text-amber-700 font-medium">
                  Sifarişi tamamlamaq üçün daha <strong className="text-orange-600 font-black">{(remainingForMinOrder ?? 0).toFixed(2)} AZN</strong> məhsul əlavə edin.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Minimum 35 AZN şərti tamamlandı. Sifarişi bitirə bilərsiniz!</span>
              </div>
            )}

            {/* Auth check prompt inside summary if not logged in */}
            {!isUserLoggedIn && (
              <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-amber-900 font-heading font-black text-xs">
                  <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Giriş Tələb Olunur</span>
                </div>
                <p className="text-[12px] text-amber-900 leading-snug font-medium">
                  Sifariş vermək üçün əvvəlcə hesabınıza daxil olun və ya qeydiyyatdan keçin.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => openAuthModal(() => setActiveTab('checkout'), 'login')}
                    className="py-2.5 px-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-bold text-xs rounded-xl shadow-xs text-center cursor-pointer transition-all"
                  >
                    Giriş et
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal(() => setActiveTab('checkout'), 'register')}
                    className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 text-center cursor-pointer transition-all"
                  >
                    Qeydiyyatdan keç
                  </button>
                </div>
              </div>
            )}

            {isMinOrderMet ? (
              !isUserLoggedIn ? (
                <button
                  type="button"
                  onClick={() => openAuthRequiredModal(() => setActiveTab('checkout'))}
                  className="w-full py-4 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-700 hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sifarişi Tamamla (Giriş Tələb Olunur)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('checkout')}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sifarişi Rəsmiləşdir</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )
            ) : (
              <div className="space-y-2">
                <button
                  disabled
                  className="w-full py-4 bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed opacity-80 select-none shadow-xs"
                >
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>Sifarişi Tamamla (Min. 35 AZN)</span>
                </button>
                <button
                  onClick={() => setActiveTab('home')}
                  className="w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs rounded-xl border border-orange-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Alış-verişə davam et (+{(remainingForMinOrder ?? 0).toFixed(2)} AZN)</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>3D Secure ilə 100% Güvənli Ödəniş</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
