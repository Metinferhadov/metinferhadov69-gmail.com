import React, { useState, useRef } from 'react';
import { Product, Category } from '../types';
import {
  X,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Play,
  Pause,
  Plus,
  Check,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Truck,
  Layers,
  Palette,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SafeVideoPlayer } from './SafeVideoPlayer';
import {
  optimizeImageFile,
  processVideoFile,
  registerVideoBlobUrl,
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_VIDEO_EXTENSIONS,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  formatFileSize
} from '../utils/mediaStorage';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'>, existingId?: string) => Promise<void> | void;
  editingProduct?: Product | null;
  categories: Category[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

interface UploadStatus {
  isUploading: boolean;
  progress: number;
  statusText: string;
  isSuccess: boolean;
  errorMessage: string | null;
  fileName?: string;
}

const PRESET_COLORS = [
  { name: 'Qara', hex: '#111827' },
  { name: 'Ağ', hex: '#F9FAFB' },
  { name: 'Gümüşü', hex: '#9CA3AF' },
  { name: 'Qızılı', hex: '#F59E0B' },
  { name: 'Göy', hex: '#2563EB' },
  { name: 'Qırmızı', hex: '#DC2626' },
  { name: 'Yaşıl', hex: '#16A34A' },
  { name: 'Tünd Yaşıl', hex: '#064E3B' },
  { name: 'Bej', hex: '#D4C3A3' },
  { name: 'Bənövşəyi', hex: '#7C3AED' }
];

const PRESET_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL',
  '36', '37', '38', '39', '40', '41', '42', '43', '44',
  '64GB', '128GB', '256GB', '512GB', '1TB'
];

