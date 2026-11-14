import React from 'react';
import { ShieldCheck, Zap, Radio, ChevronRight, CheckCircle2, Award, Flame } from 'lucide-react';
import { PLATFORMS } from '../data/platforms';
import { PlatformConfig, Language } from '../types';
import { sound } from '../utils/sound';
import { ZikoLogo } from './ZikoLogo';

interface PlatformSelectScreenProps {
  selectedPlatform: PlatformConfig;
  onSelectPlatform: (platform: PlatformConfig) => void;
  onProceed: () => void;
  lang: Language;
}

export const PlatformSelectScreen: React.FC<PlatformSelectScreenProps> = ({
  selectedPlatform,
  onSelectPlatform,
  onProceed,
  lang,
}) => {
  return (
    <div className="flex flex-col min-h-full py-6 px-4 sm:px-6 max-w-md mx-auto w-full gap-5">
      {/* Top Banner / Hero */}
      <div className="text-center space-y-2.5">
        <div className="flex justify-center">
          <ZikoLogo size="lg" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/35 text-xs font-bold text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.25)]">
          <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>بوابة سكربت Khloud bet الرسمية VIP</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          المنصة المعتمدة للهاك
        </h1>

        <p className="text-xs text-zinc-400 font-medium max-w-xs mx-auto leading-relaxed">
          سيرفر {selectedPlatform.name} الرسمي المتزامن مع خوارزميات Khloud bet بدقة 99%
        </p>
      </div>

      {/* Platform List */}
      <div className="space-y-3.5">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatform.id === platform.id;
          return (
            <div
              key={platform.id}
              onClick={() => {
                sound.playClick();
                onSelectPlatform(platform);
              }}
              className={`relative rounded-2xl border p-4 transition-all duration-300 cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-950/60 via-[#0d0a04] to-zinc-950 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.35)] scale-[1.01]'
                  : 'bg-zinc-950/70 border-white/10 hover:border-amber-500/50 hover:bg-zinc-900/60'
              }`}
            >
              {platform.recommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-600 to-yellow-500 text-black text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-xl flex items-center gap-1 shadow-md">
                  <Flame className="w-3 h-3 text-black" />
                  موصى به VIP
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-black border border-amber-500/40 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    <img
                      src={platform.img}
                      alt={platform.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-white font-cyber tracking-wide">
                        {platform.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-400 font-medium truncate">
                      {platform.tagline}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-[11px] font-black text-amber-400 font-mono">
                    {platform.accuracy}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500 mt-1">
                    {platform.latency}
                  </span>
                </div>
              </div>

              {/* Extra badges */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Zap className="w-3 h-3" />
                  {platform.geo}
                </span>
                <span className="font-mono text-zinc-500">
                  البروموكود المعتمد:{' '}
                  <strong className="text-amber-300 font-mono-cyber">{platform.promoCode}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Server specs */}
      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-amber-500/20 flex items-center justify-center gap-1.5 text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-bold">
            حماية مشفّرة 100%
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-amber-500/20 flex items-center justify-center gap-1.5 text-zinc-400">
          <Award className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-[10px] font-bold">
            سيرفر معتمد فوري
          </span>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={() => {
          sound.playSuccess();
          onProceed();
        }}
        className="w-full h-13 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-gold active:scale-[0.98] transition-all cursor-pointer mt-2"
      >
        <span>
          متابعة الشروط والتفعيل ({selectedPlatform.name})
        </span>
        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
      </button>
    </div>
  );
};
