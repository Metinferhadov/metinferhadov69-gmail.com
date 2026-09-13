import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FooterLink, FooterSettings } from '../types';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FooterManager: React.FC = () => {
  const {
    footerLinks,
    footerSettings,
    addFooterLink,
    updateFooterLink,
    deleteFooterLink,
    toggleFooterLinkActive,
    reorderFooterLinks,
    updateFooterSettings,
    showToast
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'links' | 'contact'>('links');

  // New Link Modal / Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);

  const [label, setLabel] = useState('');
  const [columnId, setColumnId] = useState<'shopping' | 'customer_service' | 'management' | 'other'>('shopping');
  const [targetType, setTargetType] = useState<'tab' | 'url' | 'section' | 'tel' | 'mail'>('tab');
  const [targetValue, setTargetValue] = useState('home');
  const [badge, setBadge] = useState('');
  const [requiresAuth, setRequiresAuth] = useState(false);

  // Settings Edit State
  const [phone, setPhone] = useState(footerSettings.phone || '+994 70 272 11 54');
  const [phoneRaw, setPhoneRaw] = useState(footerSettings.phoneRaw || '+994702721154');
  const [email, setEmail] = useState(footerSettings.email || 'destekmmzonline.az@gmail.com');
  const [tiktokUrl, setTiktokUrl] = useState(footerSettings.tiktokUrl || 'https://www.tiktok.com/@mmzonline0');
  const [instagramUrl, setInstagramUrl] = useState(footerSettings.instagramUrl || 'https://www.instagram.com/mmz_online2');
  const [facebookUrl, setFacebookUrl] = useState(footerSettings.facebookUrl || 'https://www.facebook.com/share/1ctvnddc5Y/');
  const [address, setAddress] = useState(footerSettings.address || 'Bakı şəhəri, Nəsimi r., Nizami küç. 142');
  const [workHours, setWorkHours] = useState(footerSettings.workHours || 'Hər gün 24/7 Dəstək');
  const [copyrightText, setCopyrightText] = useState(footerSettings.copyrightText || '© 2026 MMZ ONLINE Marketplace. Bütün hüquqlar qorunur.');

  const handleOpenAdd = () => {
    setEditingLinkId(null);
    setLabel('');
    setColumnId('shopping');
    setTargetType('tab');
    setTargetValue('home');
    setBadge('');
    setRequiresAuth(false);
    setShowAddModal(true);
  };

  const handleOpenEdit = (link: FooterLink) => {
    setEditingLinkId(link.id);
    setLabel(link.label);
    setColumnId(link.columnId);
    setTargetType(link.targetType);
    setTargetValue(link.targetValue);
    setBadge(link.badge || '');
    setRequiresAuth(!!link.requiresAuth);
    setShowAddModal(true);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      showToast('Zəhmət olmasa link adını daxil edin', 'error');
      return;
    }

    if (editingLinkId) {
      updateFooterLink(editingLinkId, {
        label: label.trim(),
        columnId,
        targetType,
        targetValue: targetValue.trim(),
        badge: badge.trim() || undefined,
        requiresAuth
      });
    } else {
      const nextOrder = footerLinks.filter((l) => l.columnId === columnId).length + 1;
      addFooterLink({
        label: label.trim(),
        columnId,
        targetType,
        targetValue: targetValue.trim(),
        badge: badge.trim() || undefined,
        requiresAuth,
        order: nextOrder,
        isActive: true
      });
    }

    setShowAddModal(false);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= footerLinks.length) return;

    const newLinks = [...footerLinks];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    // reassign order
    const updated = newLinks.map((l, i) => ({ ...l, order: i + 1 }));
    reorderFooterLinks(updated);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateFooterSettings({
      phone: phone.trim(),
      phoneRaw: phoneRaw.trim().replace(/\s+/g, ''),
      email: email.trim(),
      tiktokUrl: tiktokUrl.trim(),
      instagramUrl: instagramUrl.trim(),
      facebookUrl: facebookUrl.trim(),
      address: address.trim(),
      workHours: workHours.trim(),
      copyrightText: copyrightText.trim()
    });
  };

  const columnLabels: Record<string, string> = {
    shopping: '🛍️ Alış-veriş',
    customer_service: '🎧 Müştəri Xidməti',
    management: '⚡ MMZ İdarəetmə',
    other: '📌 Digər Linklər'
  };

  const targetTabOptions = [
    { value: 'home', label: 'Ana Səhifə (Home)' },
    { value: 'flash_sales', label: '⚡ Flaş Satışlar' },
    { value: 'cart', label: '🛒 Səbətim' },
    { value: 'orders', label: '📦 Sifariş İzləmə' },
    { value: 'chat', label: '💬 Canlı Dəstək / Bot' },
    { value: 'faq', label: '❓ Tez-tez Verilən Suallar (FAQ)' },
    { value: 'returns', label: '🔄 Qaytarma Şərtləri' },
    { value: 'wishlist', label: '❤️ Sevimlilər Siyahısı' },
    { value: 'admin', label: '⚡ Admin Panel' },
    { value: 'profile', label: '👤 Şəxsi Kabinet' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Action & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🦶</span>
            <h2 className="font-heading font-black text-xl text-slate-900">
              Footer Linkləri & Əlaqə İdarəetməsi
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Saytın altındakı (Footer) telefon nömrəsini, menyu linklərini və yönləndirmə hədəflərini buradan idarə edin.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveSubTab('links')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'links' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🔗 Linklər ({footerLinks.length})
            </button>
            <button
              onClick={() => setActiveSubTab('contact')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'contact' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              📞 Əlaqə & Telefon
            </button>
          </div>

          {activeSubTab === 'links' && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Link</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: LINKS MANAGEMENT */}
      {activeSubTab === 'links' && (
        <div className="space-y-6">
          {(['shopping', 'customer_service', 'management', 'other'] as const).map((colKey) => {
            const colLinks = footerLinks.filter((l) => l.columnId === colKey);
            if (colLinks.length === 0 && colKey === 'other') return null;

            return (
              <div key={colKey} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <span>{columnLabels[colKey]}</span>
                    <span className="text-xs font-normal text-slate-400">({colLinks.length} link)</span>
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {colLinks.map((link) => {
                    const globalIndex = footerLinks.findIndex((l) => l.id === link.id);
                    return (
                      <div
                        key={link.id}
                        className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                          link.isActive
                            ? 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:shadow-xs'
                            : 'bg-slate-100/60 border-dashed border-slate-300 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Reorder Buttons */}
                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => handleMove(globalIndex, 'up')}
                              disabled={globalIndex === 0}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMove(globalIndex, 'down')}
                              disabled={globalIndex === footerLinks.length - 1}
                              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-bold text-sm text-slate-900">
                                {link.label}
                              </span>
                              {link.badge && (
                                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md text-[10px] font-bold">
                                  {link.badge}
                                </span>
                              )}
                              {link.requiresAuth && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold">
                                  Giriş tələb olunur
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-slate-400">{link.targetType}:</span>
                              <strong className="text-slate-700 font-semibold">{link.targetValue}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => toggleFooterLinkActive(link.id)}
                            title={link.isActive ? 'Deaktiv et' : 'Aktiv et'}
                            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              link.isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-200 text-slate-600 border-slate-300'
                            }`}
                          >
                            {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleOpenEdit(link)}
                            title="Redaktə et"
                            className="p-2 bg-white text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => deleteFooterLink(link.id)}
                            title="Sil"
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl border border-red-200 text-xs font-bold cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 2: CONTACT & PHONE SETTINGS */}
      {activeSubTab === 'contact' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-heading font-black text-lg text-slate-900">
              Footer Əlaqə və Telefon Məlumatları
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Bu nömrə mobil telefonda birbaşa zəng açılması üçün istifadə olunur (məs: +994 70 272 11 54).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                📞 Görünən Telefon Nömrəsi *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="+994 70 272 11 54"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">İstifadəçilərin saytda gördüyü formatlı nömrə.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                🔗 Zəng Linki Ünvanı (tel:) *
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="+994702721154"
                  value={phoneRaw}
                  onChange={(e) => setPhoneRaw(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Mobil cihazda zəng ekranı açmaq üçün `tel:+994702721154` olaraq işləyir.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ✉️ Dəstək Email Ünvanı
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="destekmmzonline.az@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">İstifadəçilər toxunduqda `mailto:destekmmzonline.az@gmail.com` açılır.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ⏰ İş Saatları Mətni
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Hər gün 24/7 Dəstək"
                  value={workHours}
                  onChange={(e) => setWorkHours(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Social Media Links Section */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span>🌐 Sosial Şəbəkələr (Bizi izləyin)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    🎵 TikTok Linki
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.tiktok.com/@mmzonline0"
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    📸 Instagram Linki
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.instagram.com/mmz_online2"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    📘 Facebook Linki
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.facebook.com/share/1ctvnddc5Y/"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                📍 Ünvan Məlumatı
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Bakı şəhəri, Nəsimi rayonu, Nizami küçəsi 142"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                © Copyright Mətni
              </label>
              <input
                type="text"
                placeholder="© 2026 MMZ ONLINE Marketplace. Bütün hüquqlar qorunur."
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Yadda Saxla</span>
            </button>
          </div>
        </form>
      )}

      {/* CREATE / EDIT LINK MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="font-heading font-black text-lg text-slate-900">
                  {editingLinkId ? 'Footer Linkini Redaktə Et' : 'Yeni Footer Linki Əlavə Et'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveLink} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Linkin Adı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Məs: Günün Fürsətləri, Qaytarma Şərtləri..."
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Footer Sütunu *
                    </label>
                    <select
                      value={columnId}
                      onChange={(e) => setColumnId(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    >
                      <option value="shopping">🛍️ Alış-veriş</option>
                      <option value="customer_service">🎧 Müştəri Xidməti</option>
                      <option value="management">⚡ MMZ İdarəetmə</option>
                      <option value="other">📌 Digər</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Hədəf Tipi *
                    </label>
                    <select
                      value={targetType}
                      onChange={(e) => {
                        const newType = e.target.value as any;
                        setTargetType(newType);
                        if (newType === 'tab' && !targetTabOptions.some((o) => o.value === targetValue)) {
                          setTargetValue('home');
                        }
                      }}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    >
                      <option value="tab">Daxili Səhifə (Route / Tab)</option>
                      <option value="section">Bölmə Filtri (Section / Tag)</option>
                      <option value="url">Xarici URL Link</option>
                      <option value="tel">Telefon Zəngi (tel:)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Hədəf Dəyəri / Route *
                  </label>
                  {targetType === 'tab' ? (
                    <select
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    >
                      {targetTabOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : targetType === 'section' ? (
                    <select
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    >
                      <option value="daily_deal">🔥 Günün Fürsəti (daily_deal)</option>
                      <option value="flash_sale">⚡ Flaş Satış (flash_sale)</option>
                      <option value="new_arrival">✨ Yeni Gələnlər (new_arrival)</option>
                      <option value="best_seller">👑 Çox Satılanlar (best_seller)</option>
                      <option value="for_you">💖 Sənin Üçün (for_you)</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder={targetType === 'tel' ? '+994702721154' : 'https://...'}
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nişan / Badge (İstəyə bağlı)
                    </label>
                    <input
                      type="text"
                      placeholder="Məs: 🔥 Yeni, ⚡ -50%"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={requiresAuth}
                        onChange={(e) => setRequiresAuth(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                      />
                      <span className="text-xs font-bold text-slate-700">
                        Giriş (Login) Tələb Olunsun
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    {editingLinkId ? 'Yenilə' : 'Əlavə Et'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
