import React from 'react';
import { Video, Sparkles, BookOpen, Key, Infinity, CheckCircle2, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  isUnlimitedMode: boolean;
  hasCustomKey: boolean;
  totalGenerated: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onOpenSettings,
  isUnlimitedMode,
  hasCustomKey,
  totalGenerated,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Video className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Veo Studio
              </h1>
              <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
                TURBO AI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Generator Video Sinematik Berbasis Mesin Google Veo
            </p>
          </div>
        </div>

        {/* Right Actions & Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Unlimited Status Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <Infinity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Mode Unlimited Aktif</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>

          {/* Video Counter */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalGenerated} Video Dibuat</span>
          </div>

          {/* Panduan Button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Panduan Prompt</span>
            <span className="sm:hidden">Panduan</span>
          </button>

          {/* Settings / API Key Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-medium transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title="Pengaturan Mode & API Key"
          >
            <Key className={`w-3.5 h-3.5 ${hasCustomKey ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{hasCustomKey ? 'Custom Key' : 'Pengaturan'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
