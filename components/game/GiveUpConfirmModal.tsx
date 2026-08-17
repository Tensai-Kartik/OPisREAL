'use client';

import Image from 'next/image';
import { Swords, Flag, AlertTriangle, X } from 'lucide-react';

interface GiveUpConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSurrender: () => void;
  isLoading?: boolean;
}

export default function GiveUpConfirmModal({
  isOpen,
  onClose,
  onConfirmSurrender,
  isLoading = false,
}: GiveUpConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-md parchment-panel rounded-2xl border-2 border-red-500/60 shadow-2xl overflow-hidden p-5 sm:p-6 text-center relative">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-black text-[11px] uppercase tracking-widest mb-3">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span>Surrender Warning</span>
        </div>

        {/* Character image preview */}
        <div className="relative w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden border-2 border-red-500/60 shadow-lg bg-slate-900">
          <Image
            src="/give_up.jpg"
            alt="Give Up Warning"
            width={64}
            height={64}
            className="w-full h-full object-cover object-center"
          />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight mb-1.5">
          ARE YOU SURE, PIRATE?
        </h3>

        <p className="text-slate-300 text-xs sm:text-sm max-w-xs mx-auto mb-5 leading-relaxed">
          Surrendering will end this round and reveal the secret character. A true pirate never backs down easily!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {/* Tatakae (Fight) - Primary button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:flex-1 py-3 gold-button rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <Swords className="w-4 h-4 text-slate-950" />
            <span>Tatakae (Fight)</span>
          </button>

          {/* Surrender - Danger button */}
          <button
            onClick={onConfirmSurrender}
            disabled={isLoading}
            className="w-full sm:flex-1 py-3 bg-red-950/80 hover:bg-red-900 border border-red-500/60 text-red-200 hover:text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Flag className="w-4 h-4 text-red-400" />
            <span>{isLoading ? 'Revealing...' : 'Surrender'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
