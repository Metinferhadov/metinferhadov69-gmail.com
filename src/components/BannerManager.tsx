import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Banner } from '../types';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload,
  Sparkles,
  Check,
  X,
  Zap,
  ArrowUp,
  ArrowDown,
  Palette,
  AlertTriangle,
  ExternalLink,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRADIENT_PRESETS = [
  {
    name: 'Narıncı & Qızılı',
    value: 'from-orange-600 via-amber-500 to-red-600',
    sample: 'linear-gradient(to right, #ea580c, #f59e0b, #dc2626)'
  },
  {
    name: 'Bənövşəyi & İndiqo',
    value: 'from-violet-700 via-indigo-600 to-purple-800',
    sample: 'linear-gradient(to right, #6d28d9, #4f46e5, #6b21a8)'
  },
  {
    name: 'Premium Qara & Karbon',
    value: 'from-slate-900 via-zinc-800 to-neutral-900',
    sample: 'linear-gradient(to right, #0f172a, #27272a, #171717)'
  },
  {
    name: 'Zümrüd & Yaşıl',
    value: 'from-emerald-700 via-teal-600 to-green-800',
    sample: 'linear-gradient(to right, #047857, #0d9488, #166534)'
  },
  {
    name: 'Okean Mavisi & Göy',
    value: 'from-blue-700 via-cyan-600 to-sky-800',
    sample: 'linear-gradient(to right, #1d4ed8, #0891b2, #075985)'
  },
  {
    name: 'Al-Qırmızı & Çəhrayı',
    value: 'from-rose-600 via-pink-600 to-red-700',
    sample: 'linear-gradient(to right, #e11d48, #db2777, #b91c1c)'
  },
  {
    name: 'Qızılı Kəhrəba',
    value: 'from-amber-600 via-yellow-500 to-orange-700',
    sample: 'linear-gradient(to right, #d97706, #eab308, #c2410c)'
  }
];

const LINK_OPTIONS = [
  { value: 'flash_sales', label: '⚡ Flaş Endirimlər (Flash Sales)' },
  { value: 'categories', label: '📁 Bütün Kateqoriyalar' },
  { value: 'cart', label: '🛒 Səbət' },
  { value: 'profile', label: '👤 İstifadəçi Profili' },
  { value: 'chat', label: '💬 Müştəri Mesajları' },
  { value: 'orders', label: '📦 Sifarişlərim' }
];

