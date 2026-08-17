'use client';

import React from 'react';
import Image from 'next/image';
import { Loader2, Flag } from 'lucide-react';

interface GiveUpButtonProps {
  onGiveUp: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  theme?: 'dark' | 'light';
}

export default function GiveUpButton({
  onGiveUp,
  disabled = false,
  isLoading = false,
  theme = 'dark',
}: GiveUpButtonProps) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onGiveUp}
      disabled={disabled || isLoading}
      title="Give up and reveal the secret character"
      className={`group relative flex flex-col items-center justify-center p-1.5 rounded-xl border-2 transition-all duration-200 shadow-xl select-none shrink-0 cursor-pointer ${
        disabled
          ? 'opacity-40 cursor-not-allowed border-slate-700 bg-slate-900/50'
          : isDark
            ? 'bg-slate-950/95 border-red-500/50 hover:border-red-400 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95'
            : 'bg-white/95 border-red-400/60 hover:border-red-500 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_0_18px_rgba(239,68,68,0.3)] active:scale-95'
      }`}
    >
      {/* Give Up Image Container */}
      <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-red-500/60 bg-slate-900 shadow-md mb-1 flex items-center justify-center group-hover:border-red-400 transition-colors">
        <Image
          src="/give_up.jpg"
          alt="Give Up"
          width={48}
          height={48}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-200"
        />
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Give Up Text Button */}
      <div
        className={`font-black text-[11px] uppercase tracking-wider text-center px-1.5 py-0.5 rounded transition-colors leading-tight flex items-center space-x-1 ${
          isDark
            ? 'text-red-400 group-hover:text-red-300'
            : 'text-red-600 group-hover:text-red-700'
        }`}
      >
        <Flag className="w-3 h-3 group-hover:rotate-12 transition-transform duration-200" />
        <span>I Give Up</span>
      </div>
    </button>
  );
}
