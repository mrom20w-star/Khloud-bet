import React from 'react';
import { ChevronLeft, Flame, Sparkles, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GameId, GameItem, PlatformConfig, Language } from '../types';
import { sound } from '../utils/sound';
import { ZikoLogo } from './ZikoLogo';

interface GamesHubProps {
  platform: PlatformConfig;
  userId: string;
  onSelectGame: (gameId: GameId) => void;
  onBack: () => void;
  lang: Language;
}

// Only Apple of Fortune remains as requested
const GAMES: GameItem[] = [
  {
    id: 'apple',
    title: 'Apple of Fortune',
    subtitle: 'تفاحة الحظ',
    desc: 'توقعات الصفوف الآمنة بدقة خوارزمية 99% ونسب أرباح مضاعفة',
    img: '/apple-official.png',
    badge: 'الأكثر ربحاً',
    accuracy: '99%',
    hot: true,
  },
];

export const GamesHub: React.FC<GamesHubProps> = ({
  platform,
  userId,
  onSelectGame,
  onBack,
  lang,
}) => {
  return (
    <div className="flex flex-col min-h-full py-6 px-4 sm:px-6 max-w-md mx-auto w-full gap-5">
      {/* Top Bar with Platform and User status */}
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/35 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.25)]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-black tracking-wider uppercase text-amber-400 font-cyber">
              Khloud bet VIP
            </span>
          </div>
        </div>
      </div>

      {/* User ID banner */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/80 border border-amber-500/25 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-zinc-300 font-bold">
            معرف الحساب المفعل:
          </span>
          <span className="font-mono-cyber font-black text-white text-xs">{userId || 'غير محدد'}</span>
        </div>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-700/40 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          متصل
        </span>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          لعبة التفاحة المعتمدة
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          افتح توقعات خوارزمية Khloud bet المباشرة لمنصة {platform.name} بدقة 99%
        </p>
      </div>

      {/* Only Apple of Fortune Card */}
      <div className="space-y-4">
        {GAMES.map((game) => (
          <div
            key={game.id}
            onClick={() => {
              sound.playSuccess();
              onSelectGame(game.id);
            }}
            className="group relative rounded-2xl border-2 border-amber-500/40 bg-zinc-950/85 hover:border-amber-400 hover:bg-zinc-900/90 p-4 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-[0_0_28px_rgba(245,158,11,0.35)] active:scale-[0.98]"
          >
            {/* Hot badge */}
            {game.hot && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-600 to-yellow-500 text-black text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-xl flex items-center gap-1 shadow-md">
                <Flame className="w-3 h-3 text-black" />
                {game.badge}
              </div>
            )}

            <div className="flex items-start gap-3.5">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-500/40 bg-black shrink-0 relative group-hover:border-amber-400 transition-colors p-1">
                <img
                  src={game.img}
                  alt={game.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                    {game.title}
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-bold">
                    ({game.subtitle})
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {game.desc}
                </p>

                {/* Accuracy & Button */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                  <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>دقة الخوارزمية:</span>
                    <strong className="text-amber-400 font-mono-cyber font-black">
                      {game.accuracy}
                    </strong>
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:text-yellow-300 transition-colors">
                    <span>فتح التوقعات</span>
                    <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
