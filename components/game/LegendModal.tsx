'use client';

import { X, Check, AlertCircle, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';

interface LegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegendModal({ isOpen, onClose }: LegendModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg parchment-panel rounded-2xl border border-amber-600/40 p-6 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-amber-400 font-bold text-lg mb-4">
          <HelpCircle className="w-6 h-6" />
          <span>How to Play & Indicator Legend</span>
        </div>

        <p className="text-slate-300 text-xs mb-4 leading-relaxed">
          Guess a random One Piece character! After each guess, attribute tiles will reveal how close your guessed character matches the secret target character.
        </p>

        <div className="space-y-3 text-xs">
          <div className="flex items-start space-x-3 p-2.5 rounded-lg cell-correct">
            <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold uppercase tracking-wider text-green-300">Green — Exact Match</div>
              <div className="text-slate-200">The attribute exactly matches the secret character.</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2.5 rounded-lg cell-partial">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold uppercase tracking-wider text-orange-300">Orange — Partial Match</div>
              <div className="text-slate-200">Partial overlap in Devil Fruit Type, Haki types, or Affiliations/Occupations.</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2.5 rounded-lg cell-incorrect">
            <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold uppercase tracking-wider text-red-300">Red — Incorrect</div>
              <div className="text-slate-200">No overlap with the secret character&apos;s attribute.</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-200">
            <div className="flex flex-col flex-shrink-0 mt-0.5">
              <ArrowUp className="w-4 h-4 text-amber-400" />
              <ArrowDown className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="font-bold uppercase tracking-wider text-amber-400">Up / Down Arrows — Numeric Values</div>
              <div className="text-slate-200">
                <strong>⬆️ Target is Higher:</strong> Secret target has higher Bounty, Age, or Height.<br />
                <strong>⬇️ Target is Lower:</strong> Secret target has lower Bounty, Age, or Height.
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 gold-button rounded-xl text-sm font-bold uppercase"
        >
          Got It, Let&apos;s Play!
        </button>
      </div>
    </div>
  );
}