export const BannerManager: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner, toggleBannerActive, reorderBanners } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteConfirmBanner, setDeleteConfirmBanner] = useState<Banner | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('⚡ MƏHDUD MÜDDƏTLİ FÜRSƏT');
  const [buttonText, setButtonText] = useState('İndi Kəşf Et');
  const [categoryLink, setCategoryLink] = useState('flash_sales');
  const [bgColor, setBgColor] = useState('from-orange-600 via-amber-500 to-red-600');
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(true);
  const [orderNum, setOrderNum] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sort banners by order
  const sortedBanners = [...banners].sort((a, b) => (a.order || 0) - (b.order || 0));

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setBadge('⚡ MƏHDUD MÜDDƏTLİ FÜRSƏT');
    setButtonText('İndi Kəşf Et');
    setCategoryLink('flash_sales');
    setBgColor('from-orange-600 via-amber-500 to-red-600');
    setImageUrl('');
    setActive(true);
    setOrderNum(banners.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setDescription(banner.description || '');
    setBadge(banner.badge);
    setButtonText(banner.buttonText);
    setCategoryLink(banner.categoryLink || 'flash_sales');
    setBgColor(banner.bgColor);
    setImageUrl(banner.imageUrl);
    setActive(banner.active);
    setOrderNum(banner.order || 1);
    setIsModalOpen(true);
  };

  // Handle Real Image Upload (JPG, PNG, WEBP)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check valid image types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Zəhmət olmasa yalnız JPG, PNG və ya WEBP formatında şəkil seçin.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Form (Create or Update)
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Zəhmət olmasa banner başlığını daxil edin.');
      return;
    }

    const finalImageUrl =
      imageUrl.trim() ||
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&q=80';

    if (editingBanner) {
      updateBanner(editingBanner.id, {
        title: title.trim(),
        subtitle: subtitle.trim(),
        description: description.trim() || undefined,
        badge: badge.trim() || '⚡ TƏKLİF',
        buttonText: buttonText.trim() || 'İndi Kəşf Et',
        categoryLink,
        bgColor,
        imageUrl: finalImageUrl,
        active,
        order: Number(orderNum) || 1
      });
    } else {
      addBanner({
        title: title.trim(),
        subtitle: subtitle.trim(),
        description: description.trim() || undefined,
        badge: badge.trim() || '⚡ TƏKLİF',
        buttonText: buttonText.trim() || 'İndi Kəşf Et',
        categoryLink,
        bgColor,
        imageUrl: finalImageUrl,
        active,
        order: Number(orderNum) || banners.length + 1
      });
    }

    setIsModalOpen(false);
  };

  // Move banner up in order
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...sortedBanners];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    reorderBanners(items);
  };

  // Move banner down in order
  const handleMoveDown = (index: number) => {
    if (index === sortedBanners.length - 1) return;
    const items = [...sortedBanners];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    reorderBanners(items);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (deleteConfirmBanner) {
      deleteBanner(deleteConfirmBanner.id);
      setDeleteConfirmBanner(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                Banner İdarəetmə Sistemi
              </h2>
              <p className="text-xs text-slate-500">
                Ana səhifədəki slayd və promosyon bannerlərini real vaxtda idarə edin
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600">
            <span>Ümumi: <strong className="text-slate-900">{banners.length}</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-600">
              Aktiv: <strong>{banners.filter((b) => b.active).length}</strong>
            </span>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-orange-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Yeni Banner Əlavə Et
          </button>
        </div>
      </div>

      {/* Banner Cards List */}
      {sortedBanners.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-black text-base text-slate-900">
            Hələ heç bir banner əlavə edilməyib
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Ana səhifədə böyük promosyon şəkli və məlumatları göstərmək üçün ilk bannerinizi əlavə edin.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> + Yeni Banner Əlavə Et
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBanners.map((banner, index) => {
            return (
              <div
                key={banner.id}
                className={`bg-white rounded-3xl border transition-all overflow-hidden p-4 sm:p-5 shadow-xs ${
                  banner.active
                    ? 'border-slate-200/90 hover:border-orange-300 hover:shadow-md'
                    : 'border-slate-200/60 opacity-75 bg-slate-50/50'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Left: Sequence & Thumbnail */}
                  <div className="lg:col-span-4 flex items-center gap-3">
                    {/* Ordering buttons */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition-colors cursor-pointer"
                        title="Yuxarı qaldır"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-black text-center text-slate-500">
                        #{index + 1}
                      </span>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === sortedBanners.length - 1}
                        className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 transition-colors cursor-pointer"
                        title="Aşağı endir"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Banner Mini Preview Container */}
                    <div
                      className={`relative w-36 sm:w-44 h-24 rounded-2xl overflow-hidden shadow-xs flex-shrink-0 bg-gradient-to-r ${banner.bgColor} flex items-center p-2`}
                    >
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="absolute right-0 top-0 w-3/4 h-full object-cover opacity-40 mix-blend-luminosity"
                      />
                      <div className="relative z-10 text-white">
                        <span className="text-[8px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full uppercase truncate max-w-[90px] block">
                          {banner.badge}
                        </span>
                        <h5 className="font-heading font-black text-[10px] line-clamp-1 mt-1">
                          {banner.title}
                        </h5>
                        <p className="text-[8px] text-slate-200 line-clamp-1 mt-0.5">
                          {banner.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                          {banner.badge}
                        </span>
                        {banner.active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Aktiv
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Deaktiv
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading font-black text-sm text-slate-900 mt-1 truncate">
                        {banner.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {banner.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Details & Links */}
                  <div className="lg:col-span-5 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">Düymə:</span>
                      <strong className="text-slate-800">{banner.buttonText}</strong>
                    </div>

                    <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium">Keçid:</span>
                      <span className="text-orange-600 font-bold flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {LINK_OPTIONS.find((l) => l.value === banner.categoryLink)?.label ||
                          banner.categoryLink ||
                          'Flaş Endirimlər'}
                      </span>
                    </div>

                    <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 block font-medium">Qradient:</span>
                      <span
                        className="w-4 h-4 rounded-full border border-white shadow-xs"
                        style={{
                          background:
                            GRADIENT_PRESETS.find((g) => g.value === banner.bgColor)?.sample ||
                            'linear-gradient(to right, #ea580c, #f59e0b)'
                        }}
                        title={banner.bgColor}
                      />
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="lg:col-span-3 flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t border-slate-100 lg:border-0">
                    {/* Toggle Active Switch */}
                    <button
                      onClick={() => toggleBannerActive(banner.id)}
                      className={`px-3 py-2 sm:py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border ${
                        banner.active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                      }`}
                      title={banner.active ? 'Banneri deaktiv et' : 'Banneri aktiv et'}
                    >
                      {banner.active ? (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Aktiv
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Deaktiv
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(banner)}
                        className="p-2 sm:p-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl transition-colors cursor-pointer"
                        title="Düzəliş et"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteConfirmBanner(banner)}
                        className="p-2 sm:p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: CREATE / EDIT BANNER WITH LIVE PREVIEW */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-base sm:text-lg text-slate-900">
                      {editingBanner ? 'Bannerə Düzəliş Et' : 'Yeni Banner Əlavə Et'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Dəyişikliklər birbaşa yadda saxlanılacaq və ana səhifədə əks olunacaq
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
                {/* 1. REAL-TIME LIVE PREVIEW BOX */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-orange-500" /> Canlı Önizləmə (Live Preview)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Ana səhifədə bu cür görünəcək
                    </span>
                  </div>

                  <div className="relative rounded-3xl overflow-hidden shadow-xl border border-orange-500/20 min-h-[220px] sm:min-h-[260px] flex items-center bg-slate-900 p-6 sm:p-8">
                    {/* Background Gradient & Image */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${bgColor}`} />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/60 mix-blend-overlay" />
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="Banner Preview"
                        className="absolute right-0 top-0 w-full sm:w-3/5 h-full object-cover object-center opacity-40 mix-blend-luminosity"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                    {/* Preview Content */}
                    <div className="relative z-10 max-w-xl text-white">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400 text-slate-950 text-[11px] font-black rounded-full uppercase tracking-wider mb-2.5 shadow-md">
                        <Zap className="w-3 h-3 fill-slate-950" />
                        {badge || '⚡ MƏHDUD MÜDDƏTLİ FÜRSƏT'}
                      </span>

                      <h3 className="font-heading font-black text-xl sm:text-2xl md:text-3xl leading-tight text-white mb-2 drop-shadow-md">
                        {title || 'Banner Başlığı Buraya Gələcək'}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-100 font-medium mb-4 line-clamp-2 drop-shadow">
                        {subtitle || 'Alt başlıq mətni və cəlbedici təsvir burada görünəcək.'}
                      </p>

                      <div className="flex items-center gap-2">
                        <span className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          {buttonText || 'İndi Kəşf Et'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. FORM FIELDS */}
                <form id="bannerForm" onSubmit={handleSaveBanner} className="space-y-4">
                  {/* Image Upload Zone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Banner Şəkli (Real Fayl Yüklə və ya URL daxil et) *
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* File Upload Box */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/40 hover:bg-orange-50/80 p-4 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center text-center group"
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          Şəkil Yüklə (JPG, PNG, WEBP)
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Kompüterdən və ya telefondan fayl seçin
                        </span>
                      </div>

                      {/* Image URL Input */}
                      <div className="flex flex-col justify-center space-y-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 block mb-1">
                            Və ya Şəkil URL-i:
                          </label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        {imageUrl && (
                          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Şəkil aktivdir
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Banner Başlığı *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Məs: BÖYÜK YAZ ENDİRİMİ %70-DƏK"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Alt Başlıq (Şüar / Qısa Mətn)
                      </label>
                      <input
                        type="text"
                        placeholder="Məs: Minlərlə trend məhsul inanılmaz qiymətlərlə səni gözləyir!"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Badge & Button Text */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Badge Etiketi
                      </label>
                      <input
                        type="text"
                        placeholder="Məs: ⚡ MƏHDUD MÜDDƏTLİ FÜRSƏT"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Düymə Yazısı
                      </label>
                      <input
                        type="text"
                        placeholder="Məs: İndi Kəşf Et"
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Düymə Keçidi (Bölmə)
                      </label>
                      <select
                        value={categoryLink}
                        onChange={(e) => setCategoryLink(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 font-bold"
                      >
                        {LINK_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Gradient / Theme Color Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-orange-500" /> Arxa Fon Rəng Qradienti Seçin
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {GRADIENT_PRESETS.map((preset) => {
                        const isSelected = bgColor === preset.value;
                        return (
                          <button
                            type="button"
                            key={preset.value}
                            onClick={() => setBgColor(preset.value)}
                            className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <span
                              className="w-5 h-5 rounded-full border border-white shadow-xs flex-shrink-0"
                              style={{ background: preset.sample }}
                            />
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {preset.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Settings: Active Status & Order */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <input
                        type="checkbox"
                        id="activeBannerCheckbox"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded cursor-pointer accent-orange-600"
                      />
                      <label htmlFor="activeBannerCheckbox" className="text-xs font-bold text-slate-800 cursor-pointer">
                        Aktiv Banner (Ana səhifədə görünsün)
                      </label>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                        Göstərilmə Sırası:
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={orderNum}
                        onChange={(e) => setOrderNum(parseInt(e.target.value) || 1)}
                        className="w-20 p-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-200 flex items-center justify-end gap-2.5 bg-slate-50/80 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  form="bannerForm"
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/25 cursor-pointer flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                >
                  <Check className="w-4 h-4" /> Yadda Saxla
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION MODAL: DELETE BANNER */}
      <AnimatePresence>
        {deleteConfirmBanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <h3 className="font-heading font-black text-lg text-slate-900 mb-1">
                Bu banneri silmək istəyirsiniz?
              </h3>

              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                "{deleteConfirmBanner.title}" banneri birdəfəlik silinəcək və ana səhifədəki slayd siyahısından çıxarılacaq.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteConfirmBanner(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/25 transition-all cursor-pointer"
                >
                  Bəli, Sil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
