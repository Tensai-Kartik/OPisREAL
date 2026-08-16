'use client';

import { useState } from 'react';
import { ClueItem } from '@/types/game';
import { Lock, Eye, Lightbulb, EyeOff, Sparkles } from 'lucide-react';

interface CluesPanelProps {
  clues: ClueItem[];
  guessCount: number;
  theme?: 'dark' | 'light';
}

export default function CluesPanel({ clues, guessCount, theme = 'dark' }: CluesPanelProps) {
  const isDark = theme === 'dark';
  const [revealedLevels, setRevealedLevels] = useState<Record<number, boolean>>({});

  if (!clues || clues.length === 0) return null;

  const toggleReveal = (level: number) => {
    setRevealedLevels((prev) => ({ ...prev, [level]: !prev[level] }));
  };

  return (
    <div className={`w-full max-w-5xl mx-auto my-3 p-4 sm:p-5 rounded-2xl border-2 shadow-2xl backdrop-blur-2xl relative overflow-hidden transition-all duration-200 ${
      isDark
        ? 'border-amber-600/40 parchment-panel shadow-[0_12px_40px_rgba(0,0,0,0.8)]'
        : 'border-slate-300 bg-white/90 shadow-xl'
    }`}>
      {/* Top ambient glass reflection sheen */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

      {/* Internal Header: Hints & Clues Title + Guesses Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className={`p-1.5 rounded-xl border flex items-center justify-center shadow-md ${
            isDark ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-amber-100 border-amber-400 text-amber-800'
          }`}>
            <Lightbulb className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className={`font-black text-xs sm:text-sm uppercase tracking-wider ${
              isDark ? 'text-amber-400 drop-shadow-sm' : 'text-slate-900'
            }`}>
              Character Hints & Clues
            </h3>
            <p className={`text-[10.5px] font-medium hidden sm:block ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Unlocks special lore clues as your guess count increases
            </p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold shadow-md flex items-center space-x-2 backdrop-blur-md ${
          isDark
            ? 'bg-slate-950/80 border-amber-500/30 text-slate-200'
            : 'bg-white border-slate-300 text-slate-800'
        }`}>
          <span className="text-[10.5px] font-extrabold uppercase tracking-wider opacity-75">Guesses:</span>
          <span className="px-2 py-0.5 rounded-lg bg-amber-500/25 text-amber-400 font-black text-xs border border-amber-500/40">
            {guessCount}
          </span>
        </div>
      </div>

      {/* 4 Horizontal Frosted Glass Clue Boxes inside the Container */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {clues.map((clue) => {
          const isRevealed = !!revealedLevels[clue.level];

          return (
            <div
              key={clue.level}
              onClick={() => clue.isUnlocked && toggleReveal(clue.level)}
              className={`relative overflow-hidden p-3.5 rounded-xl border-2 text-center flex flex-col items-center justify-between min-h-[105px] select-none transition-all duration-200 backdrop-blur-xl group ${
                clue.isUnlocked
                  ? isDark
                    ? 'bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-amber-950/40 border-amber-500/80 shadow-[0_8px_24px_rgba(0,0,0,0.6),0_0_16px_rgba(245,158,11,0.25)] hover:border-amber-400 hover:-translate-y-1 hover:scale-[1.025] hover:shadow-[0_12px_32px_rgba(0,0,0,0.7),0_0_24px_rgba(245,158,11,0.4)] cursor-pointer active:scale-95'
                    : 'bg-gradient-to-b from-white/95 to-amber-50/90 border-amber-500 shadow-md hover:border-amber-600 hover:-translate-y-1 hover:scale-[1.025] hover:shadow-lg cursor-pointer active:scale-95'
                  : isDark
                    ? 'bg-slate-900/85 border-slate-700/80 shadow-md hover:border-slate-600 hover:bg-slate-900/95'
                    : 'bg-white/85 border-slate-300 shadow-sm hover:border-slate-400 hover:bg-white/95'
              }`}
            >
              {/* Subtle top ambient glass reflection line */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

              {/* Title & Status Icon */}
              <div className={`flex items-center space-x-1.5 font-black text-xs uppercase tracking-wider mb-1.5 ${
                clue.isUnlocked
                  ? isDark ? 'text-amber-300 drop-shadow-sm' : 'text-amber-700'
                  : isDark ? 'text-slate-200' : 'text-slate-700'
              }`}>
                {clue.isUnlocked ? (
                  isRevealed ? (
                    <EyeOff className="w-4 h-4 text-amber-400 transition-transform duration-200 group-hover:scale-110" />
                  ) : (
                    <Eye className="w-4 h-4 text-amber-400 transition-transform duration-200 group-hover:scale-110 animate-bounce" />
                  )
                ) : (
                  <div className="p-1 rounded-full bg-slate-800/80 border border-slate-700">
                    <Lock className="w-3 h-3 text-amber-400/80" />
                  </div>
                )}
                <span>{clue.label}</span>
              </div>

              {/* Clue Content */}
              {clue.isUnlocked ? (
                isRevealed ? (
                  <div className="w-full my-auto p-2 rounded-lg bg-slate-950/80 border border-amber-500/40 text-slate-100 text-xs font-bold leading-tight animate-fadeIn shadow-inner">
                    {clue.text}
                  </div>
                ) : (
                  <div className={`my-auto px-3 py-1.5 border-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center space-x-1.5 shadow-md ${
                    isDark
                      ? 'bg-gradient-to-r from-amber-500/25 via-amber-400/35 to-amber-500/25 text-amber-300 border-amber-400/80 group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:shadow-[0_0_16px_rgba(245,158,11,0.6)]'
                      : 'bg-amber-100 text-amber-900 border-amber-400 group-hover:bg-amber-500 group-hover:text-white'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:text-slate-950" />
                    <span>Click to Reveal</span>
                  </div>
                )
              ) : (
                <div className={`my-auto px-3 py-1 rounded-md text-[11px] font-bold border backdrop-blur-md ${
                  isDark
                    ? 'bg-slate-950/70 border-slate-800 text-amber-200/80'
                    : 'bg-slate-100/90 border-slate-200 text-slate-700'
                }`}>
                  Unlocks at Guess #{clue.unlockedAt}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
