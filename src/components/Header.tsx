import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import mmzLogoImg from '../assets/images/mmz_logo_1787952155327.jpg';
import {
  Search,
  ShoppingCart,
  Heart,
  Bell,
  MessageCircle,
  ShieldCheck,
  Zap,
  User,
  LayoutDashboard,
  Package,
  X,
  ChevronDown,
  Sparkles,
  Flame,
  Truck,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  Home,
  Grid,
  HelpCircle,
  Phone,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartItemCount,
    wishlist,
    unreadNotificationsCount,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    user,
    isUserLoggedIn,
    openAuthModal,
    logoutUser,
    hasAdminRights,
    unreadChatMessagesCount,
    customerUnreadChatCount
  } = useStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const popularSearches = [
    'Bluetooth Qulaqlıq',
    'Smart Saat',
    'Gaming Klaviatura',
    'Portativ Proyektor',
    'Suya davamlı çanta',
    'MagSafe Şarj'
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top micro-bar */}
      <div className="bg-gradient-to-r from-[#070b16] via-[#101b38] to-[#070b16] text-white text-xs font-semibold py-1.5 px-4 shadow-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="bg-gradient-to-r from-orange-500/30 to-amber-500/30 border border-orange-500/40 text-amber-300 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(255,85,0,0.3)]">
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300 animate-bounce" /> Flaş Təklif
            </span>
            <span className="truncate text-slate-200">
              ⚡ 35 AZN-dən yuxarı <strong className="text-cyan-300">PULSUZ Çatdırılma!</strong> &bull; Kod: <strong className="text-orange-400">MMZ2026</strong> ilə 20% Endirim!
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-300 text-xs">
            <span className="flex items-center gap-1 hover:text-cyan-300 transition-colors">
              <Truck className="w-3.5 h-3.5 text-cyan-400" /> 2 Saatda Kuryer
            </span>
            <span className="flex items-center gap-1 hover:text-emerald-300 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Orijinal & Güvənli
            </span>
            {hasAdminRights && (
              <button
                onClick={() => setActiveTab('admin')}
                className="text-orange-400 hover:text-orange-300 font-bold underline cursor-pointer transition-colors"
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar with Glassmorphism */}
      <div className="bg-[#090e1c]/92 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.7)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          {/* DESKTOP HEADER (MD and up) */}
          <div className="hidden md:flex items-center justify-between gap-4 lg:gap-6">
            {/* MMZ ONLINE 3D Logo */}
            <div
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
                setActiveTab('home');
              }}
              className="flex items-center gap-2.5 cursor-pointer select-none group flex-shrink-0"
            >
              <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 p-0.5 shadow-[0_0_20px_rgba(255,85,0,0.35)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                  <img
                    src={mmzLogoImg}
                    alt="MMZ ONLINE Logo"
                    className="w-full h-full object-cover rounded-[14px] transform group-hover:scale-110 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-[#090e1c] shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-heading font-black text-lg md:text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    MMZ
                  </span>
                  <span className="font-heading font-bold text-lg md:text-xl text-orange-400">
                    ONLINE
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-1 block">
                  Premium Marketplace
                </span>
              </div>
            </div>

            {/* Smart Search Bar (Desktop) */}
            <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
              <div
                className={`relative flex items-center w-full bg-[#0d1527]/90 rounded-2xl border transition-all duration-200 ${
                  isSearchFocused
                    ? 'border-cyan-400 bg-[#101b36] shadow-[0_0_25px_rgba(0,240,255,0.25)]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="pl-3.5 text-slate-400 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-orange-400" />
                </div>
                <input
                  type="text"
                  placeholder="İstədiyiniz məhsulu və ya brendi axtarın (məs: Qulaqlıq, Saat)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full py-2.5 px-3 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 mr-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsSearchFocused(false);
                    if (activeTab !== 'home') setActiveTab('home');
                  }}
                  className="flex items-center gap-1 mr-1 px-4 py-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(255,85,0,0.35)] active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Axtar
                </button>
              </div>

              {/* Live Search Suggestion Popup (Desktop) */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#0c1324]/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 p-4 z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-orange-400">
                        <Flame className="w-4 h-4" /> Populyar Axtarışlar
                      </span>
                      <span className="text-cyan-400 font-normal">Trendlər</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setSearchQuery(item);
                            setIsSearchFocused(false);
                            if (activeTab !== 'home') setActiveTab('home');
                          }}
                          className="px-3 py-1.5 bg-slate-900/80 hover:bg-orange-500/20 hover:text-orange-300 hover:border-orange-500/40 border border-white/10 text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Action Buttons */}
            <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
              {/* Chat Support */}
              <button
                onClick={() => setActiveTab('chat')}
                className={`relative p-2.5 rounded-xl transition-all cursor-pointer border ${
                  activeTab === 'chat'
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-[0_0_12px_rgba(255,85,0,0.3)]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-cyan-400 border-white/10'
                }`}
                title="Canlı Dəstək & Çat"
              >
                <MessageCircle className="w-5 h-5" />
                {(hasAdminRights ? unreadChatMessagesCount : customerUnreadChatCount) > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#090e1c] animate-pulse">
                    {hasAdminRights ? unreadChatMessagesCount : customerUnreadChatCount}
                  </span>
                ) : (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#090e1c]" />
                )}
              </button>

              {/* Notifications Dropdown */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-cyan-400 transition-all cursor-pointer border border-white/10"
                  title="Bildirişlər"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 ? (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  ) : (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-full flex items-center justify-center border border-white/10">
                      0
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0c1324]/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/15 py-3 px-4 z-50 text-slate-200"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-white text-sm">
                            Bildirişlər
                          </span>
                          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[11px] font-bold rounded-full">
                            {unreadNotificationsCount} yeni
                          </span>
                        </div>
                        {unreadNotificationsCount > 0 && (
                          <button
                            onClick={markAllNotificationsRead}
                            className="text-xs text-orange-600 hover:underline font-medium cursor-pointer"
                          >
                            Hamısını oxu
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 py-1">
                        {notifications.length === 0 ? (
                          <div className="py-6 px-4 text-center text-slate-400 text-xs">
                            Bildiriş yoxdur
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markNotificationRead(n.id);
                                if (n.type === 'order') setActiveTab('orders');
                              }}
                              className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                                n.isRead ? 'opacity-70 hover:bg-slate-50' : 'bg-orange-50/50 hover:bg-orange-50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-xs font-bold text-slate-800">{n.title}</h4>
                                <span className="text-[10px] text-slate-400 flex-shrink-0">{n.time}</span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1 leading-snug">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`relative p-2.5 rounded-xl transition-all cursor-pointer border ${
                  activeTab === 'wishlist'
                    ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-red-400 border-white/10'
                }`}
                title="Sevimlilər"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setActiveTab('cart')}
                className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-400 hover:to-amber-400 text-white rounded-xl font-bold text-xs shadow-[0_4px_16px_rgba(255,85,0,0.35)] hover:shadow-[0_4px_22px_rgba(255,85,0,0.5)] transition-all hover:scale-105 active:scale-95 cursor-pointer border border-orange-400/30"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-slate-950 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-orange-500">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="font-heading">Səbət</span>
              </button>

              {/* User / Profile Menu & Auth buttons */}
              {!isUserLoggedIn ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    id="btn-header-login"
                    onClick={() => openAuthModal(undefined, 'login')}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer border border-white/15"
                  >
                    <LogIn className="w-4 h-4 text-orange-400" />
                    <span>Giriş</span>
                  </button>
                  <button
                    id="btn-header-register"
                    onClick={() => openAuthModal(undefined, 'register')}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] border border-cyan-400/30 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-cyan-200" />
                    <span>Qeydiyyat</span>
                  </button>
                </div>
              ) : (
                <div ref={userMenuRef} className="relative">
                  <button
                    id="btn-header-user-menu"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border border-white/15"
                  >
                    <img
                      src={user.avatar && !user.avatar.includes('photo-1534528741775') ? user.avatar : mmzLogoImg}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-500"
                      referrerPolicy="no-referrer"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-[#0c1324]/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/15 py-2 px-1 z-50 text-slate-200"
                      >
                        <div className="px-3 py-2 border-b border-white/10 mb-1">
                          <p className="text-xs font-bold text-white truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email || user.phone}</p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-2 py-0.5 rounded-full">
                              👑 {user.memberTier}
                            </span>
                          </div>
                        </div>

                        <button
                          id="menu-btn-profile"
                          onClick={() => {
                            setActiveTab('profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <User className="w-4 h-4 text-cyan-400" /> Profilim
                        </button>
                        <button
                          id="menu-btn-orders"
                          onClick={() => {
                            setActiveTab('orders');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <Package className="w-4 h-4 text-orange-400" /> Sifarişlərim
                        </button>

                        {/* Admin Panel Button ONLY for authorized Admin/SuperAdmin */}
                        {hasAdminRights && (
                          <button
                            id="menu-btn-admin-panel"
                            onClick={() => {
                              setActiveTab('admin');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-orange-400 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 rounded-xl transition-colors text-left cursor-pointer my-0.5"
                          >
                            <LayoutDashboard className="w-4 h-4 text-orange-400" /> Admin Panel
                          </button>
                        )}

                        <div className="border-t border-white/10 my-1" />
                        <button
                          id="menu-btn-logout"
                          onClick={() => {
                            logoutUser();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/15 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" /> Çıxış
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE HEADER (Phones and small screens < 768px) */}
          <div className="flex md:hidden flex-col gap-2">
            {/* Top Row: Hamburger + Logo + Action Icons */}
            <div className="flex items-center justify-between gap-2">
              {/* Hamburger Button & Logo */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-hamburger-menu"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 -ml-1 text-slate-200 hover:text-cyan-400 active:scale-95 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
                  aria-label="Naviqasiya Menyunı Aç"
                  title="Menyu"
                >
                  <Menu className="w-5 h-5 text-slate-200" />
                </button>

                <div
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery('');
                    setActiveTab('home');
                  }}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-400 p-0.5 shadow-sm">
                    <img
                      src={mmzLogoImg}
                      alt="MMZ ONLINE"
                      className="w-full h-full object-cover rounded-[10px]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center gap-1 font-heading font-black text-base tracking-tight text-white">
                    <span>MMZ</span>
                    <span className="text-orange-400">ONLINE</span>
                  </div>
                </div>
              </div>

              {/* Right Mobile Actions */}
              <div className="flex items-center gap-1">
                {/* Wishlist */}
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className="relative p-2 text-slate-300 hover:text-red-400 rounded-xl cursor-pointer"
                  title="Sevimlilər"
                >
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* Cart */}
                <button
                  onClick={() => setActiveTab('cart')}
                  className="relative p-2 text-slate-300 hover:text-orange-400 rounded-xl cursor-pointer"
                  title="Səbət"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-1 ring-[#090e1c]">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                {/* Profile / Auth Quick Icon */}
                {isUserLoggedIn ? (
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="p-1 rounded-xl cursor-pointer"
                    title={user.name}
                  >
                    <img
                      src={user.avatar && !user.avatar.includes('photo-1534528741775') ? user.avatar : mmzLogoImg}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover ring-2 ring-amber-500"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => openAuthModal(undefined, 'login')}
                    className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[11px] rounded-lg shadow-xs cursor-pointer active:scale-95"
                  >
                    Giriş
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Row: Full-width Mobile Search */}
            <div className="relative w-full">
              <div
                className={`relative flex items-center w-full bg-[#0d1527] rounded-xl border transition-all ${
                  isSearchFocused ? 'border-cyan-400 bg-[#101b36] ring-2 ring-cyan-400/20' : 'border-white/15'
                }`}
              >
                <div className="pl-3 text-slate-400 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-orange-400" />
                </div>
                <input
                  type="text"
                  placeholder="Məhsul, brend və ya kateqoriya axtar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full py-2 px-2.5 bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 mr-1 text-slate-400 hover:text-white rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile Search Suggestions Dropdown */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-[#0c1324]/98 backdrop-blur-xl rounded-xl shadow-xl border border-white/15 p-3 z-50 text-slate-200"
                  >
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase">
                      <span className="text-orange-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" /> Trend Axtarışlar
                      </span>
                      <button
                        onClick={() => setIsSearchFocused(false)}
                        className="text-[10px] text-slate-400 hover:text-white"
                      >
                        Bağla ✕
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {popularSearches.map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setSearchQuery(item);
                            setIsSearchFocused(false);
                            if (activeTab !== 'home') setActiveTab('home');
                          }}
                          className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 text-slate-700 text-[11px] font-medium rounded-lg"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* MOBILE HAMBURGER SLIDE-IN DRAWER */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              {/* Dark Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              />

              {/* Drawer Container */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                className="relative w-[85%] max-w-[320px] bg-[#090e1c] h-full shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col z-10 overflow-hidden border-r border-white/10 text-slate-100"
              >
                {/* Drawer Header */}
                <div className="p-4 bg-gradient-to-r from-[#070b16] via-[#101b38] to-[#070b16] text-white flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-500 p-0.5 overflow-hidden shadow-[0_0_12px_rgba(255,85,0,0.4)]">
                      <img
                        src={mmzLogoImg}
                        alt="MMZ Logo"
                        className="w-full h-full object-cover rounded-[10px]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="font-heading font-black text-sm tracking-tight text-white flex items-center gap-1">
                        <span>MMZ</span>
                        <span className="text-orange-400">ONLINE</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase block">
                        Azərbaycanın №1 Mağazası
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer border border-white/10"
                    aria-label="Bağla"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Status Card */}
                <div className="p-3 bg-[#0c1324] border-b border-white/10">
                  {isUserLoggedIn ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={user.avatar && !user.avatar.includes('photo-1534528741775') ? user.avatar : mmzLogoImg}
                          alt={user.name}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-500 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{user.email || user.phone}</p>
                          <span className="inline-block mt-0.5 text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black px-1.5 py-0.2 rounded-full">
                            👑 {user.memberTier}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          logoutUser();
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg cursor-pointer transition-colors"
                        title="Çıxış"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-200">
                        Xoş gəlmisiniz! Daxil olun və ya qeydiyyatdan keçin:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            openAuthModal(undefined, 'login');
                          }}
                          className="px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-[0_0_12px_rgba(255,85,0,0.3)] text-center cursor-pointer active:scale-95"
                        >
                          Daxil Ol
                        </button>
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            openAuthModal(undefined, 'register');
                          }}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-white/10 font-bold text-xs rounded-xl text-center cursor-pointer active:scale-95"
                        >
                          Qeydiyyat
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Drawer Body Scroll Area */}
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  {/* Main Navigation Links */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 mb-1">
                      Əsas Naviqasiya
                    </p>

                    {[
                      { id: 'home', label: 'Ana Səhifə', icon: Home, badge: null },
                      { id: 'flash_sales', label: 'Flaş Endirimlər', icon: Zap, badge: '90%-dək' },
                      { id: 'categories', label: 'Bütün Kateqoriyalar', icon: Grid, badge: `${categories.length}` },
                      { id: 'cart', label: 'Səbətim', icon: ShoppingCart, badge: cartItemCount > 0 ? `${cartItemCount}` : null },
                      { id: 'orders', label: 'Sifarişlərim', icon: Package, badge: null },
                      { id: 'wishlist', label: 'Sevimlilərim', icon: Heart, badge: wishlist.length > 0 ? `${wishlist.length}` : null },
                      { id: 'chat', label: 'Canlı Dəstək & Çat', icon: MessageCircle, badge: 'Aktiv' },
                      { id: 'profile', label: 'İstifadəçi Profili', icon: User, badge: null }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.id === 'home') {
                              setSelectedCategory(null);
                              setSearchQuery('');
                            }
                            setActiveTab(item.id as any);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_15px_rgba(255,85,0,0.35)]'
                              : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                isActive ? 'bg-black/30 text-white' : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {/* Admin Panel Direct Link (Only visible if user has admin rights) */}
                    {hasAdminRights && (
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setActiveTab('admin');
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md transition-all cursor-pointer active:scale-95"
                        >
                          <div className="flex items-center gap-2.5">
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Admin Paneli</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/25 text-white font-black">
                            İdarə Et
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Product Categories Quick Tap */}
                  <div className="space-y-1 pt-2 border-t border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 mb-1">
                      Kateqoriyalar
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setActiveTab('home');
                            setIsMobileMenuOpen(false);
                          }}
                          className={`px-2.5 py-2 rounded-xl text-[11px] font-bold text-left truncate transition-colors cursor-pointer border ${
                            selectedCategory === cat.id && activeTab === 'home'
                              ? 'bg-orange-500/20 border-orange-500/40 text-orange-300 shadow-[0_0_10px_rgba(255,85,0,0.2)]'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Help & Support Info */}
                  <div className="space-y-1 pt-2 border-t border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 mb-1">
                      Müştəri Xidmətləri
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('faq');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 text-left"
                    >
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                      <span>Tez-tez Verilən Suallar (FAQ)</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('returns');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 text-left"
                    >
                      <RotateCcw className="w-4 h-4 text-cyan-400" />
                      <span>Geri Qaytarılma Qaydaları</span>
                    </button>
                  </div>
                </div>

                {/* Drawer Footer: Phone Call & Safety */}
                <div className="p-3.5 bg-[#070b16] border-t border-white/10 flex flex-col gap-2">
                  <a
                    href="tel:+994702721154"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Qaynar Xətt: +994 70 272 11 54</span>
                  </a>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>100% Orijinal məhsullar və yüksək keyfiyyət</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Secondary Category Navigation Bar */}
        <div className="bg-[#070b16]/95 backdrop-blur-md border-t border-white/10 px-4 py-2 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                setSelectedCategory(null);
                if (activeTab !== 'home') setActiveTab('home');
              }}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === null && activeTab === 'home'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(0,240,255,0.4)] border border-cyan-400/40'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              🛍️ Bütün Məhsullar
            </button>

            <button
              onClick={() => {
                setActiveTab('flash_sales');
              }}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'flash_sales'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_15px_rgba(255,85,0,0.4)] border border-orange-400/40'
                  : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/30'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-orange-400" /> Flaş Endirimlər
            </button>

            {categories.map((cat) => {
              if (cat.id === 'fashion') {
                const isAnyClothingActive =
                  (selectedCategory === 'fashion' ||
                    selectedCategory === 'clothing_kids' ||
                    selectedCategory === 'clothing_girls' ||
                    selectedCategory === 'clothing_men') &&
                  activeTab === 'home';

                return (
                  <div key={cat.id} className="relative group flex items-center">
                    <button
                      onClick={() => {
                        setSelectedCategory('fashion');
                        if (activeTab !== 'home') setActiveTab('home');
                      }}
                      className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                        isAnyClothingActive
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_12px_rgba(255,85,0,0.4)] border border-orange-400/40'
                          : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <span>👕 Geyim</span>
                      <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                    </button>

                    {/* Geyim alt seçimləri: 1. Uşaq Geyimləri, 2. Qız Geyimləri, 3. Kişi Geyimləri */}
                    <div className="absolute top-full left-0 mt-1 hidden group-hover:block hover:block bg-[#0c1324]/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/15 py-2 min-w-[200px] z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-white/10 mb-1">
                        Geyim Bölmələri
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCategory('clothing_kids');
                          if (activeTab !== 'home') setActiveTab('home');
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                          selectedCategory === 'clothing_kids' && activeTab === 'home'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="text-base">👦</span>
                        <span>Uşaq Geyimləri</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategory('clothing_girls');
                          if (activeTab !== 'home') setActiveTab('home');
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                          selectedCategory === 'clothing_girls' && activeTab === 'home'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="text-base">👧</span>
                        <span>Qız Geyimləri</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategory('clothing_men');
                          if (activeTab !== 'home') setActiveTab('home');
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                          selectedCategory === 'clothing_men' && activeTab === 'home'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="text-base">👨</span>
                        <span>Kişi Geyimləri</span>
                      </button>
                      <div className="border-t border-white/10 my-1" />
                      <button
                        onClick={() => {
                          setSelectedCategory('fashion');
                          if (activeTab !== 'home') setActiveTab('home');
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-[11px] font-semibold transition-colors text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer`}
                      >
                        Bütün Geyimlər
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (activeTab !== 'home') setActiveTab('home');
                  }}
                  className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id && activeTab === 'home'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_12px_rgba(255,85,0,0.4)] border border-orange-400/40'
                      : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
