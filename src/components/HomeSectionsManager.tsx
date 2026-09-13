import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { HomeSection, Product } from '../types';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Flame,
  Award,
  Percent,
  Tag,
  Gift,
  Star,
  Smartphone,
  ShoppingBag,
  Package,
  Heart,
  ArrowUp,
  ArrowDown,
  Clock,
  Check,
  X,
  Search,
  AlertTriangle,
  Layers,
  ChevronRight,
  Sliders,
  GripVertical,
  CheckCircle2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Icon dictionary
export const SECTION_ICONS: { [key: string]: { label: string; icon: React.FC<{ className?: string }> } } = {
  zap: { label: 'Flaş Satış (Zap ⚡)', icon: Zap },
  flame: { label: 'Alovlu Fürsət (Flame 🔥)', icon: Flame },
  award: { label: 'Çox Satılan (Award 👑)', icon: Award },
  sparkles: { label: 'Yeni & Özəl (Sparkles ✨)', icon: Sparkles },
  percent: { label: 'Endirim (Percent 🏷️)', icon: Percent },
  tag: { label: 'Etiket (Tag 🔖)', icon: Tag },
  gift: { label: 'Hədiyyə (Gift 🎁)', icon: Gift },
  star: { label: 'Ulduzlu (Star ⭐)', icon: Star },
  smartphone: { label: 'Smartfon & Qadcet (Smartphone 📱)', icon: Smartphone },
  'shopping-bag': { label: 'Alış-veriş (ShoppingBag 🛍️)', icon: ShoppingBag },
  package: { label: 'Paket & Karqo (Package 📦)', icon: Package },
  heart: { label: 'Sevimlilər (Heart ❤️)', icon: Heart }
};

export const THEME_PRESETS: {
  [key: string]: {
    name: string;
    gradient: string;
    cardBg: string;
    border: string;
    badgeBg: string;
    iconBg: string;
    iconColor: string;
    accentColor: string;
    isDarkBg: boolean;
  };
} = {
  red_orange: {
    name: 'Qırmızı & Narıncı (Flaş Satış)',
    gradient: 'from-red-600 via-orange-600 to-amber-500',
    cardBg: 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white',
    border: 'border-red-500',
    badgeBg: 'bg-white/20 text-white',
    iconBg: 'bg-white text-red-600',
    iconColor: 'text-red-600',
    accentColor: '#dc2626',
    isDarkBg: true
  },
  orange_amber: {
    name: 'Narıncı & Kəhrəba (Günün Fürsəti)',
    gradient: 'from-orange-500 to-amber-500',
    cardBg: 'bg-white border border-slate-200/80',
    border: 'border-orange-500',
    badgeBg: 'bg-orange-100 text-orange-700',
    iconBg: 'bg-orange-100 text-orange-600',
    iconColor: 'text-orange-600',
    accentColor: '#ea580c',
    isDarkBg: false
  },
  amber_yellow: {
    name: 'Qızılı Kəhrəba & Sarı (Çox Satılanlar)',
    gradient: 'from-amber-500 to-yellow-500',
    cardBg: 'bg-white border border-slate-200/80',
    border: 'border-amber-500',
    badgeBg: 'bg-amber-100 text-amber-800',
    iconBg: 'bg-amber-100 text-amber-600',
    iconColor: 'text-amber-600',
    accentColor: '#d97706',
    isDarkBg: false
  },
  purple_indigo: {
    name: 'Bənövşəyi & İndiqo (Yeni Gələnlər & Sənin Üçün)',
    gradient: 'from-purple-600 to-indigo-600',
    cardBg: 'bg-white border border-slate-200/80',
    border: 'border-purple-500',
    badgeBg: 'bg-purple-100 text-purple-700',
    iconBg: 'bg-purple-100 text-purple-600',
    iconColor: 'text-purple-600',
    accentColor: '#9333ea',
    isDarkBg: false
  },
  emerald_teal: {
    name: 'Zümrüd Yaşılı & Teal (Eko & Təravətli)',
    gradient: 'from-emerald-600 to-teal-600',
    cardBg: 'bg-white border border-slate-200/80',
    border: 'border-emerald-500',
    badgeBg: 'bg-emerald-100 text-emerald-700',
    iconBg: 'bg-emerald-100 text-emerald-600',
    iconColor: 'text-emerald-600',
    accentColor: '#059669',
    isDarkBg: false
  },
  blue_cyan: {
    name: 'Okean Mavisi & Göy (Texnologiya & Elektronika)',
    gradient: 'from-blue-600 to-cyan-600',
    cardBg: 'bg-white border border-slate-200/80',
    border: 'border-blue-500',
    badgeBg: 'bg-blue-100 text-blue-700',
    iconBg: 'bg-blue-100 text-blue-600',
    iconColor: 'text-blue-600',
    accentColor: '#2563eb',
    isDarkBg: false
  },
  slate_dark: {
    name: 'Premium Qara & Karbon (Lüks Görünüş)',
    gradient: 'from-slate-900 via-zinc-900 to-neutral-950',
    cardBg: 'bg-gradient-to-r from-slate-900 via-zinc-900 to-neutral-950 text-white',
    border: 'border-slate-700',
    badgeBg: 'bg-white/10 text-white',
    iconBg: 'bg-orange-600 text-white',
    iconColor: 'text-white',
    accentColor: '#0f172a',
    isDarkBg: true
  },
  rose_pink: {
    name: 'Qızılgül Çəhrayısı & Al-Qırmızı',
    gradient: 'from-rose-600 to-pink-600',
    cardBg: 'bg-white border border-slate-200/80',
    border: 'border-rose-500',
    badgeBg: 'bg-rose-100 text-rose-700',
    iconBg: 'bg-rose-100 text-rose-600',
    iconColor: 'text-rose-600',
    accentColor: '#e11d48',
    isDarkBg: false
  }
};

