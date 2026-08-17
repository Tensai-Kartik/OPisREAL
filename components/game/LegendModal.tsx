'use client';

import { X, Check, AlertCircle, ArrowUp, ArrowDown, HelpCircle, Info } from 'lucide-react';

interface LegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegendModal({ isOpen, onClose }: LegendModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg parchment-panel rounded-2xl border-2 border-amber-600/40 p-6 shadow-2xl relative text-left animate-tooltip-pop">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 hover:rotate-90 transition-all duration-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-amber-400 font-bold text-lg mb-3">
          <HelpCircle className="w-6 h-6 animate-pulse" />
          <span>How to Play & Indicator Legend</span>
        </div>

        <p className="text-slate-300 text-xs mb-4 leading-relaxed">
          Guess a random One Piece character! After each guess, attribute tiles will reveal clues. Hover over any character portrait to read full lore & character descriptions!
        </p>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-green-950/40 border border-green-500/40 text-green-300 interactive-cell">
            <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold uppercase tracking-wider text-green-300">Green — Exact Match</div>
              <div className="text-slate-200">The attribute exactly matches the secret character.</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 interactive-cell">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold uppercase tracking-wider text-amber-300">Orange — Partial Match</div>
              <div className="text-slate-200">Same story arc, partial Devil Fruit class, or shared Haki.</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 interactive-cell">
            <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold uppercase tracking-wider text-red-300">Red — Incorrect</div>
              <div className="text-slate-200">No overlap with the secret character&apos;s attribute.</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-200 interactive-cell">
            <div className="flex flex-col flex-shrink-0 mt-0.5">
              <ArrowUp className="w-4 h-4 text-amber-400" />
              <ArrowDown className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="font-extrabold uppercase tracking-wider text-amber-400">Up / Down Arrows — Numeric Values & Debut</div>
              <div className="text-slate-200 space-y-1">
                <div><strong>⬆️ HIGHER:</strong> Secret target has higher Bounty, Age, Height, or debuted later in the storyline.</div>
                <div><strong>⬇️ LOWER:</strong> Secret target has lower Bounty, Age, Height, or debuted earlier in the storyline.</div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-900/80 border border-sky-500/30 text-sky-200 interactive-cell">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-sky-400" />
            <div>
              <div className="font-extrabold uppercase tracking-wider text-sky-400">Hover Over Character Portraits</div>
              <div className="text-slate-200">
                Hover over any character portrait in the game table or search dropdown to view full story lore, aliases, and facts!
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 gold-button rounded-xl text-sm font-black uppercase cursor-pointer active:scale-95 transition-transform"
        >
          Got It, Let&apos;s Play!
        </button>
      </div>
    </div>
  );
}
