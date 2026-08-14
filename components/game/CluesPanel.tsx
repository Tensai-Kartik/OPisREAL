'use client';

import { useState } from 'react';
import { ClueItem } from '@/types/game';
import { Lock, Eye, Lightbulb, EyeOff } from 'lucide-react';

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
    <div className="w-full max-w-5xl mx-auto my-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className={`flex items-center space-x-2 font-bold text-xs uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-slate-800'}`}>
          <Lightbulb className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
          <span>Character Hints & Clues</span>
        </div>
        <div className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Guesses: <span className={isDark ? 'text-amber-400 font-bold' : 'text-slate-900 font-bold'}>{guessCount}</span>
        </div>
      </div>

      {/* 4 Horizontal Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {clues.map((clue) => {
          const isRevealed = !!revealedLevels[clue.level];

          return (
            <div
              key={clue.level}
              onClick={() => clue.isUnlocked && toggleReveal(clue.level)}
              className={`p-3 rounded-xl border text-center flex flex-col items-center justify-between min-h-[90px] transition-all cursor-pointer select-none ${
                clue.isUnlocked
                  ? isDark
                    ? 'bg-slate-900/90 border-amber-500/50 hover:border-amber-400 text-slate-100 shadow-lg'
                    : 'bg-white/95 border-slate-200 hover:border-slate-300 text-slate-900 shadow-md shadow-slate-200/50'
                  : isDark
                    ? 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
                    : 'bg-slate-100/70 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className={`flex items-center space-x-1.5 font-bold text-xs uppercase tracking-wider mb-1 ${
                isDark ? 'text-amber-400' : 'text-amber-600'
              }`}>
                {clue.isUnlocked ? (
                  isRevealed ? (
                    <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-amber-500" />
                  )
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{clue.label}</span>
              </div>

              {clue.isUnlocked ? (
                isRevealed ? (
                  <p className="text-slate-900 dark:text-slate-100 text-xs font-semibold leading-tight my-auto animate-fadeIn">
                    {clue.text}
                  </p>
                ) : (
                  <div className={`my-auto px-3 py-1 border rounded-md text-[11px] font-bold uppercase tracking-wide ${
                    isDark
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    Click to Reveal
                  </div>
                )
              ) : (
                <p className="text-slate-400 text-[11px] italic my-auto">
                  Unlocks at guess #{clue.unlockedAt}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
