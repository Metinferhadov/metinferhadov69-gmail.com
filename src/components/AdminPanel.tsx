import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus, Coupon, Order } from '../types';
import mmzLogoImg from '../assets/images/mmz_logo_1787952155327.jpg';
import { STATUS_CONFIG } from './OrdersView';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  CreditCard,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  Tag,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Eye,
  Sliders,
  DollarSign,
  Layers,
  MessageSquare,
  MessageCircle,
  Image as ImageIcon,
  Paperclip,
  CheckCheck,
  ShieldCheck,
  Search,
  UserPlus,
  X,
  FileText,
  Download,
  Sparkles,
  Zap,
  Flame,
  Headphones,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductFormModal } from './ProductFormModal';
import { BannerManager } from './BannerManager';
import { HomeSectionsManager } from './HomeSectionsManager';
import { FlashSalesManager } from './FlashSalesManager';
import { SupportAdminManager } from './SupportAdminManager';
import { FooterManager } from './FooterManager';
import { RoleManagementPanel } from './RoleManagementPanel';
import { HomeManagementPanel } from './HomeManagementPanel';
import { ChatImageModal } from './ChatImageModal';
import { optimizeImageFile } from '../utils/mediaStorage';

export const AdminPanel: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    deleteOrder,
    coupons,
    addCoupon,
    deleteCoupon,
    banners,
    homeSections,
    categories,
    user,
    showToast,
    notifications,
    addNotification,
    deleteNotification,
    clearAllNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationsCount,
    footerLinks,
    supportAdmins,
    selectedAdminId,
    setSelectedAdminId,
    chatUsers,
    selectedChatUserId,
    setSelectedChatUserId,
    addChatUser,
    updateChatUser,
    deleteChatUser,
    chatMessages,
    sendChatMessage,
    deleteChatMessage,
    clearChatMessages,
    unreadChatMessagesCount,
    markChatMessagesAsRead,
    setActiveTab,
    setSelectedOrderId,
    hasAdminRights,
    isSuperAdmin,
    openAuthModal,
    isUserLoggedIn,
    flashSaleConfig,
    allUsers
  } = useStore();

  const [adminTab, setAdminTab] = useState<
    | 'dashboard'
    | 'orders'
    | 'products'
    | 'home_manage'
    | 'home_sections'
    | 'flash_sales'
    | 'banners'
    | 'coupons'
    | 'support_admins'
    | 'messages'
    | 'footer'
    | 'notifications'
    | 'roles'
    | 'users'
    | 'customers'
  >('dashboard');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'order' | 'discount' | 'system' | 'chat'>('all');
  const [showCreateNotif, setShowCreateNotif] = useState(false);
  const [broadcastType, setBroadcastType] = useState<'system' | 'order' | 'discount' | 'chat'>('system');

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedEditingProduct, setSelectedEditingProduct] = useState<Product | null>(null);

  // New Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponVal, setNewCouponVal] = useState('20');
  const [newCouponMin, setNewCouponMin] = useState('30');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Admin Chat States
  const [adminChatInput, setAdminChatInput] = useState('');
  const [adminModalImage, setAdminModalImage] = useState<{ url: string; name?: string } | null>(null);
  const [adminChatFile, setAdminChatFile] = useState<{
    url: string;
    name: string;
    type: 'image' | 'file';
    size?: string;
  } | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showNewMsgModal, setShowNewMsgModal] = useState(false);
  const [newMsgSelectedUserId, setNewMsgSelectedUserId] = useState<string>('');
  const [newMsgCustomName, setNewMsgCustomName] = useState('');
  const [newMsgCustomPhone, setNewMsgCustomPhone] = useState('');
  const [newMsgText, setNewMsgText] = useState('');
  const [newMsgFile, setNewMsgFile] = useState<{
    url: string;
    name: string;
    type: 'image' | 'file';
    size?: string;
  } | null>(null);

  const adminChatEndRef = React.useRef<HTMLDivElement>(null);
  const adminImageInputRef = React.useRef<HTMLInputElement>(null);
  const adminFileInputRef = React.useRef<HTMLInputElement>(null);
  const newMsgImageInputRef = React.useRef<HTMLInputElement>(null);

  // Broadcast Message State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [viewingReceipt, setViewingReceipt] = useState<{
    url: string;
    orderId: string;
    orderNumber: string;
    total: number;
    customerName?: string;
    phone?: string;
    email?: string;
    paymentMethod?: string;
    createdAt?: string;
    status?: OrderStatus;
  } | null>(null);
  const [receiptZoom, setReceiptZoom] = useState<number>(1);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // KPI Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' && o.status !== 'payment_rejected' ? (o.total || 0) : 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const verifyingOrdersCount = orders.filter((o) => o.status === 'payment_verifying' || o.status === 'payment_pending').length;
  const confirmedOrdersCount = orders.filter((o) => o.status === 'payment_confirmed').length;

  const handleSaveProductData = async (productData: Omit<Product, 'id'>, existingId?: string) => {
    if (existingId) {
      const existing = products.find((p) => p.id === existingId);
      if (existing) {
        await updateProduct({ ...existing, ...productData });
      }
    } else {
      await addProduct(productData);
    }
    setSelectedEditingProduct(null);
    setShowProductModal(false);
  };

  const handleEditClick = (p: Product) => {
    setSelectedEditingProduct(p);
    setShowProductModal(true);
  };

  const handleOpenAddProduct = () => {
    setSelectedEditingProduct(null);
    setShowProductModal(true);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const c: Coupon = {
      code: newCouponCode.toUpperCase().trim(),
      discountType: newCouponType,
      discountValue: parseFloat(newCouponVal) || 10,
      minOrderAmount: parseFloat(newCouponMin) || 0,
      description: newCouponDesc || `${newCouponVal}% endirim kuponu`,
      expiresAt: '2026-12-31',
      isActive: true
    };
    addCoupon(c);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;
    addNotification({
      title: broadcastTitle,
      message: broadcastMsg,
      type: broadcastType
    });
    setBroadcastTitle('');
    setBroadcastMsg('');
    setShowCreateNotif(false);
  };

  // Mobile chat view state (WhatsApp style on phone: list vs active conversation)
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  // Combined customers: Merges registered customers from Firestore users with chat users
  const combinedChatUsers = React.useMemo(() => {
    const map = new Map<string, any>();

    // 1. Registered customers from database (allUsers)
    allUsers.forEach((reg) => {
      const email = (reg.email || '').toLowerCase().trim();
      const isSuper = email.includes('metinferhadov') || reg.role === 'super_admin';
      if (!isSuper) {
        map.set(reg.id, {
          id: reg.id,
          name: reg.fullName || 'Müştəri',
          email: reg.email || '',
          phone: reg.phone || '',
          role: reg.role === 'admin' ? 'Admin' : 'Müştəri',
          status: 'online',
          lastSeen: reg.createdAt,
          createdAt: reg.createdAt || new Date().toISOString()
        });
      }
    });

    // 2. Chat users from Firestore chat_users (merge/override with freshest state)
    chatUsers.forEach((u) => {
      const existing = map.get(u.id);
      map.set(u.id, {
        id: u.id,
        name: u.name || existing?.name || 'Müştəri',
        email: u.email || existing?.email || '',
        phone: u.phone || existing?.phone || '',
        avatar: u.avatar || existing?.avatar,
        role: u.role || existing?.role || 'Müştəri',
        status: u.status || existing?.status || 'online',
        lastSeen: u.lastSeen || existing?.lastSeen,
        createdAt: u.createdAt || existing?.createdAt || new Date().toISOString()
      });
    });

    return Array.from(map.values());
  }, [chatUsers, allUsers]);

  // Sort customers by last message time (WhatsApp style: most recent chat jumps to top)
  const sortedChatUsers = React.useMemo(() => {
    return [...combinedChatUsers].sort((a, b) => {
      const lastA = chatMessages
        .filter((m) => m.chatUserId === a.id || (a.email && m.senderEmail?.toLowerCase().trim() === a.email.toLowerCase().trim()))
        .slice(-1)[0];
      const lastB = chatMessages
        .filter((m) => m.chatUserId === b.id || (b.email && m.senderEmail?.toLowerCase().trim() === b.email.toLowerCase().trim()))
        .slice(-1)[0];
      const timeA = lastA ? (lastA.createdTime || new Date(lastA.createdAt).getTime()) : 0;
      const timeB = lastB ? (lastB.createdTime || new Date(lastB.createdAt).getTime()) : 0;
      return timeB - timeA;
    });
  }, [combinedChatUsers, chatMessages]);

  // Filtered chat users
  const filteredChatUsers = sortedChatUsers.filter((u) => {
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      (u.phone && u.phone.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  const activeChatUser =
    combinedChatUsers.find((u) => u.id === selectedChatUserId) ||
    (filteredChatUsers.length > 0 ? filteredChatUsers[0] : null);

  // Mark chat messages as read for active chat user
  const hasUnreadFromActiveUser = activeChatUser
    ? chatMessages.some(
        (m) =>
          (m.chatUserId === activeChatUser.id ||
            (activeChatUser.email && m.senderEmail?.toLowerCase().trim() === activeChatUser.email.toLowerCase().trim())) &&
          m.sender === 'user' &&
          !m.isRead
      )
    : false;

  React.useEffect(() => {
    if (adminTab === 'messages' && activeChatUser && hasUnreadFromActiveUser) {
      markChatMessagesAsRead(activeChatUser.id, 'admin');
    }
  }, [adminTab, activeChatUser?.id, hasUnreadFromActiveUser, markChatMessagesAsRead]);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    if (adminTab === 'messages') {
      adminChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [adminTab, chatMessages.length, selectedChatUserId, mobileChatOpen]);

  const handleAdminSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatInput.trim() && !adminChatFile) return;
    if (!activeChatUser) {
      showToast('Zəhmət olmasa bir istifadəçi seçin və ya yeni mesaj yaradın', 'error');
      return;
    }

    sendChatMessage(adminChatInput.trim(), {
      chatUserId: activeChatUser.id,
      adminId: 'admin-metin',
      sender: 'admin',
      senderName: 'Metin Fərhadov (Admin)',
      imageUrl: adminChatFile?.type === 'image' ? adminChatFile.url : undefined,
      fileUrl: adminChatFile?.type === 'file' ? adminChatFile.url : undefined,
      fileName: adminChatFile?.name,
      fileSize: adminChatFile?.size
    });

    setAdminChatInput('');
    setAdminChatFile(null);
  };

  const handleAdminImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format: JPG, JPEG, PNG, WEBP
    const validExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const lowerName = file.name.toLowerCase();
    const hasValidExt = validExts.some((ext) => lowerName.endsWith(ext));
    const hasValidMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type.toLowerCase());

    if (!hasValidExt && !hasValidMime) {
      showToast('Yalnız JPG, JPEG, PNG və WEBP formatlı şəkillər qəbul olunur', 'error');
      if (e.target) e.target.value = '';
      return;
    }

    try {
      const { dataUrl, sizeStr } = await optimizeImageFile(file);
      setAdminChatFile({
        url: dataUrl,
        name: file.name,
        type: 'image',
        size: sizeStr
      });
      showToast('Şəkil hazırlandı', 'success');
    } catch (err) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminChatFile({
          url: reader.result as string,
          name: file.name,
          type: 'image',
          size: `${(file.size / 1024).toFixed(1)} KB`
        });
      };
      reader.readAsDataURL(file);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleAdminFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminChatFile({
          url: reader.result as string,
          name: file.name,
          type: 'file',
          size: `${(file.size / 1024).toFixed(1)} KB`
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewMsgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const lowerName = file.name.toLowerCase();
    const hasValidExt = validExts.some((ext) => lowerName.endsWith(ext));
    const hasValidMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type.toLowerCase());

    if (!hasValidExt && !hasValidMime) {
      showToast('Yalnız JPG, JPEG, PNG və WEBP formatlı şəkillər qəbul olunur', 'error');
      if (e.target) e.target.value = '';
      return;
    }

    try {
      const { dataUrl, sizeStr } = await optimizeImageFile(file);
      setNewMsgFile({
        url: dataUrl,
        name: file.name,
        type: 'image',
        size: sizeStr
      });
      showToast('Şəkil hazırlandı', 'success');
    } catch (err) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMsgFile({
          url: reader.result as string,
          name: file.name,
          type: 'image',
          size: `${(file.size / 1024).toFixed(1)} KB`
        });
      };
      reader.readAsDataURL(file);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleSendNewMessageModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim() && !newMsgFile) {
      showToast('Zəhmət olmasa mesaj mətni daxil edin', 'error');
      return;
    }

    let targetUserId = newMsgSelectedUserId;
    if (!targetUserId) {
      if (!newMsgCustomName.trim()) {
        showToast('Zəhmət olmasa istifadəçi seçin və ya müştəri adını daxil edin', 'error');
        return;
      }
      const newUser = addChatUser({
        name: newMsgCustomName.trim(),
        phone: newMsgCustomPhone.trim() || undefined,
        role: 'Müştəri',
        status: 'online'
      });
      targetUserId = newUser.id;
    }

    sendChatMessage(newMsgText.trim(), {
      chatUserId: targetUserId,
      sender: 'admin',
      imageUrl: newMsgFile?.type === 'image' ? newMsgFile.url : undefined,
      fileUrl: newMsgFile?.type === 'file' ? newMsgFile.url : undefined,
      fileName: newMsgFile?.name,
      fileSize: newMsgFile?.size
    });

    setSelectedChatUserId(targetUserId);
    setShowNewMsgModal(false);
    setNewMsgText('');
    setNewMsgFile(null);
    setNewMsgSelectedUserId('');
    setNewMsgCustomName('');
    setNewMsgCustomPhone('');
    showToast('Mesaj uğurla göndərildi', 'success');
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((n) => {
    if (notifFilter === 'unread') return !n.isRead;
    if (notifFilter === 'order') return n.type === 'order';
    if (notifFilter === 'discount') return n.type === 'discount';
    if (notifFilter === 'system') return n.type === 'system';
    if (notifFilter === 'chat') return n.type === 'chat';
    return true;
  });

  // Filtered orders for admin table
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    if (orderStatusFilter === 'payment_verifying') {
      return o.status === 'payment_verifying' || o.status === 'payment_pending';
    }
    return o.status === orderStatusFilter;
  });

  // Access Control Guard
  if (!hasAdminRights) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-heading font-black text-2xl text-slate-900">
              Giriş Məhdudlaşdırılıb
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Admin Panelinə daxil olmaq üçün təsdiqlənmiş admin hesabı ilə sistemə daxil olmalısınız.
              Əgər administrator hesabınız varsa, zəhmət olmasa daxil olun.
            </p>
          </div>
          <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => openAuthModal(undefined, 'login')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all cursor-pointer"
            >
              Admin Girişi Et
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Ana Səhifəyə Qayıt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-md shadow-orange-500/20 overflow-hidden flex-shrink-0">
              <img
                src={mmzLogoImg}
                alt="MMZ Logo"
                className="w-full h-full object-cover rounded-[10px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
                MMZ ONLINE Admin Panel
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Satış, sifarişlər, məhsullar və müştəri əlaqələrinin mərkəzləşdirilmiş idarəetməsi
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('notifications')}
            className={`relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
              adminTab === 'notifications'
                ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-500/20'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Bildirişlər bölməsi"
          >
            <Bell className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Bildirişlər</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                adminTab === 'notifications'
                  ? 'bg-white/20 text-white'
                  : unreadNotificationsCount > 0
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {unreadNotificationsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('home')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            &larr; Sayta Qayıt
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {[
          { id: 'dashboard', label: '📊 Dashboard & Gəlir', icon: LayoutDashboard, badge: null },
          { id: 'orders', label: '📦 Sifarişlər', icon: Package, badge: orders.length },
          {
            id: 'payment_verifying',
            label: '💳 Ödəniş Yoxlanılan Sifarişlər',
            icon: CheckCircle2,
            badge: verifyingOrdersCount > 0 ? `${verifyingOrdersCount} gözləyir` : null
          },
          { id: 'products', label: '🛍️ Məhsul İdarəsi', icon: ShoppingBag, badge: products.length },
          {
            id: 'home_manage',
            label: '🏠 Ana Səhifəni İdarə Et',
            icon: Sliders,
            badge: `${banners.length} banner • ${homeSections.length} bölmə`
          },
          {
            id: 'customers',
            label: '👥 MÜŞTƏRİLƏR',
            icon: Users,
            badge: allUsers.length
          },
          { id: 'coupons', label: '🏷️ Kuponlar & Endirimlər', icon: Tag, badge: coupons.length },
          {
            id: 'support_admins',
            label: '🎧 Canlı Dəstək Adminləri',
            icon: Headphones,
            badge: supportAdmins.length
          },
          {
            id: 'messages',
            label: '💬 Canlı Dəstək Mesajları',
            icon: MessageSquare,
            badge: unreadChatMessagesCount > 0 ? `${unreadChatMessagesCount} yeni` : null
          },
          {
            id: 'footer',
            label: '🦶 Footer & Əlaqə',
            icon: Layers,
            badge: footerLinks.length
          },
          {
            id: 'notifications',
            label: '🔔 Bildirişlər',
            icon: Bell,
            badge: notifications.length
          }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive =
            (tab.id === 'payment_verifying' && adminTab === 'orders' && orderStatusFilter === 'payment_verifying') ||
            (tab.id === 'orders' && adminTab === 'orders' && orderStatusFilter !== 'payment_verifying') ||
            (tab.id !== 'payment_verifying' && tab.id !== 'orders' && (
              adminTab === tab.id ||
              (tab.id === 'customers' && (adminTab === 'customers' || adminTab === 'users' || adminTab === 'roles'))
            ));
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'payment_verifying') {
                  setAdminTab('orders');
                  setOrderStatusFilter('payment_verifying');
                } else if (tab.id === 'orders') {
                  setAdminTab('orders');
                  setOrderStatusFilter('all');
                } else {
                  setAdminTab(tab.id as any);
                }
              }}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== null && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.id === 'notifications' && (unreadNotificationsCount > 0)
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD */}
      {adminTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">Ümumi Satış Gəliri</span>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-heading font-black text-2xl text-slate-900">
                {(totalRevenue ?? 0).toFixed(2)} <span className="text-sm font-bold text-orange-600">AZN</span>
              </h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ +24.5% bu həftə</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">Toplam Sifarişlər</span>
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-heading font-black text-2xl text-slate-900">
                {totalOrdersCount} ədəd
              </h3>
              <p className="text-[11px] text-blue-600 font-bold mt-1">100% icra olunur</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">Aktiv Məhsul Sayı</span>
                <ShoppingBag className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="font-heading font-black text-2xl text-slate-900">
                {totalProductsCount} ədəd
              </h3>
              <p className="text-[11px] text-purple-600 font-bold mt-1">8 Kateqoriya üzrə</p>
            </div>

            <div
              onClick={() => setAdminTab('customers')}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase group-hover:text-amber-600 transition-colors">Qeydiyyatlı Müştərilər</span>
                <Users className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="font-heading font-black text-2xl text-slate-900">
                {allUsers.length > 0 ? `${allUsers.length} nəfər` : '0 nəfər'}
              </h3>
              <p className="text-[11px] text-amber-600 font-bold mt-1">Müştəriləri idarə et &rarr;</p>
            </div>
          </div>

          {/* Special Quick Action Cards for Payment Verifying & Confirmed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => {
                setAdminTab('orders');
                setOrderStatusFilter('payment_verifying');
              }}
              className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-5 hover:bg-blue-100/80 transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">
                    {verifyingOrdersCount}
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-slate-900 text-base">
                      💳 Ödəniş Yoxlanılan Sifarişlər
                    </h4>
                    <p className="text-xs text-blue-700 font-medium mt-0.5">
                      Bank və ya BirKart təsdiqi gözləyən sifarişləri idarə et
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-700">&rarr; Bax</span>
              </div>
            </div>

            <div
              onClick={() => {
                setAdminTab('orders');
                setOrderStatusFilter('payment_confirmed');
              }}
              className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-5 hover:bg-emerald-100/80 transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
                    {confirmedOrdersCount}
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-slate-900 text-base">
                      ✓ Ödənişi Təsdiqlənmiş Sifarişlər
                    </h4>
                    <p className="text-xs text-emerald-700 font-medium mt-0.5">
                      Paketlənmə və kuryerə verilmə mərhələsinə göndər
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">&rarr; Bax</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                Bütün Sifarişlər & Status Dəyişmə
              </h3>
              <p className="text-xs text-slate-500">
                Hər bir sifarişin statusunu 8 mərhələ arasında dərhal yeniləyin
              </p>
            </div>

            {/* Quick Status Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setOrderStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  orderStatusFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Hamısı ({orders.length})
              </button>
              <button
                onClick={() => setOrderStatusFilter('payment_verifying')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  orderStatusFilter === 'payment_verifying'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <span>💳 Ödəniş Yoxlanılır</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  orderStatusFilter === 'payment_verifying' ? 'bg-white text-blue-600' : 'bg-blue-200 text-blue-800'
                }`}>
                  {verifyingOrdersCount}
                </span>
              </button>
              <button
                onClick={() => setOrderStatusFilter('payment_confirmed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  orderStatusFilter === 'payment_confirmed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <span>✓ Ödəniş Təsdiqləndi</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  orderStatusFilter === 'payment_confirmed' ? 'bg-white text-emerald-600' : 'bg-emerald-200 text-emerald-800'
                }`}>
                  {confirmedOrdersCount}
                </span>
              </button>
            </div>
          </div>

          {/* Active Payment Verifying Filter Banner */}
          {orderStatusFilter === 'payment_verifying' && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs flex-shrink-0">
                  {verifyingOrdersCount}
                </div>
                <div>
                  <h4 className="font-heading font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <span>Ödəniş Yoxlanılan Sifarişlər</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">
                      {verifyingOrdersCount} sifariş gözləyir
                    </span>
                  </h4>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Bank Köçürməsi və ya BirKart ilə ödəniş çeki yüklənmiş və təsdiq gözləyən sifarişlər
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOrderStatusFilter('all')}
                className="px-3.5 py-1.5 bg-white hover:bg-blue-100/50 text-blue-800 font-bold text-xs rounded-xl border border-blue-200 transition-colors cursor-pointer flex-shrink-0"
              >
                Bütün Sifarişlərə Keç &rarr;
              </button>
            </div>
          )}

          {/* Desktop Orders Table (hidden on mobile, visible on md and up) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Sifariş № & Tarix</th>
                  <th className="p-3">Müştəri</th>
                  <th className="p-3">Məhsullar</th>
                  <th className="p-3">Məbləğ & Üsul</th>
                  <th className="p-3">Ödəniş Çeki</th>
                  <th className="p-3">Cari Status</th>
                  <th className="p-3">Statusu Dəyiş</th>
                  <th className="p-3 text-right">Təsdiq / Əməliyyat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-bold text-sm text-slate-600">Sifariş tapılmadı</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {orderStatusFilter === 'payment_verifying'
                          ? 'Hazırda ödəniş yoxlanışı gözləyən sifariş yoxdur'
                          : 'Hazırda bu bölmədə heç bir sifariş mövcud deyil'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const cfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.payment_pending;
                    const isPendingOrVerifying = o.status === 'payment_verifying' || o.status === 'payment_pending';

                    return (
                      <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-slate-900 font-mono block">#{o.orderNumber}</span>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>
                              {o.createdAt
                                ? new Date(o.createdAt).toLocaleDateString('az-AZ', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : '—'}
                            </span>
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-slate-900">{o.customerInfo.fullName}</div>
                          <div className="text-[11px] text-slate-600 font-mono">{o.customerInfo.phone}</div>
                          {o.customerInfo.email && (
                            <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{o.customerInfo.email}</div>
                          )}
                          {o.customerInfo.city && (
                            <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                              {o.customerInfo.city}, {o.customerInfo.address}
                            </div>
                          )}
                        </td>

                        <td className="p-3 max-w-[180px] text-slate-700">
                          <div className="text-[11px] font-semibold truncate">
                            {o.items.map((it) => `${it.quantity}x ${it.product.title}`).join(', ')}
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">
                            {o.items.reduce((sum, it) => sum + (it.quantity || 1), 0)} ədəd ({o.items.length} çeşid)
                          </span>
                        </td>

                        <td className="p-3">
                          <span className="font-heading font-black text-sm text-slate-900 block">
                            {(o.total ?? 0).toFixed(2)} AZN
                          </span>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                            o.paymentMethod === 'birkart'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {o.paymentMethod === 'birkart' ? '💳 BirKart Taksit' : '💳 Bank Köçürməsi'}
                          </span>
                        </td>

                        <td className="p-3">
                          {o.receiptImage ? (
                            <button
                              type="button"
                              onClick={() => {
                                setReceiptZoom(1);
                                setViewingReceipt({
                                  url: o.receiptImage!,
                                  orderId: o.id,
                                  orderNumber: o.orderNumber,
                                  total: o.total,
                                  customerName: o.customerInfo.fullName,
                                  phone: o.customerInfo.phone,
                                  email: o.customerInfo.email,
                                  paymentMethod: o.paymentMethod,
                                  createdAt: o.createdAt,
                                  status: o.status
                                });
                              }}
                              className="flex items-center gap-1.5 p-1 bg-orange-50/80 hover:bg-orange-100/80 border border-orange-200 rounded-xl transition-all cursor-pointer group shadow-2xs"
                              title="Ödəniş çekinə tam ölçüdə bax"
                            >
                              <img
                                src={o.receiptImage}
                                alt="Çek"
                                className="w-8 h-8 rounded-lg object-cover bg-white border border-orange-200"
                              />
                              <span className="text-[11px] font-bold text-orange-600 group-hover:underline px-1">
                                Çekə Bax 🔍
                              </span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Yoxdur</span>
                          )}
                        </td>

                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] border inline-flex items-center gap-1 ${cfg.bgColor} ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </td>

                        <td className="p-3">
                          <select
                            value={o.status}
                            onChange={(e) => {
                              updateOrderStatus(o.id, e.target.value as OrderStatus);
                              showToast(`#${o.orderNumber} statusu yeniləndi`, 'info');
                            }}
                            className="px-2 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                          >
                            <option value="payment_pending">1. Ödəniş gözlənilir</option>
                            <option value="payment_verifying">2. Ödəniş yoxlanılır</option>
                            <option value="payment_confirmed">3. Ödəniş təsdiqləndi</option>
                            <option value="preparing">4. Hazırlanır</option>
                            <option value="handed_to_courier">5. Kuryerə verildi</option>
                            <option value="on_the_way">6. Yoldadır</option>
                            <option value="delivered">7. Çatdırıldı</option>
                            <option value="payment_rejected">8. Ödəniş rədd edildi</option>
                            <option value="cancelled">9. Ləğv edildi</option>
                          </select>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPendingOrVerifying && (
                              <>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await updateOrderStatus(o.id, 'payment_confirmed');
                                    showToast(`#${o.orderNumber} üçün ödəniş təsdiqləndi! ✓`, 'success');
                                  }}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1"
                                  title="Ödənişi təsdiqlə"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Təsdiqlə</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await updateOrderStatus(o.id, 'payment_rejected');
                                    showToast(`#${o.orderNumber} üçün ödəniş rədd edildi.`, 'error');
                                  }}
                                  className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 transition-all cursor-pointer flex items-center gap-1"
                                  title="Ödənişi rədd et"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Rədd et</span>
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                const existing = chatUsers.find(
                                  (u) => u.name === o.customerInfo.fullName || (u.phone && u.phone === o.customerInfo.phone)
                                );
                                if (existing) {
                                  setSelectedChatUserId(existing.id);
                                } else {
                                  const created = addChatUser({
                                    name: o.customerInfo.fullName,
                                    phone: o.customerInfo.phone,
                                    email: o.customerInfo.email,
                                    role: 'Müştəri',
                                    status: 'online'
                                  });
                                  setSelectedChatUserId(created.id);
                                }
                                setAdminTab('messages');
                              }}
                              className="px-2 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-[11px] font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                              title="Müştəri ilə Çat"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOrderId(o.id);
                                setActiveTab('order_detail');
                              }}
                              className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-slate-100 rounded-lg cursor-pointer font-bold transition-colors"
                              title="Ətraflı Bax"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setOrderToDelete(o)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                              title="Sifarişi Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Orders Card View (Phones < 768px) */}
          <div className="md:hidden space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-sm text-slate-600">Sifariş tapılmadı</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {orderStatusFilter === 'payment_verifying'
                    ? 'Hazırda ödəniş yoxlanışı gözləyən sifariş yoxdur'
                    : 'Hazırda bu bölmədə heç bir sifariş mövcud deyil'}
                </p>
              </div>
            ) : (
              filteredOrders.map((o) => {
                const cfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.payment_pending;
                const isPendingOrVerifying = o.status === 'payment_verifying' || o.status === 'payment_pending';

                return (
                  <div key={o.id} className="p-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl space-y-3">
                    {/* Header: Order # & Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-slate-900 text-sm">#{o.orderNumber}</span>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>
                            {o.createdAt
                              ? new Date(o.createdAt).toLocaleDateString('az-AZ', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : '—'}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${cfg.bgColor} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>

                    {/* Customer & Amount */}
                    <div className="flex items-start justify-between gap-2 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{o.customerInfo.fullName}</div>
                        <div className="text-[11px] text-slate-600 font-mono">{o.customerInfo.phone}</div>
                        {o.customerInfo.email && (
                          <div className="text-[11px] text-slate-400">{o.customerInfo.email}</div>
                        )}
                        {o.customerInfo.city && (
                          <div className="text-[11px] text-slate-400">{o.customerInfo.city}, {o.customerInfo.address}</div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-[11px] text-slate-400 block font-medium">Məbləğ</span>
                        <span className="font-heading font-black text-sm text-slate-900">{(o.total ?? 0).toFixed(2)} AZN</span>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                          o.paymentMethod === 'birkart'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {o.paymentMethod === 'birkart' ? 'BirKart Taksit' : 'Bank Köçürməsi'}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 text-xs text-slate-700 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span>Məhsullar ({o.items.reduce((sum, it) => sum + (it.quantity || 1), 0)} ədəd):</span>
                        <span className="text-slate-500 font-semibold">{o.items.length} çeşid</span>
                      </div>
                      {o.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-[11px]">
                          <span className="truncate pr-2">{it.quantity}x {it.product.title}</span>
                          <span className="font-bold text-slate-900 flex-shrink-0">{(((it as any).price ?? it.product.price ?? 0) * (it.quantity ?? 1)).toFixed(2)} AZN</span>
                        </div>
                      ))}
                    </div>

                    {/* Receipt (if exists) */}
                    {o.receiptImage && (
                      <div className="flex items-center justify-between bg-orange-50/70 p-2.5 rounded-xl border border-orange-200/80">
                        <div className="flex items-center gap-2">
                          <img
                            src={o.receiptImage}
                            alt="Çek"
                            className="w-10 h-10 rounded-lg object-cover bg-white border border-orange-200"
                          />
                          <div>
                            <span className="text-xs font-bold text-orange-950 block">Ödəniş Çeki</span>
                            <span className="text-[10px] text-orange-700">Müştəri tərəfindən yüklənib</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setReceiptZoom(1);
                            setViewingReceipt({
                              url: o.receiptImage!,
                              orderId: o.id,
                              orderNumber: o.orderNumber,
                              total: o.total,
                              customerName: o.customerInfo.fullName,
                              phone: o.customerInfo.phone,
                              email: o.customerInfo.email,
                              paymentMethod: o.paymentMethod,
                              createdAt: o.createdAt,
                              status: o.status
                            });
                          }}
                          className="px-3 py-1.5 bg-white text-orange-600 font-bold text-xs rounded-lg border border-orange-300 shadow-xs cursor-pointer hover:bg-orange-100 transition-colors"
                        >
                          Çekə Bax 🔍
                        </button>
                      </div>
                    )}

                    {/* Quick Confirm / Reject if payment_verifying */}
                    {isPendingOrVerifying && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={async () => {
                            await updateOrderStatus(o.id, 'payment_confirmed');
                            showToast(`#${o.orderNumber} üçün ödəniş təsdiqləndi! ✓`, 'success');
                          }}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Ödənişi Təsdiqlə</span>
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await updateOrderStatus(o.id, 'payment_rejected');
                            showToast(`#${o.orderNumber} üçün ödəniş rədd edildi.`, 'error');
                          }}
                          className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Ödənişi Rədd Et</span>
                        </button>
                      </div>
                    )}

                    {/* Status Dropdown & Action Icons */}
                    <div className="space-y-2 pt-1 border-t border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500 flex-shrink-0">Status:</span>
                        <select
                          value={o.status}
                          onChange={(e) => {
                            updateOrderStatus(o.id, e.target.value as OrderStatus);
                            showToast(`#${o.orderNumber} statusu yeniləndi`, 'info');
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                        >
                          <option value="payment_pending">1. Ödəniş gözlənilir</option>
                          <option value="payment_verifying">2. Ödəniş yoxlanılır</option>
                          <option value="payment_confirmed">3. Ödəniş təsdiqləndi</option>
                          <option value="preparing">4. Hazırlanır</option>
                          <option value="handed_to_courier">5. Kuryerə verildi</option>
                          <option value="on_the_way">6. Yoldadır</option>
                          <option value="delivered">7. Çatdırıldı</option>
                          <option value="payment_rejected">8. Ödəniş rədd edildi</option>
                          <option value="cancelled">9. Ləğv edildi</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => {
                            const existing = chatUsers.find(
                              (u) => u.name === o.customerInfo.fullName || (u.phone && u.phone === o.customerInfo.phone)
                            );
                            if (existing) {
                              setSelectedChatUserId(existing.id);
                            } else {
                              const created = addChatUser({
                                name: o.customerInfo.fullName,
                                phone: o.customerInfo.phone,
                                email: o.customerInfo.email,
                                role: 'Müştəri',
                                status: 'online'
                              });
                              setSelectedChatUserId(created.id);
                            }
                            setAdminTab('messages');
                          }}
                          className="flex-1 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Müştəri ilə Çat</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrderId(o.id);
                            setActiveTab('order_detail');
                          }}
                          className="p-2 text-slate-600 hover:text-orange-600 bg-white border border-slate-200 rounded-xl font-bold cursor-pointer"
                          title="Ətraflı Bax"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderToDelete(o)}
                          className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 border border-rose-200 rounded-xl cursor-pointer"
                          title="Sifarişi Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS CRUD */}
      {adminTab === 'products' && (
        <div className="space-y-6">
          {/* Top Bar for Products */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                Məhsulların İdarə Edilməsi
              </h3>
              <p className="text-xs text-slate-500">
                Real şəkil və video yükləmə, redaktə etmə və anbar idarəsi
              </p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-black text-xs rounded-2xl flex items-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Yeni Məhsul Əlavə Et
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex items-center gap-3 hover:border-slate-300 transition-all group"
              >
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  {p.videos && p.videos.length > 0 && (
                    <div className="absolute bottom-1 right-1 bg-purple-600 text-white text-[9px] font-black px-1 rounded-sm shadow-xs">
                      VID
                    </div>
                  )}
                  {p.images && p.images.length > 1 && (
                    <div className="absolute top-1 left-1 bg-slate-900/80 text-white text-[9px] font-bold px-1 rounded-sm">
                      +{p.images.length}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">{p.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-heading font-black text-sm text-orange-600">
                      {(p.price ?? 0).toFixed(2)} AZN
                    </span>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">
                      Stok: {p.stock}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleEditClick(p)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                    title="Redaktə et"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Product Creation & Editing Modal with Real Upload */}
          {showProductModal && (
            <ProductFormModal
              key={selectedEditingProduct ? `edit-${selectedEditingProduct.id}` : 'new-product'}
              isOpen={showProductModal}
              onClose={() => {
                setSelectedEditingProduct(null);
                setShowProductModal(false);
              }}
              onSave={handleSaveProductData}
              editingProduct={selectedEditingProduct}
              categories={categories}
              showToast={showToast}
            />
          )}
        </div>
      )}

      {/* TAB: HOME SECTIONS & BANNERS UNIFIED MANAGEMENT / ANA SƏHİFƏNİ İDARƏ ET */}
      {(adminTab === 'home_manage' || adminTab === 'home_sections') && (
        <HomeManagementPanel initialSubTab="sections" />
      )}
      {adminTab === 'banners' && <HomeManagementPanel initialSubTab="banners" />}
      {adminTab === 'flash_sales' && <HomeManagementPanel initialSubTab="flash_sales" />}

      {/* TAB 5: COUPONS & DISCOUNTS */}
      {adminTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Coupon Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-heading font-black text-base text-slate-900 pb-3 border-b border-slate-100">
              Yeni Kupon Yarat
            </h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kupon Kodu *</label>
                <input
                  type="text"
                  required
                  placeholder="Məs: YAY2026"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Endirim Növü</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="percentage">Faiz (%)</option>
                    <option value="fixed">Məbləğ (AZN)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dəyər</label>
                  <input
                    type="number"
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum Səbət (AZN)</label>
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Açıqlama</label>
                <input
                  type="text"
                  placeholder="Məs: 30 AZN üzəri sifarişlərə 20% endirim"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Kuponu Yarat & Aktivləşdir
              </button>
            </form>
          </div>

          {/* Active Coupons List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-heading font-black text-base text-slate-900 mb-2">
              Aktiv Kuponlar ({coupons.length})
            </h3>
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-mono font-black text-xs">
                    %
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-900 uppercase">
                        {c.code}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                        {c.discountType === 'percentage' ? `${c.discountValue}% Endirim` : `${c.discountValue} AZN`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{c.description}</p>
                    <span className="text-[10px] text-slate-400">Min. Səbət: {c.minOrderAmount} AZN</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteCoupon(c.code)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SUPPORT ADMINS CRUD MANAGER */}
      {adminTab === 'support_admins' && (
        <SupportAdminManager />
      )}

      {/* TAB 5: MESSAGES / ÇAT İDARƏETMƏSİ */}
      {adminTab === 'messages' && (
        <div className="space-y-4">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-orange-100 text-orange-600 rounded-xl">
                  <MessageSquare className="w-5 h-5" />
                </span>
                <h3 className="font-heading font-black text-lg text-slate-900">
                  İstifadəçi Mesajları & Canlı Dəstək
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Admin: <strong className="text-slate-800 font-semibold">Metin Fərhadov</strong> — Bütün qeydiyyatdan keçmiş istifadəçilərə canlı mesaj göndərin və cavablayın
              </p>
            </div>

            <button
              onClick={() => setShowNewMsgModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-orange-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Mesaja əlavə et
            </button>
          </div>

          {/* Admin Messaging Grid: Left (User List), Right (Chat) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[75vh] min-h-[580px]">
            {/* LEFT COLUMN: Registered Users List */}
            <div className={`lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden ${mobileChatOpen ? 'hidden lg:flex' : 'flex'}`}>
              {/* Search Bar */}
              <div className="p-3.5 border-b border-slate-200/80">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="İstifadəçi axtar..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-100/90 border border-transparent focus:border-orange-500 focus:bg-white rounded-xl text-xs focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* User List Stream */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
                {filteredChatUsers.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6" />
                    </div>
                    <p className="font-heading font-black text-sm text-slate-800">
                      İstifadəçi tapılmadı
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {chatUsers.length === 0
                        ? 'Hələ heç bir istifadəçi qeydiyyatdan keçməyib.'
                        : 'Axtarışa uyğun istifadəçi yoxdur.'}
                    </p>
                    <button
                      onClick={() => setShowNewMsgModal(true)}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Mesaj Başlat
                    </button>
                  </div>
                ) : (
                  filteredChatUsers.map((u) => {
                    const isSelected = activeChatUser?.id === u.id;
                    const userUnreadCount = chatMessages.filter(
                      (m) => (m.chatUserId === u.id || (u.email && m.senderEmail?.toLowerCase().trim() === u.email.toLowerCase().trim())) && m.sender === 'user' && !m.isRead
                    ).length;

                    // Get last message in this conversation
                    const lastMsg = chatMessages
                      .filter((m) => m.chatUserId === u.id || (u.email && m.senderEmail?.toLowerCase().trim() === u.email.toLowerCase().trim()))
                      .slice(-1)[0];

                    return (
                      <div
                        key={u.id}
                        onClick={() => {
                          setSelectedChatUserId(u.id);
                          setMobileChatOpen(true);
                          markChatMessagesAsRead(u.id, 'admin');
                        }}
                        className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-orange-50/80 border border-orange-200 shadow-xs'
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              {u.name.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="font-bold text-xs text-slate-900 truncate">
                                {u.name}
                              </h4>
                              {lastMsg && (
                                <span className="text-[10px] text-slate-400 flex-shrink-0">
                                  {lastMsg.timestamp}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {lastMsg ? (
                                lastMsg.sender === 'admin' ? (
                                  <span className="text-slate-600 font-medium">Siz: {lastMsg.text || 'Fayl'}</span>
                                ) : (
                                  lastMsg.text || 'Fayl/Şəkil'
                                )
                              ) : (
                                u.phone || u.email || 'Müştəri'
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Badges & Delete */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {userUnreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-orange-600 text-white font-bold text-[10px] rounded-full shadow-xs">
                              {userUnreadCount} yeni
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`"${u.name}" istifadəçisini və söhbətini silmək istəyirsiniz?`)) {
                                deleteChatUser(u.id);
                              }
                            }}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="İstifadəçini sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Chat Area with Selected User */}
            <div className={`lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden ${mobileChatOpen ? 'flex' : 'hidden lg:flex'}`}>
              {activeChatUser ? (
                <>
                  {/* Chat Top Header */}
                  <div className="p-3.5 sm:p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      {/* Mobile Back Button (WhatsApp style) */}
                      <button
                        type="button"
                        onClick={() => setMobileChatOpen(false)}
                        className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                        title="Müştərilər siyahısına qayıt"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>

                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-zinc-800 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-1 ring-orange-500/20">
                        {activeChatUser.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-black text-sm text-slate-900">
                            {activeChatUser.name}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {activeChatUser.role || 'Müştəri'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          {activeChatUser.phone || activeChatUser.email || 'Şəxsi WhatsApp Tipli Çat'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (window.confirm('Bu istifadəçi ilə olan mesajları təmizləmək istəyirsiniz?')) {
                            clearChatMessages(activeChatUser.id);
                          }
                        }}
                        className="text-xs text-slate-500 hover:text-red-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Təmizlə
                      </button>
                    </div>
                  </div>

                  {/* Chat Messages Stream */}
                  <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50/40 to-white">
                    {chatMessages.filter((m) => m.chatUserId === activeChatUser.id || (activeChatUser.email && m.senderEmail && m.senderEmail.toLowerCase().trim() === activeChatUser.email.toLowerCase().trim())).length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs border border-emerald-100">
                          <MessageSquare className="w-7 h-7" />
                        </div>
                        <div>
                          <h5 className="font-heading font-black text-sm text-slate-800">
                            {activeChatUser.name} ilə canlı söhbət
                          </h5>
                          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            Bu müştəri ilə hələ mesajlaşma olmayıb. Aşağıdakı xanadan ilk mesajınızı göndərərək canlı söhbətə başlaya bilərsiniz.
                          </p>
                        </div>
                      </div>
                    ) : (
                      chatMessages
                        .filter((m) => m.chatUserId === activeChatUser.id || (activeChatUser.email && m.senderEmail && m.senderEmail.toLowerCase().trim() === activeChatUser.email.toLowerCase().trim()))
                        .map((msg) => {
                          const isAdmin = msg.sender === 'admin';

                          return (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                            >
                              <div className="relative group max-w-xs sm:max-w-md">
                                {/* Sender Tag */}
                                <div
                                  className={`text-[10px] font-bold mb-1 px-1 flex items-center gap-1 ${
                                    isAdmin ? 'text-slate-500 justify-end' : 'text-slate-700'
                                  }`}
                                >
                                  {isAdmin ? (
                                    <>
                                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                      <span>Metin Fərhadov — Admin</span>
                                    </>
                                  ) : (
                                    <span>{activeChatUser.name}</span>
                                  )}
                                </div>

                                {/* Bubble */}
                                <div
                                  className={`p-3.5 rounded-2xl shadow-xs text-xs sm:text-sm ${
                                    isAdmin
                                      ? 'bg-slate-900 text-white rounded-tr-xs'
                                      : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-xs shadow-xs'
                                  }`}
                                >
                                  {/* Image preview */}
                                  {msg.imageUrl && (
                                    <div
                                      className="mb-2 rounded-xl overflow-hidden bg-black/10 relative group cursor-pointer shadow-xs max-w-[260px] sm:max-w-sm"
                                      onClick={() => setAdminModalImage({ url: msg.imageUrl!, name: msg.fileName || 'Şəkil' })}
                                    >
                                      <img
                                        src={msg.imageUrl}
                                        alt={msg.fileName || 'attachment'}
                                        className="w-full max-h-60 object-cover group-hover:scale-[1.02] transition-transform duration-200"
                                        loading="lazy"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                                          <ZoomIn className="w-3.5 h-3.5" /> Şəkilə Tam Bax
                                        </span>
                                      </div>
                                      <div className="absolute bottom-1.5 right-1.5 sm:hidden bg-black/60 text-white p-1 rounded-md">
                                        <ZoomIn className="w-3 h-3" />
                                      </div>
                                    </div>
                                  )}

                                  {/* File preview */}
                                  {msg.fileUrl && (
                                    <div
                                      className={`mb-2 p-2 rounded-xl flex items-center justify-between gap-2 ${
                                        isAdmin ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-800'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <FileText className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-xs truncate">{msg.fileName || 'Fayl'}</span>
                                      </div>
                                      <a
                                        href={msg.fileUrl}
                                        download={msg.fileName || 'file'}
                                        className="p-1 rounded hover:bg-black/10"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                      </a>
                                    </div>
                                  )}

                                  {/* Text */}
                                  {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                                  {/* Footer */}
                                  <div
                                    className={`flex items-center justify-end gap-1.5 mt-1.5 text-[9px] ${
                                      isAdmin ? 'text-slate-400' : 'text-slate-400'
                                    }`}
                                  >
                                    <span>{msg.timestamp}</span>
                                    {isAdmin && (
                                      <CheckCheck
                                        className={`w-3 h-3 ${msg.isRead ? 'text-emerald-400' : 'text-slate-500'}`}
                                      />
                                    )}
                                  </div>
                                </div>

                                {/* Delete Message */}
                                <button
                                  onClick={() => deleteChatMessage(msg.id)}
                                  className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 p-1 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-md border border-slate-200 transition-opacity cursor-pointer"
                                  title="Sil"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })
                    )}
                    <div ref={adminChatEndRef} />
                  </div>

                  {/* Attachment Preview before sending */}
                  {adminChatFile && (
                    <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between animate-fade-in">
                      <div className="flex items-center gap-2.5">
                        {adminChatFile.type === 'image' ? (
                          <div
                            className="relative cursor-pointer group"
                            onClick={() => setAdminModalImage({ url: adminChatFile.url, name: adminChatFile.name })}
                            title="Tam baxmaq üçün klikləyin"
                          >
                            <img
                              src={adminChatFile.url}
                              alt="preview"
                              className="w-9 h-9 rounded-lg object-cover border border-orange-400 shadow-xs"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <ZoomIn className="w-3 h-3" />
                            </div>
                          </div>
                        ) : (
                          <FileText className="w-6 h-6 text-orange-600" />
                        )}
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-800 truncate block max-w-xs">
                            {adminChatFile.name}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold">✓ Göndərilməyə hazırdır</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setAdminChatFile(null)}
                        className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                        title="Sil"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Admin Chat Input Bar */}
                  <form
                    onSubmit={handleAdminSendMessage}
                    className="p-3 sm:p-4 border-t border-slate-200/80 flex items-center gap-2 bg-white"
                  >
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      ref={adminImageInputRef}
                      onChange={handleAdminImageUpload}
                      className="hidden"
                    />
                    <input
                      type="file"
                      ref={adminFileInputRef}
                      onChange={handleAdminFileUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => adminImageInputRef.current?.click()}
                      className="p-2.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
                      title="Şəkil əlavə et"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => adminFileInputRef.current?.click()}
                      className="p-2.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
                      title="Fayl əlavə et"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>

                    <input
                      type="text"
                      placeholder={`Metin Fərhadov — Admin olaraq ${activeChatUser.name} istifadəçisinə yazın...`}
                      value={adminChatInput}
                      onChange={(e) => setAdminChatInput(e.target.value)}
                      className="flex-1 py-2.5 px-3.5 bg-slate-100/90 border border-transparent focus:border-orange-500 focus:bg-white rounded-xl text-xs sm:text-sm focus:outline-none transition-all"
                    />

                    <button
                      type="submit"
                      disabled={!adminChatInput.trim() && !adminChatFile}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" /> Göndər
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                  <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
                  <p className="font-bold text-sm text-slate-700">Söhbət seçilməyib</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Sol siyahıdan bir istifadəçi seçin və ya yeni mesaj yaradın.
                  </p>
                  <button
                    onClick={() => setShowNewMsgModal(true)}
                    className="mt-4 px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    + Yeni Mesaj Yarat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: YENİ MESAJ YARAT */}
      <AnimatePresence>
        {showNewMsgModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg text-slate-900">
                      Yeni Mesaj Göndər
                    </h3>
                    <p className="text-xs text-slate-500">Göndərən: Metin Fərhadov — Admin</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewMsgModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendNewMessageModal} className="space-y-4 mt-4">
                {/* 1. İstifadəçi seçimi */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    1. İstifadəçi Seçin və ya Yeni Müştəri
                  </label>
                  {chatUsers.length > 0 ? (
                    <select
                      value={newMsgSelectedUserId}
                      onChange={(e) => setNewMsgSelectedUserId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-orange-500"
                    >
                      <option value="">+ Yeni müştəri daxil et...</option>
                      {chatUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.phone || u.email || 'Müştəri'})
                        </option>
                      ))}
                    </select>
                  ) : null}

                  {/* Əgər yeni istifadəçidirsə ad və telefon daxil edin */}
                  {!newMsgSelectedUserId && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Müştərinin Adı və Soyadı *"
                        value={newMsgCustomName}
                        onChange={(e) => setNewMsgCustomName(e.target.value)}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                      />
                      <input
                        type="text"
                        placeholder="Telefon və ya Email (istəyə bağlı)"
                        value={newMsgCustomPhone}
                        onChange={(e) => setNewMsgCustomPhone(e.target.value)}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Mesaj mətni */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2. Mesaj Mətni *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Müştəriyə bildiriş və ya cavab mesajınızı yazın..."
                    value={newMsgText}
                    onChange={(e) => setNewMsgText(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* 3. Şəkil / Fayl əlavə et */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    3. Şəkil Əlavə Et (İstəyə bağlı)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={newMsgImageInputRef}
                    onChange={handleNewMsgImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => newMsgImageInputRef.current?.click()}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-orange-600" /> Şəkil Seç
                    </button>
                    {newMsgFile && (
                      <div className="flex items-center gap-2 bg-orange-50 px-2.5 py-1.5 rounded-xl border border-orange-200 text-xs text-orange-700">
                        <span className="truncate max-w-[150px]">{newMsgFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setNewMsgFile(null)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowNewMsgModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" /> Göndər
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TAB 6: NOTIFICATIONS SYSTEM */}
      {adminTab === 'notifications' && (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                  <Bell className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900">
                    Bildirişlər və Xəbərdarlıqlar
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ümumi: <strong className="text-slate-900">{notifications.length}</strong> &bull; Oxunmamış: <strong className="text-orange-600">{unreadNotificationsCount}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowCreateNotif(!showCreateNotif)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Yeni Bildiriş Yarat
              </button>
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllNotificationsRead}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hamısını Oxunmuş Et
                  </button>
                  <button
                    onClick={clearAllNotifications}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Bütün Bildirişləri Sil
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Create Notification Drawer/Form */}
          {showCreateNotif && (
            <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-orange-600" />
                  <h4 className="font-heading font-black text-sm text-slate-900">
                    Yeni Sistem / Marketinq Bildirişi Göndər
                  </h4>
                </div>
                <button
                  onClick={() => setShowCreateNotif(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Bağla
                </button>
              </div>

              <form onSubmit={handleSendBroadcast} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bildiriş Növü</label>
                  <select
                    value={broadcastType}
                    onChange={(e) => setBroadcastType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="system">Sistem / Ümumi Xəbərdarlıq</option>
                    <option value="discount">Endirim / Promo Kampaniya</option>
                    <option value="order">Sifariş Məlumatı</option>
                    <option value="chat">Müştəri Xidməti / Mesaj</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bildiriş Başlığı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Məs: ⚡ Gecə Flaş Endirimi Başladı!"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Mesaj Mətni *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Bildiriş mətni daxil edin..."
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateNotif(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    İmtina
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Göndər
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filter Pills */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: `Hamısı (${notifications.length})` },
                { id: 'unread', label: `Oxunmamış (${unreadNotificationsCount})` },
                { id: 'order', label: '📦 Sifarişlər' },
                { id: 'discount', label: '🏷️ Endirimlər' },
                { id: 'system', label: '⚙️ Sistem' },
                { id: 'chat', label: '💬 Mesajlar' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setNotifFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    notifFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {/* Empty State vs List */}
          {notifications.length === 0 ? (
            <div className="py-8" />
          ) : filteredNotifications.length === 0 ? (
            <div className="py-8" />
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((n) => {
                const typeColors = {
                  order: 'bg-blue-50 text-blue-700 border-blue-200',
                  discount: 'bg-amber-50 text-amber-700 border-amber-200',
                  system: 'bg-purple-50 text-purple-700 border-purple-200',
                  chat: 'bg-emerald-50 text-emerald-700 border-emerald-200'
                };
                const typeLabels = {
                  order: '📦 Sifariş',
                  discount: '🎁 Endirim',
                  system: '⚙️ Sistem',
                  chat: '💬 Mesaj'
                };

                return (
                  <div
                    key={n.id}
                    className={`p-4 bg-white rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      n.isRead ? 'border-slate-200 opacity-80' : 'border-orange-300 bg-orange-50/20 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-600 mt-0.5">
                        <Bell className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-heading font-black text-sm text-slate-900">
                            {n.title}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              typeColors[n.type] || 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {typeLabels[n.type] || 'Bildiriş'}
                          </span>
                          {n.isRead ? (
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              Oxunub
                            </span>
                          ) : (
                            <span className="text-[10px] text-orange-600 bg-orange-100 font-bold px-2 py-0.5 rounded-full">
                              Yeni
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {!n.isRead && (
                        <button
                          onClick={() => markNotificationRead(n.id)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Oxundu
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(n.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CUSTOMERS & USERS MANAGEMENT TAB */}
      {(adminTab === 'customers' || adminTab === 'users' || adminTab === 'roles') && (
        <RoleManagementPanel
          onOpenUserChat={(u) => {
            setSelectedChatUserId(u.id);
            setAdminTab('messages');
            setMobileChatOpen(true);
          }}
        />
      )}

      {/* FOOTER & CONTACT SETTINGS TAB */}
      {adminTab === 'footer' && <FooterManager />}

      {/* Admin Receipt Inspection Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading font-black text-base sm:text-lg text-slate-900">
                    Ödəniş Qəbzi: #{viewingReceipt.orderNumber}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                    {viewingReceipt.paymentMethod === 'birkart' ? '💳 BirKart Taksit' : '💳 Bank Köçürməsi'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                  {viewingReceipt.customerName && (
                    <span className="font-bold text-slate-700">{viewingReceipt.customerName}</span>
                  )}
                  {viewingReceipt.phone && (
                    <span className="text-slate-500">| {viewingReceipt.phone}</span>
                  )}
                  <span className="text-slate-400">
                    | Məbləğ: <strong className="text-orange-600 font-bold">{(viewingReceipt.total ?? 0).toFixed(2)} AZN</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingReceipt(null)}
                className="p-2 hover:bg-slate-100 text-slate-500 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Zoom Controls Bar */}
            <div className="flex items-center justify-between bg-slate-100 px-3 py-1.5 rounded-xl text-xs text-slate-600">
              <span className="text-[11px] font-medium">Böyütmə: {Math.round(receiptZoom * 100)}%</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setReceiptZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                  className="p-1 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Böyüt"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                  className="p-1 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Kiçilt"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptZoom(1)}
                  className="p-1 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Sıfırla"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image Preview Box with Pan/Zoom */}
            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-950 rounded-2xl p-2 min-h-[300px] max-h-[55vh]">
              <img
                src={viewingReceipt.url}
                alt="Ödəniş çeki tam ölçü"
                style={{ transform: `scale(${receiptZoom})`, transformOrigin: 'center center', transition: 'transform 0.15s ease-out' }}
                className="max-h-[50vh] w-auto max-w-full object-contain rounded-lg shadow-md"
              />
            </div>

            {/* Modal Footer with Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <a
                  href={viewingReceipt.url}
                  download={`cek-${viewingReceipt.orderNumber}.jpg`}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Endir
                </a>
              </div>

              <div className="flex items-center gap-2">
                {(viewingReceipt.status === 'payment_verifying' || viewingReceipt.status === 'payment_pending') && (
                  <>
                    <button
                      type="button"
                      onClick={async () => {
                        await updateOrderStatus(viewingReceipt.orderId, 'payment_confirmed');
                        showToast(`#${viewingReceipt.orderNumber} üçün ödəniş təsdiqləndi! ✓`, 'success');
                        setViewingReceipt(null);
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" /> Ödənişi Təsdiqlə
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await updateOrderStatus(viewingReceipt.orderId, 'payment_rejected');
                        showToast(`#${viewingReceipt.orderNumber} üçün ödəniş rədd edildi.`, 'error');
                        setViewingReceipt(null);
                      }}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-4 h-4" /> Rədd Et
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setViewingReceipt(null)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  Bağla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORDER DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {orderToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-heading font-black text-slate-900 text-lg">
                  Bu sifarişi silmək istədiyinizə əminsiniz?
                </h3>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mt-3 text-left space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Sifariş nömrəsi:</span>
                    <span className="font-bold text-slate-900 font-mono">#{orderToDelete.orderNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Müştəri:</span>
                    <span className="font-bold text-slate-800">{orderToDelete.customerInfo.fullName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Məbləğ:</span>
                    <span className="font-bold text-orange-600">{(orderToDelete.total ?? 0).toFixed(2)} AZN</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Məhsul sayı:</span>
                    <span className="font-bold text-slate-800">{orderToDelete.items.reduce((sum, item) => sum + item.quantity, 0)} ədəd</span>
                  </div>
                </div>
                <p className="text-xs text-red-600 font-semibold mt-2.5">
                  ⚠️ Bu sifariş həm admin panelindən, həm də yaddaş bazasından birdəfəlik silinəcək və geri qaytarıla bilməyəcək.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderToDelete(null)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (orderToDelete) {
                      deleteOrder(orderToDelete.id);
                      setOrderToDelete(null);
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md shadow-red-500/25 cursor-pointer transition-all"
                >
                  Bəli, sil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full-screen Image Modal for Admin Chat */}
      <ChatImageModal
        isOpen={!!adminModalImage}
        imageUrl={adminModalImage?.url || null}
        imageName={adminModalImage?.name}
        onClose={() => setAdminModalImage(null)}
      />
    </div>
  );
};