export const HomeSectionsManager: React.FC = () => {
  const {
    homeSections,
    products,
    addHomeSection,
    updateHomeSection,
    deleteHomeSection,
    toggleHomeSectionActive,
    reorderHomeSections,
    showToast,
    flashSaleConfig,
    deleteFlashSaleSection,
    restoreFlashSaleSection
  } = useStore();

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<HomeSection | null>(null);
  const [deleteConfirmSection, setDeleteConfirmSection] = useState<HomeSection | null>(null);
  const [productPickerSection, setProductPickerSection] = useState<HomeSection | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [iconName, setIconName] = useState('zap');
  const [themeColor, setThemeColor] = useState('red_orange');
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(1);
  const [showButton, setShowButton] = useState(true);
  const [buttonText, setButtonText] = useState('Hamısına Bax');
  const [buttonLink, setButtonLink] = useState('flash_sale');
  const [hasCountdown, setHasCountdown] = useState(false);
  const [countdownTitle, setCountdownTitle] = useState('Bitməsinə qaldı:');
  const [countdownEndTime, setCountdownEndTime] = useState('2026-12-31T23:59');
  const [countdownExpiredAction, setCountdownExpiredAction] = useState<'hide' | 'show_always'>('hide');
  const [productSource, setProductSource] = useState<'manual' | 'tag' | 'all'>('tag');
  const [productTag, setProductTag] = useState('flash_sale');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [maxProductsCount, setMaxProductsCount] = useState(6);
  const [customDiscountPercent, setCustomDiscountPercent] = useState<number | undefined>(undefined);

  // Product picker search
  const [pickerSearchQuery, setPickerSearchQuery] = useState('');

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Sorted sections
  const sortedSections = [...homeSections].sort((a, b) => a.order - b.order);

  const openCreateModal = () => {
    setEditingSection(null);
    setTitle('');
    setSubtitle('');
    setBadgeText('');
    setIconName('zap');
    setThemeColor('red_orange');
    setIsActive(true);
    setOrder(homeSections.length + 1);
    setShowButton(true);
    setButtonText('Hamısına Bax');
    setButtonLink('flash_sale');
    setHasCountdown(false);
    setCountdownTitle('Bitməsinə qaldı:');
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    setCountdownEndTime(tomorrow.toISOString().slice(0, 16));
    setCountdownExpiredAction('hide');
    setProductSource('tag');
    setProductTag('flash_sale');
    setSelectedProductIds([]);
    setMaxProductsCount(6);
    setCustomDiscountPercent(undefined);
    setIsFormOpen(true);
  };

  const openEditModal = (sec: HomeSection) => {
    setEditingSection(sec);
    setTitle(sec.title);
    setSubtitle(sec.subtitle);
    setBadgeText(sec.badgeText || '');
    setIconName(sec.iconName);
    setThemeColor(sec.themeColor || 'red_orange');
    setIsActive(sec.isActive);
    setOrder(sec.order);
    setShowButton(sec.showButton);
    setButtonText(sec.buttonText || 'Hamısına Bax');
    setButtonLink(sec.buttonLink || 'flash_sale');
    setHasCountdown(sec.hasCountdown);
    setCountdownTitle(sec.countdownTitle || 'Bitməsinə qaldı:');
    setCountdownEndTime(sec.countdownEndTime ? sec.countdownEndTime.slice(0, 16) : '');
    setCountdownExpiredAction(sec.countdownExpiredAction || 'hide');
    setProductSource(sec.productSource || 'tag');
    setProductTag(sec.productTag || 'flash_sale');
    setSelectedProductIds(sec.productIds || []);
    setMaxProductsCount(sec.maxProductsCount || 6);
    setCustomDiscountPercent(sec.customDiscountPercent);
    setIsFormOpen(true);
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Zəhmət olmasa bölmənin başlığını daxil edin!', 'error');
      return;
    }

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      badgeText: badgeText.trim() || undefined,
      iconName,
      themeColor,
      isActive,
      order: Number(order) || 1,
      showButton,
      buttonText: buttonText.trim() || undefined,
      buttonLink: buttonLink.trim() || undefined,
      hasCountdown,
      countdownTitle: countdownTitle.trim() || 'Bitməsinə qaldı:',
      countdownEndTime: hasCountdown && countdownEndTime ? countdownEndTime : undefined,
      countdownExpiredAction,
      productSource,
      productTag: productSource === 'tag' ? productTag : undefined,
      productIds: selectedProductIds,
      maxProductsCount: Number(maxProductsCount) || 6,
      customDiscountPercent: customDiscountPercent ? Number(customDiscountPercent) : undefined
    };

    if (editingSection) {
      updateHomeSection(editingSection.id, payload);
    } else {
      addHomeSection(payload);
    }

    setIsFormOpen(false);
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedSections.length) return;

    const newSections = [...sortedSections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    reorderHomeSections(newSections);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newSections = [...sortedSections];
    const [movedItem] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, movedItem);

    setDraggedIndex(null);
    reorderHomeSections(newSections);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Product Selection Handlers
  const handleToggleProductInPicker = (productId: string) => {
    if (!productPickerSection) return;
    const current = new Set(productPickerSection.productIds || []);
    if (current.has(productId)) {
      current.delete(productId);
    } else {
      current.add(productId);
    }
    const newIds = Array.from(current);
    updateHomeSection(productPickerSection.id, {
      productIds: newIds,
      productSource: 'manual'
    });
    setProductPickerSection({
      ...productPickerSection,
      productIds: newIds,
      productSource: 'manual'
    });
  };

  // Toggle in Form modal
  const handleToggleProductInForm = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  // Filtered products for modal picker
  const filteredPickerProducts = products.filter((p) => {
    if (!pickerSearchQuery.trim()) return true;
    const q = pickerSearchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  // Selected icon component for modal preview
  const SelectedIconComp = SECTION_ICONS[iconName]?.icon || Zap;
  const selectedThemePreset = THEME_PRESETS[themeColor] || THEME_PRESETS.red_orange;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-700 uppercase tracking-wider">
              🏠 Ana Səhifə İdarəetməsi
            </span>
            <span className="text-xs font-bold text-slate-500">
              ({homeSections.length} bölmə)
            </span>
          </div>
          <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 mt-1">
            Ana Səhifə Vitrin Bölmələri
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ana səhifədəki blokların adını, mətnini, məhsullarını, rənglərini və ardıcıllığını redaktə edin. Bütün dəyişikliklər dərhal yadda saxlanılır.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Yeni Bölmə Əlavə Et</span>
        </button>
      </div>

      {/* Info notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Dinamik İdarəetmə:</p>
          <p className="text-blue-800">
            Hər bölmənin yanındakı <strong>«Düzəliş et»</strong> düyməsinə basaraq başlığı (məsələn: <em>“Günün Fürsətləri” → “Böyük Endirimlər”</em>), alt başlığı, ikon və məhsulları istədiyiniz kimi dəyişə bilərsiniz. Sıranı <strong>Drag & Drop</strong> (tutub çəkmə) və ya <strong>Yuxarı / Aşağı</strong> oxları ilə dərhal dəyişə bilərsiniz.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Cəmi Bölmələr</div>
          <div className="text-xl font-black text-slate-900 mt-1">{homeSections.length} ədəd</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase">Aktiv Vitrinlər</div>
          <div className="text-xl font-black text-emerald-600 mt-1">
            {homeSections.filter((s) => s.isActive).length} ədəd
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-amber-600 uppercase">Countdown Aktiv</div>
          <div className="text-xl font-black text-amber-600 mt-1">
            {homeSections.filter((s) => s.isActive && s.hasCountdown).length} ədəd
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-blue-600 uppercase">Ümumi Məhsul Bazası</div>
          <div className="text-xl font-black text-blue-600 mt-1">{products.length} məhsul</div>
        </div>
      </div>

      {/* FLASH SALE MAIN SECTION HIGHLIGHT CARD */}
      <div
        className={`p-5 rounded-3xl border transition-all ${
          flashSaleConfig.isActive
            ? 'bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border-orange-300 shadow-xs'
            : 'bg-slate-50 border-slate-200 opacity-80'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-md ${
                flashSaleConfig.isActive
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-100 text-orange-700">
                  Xüsusi Banner Bölməsi
                </span>
                <h3 className="font-heading font-black text-base text-slate-900">
                  {flashSaleConfig.title || 'Günün Flaş Endirimləri'}
                </h3>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    flashSaleConfig.isActive
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-red-100 text-red-600 border border-red-200'
                  }`}
                >
                  {flashSaleConfig.isActive ? '● Ana Səhifədə Aktivdir' : '○ Silinib / Deaktiv'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {flashSaleConfig.subtitle ||
                  'Məhdud sayda stoka malik məhsullar üçün qiymət endirimləri və geri sayım taymeri'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {flashSaleConfig.isActive ? (
              <button
                type="button"
                onClick={deleteFlashSaleSection}
                className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Bölməni tamamilə sil"
              >
                <Trash2 className="w-3.5 h-3.5" /> Bölməni Sil
              </button>
            ) : (
              <button
                type="button"
                onClick={restoreFlashSaleSection}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Bölməni Əlavə Et (Bərpa Et)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sections Cards List with Drag & Drop */}
      <div className="space-y-3">
        {sortedSections.map((section, index) => {
          const iconObj = SECTION_ICONS[section.iconName] || SECTION_ICONS.zap;
          const IconComponent = iconObj.icon;
          const theme = THEME_PRESETS[section.themeColor] || THEME_PRESETS.red_orange;

          // Product count calculation
          let assignedProductsCount = 0;
          if (section.productSource === 'manual') {
            assignedProductsCount = (section.productIds || []).length;
          } else if (section.productSource === 'tag') {
            assignedProductsCount = products.filter((p) =>
              p.tags.includes((section.productTag || 'flash_sale') as any)
            ).length;
          } else {
            assignedProductsCount = products.length;
          }

          const isBeingDragged = draggedIndex === index;
          const isDragOver = dragOverIndex === index;

          return (
            <motion.div
              key={section.id}
              layout
              draggable
              onDragStart={(e) => handleDragStart(e as any, index)}
              onDragOver={(e) => handleDragOver(e as any, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e as any, index)}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-3xl border transition-all shadow-xs overflow-hidden ${
                isBeingDragged
                  ? 'opacity-40 scale-[0.98] border-orange-400 dashed'
                  : isDragOver
                  ? 'border-orange-500 ring-2 ring-orange-500/30 bg-orange-50/20'
                  : section.isActive
                  ? 'border-slate-200 hover:border-slate-300'
                  : 'border-slate-200/60 opacity-70 bg-slate-50/50'
              }`}
            >
              <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Drag Handle & Info */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Drag Grip Handle */}
                  <div
                    className="p-2 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0"
                    title="Sıranı dəyişmək üçün tutub yuxarı və ya aşağı çəkin (Drag & Drop)"
                  >
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Order & Reorder Arrows */}
                  <div className="flex flex-col items-center justify-center bg-slate-100 p-1.5 rounded-2xl gap-0.5 flex-shrink-0">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMoveOrder(index, 'up')}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ${
                        index === 0 ? 'text-slate-300' : 'hover:bg-white text-slate-700 active:scale-95'
                      }`}
                      title="Yuxarı qaldır"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-black text-xs text-slate-800">#{index + 1}</span>
                    <button
                      disabled={index === sortedSections.length - 1}
                      onClick={() => handleMoveOrder(index, 'down')}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ${
                        index === sortedSections.length - 1
                          ? 'text-slate-300'
                          : 'hover:bg-white text-slate-700 active:scale-95'
                      }`}
                      title="Aşağı endir"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Section Icon Preview */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{
                      background: theme.isDarkBg
                        ? 'linear-gradient(135deg, #1e293b, #0f172a)'
                        : 'linear-gradient(135deg, #fff7ed, #fed7aa)',
                      color: theme.isDarkBg ? '#f97316' : '#ea580c'
                    }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Text Meta */}
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 truncate">
                        {section.title}
                      </h3>

                      {section.badgeText && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-700">
                          {section.badgeText}
                        </span>
                      )}

                      {section.isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> Aktiv
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> Deaktiv
                        </span>
                      )}

                      {section.hasCountdown && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Real-time Timer
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 font-medium line-clamp-1">{section.subtitle}</p>

                    {/* Meta tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-slate-500 font-medium">
                      <span>
                        Mənbə:{' '}
                        <strong className="text-slate-800">
                          {section.productSource === 'manual'
                            ? `Seçilmiş (${(section.productIds || []).length} məhsul)`
                            : section.productSource === 'tag'
                            ? `Tag: #${section.productTag}`
                            : 'Bütün məhsullar'}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Limit: <strong className="text-slate-800">maks {section.maxProductsCount} məhsul</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Mövzu: <strong className="text-slate-800">{theme.name.split(' (')[0]}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t border-slate-100 lg:border-0">
                  {/* Manage Products Button */}
                  <button
                    onClick={() => setProductPickerSection(section)}
                    className="px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Məhsulları seç və sırala"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Məhsullar ({assignedProductsCount})</span>
                  </button>

                  {/* Toggle Active Switch */}
                  <button
                    onClick={() => toggleHomeSectionActive(section.id)}
                    className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                      section.isActive
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {section.isActive ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Deaktiv et</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Aktivləşdir</span>
                      </>
                    )}
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => openEditModal(section)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Redaktə et</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteConfirmSection(section)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                    title="Bölməni sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {sortedSections.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-heading font-black text-base text-slate-900">
              Heç bir ana səhifə bölməsi yoxdur
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Ana səhifədə vitrin göstərmək üçün ilk bölmənizi əlavə edin.
            </p>
            <button
              onClick={openCreateModal}
              className="px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              + İlk Bölməni Əlavə Et
            </button>
          </div>
        )}
      </div>

      {/* CREATE / EDIT SECTION MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-heading font-black text-xl text-slate-900">
                    {editingSection ? `Bölməni Redaktə Et: ${editingSection.title}` : 'Yeni Ana Səhifə Bölməsi Yarat'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Başlıq, alt başlıq, məhsullar, ikon və düymə mətnlərini dəyişin
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* LIVE REAL-TIME PREVIEW ACCORDION / CARD */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-orange-600">
                    <Sparkles className="w-3.5 h-3.5" /> Canlı Önizləmə (Ana Səhifədə belə görünəcək)
                  </span>
                  <span>Sıra: #{order}</span>
                </div>

                <div
                  className={`p-4 sm:p-5 rounded-2xl shadow-sm relative overflow-hidden transition-all ${
                    selectedThemePreset.isDarkBg
                      ? `bg-gradient-to-r ${selectedThemePreset.gradient} text-white`
                      : 'bg-white border border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                          selectedThemePreset.isDarkBg ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'
                        }`}
                      >
                        <SelectedIconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-black text-base sm:text-lg">
                            {title || 'Bölmə Başlığı Daxil Edin...'}
                          </h4>
                          {badgeText && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                selectedThemePreset.isDarkBg ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {badgeText}
                            </span>
                          )}
                        </div>
                        {subtitle && (
                          <p
                            className={`text-xs ${
                              selectedThemePreset.isDarkBg ? 'text-orange-100' : 'text-slate-500'
                            }`}
                          >
                            {subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasCountdown && (
                        <div
                          className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 ${
                            selectedThemePreset.isDarkBg ? 'bg-black/30 text-white' : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{countdownTitle} 08:45:20</span>
                        </div>
                      )}

                      {showButton && (
                        <div
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                            selectedThemePreset.isDarkBg
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          <span>{buttonText || 'Hamısına Bax'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveSection} className="space-y-6">
                {/* 1. Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-heading font-black text-xs uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> 1. Başlıq & Mətnlər
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Bölmə Başlığı *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Məsələn: Böyük Endirimlər və ya Günün Fürsətləri"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Alt Başlıq</label>
                      <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="Məs: Ən çox bəyənilən və son dərəcə sərfəli qiymətlər"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Endirim / Badge Mətni (İstəyə bağlı)
                      </label>
                      <input
                        type="text"
                        value={badgeText}
                        onChange={(e) => setBadgeText(e.target.value)}
                        placeholder="Məs: 90%-dək Endirim, 🔥 Günün Təklifi"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Sıralama Sırası (Order)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={order}
                        onChange={(e) => setOrder(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Visual Style & Icon Picker */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <h4 className="font-heading font-black text-xs uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> 2. İkon və Vizual Rəng Tərzi
                  </h4>

                  {/* Icon selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Bölmə İkonu</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {Object.entries(SECTION_ICONS).map(([key, item]) => {
                        const Icon = item.icon;
                        const isSelected = iconName === key;
                        return (
                          <button
                            type="button"
                            key={key}
                            onClick={() => setIconName(key)}
                            className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-orange-500 text-white border-orange-500 shadow-md scale-105'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-bold truncate max-w-full">
                              {item.label.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Theme Presets */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Vizual Mövzu Qradiyenti</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {Object.entries(THEME_PRESETS).map(([key, item]) => {
                        const isSelected = themeColor === key;
                        return (
                          <button
                            type="button"
                            key={key}
                            onClick={() => setThemeColor(key)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                              isSelected
                                ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/50'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div
                              className={`h-4 w-full rounded-lg bg-gradient-to-r ${item.gradient} mb-2 shadow-xs`}
                            />
                            <div className="text-[11px] font-black text-slate-900 leading-tight">
                              {item.name.split(' (')[0]}
                            </div>
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-[10px]">
                                ✓
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Countdown Timer Settings */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-black text-xs uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> 3. Countdown Timer (Flaş Satış üçün)
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasCountdown}
                        onChange={(e) => setHasCountdown(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded-md focus:ring-orange-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-700">Timer Aktiv olsun</span>
                    </label>
                  </div>

                  {hasCountdown && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Timer Başlığı
                        </label>
                        <input
                          type="text"
                          value={countdownTitle}
                          onChange={(e) => setCountdownTitle(e.target.value)}
                          placeholder="Məs: Bitməsinə qaldı:"
                          className="w-full px-4 py-2 bg-white border border-amber-200 rounded-xl text-xs text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Bitmə Tarixi və Saatı *
                        </label>
                        <input
                          type="datetime-local"
                          value={countdownEndTime}
                          onChange={(e) => setCountdownEndTime(e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Müddət bitdikdə nə baş versin?
                        </label>
                        <select
                          value={countdownExpiredAction}
                          onChange={(e) => setCountdownExpiredAction(e.target.value as any)}
                          className="w-full px-4 py-2 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-900"
                        >
                          <option value="hide">Bölmə avtomatik gizlənsin (Tövsiyə olunur)</option>
                          <option value="show_always">
                            Bölmə açıq qalsın (Timer 00:00:00 göstərsin)
                          </option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Products Source & Action Button */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <h4 className="font-heading font-black text-xs uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" /> 4. Məhsul Təyinatı & Keçid Düyməsi
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Məhsul Təyinatı Üsulu
                      </label>
                      <select
                        value={productSource}
                        onChange={(e) => setProductSource(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900"
                      >
                        <option value="tag">Etiketə (Tag) görə avtomatik</option>
                        <option value="manual">Manual Seçilmiş Məhsullar</option>
                        <option value="all">Bütün Məhsullar</option>
                      </select>
                    </div>

                    {productSource === 'tag' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Məhsul Tag-i
                        </label>
                        <select
                          value={productTag}
                          onChange={(e) => setProductTag(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900"
                        >
                          <option value="flash_sale">⚡ flash_sale (Flaş Endirimlər)</option>
                          <option value="daily_deal">🔥 daily_deal (Günün Fürsətləri)</option>
                          <option value="best_seller">👑 best_seller (Çox Satılanlar)</option>
                          <option value="new_arrival">✨ new_arrival (Yeni Gələnlər)</option>
                          <option value="for_you">🎯 for_you (Sənin Üçün)</option>
                          <option value="top_seller">🏆 top_seller (Top Reytinq)</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Göstəriləcək Məhsul Sayı (Limit)
                      </label>
                      <select
                        value={maxProductsCount}
                        onChange={(e) => setMaxProductsCount(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900"
                      >
                        <option value={4}>4 Məhsul</option>
                        <option value={6}>6 Məhsul (Standart)</option>
                        <option value={8}>8 Məhsul</option>
                        <option value={10}>10 Məhsul</option>
                        <option value={12}>12 Məhsul</option>
                        <option value={18}>18 Məhsul</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Bölmə Statusu
                      </label>
                      <select
                        value={isActive ? 'active' : 'inactive'}
                        onChange={(e) => setIsActive(e.target.value === 'active')}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900"
                      >
                        <option value="active">🟢 Aktiv (Ana səhifədə göstərilir)</option>
                        <option value="inactive">⚪ Deaktiv (Gizlədilib)</option>
                      </select>
                    </div>
                  </div>

                  {/* Manual Products picker within form */}
                  {productSource === 'manual' && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          Bölməyə daxil olan məhsullar: {selectedProductIds.length} ədəd seçilib
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedProductIds(products.map((p) => p.id))}
                            className="text-[11px] font-bold text-orange-600 hover:underline"
                          >
                            Hamısını seç
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => setSelectedProductIds([])}
                            className="text-[11px] font-bold text-red-600 hover:underline"
                          >
                            Təmizlə
                          </button>
                        </div>
                      </div>

                      <div className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1">
                        {products.map((p) => {
                          const isSelected = selectedProductIds.includes(p.id);
                          return (
                            <div
                              key={p.id}
                              onClick={() => handleToggleProductInForm(p.id)}
                              className={`p-2 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-orange-50 border-orange-400 font-bold'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <img
                                src={p.images?.[0]}
                                alt=""
                                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                              />
                              <span className="text-xs text-slate-800 truncate flex-1">{p.title}</span>
                              <span className="text-xs text-orange-600 font-bold">{p.price} AZN</span>
                              <div
                                className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                                  isSelected ? 'bg-orange-600 text-white' : 'border border-slate-300'
                                }`}
                              >
                                {isSelected ? '✓' : ''}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Button options */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showButton}
                          onChange={(e) => setShowButton(e.target.checked)}
                          className="w-4 h-4 text-orange-600 rounded-md focus:ring-orange-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          Sağ tərəfdə keçid düyməsini göstər
                        </span>
                      </label>
                    </div>

                    {showButton && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Düymə Mətni
                          </label>
                          <input
                            type="text"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            placeholder="Hamısına Bax"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Düymə Hədəfi (Link / Tag)
                          </label>
                          <select
                            value={buttonLink}
                            onChange={(e) => setButtonLink(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                          >
                            <option value="flash_sale">⚡ Flaş Satış Siyahısı</option>
                            <option value="daily_deal">🔥 Günün Fürsətləri Siyahısı</option>
                            <option value="best_seller">👑 Çox Satılanlar Siyahısı</option>
                            <option value="new_arrival">✨ Yeni Gələnlər Siyahısı</option>
                            <option value="all">📁 Bütün Məhsullar</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
                  >
                    {editingSection ? 'Yadda Saxla' : 'Bölməni Yarat'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MANAGE PRODUCTS IN SECTION MODAL */}
      <AnimatePresence>
        {productPickerSection && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900">
                    Bölmənin Məhsulları: {productPickerSection.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Seçilmiş məhsullar: {(productPickerSection.productIds || []).length} ədəd (Göstərmə
                    limiti: {productPickerSection.maxProductsCount})
                  </p>
                </div>
                <button
                  onClick={() => setProductPickerSection(null)}
                  className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filters for product picker */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={pickerSearchQuery}
                    onChange={(e) => setPickerSearchQuery(e.target.value)}
                    placeholder="Məhsul adı və ya kateqoriya ilə axtar..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const allIds = products.map((p) => p.id);
                      updateHomeSection(productPickerSection.id, {
                        productIds: allIds,
                        productSource: 'manual'
                      });
                      setProductPickerSection({
                        ...productPickerSection,
                        productIds: allIds,
                        productSource: 'manual'
                      });
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer whitespace-nowrap"
                  >
                    Hamısını Seç
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateHomeSection(productPickerSection.id, {
                        productIds: [],
                        productSource: 'manual'
                      });
                      setProductPickerSection({
                        ...productPickerSection,
                        productIds: [],
                        productSource: 'manual'
                      });
                    }}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl cursor-pointer whitespace-nowrap"
                  >
                    Təmizlə
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[55vh] pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPickerProducts.map((p) => {
                    const isSelected = (productPickerSection.productIds || []).includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleToggleProductInPicker(p.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'bg-orange-50/80 border-orange-500 ring-2 ring-orange-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                          <img
                            src={p.images?.[0]}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-xs text-slate-900 truncate">{p.title}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-black text-xs text-orange-600">
                              {(p.price ?? 0).toFixed(2)} AZN
                            </span>
                            {p.discountPercent > 0 && (
                              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded">
                                -{p.discountPercent}%
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {p.category}
                          </span>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            isSelected ? 'bg-orange-600 text-white' : 'border border-slate-300 text-transparent'
                          }`}
                        >
                          ✓
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Dəyişikliklər avtomatik yadda saxlanılır
                </span>
                <button
                  onClick={() => setProductPickerSection(null)}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-2xl cursor-pointer hover:bg-slate-800"
                >
                  Tamamlandı
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmSection && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center"
            >
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-heading font-black text-lg text-slate-900">
                  Bölməni Silmək İstəyirsiniz?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  “<strong>{deleteConfirmSection.title}</strong>” bölməsi ana səhifədən və admin panelindən tamamilə silinəcək.
                </p>
              </div>

              <div className="p-3 bg-red-50 rounded-2xl text-xs text-red-700 font-bold border border-red-200/60">
                Bu bölməni silmək istədiyinizə əminsiniz?
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmSection(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteHomeSection(deleteConfirmSection.id);
                    setDeleteConfirmSection(null);
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-red-500/25 transition-all cursor-pointer"
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
