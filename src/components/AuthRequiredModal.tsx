import React from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, X, LogIn, UserPlus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthRequiredModal: React.FC = () => {
  const {
    isAuthRequiredModalOpen,
    closeAuthRequiredModal,
    openAuthModal,
    authRequiredPendingAction
  } = useStore();

  if (!isAuthRequiredModalOpen) return null;

  const handleLoginClick = () => {
    const callback = authRequiredPendingAction;
    closeAuthRequiredModal();
    openAuthModal(callback || undefined, 'login');
  };

  const handleRegisterClick = () => {
    const callback = authRequiredPendingAction;
    closeAuthRequiredModal();
    openAuthModal(callback || undefined, 'register');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/80 overflow-hidden text-center"
        >
          {/* Close button */}
          <button
            onClick={closeAuthRequiredModal}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Bağla"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Glowing Top Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 rounded-b-full" />

          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-orange-100 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          {/* Title */}
          <h3 className="font-heading font-black text-xl text-slate-900 mb-2">
            Giriş Tələb Olunur
          </h3>

          {/* Prompt Message (Exact user request) */}
          <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed px-2">
            Sifariş vermək üçün əvvəlcə hesabınıza daxil olun və ya qeydiyyatdan keçin.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLoginClick}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Giriş et</span>
            </button>

            <button
              onClick={handleRegisterClick}
              className="w-full py-3.5 px-5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-2xl transition-all border border-slate-200 hover:border-slate-300 active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <UserPlus className="w-4 h-4 text-slate-600" />
              <span>Qeydiyyatdan keç</span>
            </button>
          </div>

          {/* Return/Cancel Link */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={closeAuthRequiredModal}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Məhsullara baxmağa davam et</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
