import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  User,
  Phone,
  Mail,
  Lock,
  X,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RotateCcw,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import mmzLogoImg from '../assets/images/mmz_logo_1787952155327.jpg';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalInitialMode,
    loginUserWithCredentials,
    registerUserWithCredentials,
    sendPasswordResetOtp,
    verifyOtpAndResetPassword
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot Password State
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalInitialMode || 'login');
      setErrorMessage(null);
      setSuccessMessage(null);
      setForgotStep(1);
    }
  }, [isAuthModalOpen, authModalInitialMode]);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    let cleanEmail = loginEmail.trim();
    if (!cleanEmail) {
      setErrorMessage('Zəhmət olmasa e-poçt ünvanınızı daxil edin');
      return;
    }
    // If entered phone number instead of email
    if (!cleanEmail.includes('@')) {
      const sanitizedPhone = cleanEmail.replace(/[^0-9]/g, '');
      if (sanitizedPhone.includes('702721154')) {
        cleanEmail = 'metinferhadov69@gmail.com';
      } else {
        cleanEmail = `${sanitizedPhone}@mmzonline.az`;
      }
    }

    if (!loginPassword) {
      setErrorMessage('Zəhmət olmasa şifrənizi daxil edin');
      return;
    }

    setIsLoading(true);
    try {
      await loginUserWithCredentials({ email: cleanEmail, password: loginPassword });
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMessage('Daxil edilən e-poçt və ya şifrə yanlışdır.');
      } else if (err.code === 'auth/user-not-found') {
        setErrorMessage('Bu e-poçt ünvanı ilə qeydiyyatdan keçmiş istifadəçi tapılmadı.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMessage('Çox sayda uğursuz cəhd edildi. Zəhmət olmasa bir neçə dəqiqə sonra yenidən cəhd edin.');
      } else {
        setErrorMessage(err.message || 'Giriş zamanı xəta baş verdi. Zəhmət olmasa təkrar yoxlayın.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regFullName.trim()) {
      setErrorMessage('Zəhmət olmasa Ad və Soyadınızı daxil edin');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Düzgün e-poçt ünvanı daxil edin (məs: ad@example.com)');
      return;
    }

    if (!regPhone.trim()) {
      setErrorMessage('Zəhmət olmasa telefon nömrənizi daxil edin');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Şifrə minimum 6 simvoldan ibarət olmalıdır');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Daxil edilən şifrələr bir-biri ilə uyğun gəlmir');
      return;
    }

    setIsLoading(true);
    try {
      await registerUserWithCredentials({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('Bu e-poçt ünvanı artıq başqa hesab üçün qeydiyyatdan keçib.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('Şifrə çox zəifdir. Zəhmət olmasa daha güclü şifrə seçin.');
      } else {
        setErrorMessage(err.message || 'Qeydiyyat zamanı xəta baş verdi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!forgotIdentifier.trim()) {
      setErrorMessage('Zəhmət olmasa qeydiyyatlı telefon nömrənizi və ya e-poçtunuzu daxil edin');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendPasswordResetOtp(forgotIdentifier.trim());
      setSimulatedOtpNotice(res.simulationOtp || '123456');
      setSuccessMessage(res.message);
      setForgotStep(2);
    } catch (err: any) {
      setErrorMessage(err.message || 'OTP kodu göndərilərkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (otpCode.trim().length < 6) {
      setErrorMessage('Zəhmət olmasa 6-rəqəmli təsdiq kodunu daxil edin');
      return;
    }
    setForgotStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('Yeni şifrə ən azı 6 simvol olmalıdır');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Yeni şifrələr bir-biri ilə eyni deyil');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtpAndResetPassword(forgotIdentifier.trim(), otpCode.trim(), newPassword);
      setMode('login');
      setLoginEmail(forgotIdentifier.includes('@') ? forgotIdentifier : 'metinferhadov69@gmail.com');
      setLoginPassword('');
      setForgotStep(1);
      setSuccessMessage('Şifrəniz uğurla dəyişdirildi. İndi yeni şifrənizlə daxil olun.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Şifrə bərpa edilərkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col max-h-[92vh]"
        >
          {/* Close Button */}
          <button
            id="btn-close-auth-modal"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-20 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 p-6 text-white text-center relative overflow-hidden shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 flex items-center justify-center mx-auto mb-2.5 shadow-lg shadow-amber-500/20 overflow-hidden">
              <img
                src={mmzLogoImg}
                alt="MMZ Logo"
                className="w-full h-full object-cover rounded-[14px]"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="font-heading font-black text-xl text-white tracking-tight">
              MMZ ONLINE
            </h3>
            <p className="text-xs text-orange-200/90 mt-0.5">
              {mode === 'login' && 'Şəxsi kabinetinizə daxil olun'}
              {mode === 'register' && 'Yeni istifadəçi hesabı yaradın'}
              {mode === 'forgot_password' && 'Şifrənin SMS/OTP ilə bərpası'}
            </p>

            {/* Mode Switcher Tabs */}
            {mode !== 'forgot_password' && (
              <div className="flex bg-slate-950/50 p-1 rounded-xl border border-white/10 mt-4 max-w-xs mx-auto">
                <button
                  id="tab-auth-login"
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Giriş
                </button>
                <button
                  id="tab-auth-register"
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'register'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Qeydiyyat
                </button>
              </div>
            )}
          </div>

          {/* Form Body (Scrollable if needed) */}
          <div className="p-6 overflow-y-auto">
            {/* Feedback Alerts */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 font-medium"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-xs text-emerald-700 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {/* 1. LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-poçt və ya Telefon Nömrəsi
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="input-login-email"
                      type="text"
                      required
                      placeholder="ad@example.com və ya 0702721154"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Şifrə
                    </label>
                    <button
                      id="link-forgot-password"
                      type="button"
                      onClick={() => {
                        setMode('forgot_password');
                        setForgotStep(1);
                        setForgotIdentifier(loginEmail);
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                    >
                      Şifrəni unutmusunuz?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="input-login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Hesaba Daxil Ol</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-3 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    Hesabınız yoxdur?{' '}
                    <button
                      id="link-switch-to-register"
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setErrorMessage(null);
                      }}
                      className="text-orange-600 font-bold hover:underline cursor-pointer"
                    >
                      İndi Qeydiyyatdan Keçin
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* 2. REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ad və Soyad *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="input-reg-fullname"
                      type="text"
                      required
                      placeholder="Məs: Əli Məmmədov"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-poçt Ünvanı *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="input-reg-email"
                      type="email"
                      required
                      placeholder="ali@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobil Nömrə *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="input-reg-phone"
                      type="tel"
                      required
                      placeholder="+994 50 123 45 67"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Şifrə (min 6) *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="input-reg-password"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Təkrar Şifrə *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="input-reg-confirm-password"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <button
                  id="btn-submit-register"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 mt-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Qeydiyyatdan Keç</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    Artıq hesabınız var?{' '}
                    <button
                      id="link-switch-to-login"
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setErrorMessage(null);
                      }}
                      className="text-orange-600 font-bold hover:underline cursor-pointer"
                    >
                      Daxil Olun
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* 3. FORGOT PASSWORD (SMS / OTP RESET) */}
            {mode === 'forgot_password' && (
              <div className="space-y-4">
                {/* Step indicator */}
                <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-600">
                  <span className={forgotStep >= 1 ? 'text-orange-600 font-black' : ''}>1. Nömrə/Email</span>
                  <span>→</span>
                  <span className={forgotStep >= 2 ? 'text-orange-600 font-black' : ''}>2. SMS Kodu</span>
                  <span>→</span>
                  <span className={forgotStep === 3 ? 'text-orange-600 font-black' : ''}>3. Yeni Şifrə</span>
                </div>

                {forgotStep === 1 && (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Telefon Nömrəniz və ya E-poçt
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          id="input-forgot-identifier"
                          type="text"
                          required
                          placeholder="Məs: 0702721154 və ya ad@example.com"
                          value={forgotIdentifier}
                          onChange={(e) => setForgotIdentifier(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Qeydiyyatlı nömrənizə 6-rəqəmli OTP təsdiq kodu göndəriləcək.
                      </p>
                    </div>

                    <button
                      id="btn-send-otp"
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Təsdiq Kodu (SMS) Göndər</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {forgotStep === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">
                          6-Rəqəmli Təsdiq Kodu (SMS)
                        </label>
                        {simulatedOtpNotice && (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Kod: {simulatedOtpNotice}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          id="input-otp-code"
                          type="text"
                          maxLength={6}
                          required
                          placeholder="Məs: 123456"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-sm font-black tracking-widest text-slate-900 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <button
                      id="btn-verify-otp"
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                      <span>Kodu Təsdiqlə</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {forgotStep === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Yeni Şifrə (min 6 simvol)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          id="input-new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Yeni Şifrə Təkrarı
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          id="input-confirm-new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <button
                      id="btn-save-new-password"
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Yeni Şifrəni Yadda Saxla</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                <div className="pt-2 text-center border-t border-slate-100">
                  <button
                    id="btn-back-to-login"
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    ← Giriş Səhifəsinə Qayıt
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

