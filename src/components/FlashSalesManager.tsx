import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FlashSaleButton } from '../types';
import {
  Zap,
  Flame,
  Sparkles,
  Award,
  Gift,
  Percent,
  Clock,
  Trash2,
  Plus,
  Check,
  X,
  Sliders,
  Image as ImageIcon,
  Palette,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRADIENT_PRESETS = [
  {
    name: 'Alovlu Narıncı-Qırmızı (Defolt)',
    from: '#ea580c',
    via: '#dc2626',
    to: '#d97706'
  },
  {
    name: 'Zərif Bənövşəyi & Çəhrayı',
    from: '#7c3aed',
    via: '#db2777',
    to: '#f43f5e'
  },
  {
    name: 'Gecə Göyü & Mavi Elektrik',
    from: '#1e3a8a',
    via: '#2563eb',
    to: '#06b6d4'
  },
  {
    name: 'Lüks Qara & Qızılı Amber',
    from: '#0f172a',
    via: '#334155',
    to: '#d97706'
  },
  {
    name: 'Zümrüd Yaşıli & Firuzə',
    from: '#065f46',
    via: '#059669',
    to: '#0d9488'
  },
  {
    name: 'Tünd Yaqut & Bordo',
    from: '#881337',
    via: '#be123c',
    to: '#e11d48'
  }
];

const BANNER_ICONS = [
  { id: 'flame', label: 'Alov (Flame 🔥)', icon: Flame },
  { id: 'zap', label: 'İldırım (Zap ⚡)', icon: Zap },
  { id: 'sparkles', label: 'Ulduzlar (Sparkles ✨)', icon: Sparkles },
  { id: 'award', label: 'Tac & Mükafat (Award 👑)', icon: Award },
  { id: 'gift', label: 'Hədiyyə (Gift 🎁)', icon: Gift },
  { id: 'percent', label: 'Endirim (Percent 🏷️)', icon: Percent }
];

export const FlashSalesManager: React.FC = () => {
  const {
    flashSaleConfig,
    updateFlashSaleConfig,
    deleteFlashSaleSection,
    restoreFlashSaleSection,
    addFlashSaleButton,
    updateFlashSaleButton,
    deleteFlashSaleButton,
    addProductToFlashSale,
    removeProductFromFlashSale,
    products,
    showToast
  } = useStore();

  // Local editing state
  const [title, setTitle] = useState(flashSaleConfig.title || 'Günün Flaş Endirimləri');
  const [subtitle, setSubtitle] = useState(flashSaleConfig.subtitle || '');
  const [discountPercent, setDiscountPercent] = useState(flashSaleConfig.discountPercent || 70);
  const [discountBadgeText, setDiscountBadgeText] = useState(flashSaleConfig.discountBadgeText || '');
  const [hasTimer, setHasTimer] = useState(flashSaleConfig.hasTimer ?? true);
  const [timerHours, setTimerHours] = useState(flashSaleConfig.timerHours ?? 5);
  const [timerMinutes, setTimerMinutes] = useState(flashSaleConfig.timerMinutes ?? 42);
  const [timerSeconds, setTimerSeconds] = useState(flashSaleConfig.timerSeconds ?? 18);
  const [bannerIcon, setBannerIcon] = useState(flashSaleConfig.bannerIcon || 'flame');
  const [gradientFrom, setGradientFrom] = useState(flashSaleConfig.gradientFrom || '#ea580c');
  const [gradientVia, setGradientVia] = useState(flashSaleConfig.gradientVia || '#dc2626');
  const [gradientTo, setGradientTo] = useState(flashSaleConfig.gradientTo || '#d97706');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(flashSaleConfig.backgroundImageUrl || '');
  const [backgroundOverlayOpacity, setBackgroundOverlayOpacity] = useState(flashSaleConfig.backgroundOverlayOpacity ?? 70);
  const [showProducts, setShowProducts] = useState(flashSaleConfig.showProducts ?? true);
  const [productSource, setProductSource] = useState<'manual' | 'tag' | 'all_flash'>(flashSaleConfig.productSource || 'manual');

  // Modals
  const [showAddBtnModal, setShowAddBtnModal] = useState(false);
  const [newBtnLabel, setNewBtnLabel] = useState('');
  const [newBtnTag, setNewBtnTag] = useState('flash_sale');
  const [newBtnActionType, setNewBtnActionType] = useState<'tag_filter' | 'all_products'>('tag_filter');

  const [showProductPickerModal, setShowProductPickerModal] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // Sync from props if updated from firestore
  React.useEffect(() => {
    setTitle(flashSaleConfig.title || '');
    setSubtitle(flashSaleConfig.subtitle || '');
    setDiscountPercent(flashSaleConfig.discountPercent || 70);
    setDiscountBadgeText(flashSaleConfig.discountBadgeText || '');
    setHasTimer(flashSaleConfig.hasTimer ?? true);
    setTimerHours(flashSaleConfig.timerHours ?? 5);
    setTimerMinutes(flashSaleConfig.timerMinutes ?? 42);
    setTimerSeconds(flashSaleConfig.timerSeconds ?? 18);
    setBannerIcon(flashSaleConfig.bannerIcon || 'flame');
    setGradientFrom(flashSaleConfig.gradientFrom || '#ea580c');
    setGradientVia(flashSaleConfig.gradientVia || '#dc2626');
    setGradientTo(flashSaleConfig.gradientTo || '#d97706');
    setBackgroundImageUrl(flashSaleConfig.backgroundImageUrl || '');
    setBackgroundOverlayOpacity(flashSaleConfig.backgroundOverlayOpacity ?? 70);
    setShowProducts(flashSaleConfig.showProducts ?? true);
    setProductSource(flashSaleConfig.productSource || 'manual');
  }, [flashSaleConfig]);

  // Handle Save All Base Settings
  const handleSaveBaseSettings = async () => {
    await updateFlashSaleConfig({
      title: title.trim(),
      subtitle: subtitle.trim(),
      discountPercent: Number(discountPercent) || 0,
      discountBadgeText: discountBadgeText.trim(),
      hasTimer,
      timerHours: Number(timerHours) || 0,
      timerMinutes: Number(timerMinutes) || 0,
      timerSeconds: Number(timerSeconds) || 0,
      bannerIcon: bannerIcon as any,
      gradientFrom,
      gradientVia,
      gradientTo,
      backgroundImageUrl: backgroundImageUrl.trim(),
      backgroundOverlayOpacity: Number(backgroundOverlayOpacity) || 0,
      showProducts,
      productSource
    });
  };

  // Handle Add Button
  const handleAddButton = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBtnLabel.trim()) {
      showToast('Zəhmət olmasa düymə mətni daxil edin', 'error');
      return;
    }
    await addFlashSaleButton({
      label: newBtnLabel.trim(),
      actionType: newBtnActionType,
      tagFilter: newBtnActionType === 'all_products' ? 'all' : newBtnTag
    });
    setNewBtnLabel('');
    setShowAddBtnModal(false);
  };

  // Handle Image File Upload
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Şəkil ölçüsü maksimum 2MB ola bilər', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImageUrl(reader.result as string);
        showToast('Banner şəkli seçildi', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter products for modal picker
  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  // Display products currently attached
  const attachedProducts = (flashSaleConfig.productIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is typeof products[0] => p !== undefined);

  return (
    <div className="space-y-6">
      {/* Top Banner Card & Status */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-700 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-orange-600 text-orange-600 animate-pulse" />
              Günün Flaş Endirimləri İdarəetməsi
            </span>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                flashSaleConfig.isActive
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              {flashSaleConfig.isActive ? '● Ana Səhifədə Aktivdir' : '○ Silinib / Deaktivdir'}
            </span>
          </div>
          <h2 className="font-heading font-black text-2xl text-slate-900 mt-2">
            “Günün Flaş Endirimləri” Bölməsinin Tənzimlənməsi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Bu paneldən bölməni tamamilə silə, yenidən əlavə edə, başlığı, açıqlama mətnini, endirim faizini, taymer vaxtını, filtr düymələrini, arxa plan görünüşünü və vitrindəki məhsulları bir toxunuşla idarə edə bilərsiniz.
          </p>
        </div>

        {/* Global Action: Delete or Restore */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {flashSaleConfig.isActive ? (
            <button
              onClick={() => setShowDeleteConfirmModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>Bölməni Tamamilə Sil</span>
            </button>
          ) : (
            <button
              onClick={restoreFlashSaleSection}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Bölməni Yenidən Əlavə Et (Bərpa Et)</span>
            </button>
          )}

          <button
            onClick={handleSaveBaseSettings}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Yadda Saxla</span>
          </button>
        </div>
      </div>

      {/* Notice if deactivated */}
      {!flashSaleConfig.isActive && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-3xl flex items-center justify-between gap-4 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-200/70 flex items-center justify-center flex-shrink-0">
              <EyeOff className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Bölmə hazırda silinib / deaktiv vəziyyətdədir</h4>
              <p className="text-xs text-amber-800">
                Ana Səhifədə istifadəçilərə heç bir flaş bölməsi görünmür və yerində boşluq qalmır. İstədiyiniz zaman "Bölməni Yenidən Əlavə Et" düyməsi ilə bərpa edə bilərsiniz.
              </p>
            </div>
          </div>
          <button
            onClick={restoreFlashSaleSection}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex-shrink-0"
          >
            İndi Bərpa Et
          </button>
        </div>
      )}

      {/* Real-time Interactive Live Preview */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-orange-600" />
            Canlı Görünüş Önizləməsi (İstifadəçilərin Ekranında Necə Görünəcək)
          </span>
          <span className="text-xs text-slate-400 font-medium">Real-vaxt yenilənmə</span>
        </div>

        <div
          style={
            backgroundImageUrl
              ? {}
              : {
                  background: `linear-gradient(135deg, ${gradientFrom}, ${gradientVia}, ${gradientTo})`
                }
          }
          className="rounded-3xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col justify-between"
        >
          {backgroundImageUrl && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}
              />
              <div
                className="absolute inset-0 bg-slate-950"
                style={{ opacity: backgroundOverlayOpacity / 100 }}
              />
            </>
          )}

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="p-1.5 bg-white/20 backdrop-blur-xs rounded-xl flex items-center justify-center">
                  {bannerIcon === 'zap' ? (
                    <Zap className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
                  ) : bannerIcon === 'sparkles' ? (
                    <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
                  ) : bannerIcon === 'award' ? (
                    <Award className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
                  ) : bannerIcon === 'gift' ? (
                    <Gift className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
                  ) : bannerIcon === 'percent' ? (
                    <Percent className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
                  ) : (
                    <Flame className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
                  )}
                </span>
                <span className="font-heading font-black text-xl uppercase tracking-wider text-white">
                  {title || 'Günün Flaş Endirimləri'}
                </span>
                {discountPercent > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-slate-950 shadow-xs uppercase tracking-wider">
                    {discountBadgeText || `${discountPercent}%-dək Endirim`}
                  </span>
                )}
              </div>
              {subtitle && <p className="text-xs text-orange-100 font-medium">{subtitle}</p>}
            </div>

            {hasTimer && (
              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-inner flex-shrink-0 self-start sm:self-auto">
                <Clock className="w-4 h-4 text-amber-300 ml-1" />
                <div className="flex items-center gap-1 font-mono font-bold text-sm">
                  <div className="bg-slate-950 px-2 py-0.5 rounded-lg text-white">
                    {String(timerHours).padStart(2, '0')}
                  </div>
                  <span className="text-amber-300">:</span>
                  <div className="bg-slate-950 px-2 py-0.5 rounded-lg text-white">
                    {String(timerMinutes).padStart(2, '0')}
                  </div>
                  <span className="text-amber-300">:</span>
                  <div className="bg-slate-950 px-2 py-0.5 rounded-lg text-amber-400 animate-pulse">
                    {String(timerSeconds).padStart(2, '0')}
                  </div>
                </div>
              </div>
            )}
          </div>

          {flashSaleConfig.buttons && flashSaleConfig.buttons.length > 0 && (
            <div className="relative z-10 mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-white/20">
              <span className="text-xs font-bold text-amber-200">Filtirlə:</span>
              {flashSaleConfig.buttons.map((btn) => (
                <span
                  key={btn.id}
                  className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-xl cursor-default"
                >
                  {btn.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Text, Titles & Discount */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-black text-slate-900 text-base">
              1. Başlıq, Yazı və Endirim Faizi
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bölmənin Başlığı
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Günün Flaş Endirimləri"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Altındakı Açıqlama / Yazı
              </label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={2}
                placeholder="Məhdud sayda stoka malik məhsullar üçün 70%-dək qiymət endirimi!"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Endirim Faizi (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-bold text-sm">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Endirim Nişanı Mətni
                </label>
                <input
                  type="text"
                  value={discountBadgeText}
                  onChange={(e) => setDiscountBadgeText(e.target.value)}
                  placeholder="70%-dək Endirim"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Banner Icon Choice */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bannerin İkonu
              </label>
              <div className="grid grid-cols-3 gap-2">
                {BANNER_ICONS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = bannerIcon === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBannerIcon(item.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-orange-600 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <IconComp className="w-4 h-4 text-orange-600" />
                      <span>{item.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Timer Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-black text-slate-900 text-base">
                2. Taymer Tənzimləməsi
              </h3>
            </div>

            {/* Toggle Timer */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasTimer}
                onChange={(e) => setHasTimer(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              <span className="ml-2 text-xs font-bold text-slate-700">
                {hasTimer ? 'Aktiv' : 'Deaktiv'}
              </span>
            </label>
          </div>

          {hasTimer ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Taymerin başlanğıc və ya dövri vaxtını aşağıdakı xanalardan dəyişə bilərsiniz.
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Saat (Hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={timerHours}
                    onChange={(e) => setTimerHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center font-mono font-bold text-base text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dəqiqə (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center font-mono font-bold text-base text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Saniyə (Seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-center font-mono font-bold text-base text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Taymer sıfırlandıqda:</span>
                <span className="font-bold text-slate-800">Gündəlik yenilənmə dövrü</span>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 space-y-1">
              <EyeOff className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-700">Taymer hazırda deaktivdir</p>
              <p>Bannerdə heç bir geri sayım göstərilmir.</p>
            </div>
          )}
        </div>

        {/* Card 3: Background & Banner Appearance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
              <Palette className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-black text-slate-900 text-base">
              3. Fon Rəngləri və Banner Şəkli
            </h3>
          </div>

          {/* Preset Gradients */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Hazır Rəng Şablonları
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GRADIENT_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setGradientFrom(p.from);
                    setGradientVia(p.via);
                    setGradientTo(p.to);
                  }}
                  className="p-2 rounded-xl border border-slate-200 hover:border-slate-400 text-left flex items-center gap-2 transition-all cursor-pointer group"
                >
                  <div
                    className="w-5 h-5 rounded-lg shadow-inner flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${p.from}, ${p.via}, ${p.to})`
                    }}
                  />
                  <span className="text-[11px] font-bold text-slate-700 truncate group-hover:text-slate-900">
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Hex Inputs */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Başlanğıc
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={gradientFrom}
                  onChange={(e) => setGradientFrom(e.target.value)}
                  className="w-7 h-7 rounded-md cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={gradientFrom}
                  onChange={(e) => setGradientFrom(e.target.value)}
                  className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-slate-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Orta
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={gradientVia}
                  onChange={(e) => setGradientVia(e.target.value)}
                  className="w-7 h-7 rounded-md cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={gradientVia}
                  onChange={(e) => setGradientVia(e.target.value)}
                  className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-slate-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Son
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={gradientTo}
                  onChange={(e) => setGradientTo(e.target.value)}
                  className="w-7 h-7 rounded-md cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={gradientTo}
                  onChange={(e) => setGradientTo(e.target.value)}
                  className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Background Image option */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">
              Arxa Plan Şəkli (İstəyə görə)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={backgroundImageUrl}
                onChange={(e) => setBackgroundImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... və ya şəkil seçin"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-800"
              />
              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center gap-1 flex-shrink-0">
                <ImageIcon className="w-3.5 h-3.5" /> Şəkil Seç
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
              </label>
              {backgroundImageUrl && (
                <button
                  type="button"
                  onClick={() => setBackgroundImageUrl('')}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                  title="Şəkli sil"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {backgroundImageUrl && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs text-slate-600 font-medium">
                  <span>Şəkil örtük tündlüyü (Dark Overlay)</span>
                  <span>{backgroundOverlayOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={backgroundOverlayOpacity}
                  onChange={(e) => setBackgroundOverlayOpacity(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Card 4: Quick Filter Buttons Management */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-black text-slate-900 text-base">
                  4. Düymələr İdarəetməsi
                </h3>
                <p className="text-[11px] text-slate-500">
                  “Flaş Satış”, “Ən Çox Satılanlar” və s. düymələrin mətni
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddBtnModal(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Düymə
            </button>
          </div>

          <div className="space-y-2">
            {(flashSaleConfig.buttons || []).map((btn, idx) => (
              <div
                key={btn.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3"
              >
                <div className="flex-1 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={btn.label}
                    onChange={(e) => updateFlashSaleButton(btn.id, { label: e.target.value })}
                    className="flex-1 px-2.5 py-1 text-xs font-bold text-slate-900 rounded-lg border border-slate-200 bg-white"
                  />
                  <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 bg-slate-200/50 rounded-md">
                    {btn.tagFilter || btn.actionType}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => deleteFlashSaleButton(btn.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Düyməni sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {(flashSaleConfig.buttons || []).length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400">
                Hazırda heç bir düymə yoxdur. "Yeni Düymə" əlavə edin.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card 5: Showcase Products Management */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-slate-900 text-base">
                5. Bölmədə Göstərilən Flaş Məhsullar
              </h3>
              <p className="text-xs text-slate-500">
                Bölmə daxilində və ya altında xüsusi vitrində nümayiş etdiriləcək məhsulları əlavə edin və ya silin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer mr-2">
              <input
                type="checkbox"
                checked={showProducts}
                onChange={(e) => setShowProducts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              <span className="ml-2 text-xs font-bold text-slate-700">
                {showProducts ? 'Məhsul Vitrini Aktivdir' : 'Vitrini Gizlət'}
              </span>
            </label>

            <button
              type="button"
              onClick={() => setShowProductPickerModal(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Məhsul Əlavə Et
            </button>
          </div>
        </div>

        {/* Attached Products Grid */}
        {attachedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {attachedProducts.map((p) => (
              <div
                key={p.id}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs text-slate-900 truncate">{p.title}</h5>
                    <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                      <span className="font-black text-orange-600">{(p.price ?? 0).toFixed(2)} AZN</span>
                      {(p.oldPrice ?? 0) > (p.price ?? 0) && (
                        <span className="line-through text-slate-400 text-[10px]">
                          {(p.oldPrice ?? 0).toFixed(2)} AZN
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeProductFromFlashSale(p.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer flex-shrink-0"
                  title="Məhsulu bölmədən çıxar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 space-y-2 border border-dashed border-slate-200">
            <Package className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700">Bu bölməyə hələ xüsusi məhsul seçilməyib</p>
            <p>
              "Məhsul Əlavə Et" düyməsinə klikləyərək istədiyiniz məhsulları bölməyə daxil edin.
            </p>
            <button
              type="button"
              onClick={() => setShowProductPickerModal(true)}
              className="mt-2 px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Məhsul Seçin
            </button>
          </div>
        )}
      </div>

      {/* MODAL: ADD BUTTON */}
      <AnimatePresence>
        {showAddBtnModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-heading font-black text-slate-900 text-base">
                  Yeni Filtr Düyməsi Əlavə Et
                </h3>
                <button
                  onClick={() => setShowAddBtnModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddButton} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Düymənin Mətni (məs: 🔥 Super Təkliflər)
                  </label>
                  <input
                    type="text"
                    required
                    value={newBtnLabel}
                    onChange={(e) => setNewBtnLabel(e.target.value)}
                    placeholder="🔥 Super Təkliflər"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Düymənin Növü
                  </label>
                  <select
                    value={newBtnActionType}
                    onChange={(e) => setNewBtnActionType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                  >
                    <option value="tag_filter">Məhsul Etiketi üzrə filtr</option>
                    <option value="all_products">Bütün Məhsullar (Hamısını Göstər)</option>
                  </select>
                </div>

                {newBtnActionType === 'tag_filter' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Məhsul Etiketi (Filter Tag)
                    </label>
                    <select
                      value={newBtnTag}
                      onChange={(e) => setNewBtnTag(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                    >
                      <option value="flash_sale">flash_sale (Flaş Satış)</option>
                      <option value="best_seller">best_seller (Ən Çox Satılan)</option>
                      <option value="for_you">for_you (Sənin üçün Seçdik)</option>
                      <option value="top_seller">top_seller (Top Satış)</option>
                      <option value="new_arrival">new_arrival (Yeni Gələnlər)</option>
                      <option value="trending">trending (Trend)</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddBtnModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    İmtina
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Əlavə Et
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: SELECT PRODUCTS PICKER */}
      <AnimatePresence>
        {showProductPickerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-heading font-black text-slate-900 text-base">
                    Flaş Bölməsinə Məhsul Əlavə Et
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bölmədə göstərilməsini istədiyiniz məhsullara klikləyərək seçin
                  </p>
                </div>
                <button
                  onClick={() => setShowProductPickerModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Məhsul adı və ya kateqoriya ilə axtar..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
                />
              </div>

              {/* Product List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredProducts.map((p) => {
                  const isAdded = (flashSaleConfig.productIds || []).includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        if (isAdded) {
                          removeProductFromFlashSale(p.id);
                        } else {
                          addProductToFlashSale(p.id);
                        }
                      }}
                      className={`p-2.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isAdded
                          ? 'border-orange-500 bg-orange-50/50'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-slate-900 truncate">{p.title}</h5>
                          <span className="text-[11px] font-black text-orange-600">
                            {(p.price ?? 0).toFixed(2)} AZN
                          </span>
                        </div>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 ${
                          isAdded
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Əlavə Olunub
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> Seç
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Seçilmiş məhsul sayı: {(flashSaleConfig.productIds || []).length}
                </span>
                <button
                  type="button"
                  onClick={() => setShowProductPickerModal(false)}
                  className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Tamamla
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: DELETE CONFIRMATION */}
      <AnimatePresence>
        {showDeleteConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-heading font-black text-slate-900 text-lg">
                  “Günün Flaş Endirimləri” bölməsini silmək istəyirsiniz?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Bu bölmə Ana Səhifədən tamamilə yığışdırılacaq və heç bir boş sahə qalmayacaq. İstədiyiniz vaxt Admin Paneldən yenidən əlavə edə bilərsiniz.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirmModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                >
                  İmtina
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteFlashSaleSection();
                    setShowDeleteConfirmModal(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 cursor-pointer transition-colors"
                >
                  Bəli, Bölməni Sil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
