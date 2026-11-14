import React, { useState, useRef } from 'react';
import {
  Copy,
  Check,
  DollarSign,
  Coins,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  Fingerprint,
  Loader2,
  AlertCircle,
  Smartphone,
  KeyRound,
  Lock,
  Unlock,
} from 'lucide-react';
import { PlatformConfig, Language } from '../types';
import { sound } from '../utils/sound';
import { ZikoLogo } from './ZikoLogo';

interface ActivationFlowProps {
  platform: PlatformConfig;
  onBack: () => void;
  onComplete: (userId: string, verifiedPassword: string) => void;
  lang: Language;
}

const REQUIRED_PASSWORD = 'NEMAR_AXC9';

export const ActivationFlow: React.FC<ActivationFlowProps> = ({
  platform,
  onBack,
  onComplete,
  lang,
}) => {
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const codeInputRef = useRef<HTMLInputElement>(null);

  const promoCode = platform.promoCode || 'LM55';

  const isPasswordValid = activationCode.trim() === REQUIRED_PASSWORD;

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(promoCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLockedIdAttempt = () => {
    if (!isPasswordValid) {
      sound.playClick();
      setErrorMsg('يجب إدخال كود التفعيل الصحيح في خانة "ادخل كود التفعيل" بالأسفل أولاً قبل كتابة الـ ID');
      codeInputRef.current?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      sound.playClick();
      setErrorMsg('كود التفعيل غير صحيح! يرجى إدخال كود التفعيل المعتمد أولاً');
      codeInputRef.current?.focus();
      return;
    }

    if (!userId.trim()) {
      setErrorMsg('يرجى إدخال معرف الحساب (ID) أولاً');
      return;
    }

    if (userId.trim().length < 5) {
      setErrorMsg('معرف الحساب يجب أن يتكون من 5 أرقام على الأقل');
      return;
    }

    setErrorMsg(null);
    setIsVerifying(true);
    setVerifyStep(1);
    sound.playScan();

    setTimeout(() => {
      setVerifyStep(2);
      sound.playRadarTick();
    }, 450);

    setTimeout(() => {
      setVerifyStep(3);
      sound.playRadarTick();
    }, 850);

    setTimeout(() => {
      setIsVerifying(false);
      sound.playSuccess();
      onComplete(userId.trim(), activationCode.trim());
    }, 1250);
  };

  return (
    <div className="flex flex-col min-h-full py-6 px-4 sm:px-6 max-w-md mx-auto w-full gap-5">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-amber-500/60 transition-all active:scale-95 cursor-pointer"
          title="رجوع"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <div className="flex items-center gap-2">
          <ZikoLogo size="sm" />
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/35 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-black font-cyber text-amber-400 uppercase tracking-wider">
              Khloud bet VIP
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-1.5">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          شروط التفعيل والربط المباشر
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          أكمل الخطوات التالية لتفعيل المزامنة المباشرة مع سيرفر {platform.name}
        </p>
      </div>

      {/* STEPS CONTAINER */}
      <div className="space-y-4">
        {/* Step 1: Platform Info (No Download / Create Account buttons as requested previously) */}
        <div className="rounded-2xl border border-amber-500/25 bg-zinc-950/75 p-4.5 backdrop-blur-md shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black flex items-center justify-center font-black text-xs shadow-neon-gold">
                1
              </div>
              <h2 className="text-sm font-black text-white">
                منصة {platform.name} المعتمدة
              </h2>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
              إلزامي
            </span>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900/80 border border-white/5 p-3 rounded-xl">
            <div className="w-11 h-11 rounded-xl bg-black border border-amber-500/30 p-1 flex items-center justify-center shrink-0 overflow-hidden">
              <img src={platform.img} alt={platform.name} className="w-full h-full object-contain" />
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              تأكد من تسجيل حسابك في منصة {platform.name} الرسمية لتفعيل المزامنة المباشرة مع سيرفر Khloud bet.
            </p>
          </div>
        </div>

        {/* Step 2: Promo Code */}
        <div className="rounded-2xl border border-amber-500/25 bg-zinc-950/75 p-4.5 backdrop-blur-md shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black flex items-center justify-center font-black text-xs shadow-neon-gold">
                2
              </div>
              <h2 className="text-sm font-black text-white">
                إدخال كود البروموكود ({promoCode})
              </h2>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
              مطلوب للتسجيل
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            استخدم البروموكود المعتمد أثناء التسجيل لضمان ربط حسابك في {platform.name} بسيرفر Khloud bet وتفعيل دقة 99%:
          </p>

          <div
            onClick={handleCopyCode}
            className="relative bg-zinc-900/90 rounded-xl border-2 border-dashed border-amber-500/60 hover:border-amber-400 p-3.5 transition-all cursor-pointer group shadow-neon-gold flex items-center justify-between"
          >
            <div>
              <span className="block text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-0.5">
                الكود المعتمد
              </span>
              <span className="text-3xl font-black font-mono-cyber tracking-widest text-amber-400 text-glow-gold">
                {promoCode}
              </span>
            </div>

            <button
              type="button"
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-amber-500 text-black shadow-neon-gold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step 3: Minimum Deposit (180 L.E or 4 USD) */}
        <div className="rounded-2xl border border-amber-500/25 bg-zinc-950/75 p-4.5 backdrop-blur-md shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black flex items-center justify-center font-black text-xs shadow-neon-gold">
                3
              </div>
              <h2 className="text-sm font-black text-white">
                الحد الأدنى للإيداع
              </h2>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
              تفعيل الخوارزمية
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            قم بإجراء أول إيداع بالحد الأدنى المطلوب لتفعيل المزامنة مع سيرفر التوقعات:
          </p>

          <div className="grid grid-cols-2 gap-2.5" dir="ltr">
            <div className="bg-zinc-900/90 border border-amber-500/20 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-inner">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-amber-400" /> USD ($)
              </span>
              <span className="text-xl font-black text-white font-mono-cyber">$4.00</span>
            </div>

            <div className="bg-zinc-900/90 border border-amber-500/20 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-inner">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-400" /> EGP (جنيه)
              </span>
              <span className="text-xl font-black text-amber-400 font-mono-cyber">180 L.E</span>
            </div>
          </div>
        </div>

        {/* Step 4: ID Verification + "ادخل كود التفعيل" directly underneath */}
        <div className="rounded-2xl border-2 border-amber-500/50 bg-zinc-950/90 p-4.5 backdrop-blur-md shadow-[0_0_28px_rgba(245,158,11,0.2)] space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black flex items-center justify-center font-black text-xs shadow-neon-gold">
                4
              </div>
              <h2 className="text-sm font-black text-white">
                تأكيد الـ ID وكود التفعيل
              </h2>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
              مطلوب للدخول
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            أدخل كود التفعيل في خانة <strong className="text-amber-400">"ادخل كود التفعيل"</strong> أسفل الـ ID أولاً، ثم اكتب معرف حسابك للدخول إلى السكريبت:
          </p>

          <form onSubmit={handleVerify} className="space-y-3">
            {/* Field 1: Account ID */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-zinc-300">
                  معرف الحساب (Account ID)
                </label>
                {isPasswordValid ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <Unlock className="w-3 h-3" />
                    مفتوح للكتابة
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    مقفل لحين إدخال كود التفعيل بالأسفل
                  </span>
                )}
              </div>

              <div
                onClick={handleLockedIdAttempt}
                className="relative"
              >
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-zinc-500">
                  <Fingerprint className={`w-4 h-4 ${isPasswordValid ? 'text-emerald-400' : 'text-amber-500/60'}`} />
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    if (!isPasswordValid) return;
                    setUserId(e.target.value.replace(/[^0-9]/g, ''));
                    if (errorMsg) setErrorMsg(null);
                  }}
                  readOnly={!isPasswordValid}
                  disabled={isVerifying}
                  placeholder={
                    isPasswordValid
                      ? 'اكتب معرف حسابك الآن (مثال: 74829105)'
                      : 'أدخل كود التفعيل بالأسفل أولاً لفتح الـ ID...'
                  }
                  className={`w-full h-12 rounded-xl ps-10 pe-4 font-mono-cyber tracking-wider text-sm transition-all outline-none ${
                    isPasswordValid
                      ? 'bg-zinc-900 border border-emerald-600/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white'
                      : 'bg-zinc-950/90 border border-amber-500/30 text-zinc-500 cursor-not-allowed placeholder:text-zinc-600 placeholder:text-xs'
                  }`}
                />
              </div>
            </div>

            {/* Field 2: Activation Code directly under ID */}
            <div>
              <label className="block text-[11px] font-bold text-amber-300 mb-1">
                ادخل كود التفعيل
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-zinc-500">
                  <KeyRound className={`w-4 h-4 ${isPasswordValid ? 'text-emerald-400' : 'text-amber-400'}`} />
                </div>
                <input
                  ref={codeInputRef}
                  type="text"
                  value={activationCode}
                  onChange={(e) => {
                    setActivationCode(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  disabled={isVerifying}
                  placeholder="ادخل كود التفعيل"
                  className={`w-full h-12 bg-zinc-900 rounded-xl ps-10 pe-4 text-white font-mono-cyber tracking-widest text-sm transition-all outline-none placeholder:text-zinc-500 ${
                    isPasswordValid
                      ? 'border-2 border-emerald-500/70 focus:border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'border border-amber-500/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-500'
                  }`}
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-600/60 flex items-start gap-2 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Server Status Indicator */}
            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-amber-500/20 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="flex items-center gap-1 font-bold">
                <Smartphone className="w-3 h-3 text-amber-400" />
                <span>اتصال سيرفر {platform.name}:</span>
              </span>
              <span className="text-amber-400 font-mono font-bold">
                متصل (جاهز للمزامنة)
              </span>
            </div>

            {/* Submit Button */}
            {isVerifying ? (
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-amber-500/35 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-200">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span className="font-bold">
                    {verifyStep === 1 && 'التحقق من كود التفعيل المعتمد...'}
                    {verifyStep === 2 && `المزامنة مع سيرفر Khloud bet و ${platform.name}...`}
                    {verifyStep === 3 && 'فتح لعبة التفاحة بنجاح...'}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 h-full transition-all duration-500 shadow-neon-gold"
                    style={{ width: `${(verifyStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-gold active:scale-[0.98] transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>تفعيل السكريبت والدخول</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