const ProductFormModalInner: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  categories,
  showToast
}) => {
  // Form Basic Fields (Hooks must always run unconditionally)
  const [title, setTitle] = useState(editingProduct?.title || '');
  const [subtitle, setSubtitle] = useState(editingProduct?.subtitle || '');
  const [description, setDescription] = useState(editingProduct?.description || '');
  const [price, setPrice] = useState(editingProduct?.price ? editingProduct.price.toString() : '');
  const [oldPrice, setOldPrice] = useState(editingProduct?.oldPrice ? editingProduct.oldPrice.toString() : '');
  const [stock, setStock] = useState(editingProduct?.stock ? editingProduct.stock.toString() : '20');
  const [categoryId, setCategoryId] = useState(editingProduct?.categoryId || categories[0]?.id || 'electronics');
  const [brand, setBrand] = useState(editingProduct?.brand || 'MMZ Pro');
  const [deliveryDays, setDeliveryDays] = useState(editingProduct?.deliveryDays || '1-2 gün');
  const [isFreeDelivery, setIsFreeDelivery] = useState(editingProduct?.isFreeDelivery ?? true);

  // Media States (Limits: max 6 images, max 1 video)
  const [images, setImages] = useState<string[]>(() => {
    if (!editingProduct?.images || !Array.isArray(editingProduct.images)) return [];
    return editingProduct.images
      .filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
      .slice(0, 6);
  });
  const [videos, setVideos] = useState<string[]>(() => {
    if (!editingProduct) return [];
    if (Array.isArray(editingProduct.videos)) {
      return editingProduct.videos
        .filter((v): v is string => typeof v === 'string' && v.trim().length > 0 && !v.startsWith('blob:'))
        .slice(0, 1);
    }
    if (typeof (editingProduct as any).video === 'string' && (editingProduct as any).video.trim().length > 0 && !(editingProduct as any).video.startsWith('blob:')) {
      return [(editingProduct as any).video];
    }
    return [];
  });
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string>(() => {
    if (Array.isArray(editingProduct?.videos) && editingProduct.videos[0] && !editingProduct.videos[0].startsWith('blob:')) {
      return editingProduct.videos[0];
    }
    if (typeof (editingProduct as any)?.video === 'string' && !(editingProduct as any).video.startsWith('blob:')) {
      return (editingProduct as any).video;
    }
    return '';
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const activeBlobUrlsRef = useRef<string[]>([]);

  // Revoke session blob URLs on unmount to prevent memory leaks
  React.useEffect(() => {
    return () => {
      activeBlobUrlsRef.current.forEach((url) => {
        try {
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        } catch (_) {}
      });
    };
  }, []);
  
  // Variants: Colors & Sizes
  const [selectedColors, setSelectedColors] = useState<string[]>(
    editingProduct?.colors ? [...editingProduct.colors] : ['Qara', 'Gümüşü']
  );
  const [customColorInput, setCustomColorInput] = useState('');

  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    editingProduct?.sizes ? [...editingProduct.sizes] : []
  );
  const [customSizeInput, setCustomSizeInput] = useState('');

  // Target Home Sections / Tags
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    if (editingProduct?.tags && editingProduct.tags.length > 0) {
      return [...editingProduct.tags];
    }
    return ['new_arrival', 'for_you'];
  });

  // Specs Key-Values
  const [specs, setSpecs] = useState<{ key: string; val: string }[]>(() => {
    if (editingProduct?.specs && Object.keys(editingProduct.specs).length > 0) {
      return Object.entries(editingProduct.specs)
        .filter(([k, v]) => {
          const kLower = String(k).toLowerCase();
          const vLower = String(v || '').toLowerCase();
          return (
            !kLower.includes('zəmanət') &&
            !kLower.includes('zemanet') &&
            !vLower.includes('zəmanət') &&
            !vLower.includes('zemanet') &&
            !vLower.includes('12 ay') &&
            !vLower.includes('14 gün')
          );
        })
        .map(([k, v]) => ({ key: k, val: v }));
    }
    return [
      { key: 'Keyfiyyət', val: '100% Orijinal A++ Sertifikatlı' }
    ];
  });

  // Upload Statuses
  const [imageUploadStatus, setImageUploadStatus] = useState<UploadStatus>({
    isUploading: false,
    progress: 0,
    statusText: '',
    isSuccess: false,
    errorMessage: null
  });

  const [videoUploadStatus, setVideoUploadStatus] = useState<UploadStatus>({
    isUploading: false,
    progress: 0,
    statusText: '',
    isSuccess: false,
    errorMessage: null
  });

  // Active Tab within Form Modal
  const [activeModalTab, setActiveModalTab] = useState<'info' | 'media' | 'variants' | 'specs'>('info');

  // Drag over UI state
  const [isImageDragOver, setIsImageDragOver] = useState(false);
  const [isVideoDragOver, setIsVideoDragOver] = useState(false);

  // Hidden File Inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const replaceImageInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState<number | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Zoomed Image Preview Modal
  const [zoomImageSrc, setZoomImageSrc] = useState<string | null>(null);

  // Auto-calculated discount percent
  const numPrice = parseFloat(price) || 0;
  const numOldPrice = parseFloat(oldPrice) || 0;
  const discountPercent =
    numOldPrice > numPrice && numOldPrice > 0
      ? Math.round(((numOldPrice - numPrice) / numOldPrice) * 100)
      : 0;

  // Handle Multi Image Upload
  const handleImageFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setImageUploadStatus({
      isUploading: true,
      progress: 5,
      statusText: 'Şəkillər qəbul edilir...',
      isSuccess: false,
      errorMessage: null,
      fileName: files.length === 1 ? files[0].name : `${files.length} şəkil`
    });

    const newUploadedUrls: string[] = [];
    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      try {
        const result = await optimizeImageFile(file, (progress, statusText) => {
          const overallProgress = Math.round(((i + progress / 100) / totalFiles) * 100);
          setImageUploadStatus((prev) => ({
            ...prev,
            progress: overallProgress,
            statusText: `[${i + 1}/${totalFiles}] ${statusText}`,
            fileName: file.name
          }));
        });

        newUploadedUrls.push(result.dataUrl);
      } catch (err: any) {
        setImageUploadStatus({
          isUploading: false,
          progress: 0,
          statusText: '',
          isSuccess: false,
          errorMessage: err.message || 'Şəkil yüklənərkən xəta baş verdi',
          fileName: file.name
        });
        showToast(`Xəta (${file.name}): ${err.message}`, 'error');
        return;
      }
    }

    setImages((prev) => [...prev, ...newUploadedUrls]);
    setImageUploadStatus({
      isUploading: false,
      progress: 100,
      statusText: 'Uğurla yükləndi',
      isSuccess: true,
      errorMessage: null
    });
    showToast(`${newUploadedUrls.length} real şəkil uğurla əlavə edildi!`, 'success');

    setTimeout(() => {
      setImageUploadStatus((prev) => ({ ...prev, isSuccess: false }));
    }, 4000);
  };

  // Handle Single Image Replace
  const handleReplaceImageFile = async (file: File) => {
    if (replaceTargetIndex === null) return;
    try {
      setImageUploadStatus({
        isUploading: true,
        progress: 10,
        statusText: 'Şəkil əvəzlənir...',
        isSuccess: false,
        errorMessage: null,
        fileName: file.name
      });

      const result = await optimizeImageFile(file, (prog, st) => {
        setImageUploadStatus((prev) => ({ ...prev, progress: prog, statusText: st }));
      });

      setImages((prev) => {
        const next = [...prev];
        next[replaceTargetIndex] = result.dataUrl;
        return next;
      });

      setImageUploadStatus({
        isUploading: false,
        progress: 100,
        statusText: 'Şəkil uğurla dəyişdirildi',
        isSuccess: true,
        errorMessage: null
      });
      showToast('Şəkil uğurla yeniləndi', 'success');
      setReplaceTargetIndex(null);
    } catch (err: any) {
      setImageUploadStatus({
        isUploading: false,
        progress: 0,
        statusText: '',
        isSuccess: false,
        errorMessage: err.message || 'Şəkil əvəzlənərkən xəta baş verdi'
      });
      showToast(err.message || 'Şəkil əvəzlənə bilmədi', 'error');
    }
  };

  // Handle Video Upload (Limit: 1 video, MP4/MOV/WEBM)
  const handleVideoFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file) return;

    // Check size limit: max 100MB
    if (file.size > 100 * 1024 * 1024) {
      setVideoUploadStatus({
        isUploading: false,
        progress: 0,
        statusText: '',
        isSuccess: false,
        errorMessage: `Video ölçüsü çox böyükdür (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maksimum icazə verilən həcm 100MB-dır.`,
        fileName: file.name
      });
      showToast('Video 100MB-dan çox ola bilməz!', 'error');
      return;
    }

    // Check format: MP4, MOV, WEBM
    const nameLower = (file.name || '').toLowerCase();
    const typeLower = (file.type || '').toLowerCase();
    const isValidFormat =
      nameLower.endsWith('.mp4') ||
      nameLower.endsWith('.mov') ||
      nameLower.endsWith('.webm') ||
      typeLower.includes('mp4') ||
      typeLower.includes('quicktime') ||
      typeLower.includes('webm') ||
      typeLower.startsWith('video/');

    if (!isValidFormat) {
      setVideoUploadStatus({
        isUploading: false,
        progress: 0,
        statusText: '',
        isSuccess: false,
        errorMessage: 'Yalnız MP4, MOV və ya WEBM formatlı videolar qəbul olunur.',
        fileName: file.name
      });
      showToast('Yalnız MP4, MOV və ya WEBM formatlı video seçin!', 'error');
      return;
    }

    // 1. INSTANT LOCAL PREVIEW while uploading
    let immediateBlobUrl = '';
    try {
      immediateBlobUrl = URL.createObjectURL(file);
      activeBlobUrlsRef.current.push(immediateBlobUrl);
      setPreviewVideoUrl(immediateBlobUrl);
    } catch (e) {
      console.warn('Could not create immediate object URL:', e);
    }

    setVideoUploadStatus({
      isUploading: true,
      progress: 20,
      statusText: 'Video serverə ötürülür...',
      isSuccess: false,
      errorMessage: null,
      fileName: file.name
    });

    try {
      const result = await processVideoFile(file, (progress, statusText) => {
        setVideoUploadStatus((prev) => ({
          ...prev,
          progress,
          statusText,
          fileName: file.name
        }));
      });

      if (result && result.videoUrl) {
        // Set final permanent accessible video URL
        setVideos([result.videoUrl]);
        setPreviewVideoUrl(result.videoUrl);
      }

      setVideoUploadStatus({
        isUploading: false,
        progress: 100,
        statusText: 'Video uğurla yükləndi və məhsula birləşdirildi',
        isSuccess: true,
        errorMessage: null,
        fileName: file.name
      });
      showToast('Məhsul videosu uğurla yükləndi!', 'success');

      setTimeout(() => {
        setVideoUploadStatus((prev) => ({ ...prev, isSuccess: false }));
      }, 4000);
    } catch (err: any) {
      console.error('Video upload error:', err);
      // Ensure no temporary broken URL is stored
      setVideos([]);
      setPreviewVideoUrl('');
      setVideoUploadStatus({
        isUploading: false,
        progress: 0,
        statusText: '',
        isSuccess: false,
        errorMessage: err.message || 'Video yüklənərkən xəta baş verdi',
        fileName: file.name
      });
      showToast(`Video xətası: ${err.message || 'Yükləmə xətası'}`, 'error');
    }
  };

  // Reorder Images
  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === images.length - 1) return;

    setImages((prev) => {
      const copy = [...prev];
      const targetIdx = direction === 'left' ? index - 1 : index + 1;
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const setAsMainImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
    showToast('Əsas şəkil təyin edildi', 'info');
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, idx) => idx !== index));
    setPreviewVideoUrl('');
    setVideoUploadStatus({
      isUploading: false,
      progress: 0,
      statusText: '',
      isSuccess: false,
      errorMessage: null,
      fileName: ''
    });
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
    showToast('Video silindi', 'info');
  };

  // Color selection toggle
  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const addCustomColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customColorInput.trim()) return;
    if (!selectedColors.includes(customColorInput.trim())) {
      setSelectedColors((prev) => [...prev, customColorInput.trim()]);
    }
    setCustomColorInput('');
  };

  // Size selection toggle
  const toggleSize = (sizeName: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sizeName) ? prev.filter((s) => s !== sizeName) : [...prev, sizeName]
    );
  };

  const addCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSizeInput.trim()) return;
    if (!selectedSizes.includes(customSizeInput.trim())) {
      setSelectedSizes((prev) => [...prev, customSizeInput.trim()]);
    }
    setCustomSizeInput('');
  };

  // Specs helper
  const addSpecRow = () => {
    setSpecs((prev) => [...prev, { key: '', val: '' }]);
  };

  const updateSpecRow = (index: number, field: 'key' | 'val', value: string) => {
    setSpecs((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const removeSpecRow = (index: number) => {
    setSpecs((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!title.trim()) {
      showToast('Zəhmət olmasa məhsulun adını daxil edin.', 'error');
      setActiveModalTab('info');
      return;
    }

    if (!numPrice || numPrice <= 0) {
      showToast('Zəhmət olmasa düzgün qiymət təyin edin.', 'error');
      setActiveModalTab('info');
      return;
    }

    if (images.length === 0) {
      showToast('Ən azı 1 real məhsul şəkli yükləməlisiniz!', 'error');
      setActiveModalTab('media');
      return;
    }

    if (videoUploadStatus.isUploading) {
      showToast('Video hələ serverə yüklənir, zəhmət olmasa bir neçə saniyə gözləyin...', 'info');
      setActiveModalTab('media');
      return;
    }

    const catObj = categories.find((c) => c.id === categoryId) || categories[0] || {
      id: 'electronics',
      name: 'Elektronika'
    };

    const finalSpecs: { [key: string]: string } = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.val.trim()) {
        finalSpecs[s.key.trim()] = s.val.trim();
      }
    });

    const payload: Omit<Product, 'id'> = {
      title: title.trim(),
      subtitle: subtitle.trim() || '',
      description: description.trim() || 'Premium MMZ keyfiyyətli məhsul.',
      price: numPrice,
      oldPrice: numOldPrice > 0 ? numOldPrice : numPrice,
      discountPercent: discountPercent,
      category: catObj.name,
      categoryId: catObj.id,
      rating: editingProduct?.rating || 5.0,
      reviewsCount: editingProduct?.reviewsCount || 0,
      salesCount: editingProduct?.salesCount || 0,
      stock: parseInt(stock) || 10,
      images: images.filter((img) => typeof img === 'string' && img.trim().length > 0).slice(0, 6),
      videos: videos.filter((vid) => typeof vid === 'string' && vid.trim().length > 0 && !vid.startsWith('blob:')).slice(0, 1),
      colors: selectedColors.length > 0 ? selectedColors : [],
      sizes: selectedSizes.length > 0 ? selectedSizes : [],
      tags: (selectedTags.length > 0 ? selectedTags : ['new_arrival', 'for_you']) as ("new_arrival" | "for_you")[],
      brand: brand.trim() || 'MMZ Pro',
      specs: finalSpecs,
      isFreeDelivery: isFreeDelivery,
      deliveryDays: deliveryDays || '1-2 gün'
    };

    setIsSubmitting(true);
    try {
      await onSave(payload, editingProduct?.id);
      onClose();
    } catch (err: any) {
      showToast(err?.message || 'Məhsul yadda saxlanılarkən xəta baş verdi', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="product-form-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
    >
      <motion.div
        id="product-form-modal-card"
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black shadow-md shadow-orange-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900 leading-snug">
                {editingProduct ? 'Məhsulu Redaktə Et' : 'Yeni Məhsul Əlavə Et'}
              </h3>
              <p className="text-xs text-slate-500">
                Real şəkil və video yükləmə ilə tam məhsul kartı yaradın
              </p>
            </div>
          </div>

          <button
            id="btn-close-product-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation inside Modal */}
        <div className="bg-slate-50/80 px-6 pt-3 border-b border-slate-200/80 flex gap-2 overflow-x-auto">
          <button
            id="tab-btn-info"
            type="button"
            onClick={() => setActiveModalTab('info')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeModalTab === 'info'
                ? 'bg-white text-orange-600 border-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Layers className="w-4 h-4" />
            Əsas Məlumatlar
          </button>

          <button
            id="tab-btn-media"
            type="button"
            onClick={() => setActiveModalTab('media')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border-b-2 relative ${
              activeModalTab === 'media'
                ? 'bg-white text-orange-600 border-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Şəkil və Video Yükləmə
            <span className="ml-1 bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-md text-[10px] font-black">
              {images.length} şəkil {videos.length > 0 && `• ${videos.length} video`}
            </span>
          </button>

          <button
            id="tab-btn-variants"
            type="button"
            onClick={() => setActiveModalTab('variants')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeModalTab === 'variants'
                ? 'bg-white text-orange-600 border-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Palette className="w-4 h-4" />
            Rəng & Ölçü Variantları
          </button>

          <button
            id="tab-btn-specs"
            type="button"
            onClick={() => setActiveModalTab('specs')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeModalTab === 'specs'
                ? 'bg-white text-orange-600 border-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Xüsusiyyətlər & Çatdırılma
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC INFO */}
          {activeModalTab === 'info' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Məhsul Adı <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-product-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Məs: Apple iPhone 15 Pro Max 256GB Natural Titanium"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Alt Başlıq / Slogan (Qısa üstünlük)
                  </label>
                  <input
                    id="input-product-subtitle"
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Məs: A17 Pro Chip, 5x Telephoto Kamera, 48MP Əsas Sensor"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Kateqoriya <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="select-product-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {/* Geyim Kateqoriyası Seçimi: Uşaq / Qız / Kişi */}
                  {(categoryId === 'fashion' ||
                    categoryId === 'clothing_kids' ||
                    categoryId === 'clothing_girls' ||
                    categoryId === 'clothing_men') && (
                    <div className="mt-3 p-3.5 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100/50 rounded-2xl border border-orange-200/80 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          👕 Geyim Növünü Təyin Edin:
                        </span>
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-200/60 px-2 py-0.5 rounded-full">
                          Məhsulu bölməyə yerləşdirin
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mb-2.5">
                        Admin olaraq bu məhsulu birbaşa Uşaq, Qız və ya Kişi kateqoriyasına yerləşdirə bilərsiniz:
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setCategoryId('clothing_kids')}
                          className={`p-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                            categoryId === 'clothing_kids'
                              ? 'bg-orange-600 text-white border-orange-600 shadow-sm shadow-orange-500/30'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:bg-orange-50/50'
                          }`}
                        >
                          <span className="text-base">👦</span>
                          <span className="font-heading font-bold">Uşaq Geyimləri</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryId('clothing_girls')}
                          className={`p-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                            categoryId === 'clothing_girls'
                              ? 'bg-orange-600 text-white border-orange-600 shadow-sm shadow-orange-500/30'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:bg-orange-50/50'
                          }`}
                        >
                          <span className="text-base">👧</span>
                          <span className="font-heading font-bold">Qız Geyimləri</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryId('clothing_men')}
                          className={`p-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                            categoryId === 'clothing_men'
                              ? 'bg-orange-600 text-white border-orange-600 shadow-sm shadow-orange-500/30'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300 hover:bg-orange-50/50'
                          }`}
                        >
                          <span className="text-base">👨</span>
                          <span className="font-heading font-bold">Kişi Geyimləri</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Brend</label>
                  <input
                    id="input-product-brand"
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Məs: Apple, Samsung, Sony, Nike, MMZ"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold"
                  />
                </div>

                {/* Price Matrix */}
                <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-4 sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-orange-950 mb-1.5">
                      Satış Qiyməti (AZN) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="input-product-price"
                        type="number"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="79.99"
                        className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-2xl font-black text-slate-900 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                        AZN
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Köhnə / Endirimsiz Qiymət (AZN)
                    </label>
                    <div className="relative">
                      <input
                        id="input-product-old-price"
                        type="number"
                        step="0.01"
                        value={oldPrice}
                        onChange={(e) => setOldPrice(e.target.value)}
                        placeholder="119.99"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl font-semibold text-slate-700 text-sm focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                        AZN
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Hesablanan Endirim
                    </label>
                    <div className="h-10 px-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between font-black">
                      <span className="text-slate-500">Faiz:</span>
                      {discountPercent > 0 ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md text-xs font-black">
                          -{discountPercent}% ENDİRİM
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Endirimsiz</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Anbar Stok Sayı (Ədəd) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-product-stock"
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="25"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Çatdırılma Müddəti
                  </label>
                  <input
                    id="input-product-delivery-days"
                    type="text"
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    placeholder="Məs: 1-2 gün, Həmin gün"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500 font-semibold"
                  />
                </div>

                {/* Target Showcase Sections / Tags */}
                <div className="sm:col-span-2 bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-800">
                      Görünəcəyi Ana Səhifə Vitrinləri & Bölmələri:
                    </label>
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/50">
                      Avtomatik Sinxronizasiya
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Bu məhsul avtomatik olaraq Ana Səhifədəki <strong>"Bütün Məhsullar"</strong> və <strong>"Məhsul Kataloqu"</strong>nda dərhal görünəcək. Əlavə olaraq xüsusi vitrinlərə də əlavə etmək üçün seçin:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      { id: 'new_arrival', label: '✨ Yeni Gələnlər' },
                      { id: 'for_you', label: '🎯 Sənin Üçün Seçdik' },
                      { id: 'flash_sale', label: '⚡ Flaş Satış' },
                      { id: 'daily_deal', label: '🔥 Günün Fürsəti' },
                      { id: 'best_seller', label: '👑 Çox Satılanlar' },
                      { id: 'discount', label: '🏷️ Xüsusi Endirim' }
                    ].map((tagItem) => {
                      const isChecked = selectedTags.includes(tagItem.id);
                      return (
                        <button
                          key={tagItem.id}
                          type="button"
                          onClick={() => {
                            setSelectedTags((prev) =>
                              prev.includes(tagItem.id)
                                ? prev.filter((t) => t !== tagItem.id)
                                : [...prev, tagItem.id]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border cursor-pointer ${
                            isChecked
                              ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span>{tagItem.label}</span>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Geniş Məhsul Təsviri
                  </label>
                  <textarea
                    id="textarea-product-desc"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Məhsul haqqında ətraflı məlumat, texniki detallar, üstünlüklər və istifadə qaydaları..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REAL IMAGE AND VIDEO UPLOAD */}
          {activeModalTab === 'media' && (
            <div className="space-y-8 text-xs">
              {/* SECTION A: REAL IMAGE UPLOADER */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-orange-600" />
                      1. Real Məhsul Şəkilləri ({images.length} ədəd)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Dəstəklənən formatlar: <b>JPG, JPEG, PNG, WEBP</b> (Max 15MB). Birinci şəkil avtomatik <b>Əsas Şəkil</b> olacaq.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Şəkil Seç
                  </button>
                </div>

                {/* Drag and Drop Zone for Images */}
                <div
                  id="image-dropzone"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsImageDragOver(true);
                  }}
                  onDragLeave={() => setIsImageDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsImageDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleImageFiles(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => imageInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                    isImageDragOver
                      ? 'border-orange-500 bg-orange-50 scale-102 ring-4 ring-orange-500/10'
                      : 'border-slate-300 hover:border-orange-400 bg-slate-50/50 hover:bg-orange-50/20'
                  }`}
                >
                  <input
                    ref={imageInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) handleImageFiles(e.target.files);
                      e.target.value = '';
                    }}
                  />

                  {/* Hidden replace input */}
                  <input
                    ref={replaceImageInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleReplaceImageFile(e.target.files[0]);
                      }
                      e.target.value = '';
                    }}
                  />

                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h5 className="font-heading font-black text-slate-800 text-sm">
                    Real məhsul şəkillərini buraya sürükləyin və ya klikləyin
                  </h5>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Cihazınızdan çoxlu şəkillər seçə bilərsiniz (Avtomatik Web üçün optimallaşdırılır)
                  </p>
                </div>

                {/* Image Upload Progress Indicator */}
                {imageUploadStatus.isUploading && (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-orange-950">
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-orange-600" />
                        {imageUploadStatus.statusText}
                      </span>
                      <span>{imageUploadStatus.progress}%</span>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-orange-600 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${imageUploadStatus.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {imageUploadStatus.isSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-3 flex items-center gap-2 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    {imageUploadStatus.statusText}
                  </div>
                )}

                {imageUploadStatus.errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3 flex items-center gap-2 font-semibold">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    {imageUploadStatus.errorMessage}
                  </div>
                )}

                {/* Uploaded Images Grid & Management */}
                {images.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-slate-600 text-xs font-bold">
                      <span>Yüklənmiş Şəkillər ({images.length})</span>
                      <span className="text-[11px] text-slate-400">
                        Oxlarla sıralayın və ya 'Əsas Şəkil' təyin edin
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative group bg-slate-100 rounded-2xl overflow-hidden border-2 transition-all shadow-xs ${
                            idx === 0
                              ? 'border-orange-500 ring-2 ring-orange-500/20'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <div className="aspect-square relative overflow-hidden bg-slate-200">
                            <img
                              src={imgUrl}
                              alt={`product-img-${idx}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Main Image Badge */}
                            {idx === 0 && (
                              <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1">
                                <Star className="w-3 h-3 fill-white" />
                                Əsas Şəkil
                              </div>
                            )}

                            {/* Zoom Preview Button */}
                            <button
                              type="button"
                              onClick={() => setZoomImageSrc(imgUrl)}
                              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Böyüt"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Control Footer */}
                          <div className="p-2 bg-white flex items-center justify-between gap-1 border-t border-slate-100">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveImage(idx, 'left')}
                                className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
                                title="Sola çək"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === images.length - 1}
                                onClick={() => moveImage(idx, 'right')}
                                className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
                                title="Sağa çək"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1">
                              {idx !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => setAsMainImage(idx)}
                                  className="px-1.5 py-1 text-[10px] font-bold text-orange-600 hover:bg-orange-50 rounded cursor-pointer"
                                  title="Əsas şəkil et"
                                >
                                  Əsas et
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setReplaceTargetIndex(idx);
                                  replaceImageInputRef.current?.click();
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                                title="Dəyiş"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                title="Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION B: REAL VIDEO UPLOADER */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                      <VideoIcon className="w-4 h-4 text-purple-600" />
                      2. Real Məhsul Videosu ({videos.length > 0 ? '1/1 video yüklənib' : '0/1 video'})
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Dəstəklənən formatlar: <b>MP4, MOV, WEBM</b> (Limit: 1 video, max 100MB). Seçilən video dərhal canlı pleyerdə oynadıla və yadda saxlanıla bilər.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      videoInputRef.current?.click();
                    }}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> {videos.length > 0 ? 'Videonu Dəyişdir' : 'Video Seç'}
                  </button>
                </div>

                {/* Drag and drop zone for videos */}
                <div
                  id="video-dropzone"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsVideoDragOver(true);
                  }}
                  onDragLeave={() => setIsVideoDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsVideoDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      const file = e.dataTransfer.files[0];
                      if (file) handleVideoFiles([file]);
                    }
                  }}
                  onClick={() => videoInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                    isVideoDragOver
                      ? 'border-purple-500 bg-purple-50 scale-102 ring-4 ring-purple-500/10'
                      : 'border-slate-300 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/20'
                  }`}
                >
                  <input
                    ref={videoInputRef}
                    type="file"
                    multiple={false}
                    accept=".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm,video/*"
                    className="hidden"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
                      if (file) {
                        handleVideoFiles([file]);
                      }
                      if (e.target) {
                        e.target.value = '';
                      }
                    }}
                  />

                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                    <VideoIcon className="w-6 h-6" />
                  </div>
                  <h5 className="font-heading font-black text-slate-800 text-sm">
                    {videos.length > 0 ? 'Yeni video seçmək üçün bura klikləyin və ya faylı sürükləyin' : 'Real məhsul videosunu buraya sürükləyin və ya klikləyin'}
                  </h5>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Cihazınızdan MP4, MOV və ya WEBM video faylı seçin (Maksimum 1 video)
                  </p>
                </div>

                {/* Video Upload Progress Indicator */}
                {videoUploadStatus.isUploading && (
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-950">
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
                        {videoUploadStatus.statusText}
                      </span>
                      <span>{videoUploadStatus.progress}%</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-purple-600 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${videoUploadStatus.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {videoUploadStatus.isSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-3 flex items-center gap-2 font-bold text-xs">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    {videoUploadStatus.statusText}
                  </div>
                )}

                {videoUploadStatus.errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3 flex items-center gap-2 font-semibold text-xs">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    {videoUploadStatus.errorMessage}
                  </div>
                )}

                {/* Uploaded Video Player (Limit: 1 video) */}
                {(videos.length > 0 || previewVideoUrl) && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                        <span>Məhsul Videosu (Canlı Pleyer)</span>
                        {videoUploadStatus.isUploading ? (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md text-[10px] font-extrabold flex items-center gap-1 animate-pulse">
                            <RefreshCw className="w-3 h-3 animate-spin text-purple-600" /> Serverə yüklənir...
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-extrabold flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" /> Video hazırdır
                          </span>
                        )}
                      </h5>
                    </div>

                    <div className="max-w-md">
                      <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-md flex flex-col">
                        <div className="relative aspect-video bg-black flex items-center justify-center">
                          <SafeVideoPlayer
                            key={videos[0] || previewVideoUrl}
                            src={videos[0] || previewVideoUrl}
                            className="w-full h-full object-contain"
                            controls={true}
                            preload="metadata"
                          />
                        </div>
                        <div className="p-3 bg-slate-900 flex items-center justify-between text-white text-xs">
                          <span className="font-bold flex items-center gap-1.5 text-purple-400">
                            <VideoIcon className="w-3.5 h-3.5" /> Məhsul Videosu (1/1)
                          </span>
                          <button
                            type="button"
                            onClick={() => removeVideo(0)}
                            className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: VARIANTS (COLORS & SIZES) */}
          {activeModalTab === 'variants' && (
            <div className="space-y-6 text-xs">
              {/* Color Options */}
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-orange-600" />
                    Rəng Variantları ({selectedColors.length} seçilib)
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => {
                    const isSelected = selectedColors.includes(c.name);
                    return (
                      <button
                        type="button"
                        key={c.name}
                        onClick={() => toggleColor(c.name)}
                        className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-105'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.name}
                        {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Color */}
                <div className="flex gap-2 pt-2 border-t border-slate-200">
                  <input
                    type="text"
                    value={customColorInput}
                    onChange={(e) => setCustomColorInput(e.target.value)}
                    placeholder="Başqa rəng yazın (məs: Kosmik Boz, Qrafit...)"
                    className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={addCustomColor}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl cursor-pointer"
                  >
                    Əlavə Et
                  </button>
                </div>
              </div>

              {/* Size Options */}
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Ölçü / Yaddaş Variantları ({selectedSizes.length} seçilib)
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PRESET_SIZES.map((s) => {
                    const isSelected = selectedSizes.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => toggleSize(s)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {s}
                        {isSelected && <Check className="w-3 h-3 ml-1 inline text-white" />}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Size */}
                <div className="flex gap-2 pt-2 border-t border-slate-200">
                  <input
                    type="text"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    placeholder="Fərqli ölçü və ya parametr yazın (məs: 2TB, 46mm, King Size...)"
                    className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={addCustomSize}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Əlavə Et
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPECS & DELIVERY */}
          {activeModalTab === 'specs' && (
            <div className="space-y-6 text-xs">
              {/* Delivery and Guarantees */}
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/80 space-y-4">
                <h4 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  Çatdırılma Məlumatı
                </h4>

                <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={isFreeDelivery}
                    onChange={(e) => setIsFreeDelivery(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">
                      Pulsuz Çatdırılma Nişanı Göstər
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Məhsul kartında və səhifəsində yaşıl 'Pulsuz Çatdırılma' bildirişi əks olunur
                    </span>
                  </div>
                </label>
              </div>

              {/* Dynamic Key-Value Specs Table */}
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                    Texniki Xüsusiyyətlər (Parametrlər)
                  </h4>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold rounded-xl cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Sətir Əlavə Et
                  </button>
                </div>

                <div className="space-y-2">
                  {specs.map((row, sIdx) => (
                    <div key={sIdx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Parametr adı (məs: Prosessor, Ekran...)"
                        value={row.key}
                        onChange={(e) => updateSpecRow(sIdx, 'key', e.target.value)}
                        className="w-1/3 px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Dəyər (məs: Apple A17 Pro, 6.7 inch OLED...)"
                        value={row.val}
                        onChange={(e) => updateSpecRow(sIdx, 'val', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(sIdx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium">
              {images.length > 0 ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  ✓ {images.length} şəkil və {videos.length} video hazır
                </span>
              ) : (
                <span className="text-amber-600 font-bold flex items-center gap-1">
                  ⚠️ Ən azı 1 məhsul şəkli yüklənməlidir
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors cursor-pointer"
              >
                Ləğv Et
              </button>

              <button
                id="btn-publish-product"
                type="submit"
                disabled={isSubmitting || videoUploadStatus.isUploading}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Yadda saxlanılır...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{editingProduct ? 'Yenilə və Yadda Saxla' : 'Məhsulu Yayımla'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Fullscreen Image Preview Zoom Modal */}
      {zoomImageSrc && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomImageSrc(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setZoomImageSrc(null)}
              className="absolute -top-12 right-0 text-white p-2 hover:bg-white/20 rounded-full cursor-pointer"
            >
              <X className="w-7 h-7" />
            </button>
            <img
              src={zoomImageSrc}
              alt="Zoom preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface ProductFormModalErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ProductFormModalErrorBoundary extends React.Component<
  { children: React.ReactNode; onClose: () => void },
  ProductFormModalErrorBoundaryState
> {
  state: ProductFormModalErrorBoundaryState = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: Error): ProductFormModalErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ProductFormModal caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-lg text-slate-900">Məhsul pəncərəsində xəta baş verdi</h3>
            <p className="text-xs text-slate-500">
              Formu yenidən aça və ya davam edə bilərsiniz. Ağ ekran xətası qarşısı alındı.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Yenidən cəhd et
              </button>
              <button
                type="button"
                onClick={this.props.onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const ProductFormModal: React.FC<ProductFormModalProps> = (props) => {
  return (
    <ProductFormModalErrorBoundary onClose={props.onClose}>
      <ProductFormModalInner {...props} />
    </ProductFormModalErrorBoundary>
  );
};
