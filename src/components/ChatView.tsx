import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Send,
  Image as ImageIcon,
  Paperclip,
  CheckCheck,
  ArrowLeft,
  X,
  Bot,
  Headphones,
  Zap,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Search,
  MessageSquare,
  Lock,
  ZoomIn,
  Loader2
} from 'lucide-react';
import { SupportAdmin } from '../types';
import { ChatImageModal } from './ChatImageModal';
import { optimizeImageFile } from '../utils/mediaStorage';

export const ChatView: React.FC = () => {
  const {
    activeChatMode,
    setActiveChatMode,
    aiMessages,
    isAITyping,
    sendAIMessage,
    clearAIMessages,
    supportAdmins,
    selectedAdminId,
    setSelectedAdminId,
    chatMessages,
    sendChatMessage,
    user,
    setSelectedProduct,
    setActiveTab,
    isUserLoggedIn,
    openAuthModal,
    markChatMessagesAsRead,
    showToast
  } = useStore();

  const [liveChatStarted, setLiveChatStarted] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    name: string;
    type: 'image' | 'file';
    size?: string;
  } | null>(null);
  const [modalImage, setModalImage] = useState<{ url: string; name?: string } | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const [adminSearch, setAdminSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const currentUserId = (user && !user.id.startsWith('guest-')) ? user.id : (user?.id || 'usr-1');
  const currentUserEmail = (user?.email || '').toLowerCase().trim();

  // Filter only active admins from Admin Panel
  const activeSupportAdmins = supportAdmins.filter((a) => a.isActive);

  // Default fallback admin (Metin Fərhadov)
  const defaultAdmin: SupportAdmin = {
    id: 'admin-metin',
    name: 'Metin Fərhadov',
    role: 'Əsas Mağaza Admini & Rəsmi Dəstək',
    specialty: 'Sifarişlər, Çatdırılma və Müştəri Xidmətləri',
    responseTime: '~1 dəqiqə',
    status: 'online',
    isActive: true,
    createdAt: '2025-01-01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80'
  };

  // Selected Admin
  const activeAdmin: SupportAdmin =
    supportAdmins.find((a) => a.id === selectedAdminId && a.isActive) ||
    activeSupportAdmins.find((a) => a.status === 'online') ||
    activeSupportAdmins[0] ||
    defaultAdmin;

  const displayAdminsList: SupportAdmin[] =
    activeSupportAdmins.length > 0 ? activeSupportAdmins : [defaultAdmin];

  const onlineAdmins = displayAdminsList.filter((a) => a.status === 'online');
  const filteredAdmins = displayAdminsList.filter(
    (a) =>
      a.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      a.role.toLowerCase().includes(adminSearch.toLowerCase()) ||
      (a.specialty && a.specialty.toLowerCase().includes(adminSearch.toLowerCase()))
  );

  // Filter live messages for this user (Admin <-> Customer)
  const liveAdminMessages = chatMessages.filter(
    (m) =>
      (currentUserId && m.chatUserId === currentUserId) ||
      (currentUserEmail && m.senderEmail && m.senderEmail.toLowerCase().trim() === currentUserEmail)
  );

  // Automatically mark unread messages as read when customer is viewing live chat
  useEffect(() => {
    if (activeChatMode === 'live' && isUserLoggedIn && currentUserId) {
      markChatMessagesAsRead(currentUserId, 'user');
    }
  }, [activeChatMode, isUserLoggedIn, currentUserId, liveAdminMessages.length, markChatMessagesAsRead]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages.length, liveAdminMessages.length, isAITyping, activeChatMode, activeAdmin?.id, mobileChatOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedFile) return;

    if (activeChatMode === 'ai') {
      sendAIMessage(inputText.trim());
      setInputText('');
    } else {
      if (!isUserLoggedIn) {
        showToast('Canlı dəstəyə yazmaq üçün zəhmət olmasa daxil olun', 'info');
        openAuthModal(undefined, 'login');
        return;
      }
      sendChatMessage(inputText.trim(), {
        chatUserId: currentUserId,
        adminId: activeAdmin?.id,
        sender: 'user',
        imageUrl: selectedFile?.type === 'image' ? selectedFile.url : undefined,
        fileUrl: selectedFile?.type === 'file' ? selectedFile.url : undefined,
        fileName: selectedFile?.name,
        fileSize: selectedFile?.size
      });
      setInputText('');
      setSelectedFile(null);
      setLiveChatStarted(true);
    }
  };

  const handleActionClick = (action: string, payload?: any) => {
    if (action === 'open_live_support') {
      setActiveChatMode('live');
    } else if (action === 'go_to_flash_sales') {
      setActiveTab('flash_sales');
    } else if (action === 'go_to_orders') {
      setActiveTab('orders');
    } else if (action === 'go_to_cart') {
      setActiveTab('cart');
    } else if (action === 'go_to_home') {
      setActiveTab('home');
    } else if (action === 'ask_delivery') {
      sendAIMessage('Çatdırılma şərtləri və müddətləri necədir?');
    } else if (action === 'ask_payment') {
      sendAIMessage('Hansı ödəniş və taksit üsulları var?');
    } else if (action === 'search_product') {
      sendAIMessage(`Mənə ${payload || 'bu məhsul'} haqqında məlumat ver`);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setIsProcessingImage(true);
      const { dataUrl, sizeStr } = await optimizeImageFile(file);
      setSelectedFile({
        url: dataUrl,
        name: file.name,
        type: 'image',
        size: sizeStr
      });
      showToast('Şəkil əlavə edildi', 'success');
    } catch (err: any) {
      console.warn('Image optimization fallback:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({
          url: reader.result as string,
          name: file.name,
          type: 'image',
          size: `${(file.size / 1024).toFixed(1)} KB`
        });
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({
          url: reader.result as string,
          name: file.name,
          type: 'file',
          size: `${(file.size / 1024).toFixed(1)} KB`
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 mb-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Ana Səhifəyə Qayıt
          </button>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 flex items-center gap-3">
            Müştəri Dəstəyi & Çat
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
              7/24 Aktiv
            </span>
          </h1>
        </div>

        {/* High-Priority CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveChatMode('live');
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
              activeChatMode === 'live'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>Canlı Dəstəyə Yaz</span>
            {onlineAdmins.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveChatMode('ai')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
              activeChatMode === 'ai'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-600/20'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-300'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Botla Danış</span>
          </button>
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[640px]">
        {/* Left Sidebar: Modes & Admin Staff Directory */}
        <div
          className={`lg:col-span-4 border-r border-slate-200 flex-col bg-slate-50/60 ${
            mobileChatOpen && activeChatMode === 'live' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Navigation Toggle Tabs */}
          <div className="p-3.5 border-b border-slate-200 bg-white">
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setActiveChatMode('ai')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeChatMode === 'ai'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bot className="w-4 h-4" />
                AI Köməkçi
              </button>

              <button
                onClick={() => setActiveChatMode('live')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeChatMode === 'live'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Headphones className="w-4 h-4" />
                Canlı Dəstək
                {onlineAdmins.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* AI Mode: Info & FAQs */}
          {activeChatMode === 'ai' ? (
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-200/60 p-4 rounded-2xl">
                  <div className="flex items-center gap-2.5 text-orange-800 font-bold text-xs mb-1.5">
                    <Sparkles className="w-4 h-4 text-orange-600" /> Google Gemini 3.8 Flash
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    MMZ Smart Bot Google-un ən son Gemini 3.8 Flash intellekti ilə bütün məhsullar, qiymətlər, çatdırılma və kuponlar haqqında dəqiq və sürətli cavab verir.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Tez-tez Verilən Suallar:
                  </h4>
                  <div className="space-y-2">
                    {[
                      '🚚 Çatdırılma neçəyədir və neçə günə gəlir?',
                      '💳 BirKart ilə taksit mümkündürmü?',
                      '🎁 Hansı endirim kuponları aktivdir?',
                      '🔄 Məhsulun qaytarılma qaydası',
                      '📦 Son sifarişimin statusu nədir?'
                    ].map((faq, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendAIMessage(faq)}
                        className="w-full text-left p-2.5 bg-white hover:bg-orange-50/70 border border-slate-200 hover:border-orange-300 rounded-xl text-xs font-medium text-slate-700 transition-all cursor-pointer shadow-2xs"
                      >
                        {faq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Söhbəti sıfırla:</span>
                  <button
                    onClick={clearAIMessages}
                    className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Təmizlə
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Live Support: Dynamic Support Admins List (WhatsApp Style) */
            <div className="flex-1 flex flex-col p-3 sm:p-4 overflow-hidden">
              <div className="mb-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Admin axtar..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
                <span>Dəstək Adminləri</span>
                <span className="text-emerald-600 font-black">
                  {onlineAdmins.length} Online
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredAdmins.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Aktiv admin tapılmadı.
                  </div>
                ) : (
                  filteredAdmins.map((admin) => {
                    const isSelected = activeAdmin?.id === admin.id;

                    // Unread messages from admin
                    const unreadFromThisAdmin = chatMessages.filter(
                      (m) =>
                        ((currentUserId && m.chatUserId === currentUserId) ||
                          (currentUserEmail && m.senderEmail?.toLowerCase().trim() === currentUserEmail)) &&
                        (m.sender === 'admin' || m.sender === 'support') &&
                        !m.isRead
                    ).length;

                    // Last message preview
                    const lastMsgWithAdmin = chatMessages
                      .filter(
                        (m) =>
                          (currentUserId && m.chatUserId === currentUserId) ||
                          (currentUserEmail && m.senderEmail?.toLowerCase().trim() === currentUserEmail)
                      )
                      .slice(-1)[0];

                    return (
                      <div
                        key={admin.id}
                        onClick={() => {
                          setSelectedAdminId(admin.id);
                          setMobileChatOpen(true);
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'bg-white border-2 border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                            : 'bg-white/90 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 shadow-xs border border-slate-100">
                          <img
                            src={admin.avatar}
                            alt={admin.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                              admin.status === 'online'
                                ? 'bg-emerald-500'
                                : admin.status === 'busy'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900 truncate">
                              {admin.name}
                            </h4>
                            {lastMsgWithAdmin ? (
                              <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                                {lastMsgWithAdmin.timestamp}
                              </span>
                            ) : (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                  admin.status === 'online'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {admin.status === 'online' ? 'Online' : 'Oflayn'}
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {admin.role}
                          </p>

                          <div className="flex items-center justify-between mt-1">
                            <p className="text-[11px] text-slate-600 truncate max-w-[150px]">
                              {lastMsgWithAdmin
                                ? (lastMsgWithAdmin.sender === 'user' ? 'Siz: ' : '') +
                                  (lastMsgWithAdmin.text || (lastMsgWithAdmin.imageUrl ? '📷 Şəkil' : '📎 Fayl'))
                                : admin.specialty || 'Söhbətə başla'}
                            </p>

                            {unreadFromThisAdmin > 0 && (
                              <span className="w-5 h-5 rounded-full bg-[#25d366] text-white text-[10px] font-black flex items-center justify-center shadow-xs shrink-0">
                                {unreadFromThisAdmin}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Admin Panel Link */}
              <div className="mt-3 p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-500 flex items-center justify-between">
                <span>Adminləri idarə et:</span>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  Admin Panel &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Main Chat Viewport */}
        <div
          className={`lg:col-span-8 flex flex-col h-[640px] bg-slate-50/40 ${
            !mobileChatOpen && activeChatMode === 'live' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              {/* Mobile Back Button in Live Chat */}
              {activeChatMode === 'live' && (
                <button
                  onClick={() => setMobileChatOpen(false)}
                  className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Adminlər siyahısına qayıt"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center">
                {activeChatMode === 'ai' ? (
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-amber-400" />
                  </div>
                ) : (
                  <img
                    src={activeAdmin?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80'}
                    alt={activeAdmin?.name}
                    className="w-full h-full rounded-[14px] object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    activeChatMode === 'ai'
                      ? 'bg-amber-400'
                      : activeAdmin?.status === 'online'
                      ? 'bg-emerald-500'
                      : 'bg-slate-400'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-sm text-slate-900">
                    {activeChatMode === 'ai' ? 'MMZ AI Köməkçi' : activeAdmin?.name || 'Canlı Dəstək'}
                  </h3>
                  {activeChatMode === 'ai' ? (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Gemini 3.8 Flash
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        activeAdmin?.status === 'online'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {activeAdmin?.status === 'online' ? '🟢 Online' : '🔴 Oflayn'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {activeChatMode === 'ai'
                    ? 'Google Gemini 3.8 Flash modeli ilə 7/24 intellektual müştəri xidməti'
                    : `${activeAdmin?.role || 'Müştəri Xidmətləri'} • Cavab müddəti: ${activeAdmin?.responseTime || '~1 dəqiqə'}`}
                </p>
              </div>
            </div>

            {activeChatMode === 'ai' ? (
              <button
                onClick={() => setActiveChatMode('live')}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Headphones className="w-3.5 h-3.5" /> Canlı Dəstəyə Keç
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Tipli Çat
                </span>
              </div>
            )}
          </div>

          {/* Unauthenticated Notification Banner for Live Chat */}
          {activeChatMode === 'live' && !isUserLoggedIn && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Canlı dəstək admini ilə danışmaq üçün hesabınıza daxil olun.</span>
              </div>
              <button
                onClick={() => openAuthModal(undefined, 'login')}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
              >
                Daxil Ol
              </button>
            </div>
          )}

          {/* Chat Canvas */}
          <div
            className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 ${
              activeChatMode === 'live' ? 'bg-[#efeae2]/85' : 'bg-slate-50/50'
            }`}
          >
            {activeChatMode === 'ai' ? (
              /* AI Chat Flow */
              <>
                {aiMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-end gap-2.5 max-w-[85%]">
                      {msg.sender === 'bot' && (
                        <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shrink-0 mb-1 shadow-md shadow-orange-500/20">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white rounded-br-none shadow-md'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>

                        {msg.productSuggestions && msg.productSuggestions.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                              🛍️ Tövsiyə olunan məhsullar:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {msg.productSuggestions.map((prod) => (
                                <div
                                  key={prod.id}
                                  onClick={() => setSelectedProduct(prod)}
                                  className="flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-orange-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                                >
                                  <img
                                    src={prod.images?.[0]}
                                    alt={prod.title}
                                    className="w-11 h-11 rounded-lg object-cover bg-white"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 text-xs truncate">
                                      {prod.title}
                                    </p>
                                    <span className="font-black text-orange-600 text-xs">
                                      {(prod.price ?? 0).toFixed(2)} AZN
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] opacity-70">
                          {msg.sender === 'bot' ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                              Gemini 3.8 Flash
                            </span>
                          ) : <span />}
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 pl-10">
                        {msg.suggestedActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(action.action, action.payload)}
                            className="px-3 py-1.5 bg-white hover:bg-orange-50 hover:border-orange-300 text-slate-700 hover:text-orange-600 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isAITyping && (
                  <div className="flex items-end gap-2.5">
                    <div className="w-8 h-8 rounded-2xl bg-orange-600 text-white flex items-center justify-center shrink-0 mb-1">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200 p-3.5 rounded-3xl rounded-bl-none shadow-sm flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-bounce" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.15s]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-bounce [animation-delay:0.3s]" />
                      <span className="text-xs text-slate-500 font-medium ml-1.5">
                        Gemini 3.8 Flash cavab yazır...
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : !activeAdmin ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <Headphones className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900">
                    Aktiv Canlı Dəstək Admini Yoxdur
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Admin Panelindən yeni dəstək admini əlavə edildikdə burada görünəcək.
                  </p>
                </div>
              </div>
            ) : (
              /* WhatsApp-like Live Chat Stream */
              <>
                {/* Date Separator */}
                <div className="flex justify-center my-2">
                  <span className="bg-white/80 backdrop-blur-xs text-slate-500 text-[11px] font-semibold px-3 py-0.5 rounded-lg shadow-2xs uppercase tracking-wider">
                    Bugün
                  </span>
                </div>

                {liveAdminMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center my-auto p-6 text-center select-none">
                    <div className="w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center mb-3 shadow-sm border border-emerald-100">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h4 className="font-heading font-black text-base text-slate-800">
                      {activeAdmin.name} ilə şəxsi söhbət
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      {activeAdmin.role} • Cavab müddəti: {activeAdmin.responseTime || '~1 dəqiqə'}
                    </p>
                    <div className="mt-4 px-3.5 py-2 bg-white/85 border border-emerald-200/60 rounded-2xl text-[11px] text-slate-600 shadow-2xs max-w-sm">
                      🔒 Mesajlar real Firestore verilənlər bazasında qorunur. Sualınızı aşağıdan yazıb göndərə bilərsiniz.
                    </div>
                  </div>
                ) : (
                  liveAdminMessages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        <div className="relative group max-w-[85%] sm:max-w-md">
                          {/* Bubble */}
                          <div
                            className={`p-3 rounded-2xl shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] text-xs sm:text-sm leading-relaxed ${
                              isUser
                                ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-xs border border-emerald-200/50'
                                : 'bg-white text-[#111b21] rounded-tl-xs border border-slate-200/70 shadow-xs'
                            }`}
                          >
                            {!isUser && (
                              <div className="text-[11px] font-bold text-[#008069] mb-1 flex items-center gap-1.5">
                                <span>{msg.senderName || activeAdmin.name}</span>
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                                  Dəstək
                                </span>
                              </div>
                            )}

                            {msg.imageUrl && (
                              <div
                                className="mb-2 rounded-xl overflow-hidden border border-slate-200/80 bg-black/5 relative group cursor-pointer shadow-xs max-w-[260px] sm:max-w-sm"
                                onClick={() => setModalImage({ url: msg.imageUrl!, name: msg.fileName || 'Şəkil' })}
                              >
                                <img
                                  src={msg.imageUrl}
                                  alt={msg.fileName || 'Göndərilən şəkil'}
                                  className="w-full max-h-64 object-cover group-hover:scale-[1.02] transition-transform duration-200"
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

                            {msg.fileUrl && (
                              <div
                                className={`mb-2 p-2.5 rounded-xl flex items-center justify-between gap-2 text-xs ${
                                  isUser ? 'bg-emerald-100/70 text-slate-800' : 'bg-slate-100 text-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <Paperclip className="w-4 h-4 flex-shrink-0 text-emerald-700" />
                                  <span className="truncate font-semibold">{msg.fileName || 'Fayl'}</span>
                                </div>
                                <a
                                  href={msg.fileUrl}
                                  download={msg.fileName || 'file'}
                                  className="text-[10px] font-bold text-emerald-700 hover:underline shrink-0"
                                >
                                  Yüklə
                                </a>
                              </div>
                            )}

                            {msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}

                            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-500">
                              <span>{msg.timestamp}</span>
                              {isUser && (
                                <CheckCheck
                                  className={`w-3.5 h-3.5 ${
                                    msg.isRead ? 'text-[#53bdeb]' : 'text-slate-400'
                                  }`}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Upload preview */}
          {selectedFile && (
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2.5 overflow-hidden">
                {selectedFile.type === 'image' ? (
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => setModalImage({ url: selectedFile.url, name: selectedFile.name })}
                    title="Şəkilə tam baxmaq üçün klikləyin"
                  >
                    <img
                      src={selectedFile.url}
                      alt="Seçilmiş şəkil"
                      className="w-10 h-10 rounded-xl object-cover border border-emerald-500 shadow-xs"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ) : (
                  <Paperclip className="w-5 h-5 text-slate-500" />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-800 font-bold truncate max-w-[180px] sm:max-w-xs">
                      {selectedFile.name}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                      {selectedFile.size}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 block">✓ Göndərilməyə hazırdır</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                title="Ləğv et"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isProcessingImage && (
            <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center gap-2 text-xs text-emerald-700 font-medium animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Şəkil optimallaşdırılır, zəhmət olmasa gözləyin...</span>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            {activeChatMode === 'live' && (
              <>
                <input
                  type="file"
                  ref={imageInputRef}
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Şəkil Göndər (JPG, JPEG, PNG, WEBP)"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Fayl Əlavə Et"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </>
            )}

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeChatMode === 'ai'
                  ? 'Sualınızı yazın (məs: Ən çox satılanlar hansılardır?)...'
                  : 'Mesajınızı yazın...'
              }
              className="flex-1 py-2.5 px-4 bg-slate-100 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !selectedFile}
              className={`w-10 h-10 rounded-full font-bold transition-all shadow-md flex items-center justify-center shrink-0 cursor-pointer ${
                inputText.trim() || selectedFile
                  ? activeChatMode === 'live'
                    ? 'bg-[#00a884] hover:bg-[#008f6f] text-white shadow-emerald-500/20 active:scale-95'
                    : 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-orange-500/20 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Full-screen Image Modal Overlay */}
      <ChatImageModal
        isOpen={!!modalImage}
        imageUrl={modalImage?.url || null}
        imageName={modalImage?.name}
        onClose={() => setModalImage(null)}
      />
    </div>
  );
};
