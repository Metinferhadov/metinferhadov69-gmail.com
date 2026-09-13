import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { optimizeImageFile } from '../utils/mediaStorage';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowLeft,
  Copy,
  Check,
  UploadCloud,
  Camera,
  Trash2,
  Lock,
  CreditCard,
  User,
  Clock,
  Eye,
  X
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    appliedCoupon,
    isMinOrderMet,
    minOrderAmount,
    remainingForMinOrder,
    createOrder,
    setActiveTab,
    setSelectedOrderId,
    showToast,
    triggerConfetti,
    user,
    isUserLoggedIn,
    openAuthModal,
    openAuthRequiredModal
  } = useStore();

  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedName, setCopiedName] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [receiptFileSize, setReceiptFileSize] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showReceiptPreviewModal, setShowReceiptPreviewModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const CARD_NUMBER_RAW = '4098584495261412';
  const CARD_NUMBER_FORMATTED = '4098 5844 9526 1412';
  const RECIPIENT_NAME = 'Serxan Mətin Fərhadov';

  if (!isUserLoggedIn) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-orange-200 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-black text-2xl text-slate-900 mb-2">
          Giriş Tələb Olunur
        </h2>
        <p className="text-sm text-slate-600 mb-6 font-medium max-w-md mx-auto leading-relaxed">
          Sifariş vermək üçün əvvəlcə hesabınıza daxil olun və ya qeydiyyatdan keçin.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xs mx-auto mb-6">
          <button
            type="button"
            onClick={() => openAuthModal(() => setActiveTab('checkout'), 'login')}
            className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition-all cursor-pointer text-sm"
          >
            Giriş et
          </button>
          <button
            type="button"
            onClick={() => openAuthModal(() => setActiveTab('checkout'), 'register')}
            className="w-full py-3 px-6 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-2xl transition-all cursor-pointer border border-slate-200 text-sm"
          >
            Qeydiyyatdan keç
          </button>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('cart')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          ← Səbətə qayıt
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-black text-2xl text-slate-900 mb-2">
          Səbətinizdə məhsul yoxdur
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Ödəniş etmək üçün əvvəlcə məhsul seçin.
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition-all cursor-pointer"
        >
          Məhsullara Bax
        </button>
      </div>
    );
  }

  const handleCopyCard = () => {
    navigator.clipboard.writeText(CARD_NUMBER_RAW);
    setCopiedCard(true);
    showToast('Kart nömrəsi kopyalandı! (4098584495261412)', 'success');
    setTimeout(() => setCopiedCard(false), 2500);
  };

  const handleCopyName = () => {
    navigator.clipboard.writeText(RECIPIENT_NAME);
    setCopiedName(true);
    showToast('Qəbul edənin adı kopyalandı!', 'success');
    setTimeout(() => setCopiedName(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = async (file?: File) => {
    if (!file) return;

    // Validate type: jpg, jpeg, png, webp
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpe?g|png|webp)$/i)) {
      showToast('Yalnız JPG, JPEG, PNG və WEBP formatında şəkillər qəbul edilir.', 'error');
      return;
    }

    setIsCompressing(true);
    try {
      const optimized = await optimizeImageFile(file);
      setReceiptImage(optimized.dataUrl);
      setReceiptFileName(file.name);
      setReceiptFileSize(optimized.sizeStr);
      showToast('Ödəniş çeki uğurla əlavə edildi! ✓', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Şəkil yüklənərkən xəta baş verdi', 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleRemoveReceipt = () => {
    setReceiptImage(null);
    setReceiptFileName('');
    setReceiptFileSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    showToast('Ödəniş çeki silindi.', 'info');
  };

  const handleCompletePayment = async () => {
    // Prevent multiple submissions on repeated clicks
    if (isProcessing) return;

    if (!isUserLoggedIn) {
      showToast('Sifariş vermək üçün əvvəlcə hesabınıza daxil olun və ya qeydiyyatdan keçin.', 'error');
      openAuthRequiredModal(() => setActiveTab('checkout'));
      return;
    }

    if (!isMinOrderMet) {
      showToast(
        `Minimum sifariş məbləği ${minOrderAmount} AZN-dir. Sifarişi tamamlamaq üçün daha ${(remainingForMinOrder ?? 0).toFixed(2)} AZN məhsul əlavə edin.`,
        'error'
      );
      return;
    }

    if (!receiptImage) {
      showToast('Zəhmət olmasa ödəniş çekini əlavə edin.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const newOrder = await createOrder({
        status: 'payment_verifying',
        items: [...cart],
        subtotal: cartSubtotal,
        discount: cartDiscount,
        deliveryFee: cartDeliveryFee,
        total: cartTotal,
        receiptImage: receiptImage,
        customerInfo: {
          fullName: user?.name?.trim() || 'Müştəri',
          phone: user?.phone?.trim() || '+994 50 000 00 00',
          email: user?.email?.trim() || '',
          city: 'Bakı şəhəri',
          address: user?.address?.trim() || 'Bakı şəhəri'
        },
        deliveryMethod: 'courier',
        paymentMethod: 'card',
        couponUsed: appliedCoupon?.code || undefined
      });

      triggerConfetti();
      showToast('Ödəniş qeydə alındı! Sifarişiniz təsdiq üçün yoxlanılır.', 'success');
      setIsProcessing(false);
      setSelectedOrderId(newOrder.id);
      setActiveTab('order_detail');
    } catch (err: any) {
      setIsProcessing(false);
      showToast(err?.message || 'Sifariş qeydə alınarkən xəta baş verdi', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Back Button */}
      <button
        onClick={() => setActiveTab('cart')}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 mb-4 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Səbətə qayıt
      </button>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
          Ödəniş və Sifarişin Təsdiqi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Aşağıdakı kart məlumatlarına köçürmə edin və ödəniş çekini yükləyərək sifarişinizi tamamlayın
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bank Details & Receipt Upload Only */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 1: KÖÇÜRMƏ ÜÇÜN KART */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden border border-slate-700/50">
            {/* Background glowing ambient */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 shadow-inner">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-sm sm:text-base text-white">
                      Köçürmə Üçün Kart
                    </h3>
                    <p className="text-[11px] text-slate-400">Rəsmi Bank Hesabı</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Aktiv
                </div>
              </div>

              {/* Card Number Box with Copy */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  Kart Nömrəsi:
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-base sm:text-lg tracking-wider text-amber-300 select-all">
                    {CARD_NUMBER_FORMATTED}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCard}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      copiedCard
                        ? 'bg-emerald-600 text-white'
                        : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95'
                    }`}
                  >
                    {copiedCard ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Recipient Name Box with Copy */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  Qəbul Edənin Adı:
                </span>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="font-bold text-xs sm:text-sm text-slate-100 truncate select-all">
                      {RECIPIENT_NAME}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyName}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      copiedName
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/15 hover:bg-white/25 text-white active:scale-95 border border-white/10'
                    }`}
                  >
                    {copiedName ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Auto Total Payment Amount */}
              <div className="bg-orange-500/15 border border-orange-500/30 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-orange-300 block">
                    Köçürülməli Dəqiq Məbləğ:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    (Məbləğ sifarişinizin yekunu olaraq avtomatik göstərilir)
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-heading font-black text-2xl sm:text-3xl text-orange-400 block">
                    {(cartTotal ?? 0).toFixed(2)} AZN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ÖDƏNİŞ ÇEKİNİ ƏLAVƏ ET (MANDATORY) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <span>Ödəniş Çekini Əlavə Et</span>
                  <span className="text-rose-500 font-black text-xs px-2 py-0.5 bg-rose-50 border border-rose-200 rounded-md">
                    MƏCBURİ
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ödəniş etdikdən sonra bank tətbiqindən əldə etdiyiniz çeki yükləyin
                </p>
              </div>
            </div>

            {/* Hidden native file and camera inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {!receiptImage ? (
              /* Dropzone / Upload box */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
                  isDragging
                    ? 'border-orange-500 bg-orange-50/50 scale-[1.01]'
                    : 'border-slate-300 hover:border-orange-400 bg-slate-50/60'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <h4 className="font-bold text-sm text-slate-900 mb-1">
                  Ödəniş çekinin şəklini seçin və ya buraya sürükləyin
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Dəstəklənən formatlar: <strong>JPG, JPEG, PNG, WEBP</strong>
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCompressing}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4 text-orange-400" />
                    {isCompressing ? 'Yüklənir...' : 'Qalereyadan / Fayllardan Seç'}
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isCompressing}
                    className="px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4 text-orange-600" />
                    Kamera ilə Çək
                  </button>
                </div>
              </div>
            ) : (
              /* Uploaded Receipt Preview Box */
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs sm:text-sm">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Ödəniş çeki uğurla əlavə edildi</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveReceipt}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Çeki Sil</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                  <div
                    className="relative group w-full sm:w-28 h-32 sm:h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 cursor-pointer"
                    onClick={() => setShowReceiptPreviewModal(true)}
                  >
                    <img
                      src={receiptImage}
                      alt="Ödəniş çeki"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {receiptFileName || 'odenis-ceki.jpg'}
                    </h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ölçü: {receiptFileSize || 'Uyğun'} &bull; Format: Yoxlanıldı
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setShowReceiptPreviewModal(true)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Böyüt & Yoxla
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Yenisi ilə əvəz et
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & "Mən Köçürdüm" Button */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
            <h3 className="font-heading font-black text-base text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Sifariş Xülasəsi</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {cart.length} məhsul
              </span>
            </h3>

            {/* Ordered items list */}
            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1 space-y-2.5">
              {cart.map((item, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'}
                      alt={item.product?.title || 'Məhsul'}
                      className="w-11 h-11 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {item.quantity} ədəd &bull; {(item.product?.price ?? 0).toFixed(2)} AZN
                      </p>
                    </div>
                  </div>
                  <span className="font-heading font-black text-xs text-slate-900 flex-shrink-0">
                    {(((item.product?.price ?? 0) * (item.quantity ?? 1))).toFixed(2)} AZN
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Məhsulların qiyməti:</span>
                <span className="font-bold text-slate-900">{(cartSubtotal ?? 0).toFixed(2)} AZN</span>
              </div>

              {(cartDiscount ?? 0) > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Kupon Endirimi ({appliedCoupon?.code}):</span>
                  <span>-{(cartDiscount ?? 0).toFixed(2)} AZN</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Çatdırılma:</span>
                <span className="font-bold text-emerald-600">
                  {cartDeliveryFee === 0 ? 'PULSUZ' : `${(cartDeliveryFee ?? 0).toFixed(2)} AZN`}
                </span>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex justify-between items-baseline">
                <span className="font-heading font-black text-sm text-slate-900">
                  Yekun Məbləğ:
                </span>
                <span className="font-heading font-black text-2xl text-orange-600">
                  {(cartTotal ?? 0).toFixed(2)} AZN
                </span>
              </div>
            </div>

            {/* Verification Status Notice */}
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-start gap-2.5 text-xs text-blue-900">
              <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Ödəniş Yoxlanışı:</span>
                <span className="text-blue-700 text-[11px] leading-relaxed">
                  “Mən köçürdüm” düyməsinə basdıqdan sonra sifarişiniz <strong>“Ödəniş yoxlanılır”</strong> statusu alacaq və çek yoxlanıldıqdan sonra təsdiqlənəcəkdir.
                </span>
              </div>
            </div>

            {/* ACTION BUTTON: "MƏN KÖÇÜRDÜM" */}
            {!isMinOrderMet ? (
              /* Minimum order not met */
              <div className="space-y-2.5 pt-1">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Minimum Sifariş Şərti</span>
                  </div>
                  <p className="text-amber-800 text-[11px]">
                    Minimum sifariş <strong>35.00 AZN</strong>-dir. Sifariş üçün daha <strong>{(remainingForMinOrder ?? 0).toFixed(2)} AZN</strong> məhsul əlavə edin.
                  </p>
                </div>

                <button
                  type="button"
                  disabled
                  className="w-full py-4 bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs rounded-2xl cursor-not-allowed opacity-80"
                >
                  Mən Köçürdüm (Min. 35 AZN)
                </button>
              </div>
            ) : !receiptImage ? (
              /* Receipt NOT uploaded -> Button is DISABLED */
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  disabled
                  className="w-full py-4 bg-slate-100 border-2 border-dashed border-slate-300 text-slate-400 font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed opacity-85 select-none"
                >
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>Mən Köçürdüm (Çek Yükləyin)</span>
                </button>
                <p className="text-center text-[11px] font-bold text-rose-500">
                  ⚠️ Düymənin aktivləşməsi üçün ödəniş çekini əlavə etmək məcburidir.
                </p>
              </div>
            ) : (
              /* Receipt IS uploaded -> Button is ACTIVE */
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCompletePayment}
                  disabled={isProcessing}
                  className="w-full py-4 sm:py-4.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sifariş Göndərilir...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Mən Köçürdüm ({(cartTotal ?? 0).toFixed(2)} AZN)</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] font-medium text-emerald-600">
                  ✓ Çek yükləndi. Sifariş “Ödəniş yoxlanılır” olaraq qeydə alınacaq.
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Təhlükəsiz Bank Köçürməsi & Qəbz Doğrulaması</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Receipt Preview Modal */}
      {showReceiptPreviewModal && receiptImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-black text-base text-slate-900">
                Ödəniş Çekinin Şəkli
              </h3>
              <button
                onClick={() => setShowReceiptPreviewModal(false)}
                className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-900 rounded-2xl p-2 min-h-[300px]">
              <img
                src={receiptImage}
                alt="Ödəniş çeki tam ölçü"
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>{receiptFileName} ({receiptFileSize})</span>
              <button
                type="button"
                onClick={() => setShowReceiptPreviewModal(false)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
