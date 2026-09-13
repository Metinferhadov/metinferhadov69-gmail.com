import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FAQ_ITEMS, FAQItem } from '../data/mockData';
import {
  HelpCircle,
  Search,
  Truck,
  CreditCard,
  RotateCcw,
  UserCheck,
  Coins,
  ChevronDown,
  ChevronUp,
  Headphones,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FAQView: React.FC = () => {
  const { setActiveTab, setActiveChatMode, footerSettings, openAuthModal, isUserLoggedIn } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-3': true
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const categories = [
    { id: 'all', label: 'Bütün Suallar', icon: HelpCircle },
    { id: 'delivery', label: 'Çatdırılma & İzləmə', icon: Truck },
    { id: 'payment', label: 'Ödəniş & Taksitlər', icon: CreditCard },
    { id: 'returns', label: 'Qaytarma Qaydaları', icon: RotateCcw },
    { id: 'account', label: 'Hesab & Təhlükəsizlik', icon: UserCheck },
    { id: 'coins', label: 'MMZ Coins & Bonuslar', icon: Coins }
  ];

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold border border-orange-500/30">
            <HelpCircle className="w-4 h-4" />
            <span>Müştəri Dəstək Mərkəzi</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl tracking-tight text-white">
            Tez-tez Verilən <span className="text-orange-400">Suallar</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Sifariş, pulsuz çatdırılma, qeyd-şərtsiz qaytarma və ödəniş üsulları haqqında ən çox maraqlanılan sualların cavabları.
          </p>

          {/* Search Box */}
          <div className="pt-2">
            <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-1.5 focus-within:border-orange-400 focus-within:bg-white/15 transition-all">
              <Search className="w-5 h-5 text-orange-400 ml-3" />
              <input
                type="text"
                placeholder="Sualınızı yazın (məs: Çatdırılma, BirKart, Qaytarma)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-300 hover:text-white px-3 py-1 font-bold cursor-pointer"
                >
                  Təmizlə
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_12px_rgba(255,85,0,0.4)] scale-105'
                  : 'bg-[#0c1324] text-slate-300 hover:bg-[#131d36] border border-white/10 shadow-sm'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-[#0c1324] rounded-3xl p-10 text-center border border-white/10 shadow-xl">
            <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="font-heading font-black text-white text-base">Axtarışa uyğun sual tapılmadı</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Axtarış sorğusunu dəyişə və ya canlı dəstək komandamızla birbaşa əlaqə saxlaya bilərsiniz.
            </p>
            <button
              onClick={handleOpenLiveSupport}
              className="mt-4 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-[0_0_12px_rgba(255,85,0,0.35)] cursor-pointer inline-flex items-center gap-1.5"
            >
              <Headphones className="w-4 h-4" />
              Canlı Dəstəyə Yaz
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = !!openItems[faq.id];
            return (
              <div
                key={faq.id}
                className="bg-[#0c1324]/85 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm overflow-hidden transition-all duration-200 hover:border-cyan-400/30"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 text-orange-400 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="font-heading font-bold text-sm sm:text-base text-white">
                      {faq.question}
                    </span>
                  </div>
                  <div className="text-slate-400 flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-orange-400" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/10 px-5 py-4 bg-[#070b16]/60"
                    >
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Need More Help Contact Card */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-heading font-black text-xl text-white">Sualınıza cavab tapmadınız?</h3>
          <p className="text-xs sm:text-sm text-white/90 max-w-md">
            Müştəri xidmətləri komandamız və ağıllı süni intellekt botumuz 24/7 xidmətinizdədir.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={`tel:${footerSettings.phoneRaw || '+994702721154'}`}
            className="px-5 py-3 bg-white text-orange-600 hover:bg-slate-50 rounded-2xl font-heading font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>{footerSettings.phone || '+994 70 272 11 54'}</span>
          </a>

          <button
            onClick={handleOpenLiveSupport}
            className="px-5 py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-heading font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Headphones className="w-4 h-4 text-orange-400" />
            <span>Canlı Dəstəyə Yaz</span>
          </button>
        </div>
      </div>
    </div>
  );
};
