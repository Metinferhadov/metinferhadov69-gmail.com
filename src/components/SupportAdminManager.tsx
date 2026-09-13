import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SupportAdmin } from '../types';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Phone,
  Mail,
  Image as ImageIcon,
  Sparkles,
  Headphones,
  AlertTriangle,
  X,
  Upload,
  UserCheck,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80'
];

export const SupportAdminManager: React.FC = () => {
  const {
    supportAdmins,
    addSupportAdmin,
    updateSupportAdmin,
    deleteSupportAdmin,
    toggleSupportAdminStatus,
    toggleSupportAdminActive,
    showToast
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<SupportAdmin | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<SupportAdmin | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('Müştəri Xidmətləri Mütəxəssisi');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'online' | 'offline' | 'busy'>('online');
  const [specialty, setSpecialty] = useState('');
  const [responseTime, setResponseTime] = useState('~1 dəqiqə');
  const [isActive, setIsActive] = useState(true);

  const openAddModal = () => {
    setEditingAdmin(null);
    setName('');
    setRole('Müştəri Xidmətləri Mütəxəssisi');
    setAvatar(PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]);
    setEmail('destekmmzonline.az@gmail.com');
    setPhone('+994 50 123 45 67');
    setStatus('online');
    setSpecialty('Sifarişlər, Çatdırılma və Məhsul Məlumatları');
    setResponseTime('~1 dəqiqə');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (admin: SupportAdmin) => {
    setEditingAdmin(admin);
    setName(admin.name);
    setRole(admin.role);
    setAvatar(admin.avatar);
    setEmail(admin.email || '');
    setPhone(admin.phone || '');
    setStatus(admin.status);
    setSpecialty(admin.specialty || '');
    setResponseTime(admin.responseTime || '~1 dəqiqə');
    setIsActive(admin.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Admin adı boş ola bilməz', 'error');
      return;
    }

    if (editingAdmin) {
      updateSupportAdmin({
        ...editingAdmin,
        name: name.trim(),
        role: role.trim(),
        avatar: avatar.trim() || PRESET_AVATARS[0],
        email: email.trim(),
        phone: phone.trim(),
        status,
        specialty: specialty.trim(),
        responseTime: responseTime.trim(),
        isActive
      });
    } else {
      addSupportAdmin({
        name: name.trim(),
        role: role.trim(),
        avatar: avatar.trim() || PRESET_AVATARS[0],
        email: email.trim(),
        phone: phone.trim(),
        status,
        specialty: specialty.trim(),
        responseTime: responseTime.trim(),
        isActive
      });
    }

    setIsModalOpen(false);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        showToast('Profil şəkli seçildi', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const onlineCount = supportAdmins.filter((a) => a.isActive && a.status === 'online').length;
  const totalCount = supportAdmins.length;

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 text-orange-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Headphones className="w-4 h-4" /> Müştəri Dəstək Komandası
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Dəstək Adminlərinin İdarə Edilməsi
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Burada əlavə etdiyiniz və aktivləşdirdiyiniz adminlər saytda "Canlı Dəstək" bölməsində istifadəçilərə görünür və real vaxtda mesajlaşırlar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <div className="text-lg font-black text-white">{onlineCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">Online Admin</div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-3 rounded-2xl flex items-center gap-3">
            <Users className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-lg font-black text-white">{totalCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">Cəmi Admin</div>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs rounded-2xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Yeni Admin Əlavə Et
          </button>
        </div>
      </div>

      {/* Admin Cards Grid or Empty State */}
      {supportAdmins.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <Headphones className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-black text-lg text-slate-900 mb-1">
            Hazırda heç bir dəstək admini əlavə edilməyib
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            Müştərilərlə canlı əlaqə saxlamaq üçün yeni admin əlavə edin. Əlavə etdiyiniz adminlər avtomatik olaraq saytda "Canlı Dəstək" bölməsində istifadəçilərə görünəcək.
          </p>
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs rounded-2xl shadow-lg shadow-orange-500/20 inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> İlk Admini Əlavə Et
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {supportAdmins.map((admin) => (
            <div
              key={admin.id}
              className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-sm flex flex-col justify-between ${
                !admin.isActive
                  ? 'opacity-60 border-slate-200 bg-slate-50/50'
                  : admin.status === 'online'
                  ? 'border-emerald-200 hover:border-emerald-400 hover:shadow-md'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="p-5">
                {/* Header Info */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md border-2 border-white">
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

                    <div>
                      <h3 className="font-heading font-black text-slate-900 text-base">
                        {admin.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{admin.role}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            admin.status === 'online'
                              ? 'bg-emerald-100 text-emerald-800'
                              : admin.status === 'busy'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {admin.status === 'online'
                            ? '🟢 Online'
                            : admin.status === 'busy'
                            ? '🟡 Məşğul'
                            : '🔴 Oflayn'}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            admin.isActive
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {admin.isActive ? 'Aktiv' : 'Deaktiv'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Specs */}
                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                  {admin.specialty && (
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-800">İxtisas:</strong> {admin.specialty}
                      </span>
                    </div>
                  )}

                  {admin.email && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{admin.email}</span>
                    </div>
                  )}

                  {admin.phone && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{admin.phone}</span>
                    </div>
                  )}

                  {admin.responseTime && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Cavab sürəti: <strong>{admin.responseTime}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                {/* Quick Status Toggle */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleSupportAdminStatus(admin.id, 'online')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      admin.status === 'online'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'
                    }`}
                    title="Online et"
                  >
                    🟢 Online
                  </button>

                  <button
                    onClick={() => toggleSupportAdminStatus(admin.id, 'offline')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      admin.status === 'offline'
                        ? 'bg-slate-700 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                    title="Offline et"
                  >
                    🔴 Oflayn
                  </button>
                </div>

                {/* Edit / Active / Delete Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleSupportAdminActive(admin.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      admin.isActive
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                    }`}
                    title={admin.isActive ? 'Deaktiv et' : 'Aktiv et'}
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openEditModal(admin)}
                    className="p-2 bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 rounded-xl transition-colors cursor-pointer"
                    title="Redaktə et"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setAdminToDelete(admin)}
                    className="p-2 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                    title="Admini Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT ADMIN MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg text-slate-900">
                      {editingAdmin ? 'Admin Məlumatlarını Redaktə Et' : 'Yeni Dəstək Admini Əlavə Et'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Bu admin canlı çatda müştərilərə xidmət göstərəcək.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 mt-5">
                {/* Name and Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ad və Soyad *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Məs: Aysel Məmmədova"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vəzifə / Şöbə *
                    </label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Məs: Baş Müştəri Xidmətləri"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Avatar Preview & Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Profil Şəkli (Seçin və ya URL daxil edin)
                  </label>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={avatar}
                      alt="Avatar Preview"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="text"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="Şəkil URL-i daxil edin..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                      />
                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl cursor-pointer flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" /> Şəkil Faylı Yüklə
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Preset Avatars */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-[11px] font-bold text-slate-400">Hazır Avatarlar:</span>
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setAvatar(url)}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          avatar === url ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="Preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="support@mmz.az"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Əlaqə Telefonu
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+994 50 123 45 67"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Specialty and Response Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      İxtisas Sahəsi (Specialty)
                    </label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="Məs: Çatdırılma, Ödənişlər, BirKart"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cavab Müddəti
                    </label>
                    <input
                      type="text"
                      value={responseTime}
                      onChange={(e) => setResponseTime(e.target.value)}
                      placeholder="Məs: ~1 dəqiqə"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Status and Active Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Başlanğıc Statusu
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="online">🟢 Online (Aktiv Cavabdeh)</option>
                      <option value="offline">🔴 Oflayn</option>
                      <option value="busy">🟡 Məşğul</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-5">
                    <input
                      type="checkbox"
                      id="isActiveCheckbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded-lg focus:ring-orange-500"
                    />
                    <label htmlFor="isActiveCheckbox" className="text-xs font-bold text-slate-800 cursor-pointer">
                      Admin Aktivdir (Saytda göstərilsin)
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Ləğv Et
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    {editingAdmin ? 'Yadda Saxla' : 'Admini Yarat'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {adminToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-slate-900 text-base">
                Admini Silmək İstəyirsiniz?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                <strong>{adminToDelete.name}</strong> adlı dəstək admini sistemdən tamamilə silinəcək.
              </p>

              <div className="flex items-center justify-center gap-3 mt-5">
                <button
                  onClick={() => setAdminToDelete(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Ləğv Et
                </button>
                <button
                  onClick={() => {
                    deleteSupportAdmin(adminToDelete.id);
                    setAdminToDelete(null);
                  }}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
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
