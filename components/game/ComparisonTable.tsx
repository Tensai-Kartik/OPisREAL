'use client';

import { GuessComparison } from '@/types/game';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { HakiBadgeList } from './HakiSymbols';
import CharacterAvatar from './CharacterAvatar';

interface ComparisonTableProps {
  guesses: GuessComparison[];
  theme?: 'dark' | 'light';
}

export default function ComparisonTable({ guesses, theme = 'dark' }: ComparisonTableProps) {
  if (!guesses || guesses.length === 0) return null;
  const isDark = theme === 'dark';

  const getCellStyle = (status: string, isLatest: boolean) => {
    let base = '';
    switch (status) {
      case 'correct':
        base = 'bg-green-600 text-white border-green-400/90 shadow-md';
        if (isLatest) base += ' glow-correct';
        break;
      case 'partial':
        base = 'bg-amber-600 text-white border-amber-300/90 shadow-md';
        if (isLatest) base += ' glow-partial';
        break;
      case 'higher':
      case 'lower':
      case 'earlier':
      case 'later':
      case 'incorrect':
        base = 'bg-red-600 text-white border-red-400/80 shadow-md';
        break;
      default:
        base = isDark
          ? 'bg-slate-800 text-slate-200 border-slate-600/80 shadow-sm'
          : 'bg-slate-600 text-white border-slate-400/80 shadow-sm';
    }
    return base;
  };

  const getAnimationClass = (isLatest: boolean) => {
    return isLatest ? 'animate-card-flip' : '';
  };

  const renderNumericCell = (attr: { status: string; displayValue: string }, colIdx: number, isLatest: boolean) => {
    const isHigher = attr.status === 'higher' || attr.status === 'later';
    const isLower = attr.status === 'lower' || attr.status === 'earlier';

    return (
      <div
        style={isLatest ? { animationDelay: `${colIdx * 70}ms` } : undefined}
        className={`p-1.5 rounded-lg border flex flex-col items-center justify-center min-h-[54px] transition-transform ${getAnimationClass(isLatest)} ${getCellStyle(attr.status, isLatest)}`}
      >
        <div className="font-bold text-[11px] text-center leading-tight tracking-tight drop-shadow-sm">
          {attr.displayValue}
        </div>
        {isHigher && (
          <div className="flex items-center space-x-0.5 mt-0.5 text-amber-200 font-black text-[10px] animate-bounce">
            <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />
            <span>HIGHER</span>
          </div>
        )}
        {isLower && (
          <div className="flex items-center space-x-0.5 mt-0.5 text-amber-200 font-black text-[10px] animate-bounce">
            <ArrowDown className="w-3.5 h-3.5 stroke-[3]" />
            <span>LOWER</span>
          </div>
        )}
      </div>
    );
  };

  const renderTextCell = (attr: { status: string; displayValue: string }, colIdx: number, isLatest: boolean, subtext?: string) => {
    return (
      <div
        style={isLatest ? { animationDelay: `${colIdx * 70}ms` } : undefined}
        className={`p-1.5 rounded-lg border flex flex-col items-center justify-center min-h-[54px] transition-transform ${getAnimationClass(isLatest)} ${getCellStyle(attr.status, isLatest)}`}
      >
        <div className="font-bold text-[11px] text-center leading-tight break-words max-w-[110px] drop-shadow-sm">
          {attr.displayValue}
        </div>
        {subtext && (
          <div className="text-[9px] opacity-90 font-semibold text-center mt-0.5 leading-none">
            ({subtext})
          </div>
        )}
      </div>
    );
  };

  const renderDevilFruitCell = (
    fruitAttr: { status: string; displayValue: string },
    typeAttr: { status: string; displayValue: string },
    colIdx: number,
    isLatest: boolean
  ) => {
    const typeHeading = typeAttr.displayValue;
    const fruitName = fruitAttr.displayValue;
    const cellStatus = fruitAttr.status === 'correct' ? 'correct' : (fruitAttr.status === 'partial' ? 'partial' : typeAttr.status);

    return (
      <div
        style={isLatest ? { animationDelay: `${colIdx * 70}ms` } : undefined}
        className={`p-1.5 rounded-lg border flex flex-col items-center justify-center min-h-[54px] transition-transform ${getAnimationClass(isLatest)} ${getCellStyle(cellStatus, isLatest)}`}
      >
        <div className="font-bold text-[11px] text-center leading-tight break-words max-w-[120px] drop-shadow-sm">
          {typeHeading}
        </div>
        {fruitName && fruitName !== 'None' && fruitName !== 'Unknown' && (
          <div className="text-[9.5px] opacity-90 font-semibold text-center mt-0.5 leading-tight break-words max-w-[120px] text-amber-100">
            ({fruitName})
          </div>
        )}
      </div>
    );
  };

  const renderHakiCell = (attr: { status: string; displayValue: string }, colIdx: number, isLatest: boolean) => {
    return (
      <div
        style={isLatest ? { animationDelay: `${colIdx * 70}ms` } : undefined}
        className={`p-1.5 rounded-lg border flex flex-col items-center justify-center min-h-[54px] transition-transform ${getAnimationClass(isLatest)} ${getCellStyle(attr.status, isLatest)}`}
      >
        <HakiBadgeList hakiDisplayValue={attr.displayValue} />
      </div>
    );
  };

  const renderDebutCell = (attr: { status: string; displayValue: string }, colIdx: number, isLatest: boolean) => {
    const raw = attr.displayValue || 'Unknown';
    const match = raw.match(/^(.*?)\s*\((.*?)\)$/);

    if (match) {
      const chapterPart = match[1];
      const arcPart = match[2];
      return (
        <div
          style={isLatest ? { animationDelay: `${colIdx * 70}ms` } : undefined}
          className={`p-1.5 rounded-lg border flex flex-col items-center justify-center min-h-[54px] transition-transform ${getAnimationClass(isLatest)} ${getCellStyle(attr.status, isLatest)}`}
        >
          <div className="font-bold text-[11px] text-center leading-tight drop-shadow-sm">
            {chapterPart}
          </div>
          <div className="text-[9.5px] opacity-90 font-bold text-center mt-0.5 leading-tight text-amber-200">
            ({arcPart})
          </div>
        </div>
      );
    }

    return (
      <div
        style={isLatest ? { animationDelay: `${colIdx * 70}ms` } : undefined}
        className={`p-1.5 rounded-lg border flex flex-col items-center justify-center min-h-[54px] transition-transform ${getAnimationClass(isLatest)} ${getCellStyle(attr.status, isLatest)}`}
      >
        <div className="font-bold text-[11px] text-center leading-tight break-words max-w-[110px]">
          {raw}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-amber-600/30 parchment-panel p-3 shadow-2xl">
      <table className="w-full text-xs text-center border-separate border-spacing-1.5">
        <thead>
          <tr className={`font-extrabold uppercase tracking-wider text-[11px] ${
            isDark ? 'text-amber-400' : 'text-slate-700'
          }`}>
            <th className="p-2 min-w-[110px]">Character</th>
            <th className="p-2 min-w-[70px]">Gender</th>
            <th className="p-2 min-w-[70px]">Race</th>
            <th className="p-2 min-w-[120px]">Affiliation</th>
            <th className="p-2 min-w-[70px]">Status</th>
            <th className="p-2 min-w-[130px]">Devil Fruit</th>
            <th className="p-2 min-w-[90px]">Haki</th>
            <th className="p-2 min-w-[85px]">Bounty</th>
            <th className="p-2 min-w-[65px]">Age</th>
            <th className="p-2 min-w-[65px]">Height</th>
            <th className="p-2 min-w-[95px]">Debut</th>
            <th className="p-2 min-w-[90px]">Origin</th>
          </tr>
        </thead>
        <tbody className="divide-y-0">
          {guesses.map((g, idx) => {
            const isLatest = idx === 0;

            return (
              <tr key={g.character.id}>
                {/* 0. Character Portrait & Name */}
                <td>
                  <div
                    style={isLatest ? { animationDelay: '0ms' } : undefined}
                    className={`p-1.5 rounded-lg border flex flex-col items-center justify-center min-h-[54px] transition-transform ${getAnimationClass(isLatest)} ${
                      isDark ? 'bg-slate-900 border-amber-600/50 text-slate-100 shadow-md' : 'bg-white border-slate-300 text-slate-800 shadow-sm'
                    }`}
                  >
                    <CharacterAvatar
                      src={g.character.image_url}
                      name={g.character.name}
                      size="md"
                      className="mb-1"
                    />
                    <div className="font-extrabold text-[11px] leading-tight text-center max-w-[100px] truncate">
                      {g.character.name}
                    </div>
                  </div>
                </td>

                {/* 1. Gender */}
                <td>{renderTextCell(g.gender, 1, isLatest)}</td>

                {/* 2. Race */}
                <td>{renderTextCell(g.race, 2, isLatest)}</td>

                {/* 3. Affiliation */}
                <td>{renderTextCell(g.affiliation, 3, isLatest)}</td>

                {/* 4. Status */}
                <td>{renderTextCell(g.status, 4, isLatest)}</td>

                {/* 5. Devil Fruit */}
                <td>{renderDevilFruitCell(g.devilFruit, g.devilFruitType, 5, isLatest)}</td>

                {/* 6. Haki */}
                <td>{renderHakiCell(g.haki, 6, isLatest)}</td>

                {/* 7. Bounty */}
                <td>{renderNumericCell(g.bounty, 7, isLatest)}</td>

                {/* 8. Age */}
                <td>{renderNumericCell(g.age, 8, isLatest)}</td>

                {/* 9. Height */}
                <td>{renderNumericCell(g.height, 9, isLatest)}</td>

                {/* 10. Debut */}
                <td>{renderDebutCell(g.firstAppearance, 10, isLatest)}</td>

                {/* 11. Origin */}
                <td>{renderTextCell(g.origin, 11, isLatest)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
