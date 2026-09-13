import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  MessageCircle,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Edit2,
  Plus,
  Trash2,
  Sparkles,
  ChevronRight,
  LogIn,
  UserPlus,
  LayoutDashboard
} from 'lucide-react';
import { motion } from 'motion/react';
import mmzLogoImg from '../assets/images/mmz_logo_1787952155327.jpg';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUser,
    orders,
    wishlist,
    setActiveTab,
    showToast,
    isUserLoggedIn,
    openAuthModal,
    logoutUser,
    hasAdminRights
  } = useStore();
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'faq'>('profile');

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, phone, email });
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Profile Sidebar Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-center relative overflow-hidden">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl mx-auto p-1 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 mb-3 shadow-lg flex items-center justify-center overflow-hidden">
              <img
                src={user.avatar && !user.avatar.includes('photo-1534528741775') ? user.avatar : mmzLogoImg}
                alt="MMZ Logo"
                className="w-full h-full rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="font-heading font-black text-lg text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-500">{user.phone}</p>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>

            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-full">
                👑 {user.memberTier} İstifadəçi
              </span>
            </div>

            {!isUserLoggedIn && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <p className="text-xs text-slate-500 font-medium">Hesabınıza daxil olun və ya yeni profil yaradın:</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => openAuthModal(undefined, 'login')}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Giriş
                  </button>
                  <button
                    onClick={() => openAuthModal(undefined, 'register')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-orange-400" /> Qeydiyyat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Menu Buttons */}
          <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-xs space-y-1">
            <button
              onClick={() => setActiveSubTab('profile')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
                activeSubTab === 'profile'
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <User className="w-4 h-4" /> Şəxsi Məlumatlar
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className="w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-orange-500" /> Sifarişlərim ({orders.length})
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className="w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-red-500" /> Sevimlilər ({wishlist.length})
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className="w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-blue-500" /> MMZ Canlı Dəstək
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSubTab('faq')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
                activeSubTab === 'faq'
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4" /> Sifariş & Çatdırılma Qaydaları
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Admin Panel button ONLY if user has admin rights */}
            {hasAdminRights && (
              <button
                onClick={() => setActiveTab('admin')}
                className="w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-orange-600 bg-orange-50/60 hover:bg-orange-100 transition-colors cursor-pointer my-1"
              >
                <span className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-orange-600" /> Admin İdarəetmə Paneli
                </span>
                <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-full font-black">
                  Admin
                </span>
              </button>
            )}

            {isUserLoggedIn && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => logoutUser()}
                  className="w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <LogOut className="w-4 h-4" /> Hesabdan Çıxış
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          {/* SubTab 1: Profile Edit */}
          {activeSubTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900">
                    Şəxsi Məlumatlar
                  </h3>
                  <p className="text-xs text-slate-500">Hesab parametrlərinizi tənzimləyin</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Redaktə Et
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ad və Soyad</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Nömrəsi</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-poçt Ünvanı</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Yadda Saxla
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
                    >
                      Ləğv Et
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Ad və Soyad:</span>
                    <strong className="text-slate-900 text-sm">{user.name}</strong>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Mobil Telefon:</span>
                    <strong className="text-slate-900 text-sm">{user.phone}</strong>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">E-poçt:</span>
                    <strong className="text-slate-900 text-sm">{user.email}</strong>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block mb-1">Status:</span>
                    <span className="text-emerald-600 font-bold text-sm">✓ Aktiv VIP Üzv</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SubTab: FAQ & Order Rules */}
          {activeSubTab === 'faq' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-heading font-black text-lg text-slate-900 pb-3 border-b border-slate-100">
                Sifariş və Çatdırılma Qaydaları (FAQ)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Minimum sifariş məbləği nə qədərdir?
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Platformamızda minimum sifariş məbləği <strong>35.00 AZN</strong>-dir. Səbətinizdəki məhsulların ümumi məbləği 35 AZN və ya daha çox olduqda sifariş rəsmiləşdirilə bilir.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Sifariş necə rəsmiləşdirilir?
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Məhsulları səbətə əlavə etdikdən sonra sadəcə ad/soyad, telefon nömrəsi və ünvanınızı daxil edərək bir kliklə sifarişinizi təsdiqləyirsiniz.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Çatdırılma necə həyata keçirilir?
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Sifarişiniz təsdiqləndikdən sonra kuryerlərimiz tərəfindən birbaşa göstərdiyiniz ünvana operativ şəkildə çatdırılır.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Məhsulun qəbulu və yoxlanılması necə aparılır?
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Sifariş təhvil verilərkən kuryerin yanında məhsulun tamlığı və işlək vəziyyəti yoxlanılır. Hər hansı uyğunsuzluq olduqda dərhal kuryerə bildirərək dəyişdirmə tələb edə bilərsiniz.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
