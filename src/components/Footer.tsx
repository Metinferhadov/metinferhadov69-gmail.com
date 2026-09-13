import React from 'react';
import { useStore } from '../context/StoreContext';
import { FooterLink } from '../types';
import mmzLogoImg from '../assets/images/mmz_logo_1787952155327.jpg';
import {
  ShieldCheck,
  Truck,
  Headphones,
  CreditCard,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Heart,
  ChevronRight,
  ExternalLink,
  Lock,
  Instagram,
  Facebook
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    footerLinks,
    footerSettings,
    setActiveTab,
    setActiveChatMode,
    setSelectedTagFilter,
    openAuthModal,
    isUserLoggedIn,
    hasAdminRights
  } = useStore();

  const handleLinkClick = (link: FooterLink) => {
    // Check if link requires authentication
    if (link.requiresAuth && !isUserLoggedIn) {
      openAuthModal(() => {
        executeLinkAction(link);
      });
      return;
    }

    executeLinkAction(link);
  };

  const executeLinkAction = (link: FooterLink) => {
    if (link.targetType === 'tab') {
      if (link.targetValue === 'chat') {
        setActiveChatMode('live');
      }
      setActiveTab(link.targetValue as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.targetType === 'section') {
      // e.g. daily_deal, new_arrival, flash_sale
      setSelectedTagFilter(link.targetValue);
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.targetType === 'url') {
      window.open(link.targetValue, '_blank', 'noopener,noreferrer');
    } else if (link.targetType === 'tel') {
      window.location.href = `tel:${link.targetValue.replace(/\s+/g, '')}`;
    }
  };

  // Group links by column
  const shoppingLinks = footerLinks
    .filter((l) => l.columnId === 'shopping' && l.isActive)
    .sort((a, b) => a.order - b.order);

  const customerServiceLinks = footerLinks
    .filter((l) => l.columnId === 'customer_service' && l.isActive)
    .sort((a, b) => a.order - b.order);

  const managementLinks = footerLinks
    .filter((l) => l.columnId === 'management' && l.isActive && (l.targetValue !== 'admin' || hasAdminRights))
    .sort((a, b) => a.order - b.order);

  const phoneDisplay = footerSettings.phone || '+994 70 272 11 54';
  const phoneCallUrl = `tel:${(footerSettings.phoneRaw || '+994702721154').replace(/\s+/g, '')}`;
  const emailAddress = footerSettings.email || 'destekmmzonline.az@gmail.com';
  const tiktokUrl = footerSettings.tiktokUrl || 'https://www.tiktok.com/@mmzonline0';
  const instagramUrl = footerSettings.instagramUrl || 'https://www.instagram.com/mmz_online2';
  const facebookUrl = footerSettings.facebookUrl || 'https://www.facebook.com/share/1ctvnddc5Y/';

  return (
    <footer className="bg-[#040711] text-white pt-12 pb-24 md:pb-12 border-t border-white/10 mt-16 shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(255,85,0,0.25)]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-black text-xs sm:text-sm text-white">Sürətli Çatdırılma</h4>
              <p className="text-[11px] text-slate-400">35 AZN-dən yuxarı tamamilə pulsuz</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-black text-xs sm:text-sm text-white">100% Orijinal Məhsul</h4>
              <p className="text-[11px] text-slate-400">Rəsmi standartlar və yüksək keyfiyyət</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-black text-xs sm:text-sm text-white">
                24/7 Canlı Dəstək
              </h4>
              <p className="text-[11px] text-slate-400">Canlı adminlər & Sürətli AI bot</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10">
          {/* Brand Info & Phone Call Box & Socials */}
          <div className="col-span-2 space-y-4">
            <div
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 cursor-pointer select-none group inline-flex"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-[0_0_15px_rgba(255,85,0,0.4)] group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src={mmzLogoImg}
                  alt="MMZ ONLINE Logo"
                  className="w-full h-full object-cover rounded-[14px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-heading font-black text-xl tracking-tight text-white group-hover:text-orange-400 transition-colors">
                MMZ <span className="text-orange-400">ONLINE</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {footerSettings.brandDescription ||
                'Azərbaycanın ən müasir, etibarlı və sürətli 3D onlayn alış-veriş platforması. Minlərlə məhsul, ən aşağı qiymətlər və dərhal çatdırılma!'}
            </p>

            {/* Direct Phone Call Button / Link */}
            <div className="pt-1">
              <a
                href={phoneCallUrl}
                aria-label={`Zəng et: ${phoneDisplay}`}
                className="inline-flex items-center gap-3 px-4 py-2.5 bg-[#0c1324] hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 border border-white/15 hover:border-orange-400/50 text-white rounded-2xl transition-all duration-200 group cursor-pointer shadow-md active:scale-95"
              >
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 group-hover:bg-white group-hover:text-orange-600 flex items-center justify-center transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 group-hover:text-white/80 font-bold uppercase tracking-wider">
                    Müştəri Qaynar Xətti (Zəng et)
                  </div>
                  <div className="font-heading font-black text-sm text-white tracking-wide">
                    {phoneDisplay}
                  </div>
                </div>
              </a>
            </div>

            {/* Email Address & Follow Us (Bizi izləyin) */}
            <div className="pt-2 space-y-3">
              {/* Clickable Email Button */}
              <div>
                <a
                  href={`mailto:${emailAddress}`}
                  aria-label={`E-poçt: ${emailAddress}`}
                  className="inline-flex items-center gap-2.5 px-3.5 py-2 bg-[#0c1324] hover:bg-[#121c35] border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 rounded-xl text-xs font-medium transition-all duration-200 group cursor-pointer shadow-sm"
                >
                  <div className="w-6 h-6 rounded-lg bg-orange-500/15 text-orange-400 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="tracking-wide">{emailAddress}</span>
                </a>
              </div>

              {/* Bizi izləyin (Social Network Icons) */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Bizi izləyin
                </div>
                <div className="flex items-center gap-2.5">
                  {/* TikTok */}
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="TikTok: @mmzonline0"
                    aria-label="TikTok səhifəmiz"
                    className="w-9 h-9 rounded-xl bg-[#0c1324] hover:bg-slate-800 text-slate-300 hover:text-white border border-white/15 hover:border-cyan-400 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm group cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 fill-current group-hover:text-cyan-300 transition-colors"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.32a6.34 6.34 0 0 0-.85-.06A6.33 6.33 0 0 0 3.15 15.6a6.34 6.34 0 0 0 10.82 4.48c1.77-1.77 2.4-4.3 2.17-6.73a8.16 8.16 0 0 0 4.86 1.59v-3.46c-.48 0-.96-.06-1.41-.19v-4.6z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram: @mmz_online2"
                    aria-label="Instagram səhifəmiz"
                    className="w-9 h-9 rounded-xl bg-[#0c1324] hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 text-slate-300 hover:text-white border border-white/15 hover:border-rose-400 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm group cursor-pointer"
                  >
                    <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>

                  {/* Facebook */}
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook: MMZ Online"
                    aria-label="Facebook səhifəmiz"
                    className="w-9 h-9 rounded-xl bg-[#0c1324] hover:bg-[#1877F2] text-slate-300 hover:text-white border border-white/15 hover:border-blue-400 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm group cursor-pointer"
                  >
                    <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 1. Alış-veriş Bölməsi */}
          <div>
            <h5 className="font-heading font-black text-xs uppercase tracking-wider text-white mb-3">
              Alış-veriş
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              {shoppingLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link)}
                    className="hover:text-cyan-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">{link.label}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 bg-orange-500/20 text-orange-400 rounded text-[9px] font-bold">
                        {link.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Müştəri Xidməti Bölməsi */}
          <div>
            <h5 className="font-heading font-black text-xs uppercase tracking-wider text-white mb-3">
              Müştəri Xidməti
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              {customerServiceLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link)}
                    className="hover:text-cyan-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">{link.label}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-400 rounded text-[9px] font-bold">
                        {link.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. MMZ İdarəetmə Bölməsi */}
          <div>
            <h5 className="font-heading font-black text-xs uppercase tracking-wider text-white mb-3">
              MMZ İdarəetmə
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              {managementLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link)}
                    className={`transition-all cursor-pointer text-left flex items-center gap-1.5 ${
                      link.targetValue === 'admin'
                        ? 'px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_12px_rgba(255,85,0,0.35)] rounded-xl font-bold inline-flex'
                        : 'hover:text-cyan-400'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && link.targetValue !== 'admin' && (
                      <span className="px-1.5 py-0.2 bg-white/10 text-slate-300 rounded text-[9px] font-bold">
                        {link.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
              <li className="pt-2 text-[11px] text-slate-500">
                Satıcı kimi qoşulmaq və partnyorluq üçün bizimlə əlaqə saxlayın.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Partners */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{footerSettings.copyrightText || '© 2026 MMZ ONLINE Marketplace. Bütün hüquqlar qorunur.'}</p>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-slate-400">Ödəniş Partnyorları:</span>
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-black text-slate-300">
              <span className="px-2 py-1 bg-[#0c1324] rounded-md border border-white/10">VISA</span>
              <span className="px-2 py-1 bg-[#0c1324] rounded-md border border-white/10">MasterCard</span>
              <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-md border border-red-500/30">BirKart</span>
              <span className="px-2 py-1 bg-[#0c1324] rounded-md border border-white/10">3D Secure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

