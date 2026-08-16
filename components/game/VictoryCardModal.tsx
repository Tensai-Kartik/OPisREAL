'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Character } from '@/types/character';
import { RefreshCw, Sparkles, Flag, Quote } from 'lucide-react';
import { formatDebutString } from '@/lib/game/debutHelper';
import CharacterAvatar from './CharacterAvatar';

interface VictoryCardModalProps {
  character: Character;
  guessCount: number;
  isSurrender?: boolean;
  onPlayAgain: () => void;
}

export default function VictoryCardModal({
  character,
  guessCount,
  isSurrender = false,
  onPlayAgain,
}: VictoryCardModalProps) {
  useEffect(() => {
    if (!isSurrender) {
      // Fire festive confetti animation only on true victory
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#d97706', '#ef4444', '#10b981'],
      });
    }
  }, [isSurrender]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg parchment-panel rounded-2xl border-2 border-amber-500/80 shadow-2xl overflow-hidden p-4 sm:p-5 text-center relative max-h-[95vh] overflow-y-auto">
        {/* Header Badge */}
        {isSurrender ? (
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-[11px] uppercase tracking-widest mb-2 animate-float">
            <Flag className="w-3.5 h-3.5 text-red-400" />
            <span>Mystery Revealed</span>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[11px] uppercase tracking-widest mb-2 animate-float">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Victory Achieved</span>
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-black text-slate-100 gold-gradient-text uppercase tracking-tight mb-0.5">
          {isSurrender ? 'YOU GAVE UP!' : '🎉 YOU GOT IT, NAKAMA!'}
        </h2>
        <p className="text-slate-400 text-xs mb-3 font-medium">
          {isSurrender
            ? `Revealed after ${guessCount} ${guessCount === 1 ? 'guess' : 'guesses'}. Better luck next round!`
            : `Found the secret character in ${guessCount} ${guessCount === 1 ? 'guess' : 'guesses'}!`}
        </p>

        {/* Character Portrait & Main Name */}
        <div className="flex justify-center mb-2">
          <CharacterAvatar
            src={character.image_url}
            name={character.name}
            size="2xl"
            fit="contain"
            className="border-2 border-amber-500/80 shadow-xl"
          />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-100 tracking-wide mb-0.5">
          {character.name}
        </h3>
        {character.japanese_name && (
          <div className="text-[11px] text-amber-400 font-semibold mb-1">
            {character.japanese_name}
          </div>
        )}

        {/* Character Lore Description if present */}
        {character.description && (
          <div className="my-2.5 p-2.5 bg-slate-900/80 border border-amber-500/30 rounded-xl text-xs text-slate-300 leading-relaxed italic text-left flex items-start space-x-2">
            <Quote className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5 not-italic" />
            <span className="line-clamp-3">{character.description}</span>
          </div>
        )}

        {/* Aliases */}
        {(character.alias || (character.aliases && character.aliases.length > 0)) && (
          <div className="flex flex-wrap justify-center gap-1 mb-3">
            {(character.aliases && character.aliases.length > 0
              ? character.aliases.slice(0, 4).map((a) => (typeof a === 'string' ? a : a.alias))
              : (character.alias || '').split(/,\s*/).slice(0, 4)
            ).filter(Boolean).map((aliasText, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-900/90 border border-amber-600/30 text-amber-300 rounded text-[10px] font-semibold hover:border-amber-400 transition-colors"
              >
                &quot;{aliasText}&quot;
              </span>
            ))}
          </div>
        )}

        {/* Attribute Details Grid */}
        <div className="grid grid-cols-2 gap-1.5 text-left text-[11px] bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-4">
          <div className="interactive-cell p-1.5 border-b border-slate-800/80 rounded-lg hover:bg-slate-900/60">
            <span className="text-slate-400 block font-medium">Devil Fruit</span>
            <span className="font-bold text-amber-200 truncate block">{character.devil_fruit_name || 'None'}</span>
            <span className="text-[9px] text-slate-400 block">({character.devil_fruit_type})</span>
          </div>
          <div className="interactive-cell p-1.5 border-b border-slate-800/80 rounded-lg hover:bg-slate-900/60">
            <span className="text-slate-400 block font-medium">Haki</span>
            <span className="font-bold text-amber-200 truncate block">
              {character.haki && character.haki.length > 0
                ? character.haki.map((h) => h.haki_type).join(', ')
                : 'None'}
            </span>
          </div>
          <div className="interactive-cell p-1.5 border-b border-slate-800/80 rounded-lg hover:bg-slate-900/60">
            <span className="text-slate-400 block font-medium">Affiliation</span>
            <span className="font-bold text-amber-200 truncate block">
              {character.affiliations?.join(', ') || 'Independent'}
            </span>
          </div>
          <div className="interactive-cell p-1.5 border-b border-slate-800/80 rounded-lg hover:bg-slate-900/60">
            <span className="text-slate-400 block font-medium">Bounty</span>
            <span className="font-bold text-amber-200 truncate block">
              {character.bounty ? `${character.bounty.toLocaleString()} Berries` : 'Unknown / None'}
            </span>
          </div>
          <div className="interactive-cell p-1.5 rounded-lg hover:bg-slate-900/60">
            <span className="text-slate-400 block font-medium">Age & Height</span>
            <span className="font-bold text-amber-200 block">
              {character.age ? `${character.age} yrs` : 'Unknown'} • {character.height ? `${character.height} cm` : 'Unknown'}
            </span>
          </div>
          <div className="interactive-cell p-1.5 rounded-lg hover:bg-slate-900/60">
            <span className="text-slate-400 block font-medium">Origin & Debut</span>
            <span className="font-bold text-amber-200 truncate block">
              {character.origin} • {formatDebutString(character.first_appearance, character.first_arc)}
            </span>
          </div>
        </div>

        {/* Play Again Button with continuous golden shimmer sweep */}
        <button
          onClick={onPlayAgain}
          className="relative overflow-hidden w-full py-3 gold-button rounded-xl text-xs sm:text-sm uppercase font-black tracking-wider flex items-center justify-center space-x-2 shadow-lg cursor-pointer group"
        >
          <div className="absolute inset-0 animate-shine-sweep pointer-events-none opacity-40" />
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span>PLAY AGAIN (NEW CHARACTER)</span>
        </button>
      </div>
    </div>
  );
}
