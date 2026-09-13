import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Send,
  Sparkles,
  Headphones,
  CheckCheck,
  Bot,
  Image as ImageIcon,
  Paperclip,
  RefreshCw,
  ChevronRight,
  ArrowLeft,
  MessageSquare,
  Clock,
  ShieldCheck,
  ZoomIn,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, SupportAdmin } from '../types';
import { ChatImageModal } from './ChatImageModal';
import { optimizeImageFile } from '../utils/mediaStorage';

type LiveSupportView = 'list' | 'card' | 'chat';

export const AIFloatingChatWidget: React.FC = () => {
  const {
    aiMessages,
    isAITyping,
    sendAIMessage,
    clearAIMessages,
    activeChatMode,
    setActiveChatMode,
    supportAdmins,
    selectedAdminId,
    setSelectedAdminId,
    chatMessages,
    sendChatMessage,
    user,
    setSelectedProduct,
    setActiveTab,
    unreadChatMessagesCount,
    customerUnreadChatCount,
    hasAdminRights,
    isUserLoggedIn,
    openAuthModal,
    markChatMessagesAsRead,
    showToast
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [liveView, setLiveView] = useState<LiveSupportView>('list');
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    name: string;
    type: 'image' | 'file';
    size?: string;
  } | null>(null);
  const [modalImage, setModalImage] = useState<{ url: string; name?: string } | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Filter only active admins configured in Admin Panel
  const activeSupportAdmins = supportAdmins.filter((a) => a.isActive);

  // Selected Admin
  const selectedAdmin: SupportAdmin | undefined =
    supportAdmins.find((a) => a.id === selectedAdminId && a.isActive) ||
    activeSupportAdmins[0];

  const onlineAdminsCount = activeSupportAdmins.filter((a) => a.status === 'online').length;

  // Auto scroll to bottom in chat mode
  useEffect(() => {
    if (isOpen && (activeChatMode === 'ai' || liveView === 'chat')) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, aiMessages.length, chatMessages.length, isAITyping, activeChatMode, liveView]);

  // Messages with active user in Live Support for the selected Admin
  const currentUserId = (user && !user.id.startsWith('guest-')) ? user.id : (user?.id || 'usr-1');
  const liveAdminMessages = chatMessages.filter(
    (m) => m.chatUserId === currentUserId
  );

  // Mark as read when customer views live chat
  useEffect(() => {
    if (isOpen && activeChatMode === 'live' && liveView === 'chat' && isUserLoggedIn && currentUserId) {
      markChatMessagesAsRead(currentUserId, 'user');
    }
  }, [isOpen, activeChatMode, liveView, isUserLoggedIn, currentUserId, liveAdminMessages.length, markChatMessagesAsRead]);

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
        adminId: selectedAdmin?.id,
        sender: 'user',
        imageUrl: selectedFile?.type === 'image' ? selectedFile.url : undefined,
        fileUrl: selectedFile?.type === 'file' ? selectedFile.url : undefined,
        fileName: selectedFile?.name,
        fileSize: selectedFile?.size
      });
      setInputText('');
      setSelectedFile(null);
    }
  };

  const handleActionClick = (action: string, payload?: any) => {
    if (action === 'open_live_support') {
      setActiveChatMode('live');
      setLiveView('list');
    } else if (action === 'go_to_flash_sales') {
      setActiveTab('flash_sales');
      setIsOpen(false);
    } else if (action === 'go_to_orders') {
      setActiveTab('orders');
      setIsOpen(false);
    } else if (action === 'go_to_cart') {
      setActiveTab('cart');
      setIsOpen(false);
    } else if (action === 'go_to_home') {
      setActiveTab('home');
      setIsOpen(false);
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
      showToast('Şəkil hazırlandı', 'success');
    } catch (err: any) {
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

  const selectAdminAndShowCard = (adminId: string) => {
    setSelectedAdminId(adminId);
    setLiveView('card');
  };

  const startChatWithAdmin = () => {
    setLiveView('chat');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="bg-slate-900 text-white text-xs font-semibold px-3.5 py-1.5 rounded-2xl shadow-xl border border-slate-700/60 hidden sm:flex items-center gap-2 select-none"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Dəstək Botu & Canlı Dəstək</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
            isOpen
              ? 'bg-slate-900 text-white ring-4 ring-slate-800'
              : 'bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 text-white ring-4 ring-orange-500/30'
          }`}
          title="MMZ Dəstək Botu və Canlı Dəstək"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <Bot className="w-7 h-7" />
              {onlineAdminsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
              )}
            </div>
          )}

          {!isOpen && (hasAdminRights ? unreadChatMessagesCount : customerUnreadChatCount) > 0 && (
            <span className="absolute -top-1 -left-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
              {hasAdminRights ? unreadChatMessagesCount : customerUnreadChatCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Main Interactive Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 sm:bottom-24 right-2 sm:right-6 z-50 w-[96vw] sm:w-[440px] h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Top Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white p-4 shadow-md flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {activeChatMode === 'ai' ? (
                    <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                        <Bot className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 bg-amber-400" />
                    </div>
                  ) : (
                    <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-slate-800 shadow-md shrink-0 border border-slate-700">
                      <img
                        src={selectedAdmin?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80'}
                        alt={selectedAdmin?.name || 'Admin'}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                          selectedAdmin?.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-black text-sm text-white truncate">
                        {activeChatMode === 'ai'
                          ? 'MMZ Smart AI Bot'
                          : liveView === 'chat'
                          ? `${selectedAdmin?.name || 'Admin'} ilə Söhbət`
                          : 'Canlı Dəstək Xidməti'}
                      </h3>
                      {activeChatMode === 'ai' ? (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          Gemini 3.8 Flash
                        </span>
                      ) : (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {onlineAdminsCount > 0 ? `${onlineAdminsCount} Online` : 'Oflayn'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">
                      {activeChatMode === 'ai'
                        ? 'Google Gemini 3.8 Flash • 7/24 AI Köməkçi'
                        : liveView === 'chat'
                        ? selectedAdmin?.role || 'Müştəri Xidmətləri'
                        : 'Admin Panelindən idarə olunan canlı heyət'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {activeChatMode === 'ai' && (
                    <button
                      onClick={clearAIMessages}
                      className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                      title="Söhbəti Təmizlə"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Bağla"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mode Switcher & "Canlı Dəstəyə Yaz" Primary Action */}
              <div className="flex items-center gap-2 bg-slate-950/70 p-1 rounded-2xl border border-slate-800">
                <button
                  onClick={() => {
                    setActiveChatMode('ai');
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeChatMode === 'ai'
                      ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  AI Köməkçi
                </button>

                <button
                  onClick={() => {
                    setActiveChatMode('live');
                    if (liveView === 'chat' && !selectedAdminId) {
                      setLiveView('list');
                    }
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeChatMode === 'live'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                      : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 animate-pulse'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5" />
                  Canlı Dəstəyə Yaz
                  {onlineAdminsCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Chat Body depending on Mode & Live View */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 flex flex-col">
              {activeChatMode === 'ai' ? (
                /* AI Bot Conversation View */
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {aiMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-end gap-2 max-w-[88%]">
                        {msg.sender === 'bot' && (
                          <div className="w-7 h-7 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 mb-1 shadow-sm">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}

                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-br-none shadow-md shadow-orange-500/10'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>

                          {/* Product suggestions in AI reply */}
                          {msg.productSuggestions && msg.productSuggestions.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                🛍️ Tövsiyə olunan məhsullar:
                              </span>
                              <div className="space-y-1.5">
                                {msg.productSuggestions.map((prod) => (
                                  <div
                                    key={prod.id}
                                    onClick={() => {
                                      setSelectedProduct(prod);
                                      setIsOpen(false);
                                    }}
                                    className="flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-orange-50/80 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                                  >
                                    <img
                                      src={prod.images?.[0]}
                                      alt={prod.title}
                                      className="w-10 h-10 rounded-lg object-cover bg-white"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-slate-900 text-[11px] truncate">
                                        {prod.title}
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-orange-600 text-[11px]">
                                          {(prod.price ?? 0).toFixed(2)} AZN
                                        </span>
                                        {(prod.oldPrice ?? 0) > (prod.price ?? 0) && (
                                          <span className="text-[10px] text-slate-400 line-through">
                                            {(prod.oldPrice ?? 0).toFixed(2)} AZN
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-1.5 flex items-center justify-between gap-2 text-[9px] opacity-70">
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

                      {/* Quick Action Buttons */}
                      {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2 pl-9">
                          {msg.suggestedActions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleActionClick(action.action, action.payload)}
                              className="px-2.5 py-1 bg-white hover:bg-orange-50 hover:border-orange-300 text-slate-700 hover:text-orange-600 border border-slate-200 rounded-xl text-[11px] font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* AI Typing Indicator */}
                  {isAITyping && (
                    <div className="flex items-end gap-2">
                      <div className="w-7 h-7 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 mb-1">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.15s]" />
                        <span className="w-2 h-2 rounded-full bg-orange-600 animate-bounce [animation-delay:0.3s]" />
                        <span className="text-[11px] text-slate-500 font-medium ml-1">
                          Gemini 3.8 Flash cavab yazır...
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              ) : liveView === 'list' ? (
                /* 1. ADMIN LIST VIEW (Only Admins from Admin Panel) */
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 p-3.5 rounded-2xl">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                      <Headphones className="w-4 h-4 text-emerald-600" />
                      Canlı Dəstək Operatorları
                    </div>
                    <p className="text-[11px] text-emerald-700 mt-1">
                      Zəhmət olmasa əlaqə saxlamaq istədiyiniz dəstək adminini seçin:
                    </p>
                  </div>

                  {activeSupportAdmins.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <Headphones className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-sm text-slate-800">
                        Aktiv dəstək admini tapılmadı
                      </p>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Admin Panelindən yeni dəstək admini əlavə edildikdə avtomatik burada görünəcək.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {activeSupportAdmins.map((admin) => (
                        <div
                          key={admin.id}
                          onClick={() => selectAdminAndShowCard(admin.id)}
                          className="bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-md p-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Avatar with Status badge */}
                            <div className="relative shrink-0">
                              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xs border border-slate-100">
                                <img
                                  src={admin.avatar}
                                  alt={admin.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                  admin.status === 'online'
                                    ? 'bg-emerald-500 ring-1 ring-emerald-300'
                                    : admin.status === 'busy'
                                    ? 'bg-amber-500 ring-1 ring-amber-300'
                                    : 'bg-slate-400 ring-1 ring-slate-200'
                                }`}
                              />
                            </div>

                            {/* Name & Role */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                                  {admin.name}
                                </h4>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {admin.role}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                    admin.status === 'online'
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : admin.status === 'busy'
                                      ? 'bg-amber-50 text-amber-700'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      admin.status === 'online'
                                        ? 'bg-emerald-500 animate-pulse'
                                        : admin.status === 'busy'
                                        ? 'bg-amber-500'
                                        : 'bg-slate-400'
                                    }`}
                                  />
                                  {admin.status === 'online'
                                    ? 'Online'
                                    : admin.status === 'busy'
                                    ? 'Məşğul'
                                    : 'Oflayn'}
                                </span>
                                {admin.responseTime && (
                                  <span className="text-[10px] text-slate-400">
                                    {admin.responseTime}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="p-2 bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 rounded-xl transition-colors shrink-0">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : liveView === 'card' ? (
                /* 2. ADMIN PROFILE CARD VIEW */
                <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-4">
                    {/* Back Button */}
                    <button
                      onClick={() => setLiveView('list')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Bütün Operatorlar
                    </button>

                    {/* Admin Presentation Card */}
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 text-center shadow-sm space-y-4">
                      {/* Avatar */}
                      <div className="relative w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-lg border-3 border-white ring-4 ring-slate-100">
                        <img
                          src={selectedAdmin?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80'}
                          alt={selectedAdmin?.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span
                          className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${
                            selectedAdmin?.status === 'online'
                              ? 'bg-emerald-500 ring-2 ring-emerald-300'
                              : 'bg-slate-400 ring-2 ring-slate-200'
                          }`}
                        />
                      </div>

                      {/* Name & Role */}
                      <div>
                        <h3 className="font-heading font-black text-lg text-slate-900">
                          {selectedAdmin?.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                          {selectedAdmin?.role}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            selectedAdmin?.status === 'online'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              selectedAdmin?.status === 'online'
                                ? 'bg-emerald-500 animate-pulse'
                                : 'bg-slate-400'
                            }`}
                          />
                          {selectedAdmin?.status === 'online'
                            ? 'Online (Hazırda aktivdir)'
                            : 'Oflayn (Mesajınızı qəbul edir)'}
                        </span>
                      </div>

                      {/* Specialty / Details */}
                      {selectedAdmin?.specialty && (
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-xs text-slate-600 text-left">
                          <div className="font-bold text-slate-800 text-[11px] mb-0.5 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            İxtisas sahəsi:
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-600">
                            {selectedAdmin.specialty}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prominent "Mesaj yaz" CTA Button */}
                  <div className="pt-4">
                    <button
                      onClick={startChatWithAdmin}
                      className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-heading font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Mesaj yaz
                    </button>
                  </div>
                </div>
              ) : (
                /* 3. CONVERSATION VIEW (1-on-1 with selected admin - 100% EMPTY INITIALLY) */
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  {/* Conversation Header info bar */}
                  <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                    <button
                      onClick={() => setLiveView('list')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Operatorlar
                    </button>

                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden">
                        <img
                          src={selectedAdmin?.avatar}
                          alt={selectedAdmin?.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${
                            selectedAdmin?.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {selectedAdmin?.name}
                      </span>
                    </div>
                  </div>

                  {/* Messages Canvas - NO DEMO MESSAGES */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {liveAdminMessages.length === 0 ? (
                      /* Completely Empty Initial State */
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none opacity-80">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <p className="font-heading font-black text-xs text-slate-800">
                          {selectedAdmin?.name} ilə birbaşa söhbət
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1 max-w-[240px]">
                          Mesajınızı aşağıdakı sahəyə yazıb göndərin. Dəstək adminimiz dərhal cavablandıracaq.
                        </p>
                      </div>
                    ) : (
                      liveAdminMessages.map((msg) => {
                        const isUser = msg.sender === 'user';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${
                              isUser ? 'items-end' : 'items-start'
                            }`}
                          >
                            <div className="flex items-end gap-2 max-w-[88%]">
                              {!isUser && (
                                <img
                                  src={selectedAdmin?.avatar}
                                  alt="Admin"
                                  className="w-7 h-7 rounded-xl object-cover shrink-0 mb-1"
                                  referrerPolicy="no-referrer"
                                />
                              )}

                              <div
                                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                                  isUser
                                    ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-br-none shadow-md'
                                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                                }`}
                              >
                                {msg.imageUrl && (
                                  <div
                                    className="mb-2 rounded-xl overflow-hidden border border-slate-200/80 bg-black/5 relative group cursor-pointer shadow-xs max-w-[220px]"
                                    onClick={() => setModalImage({ url: msg.imageUrl!, name: msg.fileName || 'Şəkil' })}
                                  >
                                    <img
                                      src={msg.imageUrl}
                                      alt={msg.fileName || 'Şəkil'}
                                      className="w-full max-h-48 object-cover group-hover:scale-[1.02] transition-transform duration-200"
                                      loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                                      <span className="opacity-0 group-hover:opacity-100 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                                        <ZoomIn className="w-3 h-3" /> Şəkilə Tam Bax
                                      </span>
                                    </div>
                                    <div className="absolute bottom-1 right-1 sm:hidden bg-black/60 text-white p-1 rounded-md">
                                      <ZoomIn className="w-2.5 h-2.5" />
                                    </div>
                                  </div>
                                )}

                                {msg.fileUrl && (
                                  <div className="mb-2 p-2 bg-slate-100 rounded-xl flex items-center justify-between text-[11px] text-slate-700">
                                    <span className="truncate font-semibold">{msg.fileName || 'Fayl'}</span>
                                    <span className="text-[10px] text-slate-400">{msg.fileSize}</span>
                                  </div>
                                )}

                                <p className="whitespace-pre-line">{msg.text}</p>

                                <div className="mt-1 flex items-center justify-end gap-1 text-[9px] opacity-60">
                                  <span>{msg.timestamp}</span>
                                  {isUser && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}
            </div>

            {/* Upload File Preview */}
            {selectedFile && (
              <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {selectedFile.type === 'image' ? (
                    <div
                      className="relative cursor-pointer group shrink-0"
                      onClick={() => setModalImage({ url: selectedFile.url, name: selectedFile.name })}
                      title="Şəkilə baxmaq üçün klikləyin"
                    >
                      <img
                        src={selectedFile.url}
                        alt="Preview"
                        className="w-8 h-8 rounded-lg object-cover border border-orange-400"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <ZoomIn className="w-3 h-3" />
                      </div>
                    </div>
                  ) : (
                    <Paperclip className="w-5 h-5 text-slate-500" />
                  )}
                  <div className="min-w-0">
                    <span className="text-xs text-slate-800 font-bold truncate block">{selectedFile.name}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">✓ Göndərilməyə hazırdır</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                  title="Sil"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {isProcessingImage && (
              <div className="px-4 py-1.5 bg-orange-50 border-t border-orange-200 flex items-center gap-2 text-xs text-orange-700 font-medium animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-600" />
                <span>Şəkil hazırlanır...</span>
              </div>
            )}

            {/* Input Form (Active in AI mode OR in live chat mode) */}
            {(activeChatMode === 'ai' || liveView === 'chat') && (
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
                      className="p-2 text-slate-400 hover:text-orange-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      title="Şəkil Göndər (JPG, JPEG, PNG, WEBP)"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-slate-400 hover:text-orange-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
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
                      ? 'Sualınızı yazın (məs: Çatdırılma neçəyədir?)...'
                      : 'Mesajınızı yazın...'
                  }
                  className="flex-1 py-2.5 px-3.5 bg-slate-100 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !selectedFile}
                  className={`p-2.5 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center cursor-pointer ${
                    inputText.trim() || selectedFile
                      ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-orange-500/20 active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen Image Modal */}
      <ChatImageModal
        isOpen={!!modalImage}
        imageUrl={modalImage?.url || null}
        imageName={modalImage?.name}
        onClose={() => setModalImage(null)}
      />
    </>
  );
};
