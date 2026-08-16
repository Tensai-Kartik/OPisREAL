'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`group p-2.5 rounded-xl border transition-all duration-200 shadow-lg flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
        theme === 'dark'
          ? 'bg-slate-900/90 border-amber-500/40 text-amber-400 hover:border-amber-400 hover:shadow-[0_0_16px_rgba(245,158,11,0.3)] hover:bg-slate-800'
          : 'bg-white/95 border-slate-200 text-slate-800 hover:border-amber-500 hover:shadow-md hover:bg-slate-50'
      }`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
}
