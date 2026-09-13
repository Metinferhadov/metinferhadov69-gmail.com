import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  RotateCcw,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  Headphones,
  FileText,
  Clock,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { motion } from 'motion/react';

export const ReturnsPolicyView: React.FC = () => {
  const { footerSettings, setActiveChatMode, setActiveTab, openAuthModal, isUserLoggedIn, showToast } = useStore();
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('wrong_size');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !phone) {
      showToast('Zəhmət olmasa sifariş nömrəsi və əlaqə nömrənizi daxil edin', 'error');
      return;
    }
    setIsSubmitted(true);
    showToast('Qaytarma sorğunuz qeydə alındı! Kuryer 24 saatda əlaqə saxlayacaq.', 'success');
  };

  const handleOpenLiveSupport = () => {
    if (!isUserLoggedIn) {
      openAuthModal(() => {
        setActiveChatMode('live');
        setActiveTab('chat');
      });
    } else {
      setActiveChatMode('live');
      setActiveTab('chat');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30">
            <RotateCcw className="w-4 h-4" />
            <span>Qeyd-Şərtsiz Qaytarma Qaydası</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl tracking-tight text-white">
            Qaytarma və Dəyişdirmə <span className="text-blue-400">Şərtləri</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            MMZ ONLINE-da alış-verişiniz güvənlidir. Razı qalmadığınız məhsulu asanlıqla qaytara və ya başqası ilə dəyişdirə bilərsiniz.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4-Step Return Process */}
      <div className="space-y-4">
        <h2 className="font-heading font-black text-xl text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          4 Addımda Rahat Qaytarma Prosesi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Müraciət Edin',
              desc: 'Saytdan, canlı çatdan və ya +994 70 272 11 54 nömrəsindən qaytarma sorğusu yaradın.',
              icon: FileText,
              color: 'text-orange-400',
              bg: 'bg-orange-500/15'
            },
            {
              step: '02',
              title: 'Məhsulu Hazırlayın',
              desc: 'Məhsulun orijinal qutusu, aksesuarları və qəbzi ilə birlikdə paketləyin.',
              icon: PackageCheck,
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/15'
            },
            {
              step: '03',
              title: 'Kuryer Qapınızdan Alır',
              desc: 'Kuryerimiz 24 saat ərzində ünvanınıza gələrək məhsulu tamamilə pulsuz təhvil alır.',
              icon: Truck,
              color: 'text-purple-400',
              bg: 'bg-purple-500/15'
            },
            {
              step: '04',
              title: 'Pulunuz Qaytarılır',
              desc: 'Məhsul yoxlanıldıqdan sonra 1-3 iş günü ərzində ödəniş kartınıza və ya balansınıza köçürülür.',
              icon: RotateCcw,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/15'
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-[#0c1324] rounded-3xl p-6 border border-white/10 shadow-sm relative overflow-hidden group hover:border-cyan-400/40 transition-all"
              >
                <span className="text-3xl font-heading font-black text-white/10 absolute top-3 right-4 select-none">
                  {item.step}
                </span>
                <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-4 border border-white/10`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-base text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules and Eligibility Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-950/30 rounded-3xl p-6 border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-2 text-emerald-300 font-heading font-black text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Qaytarılması Mümkün Olan Hallar</span>
          </div>
          <ul className="space-y-2.5 text-xs text-emerald-200">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Məhsul istifadə edilməyib, etiketləri və plombu qorunub</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Orijinal qablaşdırması və komplektasiyası zədələnməyib</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Alış tarixindən müəyyən edilmiş qaytarma müddəti keçməyib</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Fabrik qüsuru və ya yanlış çatdırılma aşkar edilib</span>
            </li>
          </ul>
        </div>

        <div className="bg-amber-950/30 rounded-3xl p-6 border border-amber-500/30 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-heading font-black text-base">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <span>İstisna Hallar (Qanunvericiliyə Uyğun)</span>
          </div>
          <ul className="space-y-2.5 text-xs text-amber-200">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
              <span>Şəxsi gigiyena vasitələri və qulaq içi qulaqlıqlar (açılmış qutu)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
              <span>Fərdi sifarişlə hazırlanmış və ya adınıza qeydiyyatdan keçirilmiş məhsullar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
              <span>İstifadəçi səhvi nəticəsində mexaniki və ya maye zədəsi almış cihazlar</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Online Return Request Form */}
      <div className="bg-[#0c1324] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
        <div>
          <h2 className="font-heading font-black text-xl text-white">
            Onlayn Qaytarma Müraciəti Forması
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Məlumatları daxil edin, kuryerimiz 24 saat ərzində sizinlə əlaqə saxlasın.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="font-heading font-black text-emerald-300 text-lg">Müraciətiniz Qəbul Olundu!</h3>
            <p className="text-xs text-emerald-200 max-w-md mx-auto">
              Sifariş nömrəniz: <strong>{orderNumber}</strong>. Menecerimiz qısa zamanda əlaqə saxlayaraq kuryerin gəliş vaxtını təyin edəcək.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-bold hover:brightness-110 cursor-pointer"
            >
              Yeni Müraciət Göndər
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReturn} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Sifariş Nömrəsi (məs: MMZ-84920) *
              </label>
              <input
                type="text"
                required
                placeholder="MMZ-00000"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs font-bold text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Əlaqə Telefonu *
              </label>
              <input
                type="tel"
                required
                placeholder="+994 50 000 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs font-bold text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Qaytarma Səbəbi
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#070b16] border border-white/15 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="wrong_size">Ölçü / Rəng uyğun gəlmədi</option>
                <option value="defective">Fabrik qüsuru və ya zədə var</option>
                <option value="not_matching">Şəkildəki ilə fərqlidir</option>
                <option value="changed_mind">Fikrimi dəyişdim (Qaytarma müddətində)</option>
                <option value="other">Digər səbəb</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Əlavə Qeyd və ya Şərh (İstəyə bağlı)
              </label>
              <textarea
                rows={3}
                placeholder="Məhsul haqqında əlavə qeydlərinizi yaza bilərsiniz..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between pt-2">
              <p className="text-[11px] text-slate-400">
                Sorğunuz dərhal müştəri xidmətləri bazasına əlavə olunacaq.
              </p>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(255,85,0,0.4)] transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Sorğunu Göndər</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Support Box */}
      <div className="bg-[#0c1324] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-heading font-black text-lg text-white">
            Köməyə ehtiyacınız var?
          </h3>
          <p className="text-xs text-slate-400">
            Qaytarma üzrə mütəxəssisimizlə canlı çatda danışın və ya zəng edin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`tel:${footerSettings.phoneRaw || '+994702721154'}`}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-white/10 cursor-pointer transition-all"
          >
            <Phone className="w-4 h-4 text-orange-400" />
            <span>{footerSettings.phone || '+994 70 272 11 54'}</span>
          </a>
          <button
            onClick={handleOpenLiveSupport}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_12px_rgba(255,85,0,0.35)] cursor-pointer transition-all active:scale-95"
          >
            <Headphones className="w-4 h-4" />
            <span>Canlı Dəstək</span>
          </button>
        </div>
      </div>
    </div>
  );
};
