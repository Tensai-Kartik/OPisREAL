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
      className={`p-2.5 rounded-xl border transition-all duration-200 shadow-lg flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md ${
        theme === 'dark'
          ? 'bg-slate-900/90 border-amber-500/40 text-amber-400 hover:bg-slate-800'
          : 'bg-white/95 border-slate-200 text-slate-800 hover:bg-slate-100 shadow-sm'
      }`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4 text-amber-400" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-slate-700" />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
}
