import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Grid, ShoppingBag, Package, User } from 'lucide-react';
import { ActiveTab } from '../types';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cartItemCount } = useStore();

  const navItems: { tab: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { tab: 'home', label: 'Əsas', icon: Home },
    { tab: 'categories', label: 'Bölmələr', icon: Grid },
    { tab: 'cart', label: 'Səbət', icon: ShoppingBag },
    { tab: 'orders', label: 'Sifarişlər', icon: Package },
    { tab: 'profile', label: 'Profil', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b16]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      <div className="grid grid-cols-5 items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          const isCart = item.tab === 'cart';

          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`relative flex flex-col items-center justify-center py-1.5 transition-all cursor-pointer ${
                isActive ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]' : 'stroke-[1.8]'}`} />
                {isCart && cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_8px_rgba(255,85,0,0.6)]">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold text-cyan-300 drop-shadow-sm' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-0.5 shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
