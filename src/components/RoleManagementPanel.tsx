import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { RegisteredUser } from '../types';
import {
  Users,
  User,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  UserCheck,
  UserX,
  Trash2,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  RefreshCw,
  X,
  CheckCircle2,
  Lock,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RoleManagementPanelProps {
  onOpenUserChat?: (user: RegisteredUser) => void;
}

export const RoleManagementPanel: React.FC<RoleManagementPanelProps> = ({ onOpenUserChat }) => {
  const {
    allUsers,
    isSuperAdmin,
    hasAdminRights,
    updateUserAdminRole,
    deleteUserAccount,
    refreshAllUsers,
    user: currentActiveUser,
    showToast
  } = useStore();

  const [searchFilter, setSearchFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admins' | 'customers'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals for Actions
  const [userToDelete, setUserToDelete] = useState<RegisteredUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [roleActionUser, setRoleActionUser] = useState<{
    user: RegisteredUser;
    action: 'promote' | 'demote';
  } | null>(null);
  const [isRoleUpdating, setIsRoleUpdating] = useState(false);

  useEffect(() => {
    refreshAllUsers();
  }, [refreshAllUsers]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAllUsers();
      showToast('İstifadəçilər siyahısı uğurla yeniləndi', 'info');
    } catch {
      showToast('Yeniləmə zamanı xəta baş verdi', 'error');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const isPrimarySuperAdmin = (u: RegisteredUser) => {
    const e = (u.email || '').toLowerCase().trim();
    return (
      e === 'metinferhadov69@gmail.com' ||
      e === 'metinferhadov93@gmail.com' ||
      u.role === 'super_admin'
    );
  };

  const filteredUsers = allUsers.filter((u) => {
    const q = searchFilter.toLowerCase().trim();
    const matchQuery =
      !q ||
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q));

    if (!matchQuery) return false;

    if (roleFilter === 'admins') {
      return u.role === 'super_admin' || (u.role === 'admin' && u.isActiveAdmin);
    }
    if (roleFilter === 'customers') {
      return u.role === 'customer' || (u.role === 'admin' && !u.isActiveAdmin);
    }
    return true;
  });

  const confirmRoleChange = async () => {
    if (!roleActionUser) return;
    setIsRoleUpdating(true);
    try {
      if (roleActionUser.action === 'promote') {
        await updateUserAdminRole(roleActionUser.user.id, 'admin', true);
      } else {
        await updateUserAdminRole(roleActionUser.user.id, 'customer', false);
      }
      setRoleActionUser(null);
    } catch (err: any) {
      showToast(err.message || 'Rol dəyişdirilərkən xəta baş verdi', 'error');
    } finally {
      setIsRoleUpdating(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUserAccount(userToDelete.id);
      setUserToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'İstifadəçi silinərkən xəta baş verdi', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-white">
                👥 Müştərilərin İdarə Edilməsi
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Saytda qeydiyyatdan keçmiş bütün real müştərilər və istifadəçilər avtomatik olaraq burada əks olunur.
              İstənilən müştəriyə dərhal Admin statusu verə, adminlikdən çıxara və ya hesabı bazadan tamamilə silə bilərsiniz.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Canlı Sinxronizasiya
            </div>

            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              title="Müştərilər siyahısını yenilə"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Yenilə
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cəmi Müştərilər</span>
            <p className="font-heading font-black text-2xl text-slate-900 mt-1">{allUsers.length}</p>
            <span className="text-[11px] text-slate-400">Qeydiyyatlı istifadəçi hesabları</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aktiv Adminlər</span>
            <p className="font-heading font-black text-2xl text-emerald-600 mt-1">
              {allUsers.filter((u) => u.role === 'super_admin' || (u.role === 'admin' && u.isActiveAdmin)).length}
            </p>
            <span className="text-[11px] text-emerald-600/80 font-medium">Paneli idarə etmək icazəsi olanlar</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Standart Müştərilər</span>
            <p className="font-heading font-black text-2xl text-orange-600 mt-1">
              {allUsers.filter((u) => u.role === 'customer' || (u.role === 'admin' && !u.isActiveAdmin)).length}
            </p>
            <span className="text-[11px] text-slate-400">Standart alıcı hesabları</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Müştərinin adı, soyadı, e-poçt və ya telefon nömrəsi ilə axtar..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setRoleFilter('all')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              roleFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Bütün Müştərilər ({allUsers.length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('admins')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              roleFilter === 'admins'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Adminlər ({allUsers.filter((u) => u.role === 'super_admin' || (u.role === 'admin' && u.isActiveAdmin)).length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('customers')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              roleFilter === 'customers'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Müştərilər ({allUsers.filter((u) => u.role === 'customer' || (u.role === 'admin' && !u.isActiveAdmin)).length})
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4 pl-6">👤 Ad və Soyad</th>
                <th className="p-4">📧 E-poçt</th>
                <th className="p-4">📱 Telefon nömrəsi</th>
                <th className="p-4">📅 Qeydiyyat tarixi</th>
                <th className="p-4">🟢 Hesab statusu</th>
                <th className="p-4">🔑 Rol: İstifadəçi / Admin</th>
                <th className="p-4 pr-6 text-right">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-700">İstifadəçi tapılmadı</p>
                    <p className="text-xs text-slate-400 mt-1">Axtarışa uyğun qeydiyyat qeydi mövcud deyil</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSuper = isPrimarySuperAdmin(u);
                  const isAdmin = u.role === 'admin' && u.isActiveAdmin;
                  const isSelf = currentActiveUser?.id === u.id || (currentActiveUser?.email && u.email && currentActiveUser.email.toLowerCase() === u.email.toLowerCase());

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 1. Ad və Soyad */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl font-black flex items-center justify-center text-xs flex-shrink-0 shadow-xs ${
                            isSuper
                              ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                              : isAdmin
                              ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white'
                              : 'bg-slate-900 text-white'
                          }`}>
                            {u.fullName.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {u.fullName}
                              {isSelf && (
                                <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.2 rounded-md">
                                  Siz
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">ID: {u.id.slice(0, 12)}</div>
                          </div>
                        </div>
                      </td>

                      {/* 2. E-poçt */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                          <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[190px]" title={u.email}>{u.email || '—'}</span>
                        </div>
                      </td>

                      {/* 3. Telefon Nömrəsi */}
                      <td className="p-4">
                        {u.phone ? (
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span>{u.phone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Qeyd edilməyib</span>
                        )}
                      </td>

                      {/* 4. Qeydiyyat Tarixi */}
                      <td className="p-4 text-slate-500 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString('az-AZ', {
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

                      {/* 5. Hesab Statusu */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Aktiv
                        </span>
                      </td>

                      {/* 6. Rolu (İstifadəçi / Admin) */}
                      <td className="p-4">
                        {isSuper ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-purple-100 text-purple-800 border border-purple-200">
                            👑 Super Admin
                          </span>
                        ) : isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Admin
                          </span>
                        ) : u.role === 'admin' && !u.isActiveAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-amber-100 text-amber-800 border border-amber-200">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Deaktiv Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                            <User className="w-3.5 h-3.5 text-slate-500" /> İstifadəçi
                          </span>
                        )}
                      </td>

                      {/* 7. Əməliyyatlar */}
                      <td className="p-4 pr-6 text-right">
                        {isSuper ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                            <Lock className="w-3 h-3" /> Toxunulmaz
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {/* "Mesaj yaz" - Şəxsi Çat Aç */}
                            {onOpenUserChat && !isSelf && (
                              <button
                                type="button"
                                onClick={() => onOpenUserChat(u)}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold text-[11px] rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
                                title="Bu müştəri ilə WhatsApp tipli canlı çat aç"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                Mesaj yaz
                              </button>
                            )}

                            {/* "Admin et" vs "Adminlikdən çıxar" */}
                            {isAdmin ? (
                              isSuperAdmin ? (
                                <button
                                  type="button"
                                  onClick={() => setRoleActionUser({ user: u, action: 'demote' })}
                                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-[11px] rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Bu istifadəçini adminlikdən çıxar"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  Adminlikdən çıxar
                                </button>
                              ) : (
                                <span
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200"
                                  title="Yalnız Əsas Super Admin digər adminlərin statusunu dəyişə bilər"
                                >
                                  <Lock className="w-3 h-3 text-slate-400" /> Admin (Qorunur)
                                </span>
                              )
                            ) : (
                              <button
                                type="button"
                                onClick={() => setRoleActionUser({ user: u, action: 'promote' })}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-[11px] rounded-xl flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                                title="Bu istifadəçiyə Admin səlahiyyəti ver"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                Admin et
                              </button>
                            )}

                            {/* "Sil" */}
                            {(!isAdmin || isSuperAdmin) && (
                              <button
                                type="button"
                                onClick={() => setUserToDelete(u)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-[11px] rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                                title="Bu istifadəçi hesabını sistemdən tamamilə sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Sil
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Grid View */}
      <div className="md:hidden space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-sm text-slate-700">İstifadəçi tapılmadı</p>
            <p className="text-xs text-slate-400 mt-1">Axtarış filtrinə uyğun qeydiyyat qeydi yoxdur</p>
          </div>
        ) : (
          filteredUsers.map((u) => {
            const isSuper = isPrimarySuperAdmin(u);
            const isAdmin = u.role === 'admin' && u.isActiveAdmin;
            const isSelf = currentActiveUser?.id === u.id || (currentActiveUser?.email && u.email && currentActiveUser.email.toLowerCase() === u.email.toLowerCase());

            return (
              <div key={u.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl font-black flex items-center justify-center text-sm flex-shrink-0 ${
                      isSuper
                        ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                        : isAdmin
                        ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white'
                        : 'bg-slate-900 text-white'
                    }`}>
                      {u.fullName.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        {u.fullName}
                        {isSelf && (
                          <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.2 rounded-md">
                            Siz
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {u.id.slice(0, 12)}</div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {isSuper ? (
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-purple-100 text-purple-800 border border-purple-200">
                        👑 Super Admin
                      </span>
                    ) : isAdmin ? (
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                        🛡️ Admin
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                        👤 İstifadəçi
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Aktiv
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{u.email || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{u.phone || 'Telefon qeyd edilməyib'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>
                      Qeydiyyat:{' '}
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString('az-AZ', {
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

                {/* Mesaj Yaz (Mobil) */}
                {onOpenUserChat && !isSelf && (
                  <button
                    type="button"
                    onClick={() => onOpenUserChat(u)}
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    Mesaj yaz (Canlı Çat)
                  </button>
                )}

                {isSuper ? (
                  <div className="text-center py-2 bg-purple-50 rounded-xl border border-purple-200 text-[11px] font-bold text-purple-700 flex items-center justify-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Əsas Super Admin Hesabı (Dəyişdirilə bilməz)
                  </div>
                ) : isAdmin && !isSuperAdmin ? (
                  <div className="text-center py-2 bg-slate-100 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600 flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" /> Admin Hesabı (Yalnız Super Admin idarə edə bilər)
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => setRoleActionUser({ user: u, action: 'demote' })}
                        className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        Adminlikdən çıxar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setRoleActionUser({ user: u, action: 'promote' })}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        Admin et
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setUserToDelete(u)}
                      className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Sil
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: Role Promotion / Demotion Confirmation */}
      <AnimatePresence>
        {roleActionUser && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {roleActionUser.action === 'promote' ? (
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  )}
                  <h3 className="font-heading font-black text-base text-slate-900">
                    {roleActionUser.action === 'promote' ? 'Admin Səlahiyyəti Verilsin?' : 'Adminlikdən Çıxarılsın?'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setRoleActionUser(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
                <p className="text-xs text-slate-500">Seçilmiş İstifadəçi:</p>
                <p className="font-bold text-slate-900 text-sm">{roleActionUser.user.fullName}</p>
                <p className="text-xs text-slate-600">{roleActionUser.user.email}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {roleActionUser.action === 'promote'
                  ? 'Bu istifadəçiyə Admin rolu veriləcək. O, Admin Panelinə daxil olaraq sifarişləri, məhsulları və digər idarəetmə funksiyalarını yerinə yetirə biləcək.'
                  : 'Bu istifadəçi Admin statusundan çıxarılaraq standart Müştəri statusuna qaytarılacaq. Admin Panelinə girişi dərhal bağlanacaq.'}
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRoleActionUser(null)}
                  disabled={isRoleUpdating}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  İmtina et
                </button>
                <button
                  type="button"
                  onClick={confirmRoleChange}
                  disabled={isRoleUpdating}
                  className={`px-5 py-2.5 font-bold text-xs text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    roleActionUser.action === 'promote'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                      : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
                  }`}
                >
                  {isRoleUpdating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Yenilənir...
                    </>
                  ) : roleActionUser.action === 'promote' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Bəli, Admin Et
                    </>
                  ) : (
                    <>
                      <UserX className="w-3.5 h-3.5" /> Bəli, Adminlikdən Çıxar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Delete User Account Confirmation */}
      <AnimatePresence>
        {userToDelete && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-rose-600">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="font-heading font-black text-base text-slate-900">
                    İstifadəçi Hesabını Sil
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-rose-50/60 border border-rose-100 p-4 rounded-2xl space-y-1">
                <p className="text-xs text-rose-800 font-bold">Silinəcək İstifadəçi:</p>
                <p className="font-bold text-slate-900 text-sm">{userToDelete.fullName}</p>
                <p className="text-xs text-slate-600">{userToDelete.email}</p>
                {userToDelete.phone && <p className="text-xs text-slate-500">{userToDelete.phone}</p>}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Diqqət! Bu istifadəçi profilini və məlumatlarını verilənlər bazasından tamamilə silmək istədiyinizdən əminsiniz?
                Bu əməliyyat geri qaytarıla bilməz və istifadəçi artıq bu hesabla sayta daxil ola bilməyəcək.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteUser}
                  disabled={isDeleting}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/25 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Silinir...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" /> Bəli, İstifadəçini Sil
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
