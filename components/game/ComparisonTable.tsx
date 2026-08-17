'use client';

import { GuessComparison } from '@/types/game';
import { parseDebutDisplay } from '@/lib/game/debutHelper';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import { HakiBadgeList } from './HakiSymbols';
import CharacterAvatar from './CharacterAvatar';
import CharacterHoverCard from './CharacterHoverCard';

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
        base = 'bg-green-600 text-white border-green-400/90 shadow-md hover:shadow-[0_0_16px_rgba(34,197,94,0.65)] hover:border-green-300';
        if (isLatest) base += ' glow-correct';
        break;
      case 'partial':
        base = 'bg-amber-600 text-white border-amber-300/90 shadow-md hover:shadow-[0_0_16px_rgba(245,158,11,0.65)] hover:border-amber-200';
        if (isLatest) base += ' glow-partial';
        break;
      case 'higher':
      case 'lower':
      case 'earlier':
      case 'later':
      case 'incorrect':
        base = 'bg-red-600 text-white border-red-400/80 shadow-md hover:shadow-[0_0_16px_rgba(239,68,68,0.55)] hover:border-red-300';
        break;
      default:
        base = isDark
          ? 'bg-slate-800 text-slate-200 border-slate-600/80 shadow-sm hover:border-slate-400'
          : 'bg-slate-600 text-white border-slate-400/80 shadow-sm hover:border-slate-300';
    }
    return base;
  };

  const getAnimationClass = (isLatest: boolean) => {
    return isLatest ? 'animate-card-flip' : '';
  };

  const renderTextCell = (attr: { status: string; displayValue: string }, colIdx: number, isLatest: boolean) => {
    return (
      <div
        style={isLatest ? { animationDelay: `${colIdx * 70}ms` } : undefined}
        className={`interactive-cell p-1.5 rounded-lg border flex items-center justify-center min-h-[54px] transition-all duration-200 ${getAnimationClass(isLatest)} ${getCellStyle(attr.status, isLatest)}`}
      >
        <div className="font-bold text-[11px] text-center leading-tight break-words max-w-[110px]">
          {attr.displayValue || 'Unknown'}
        </div>
      </div>
    );
  };

  const renderNumericCell = (attr: { status: string; displayValue: string }, colIdx: number, isLatest: boolean) => {
    const isHigher = attr.status === 'higher' || attr.status === 'later';
    const isLower = attr.status === 'lower' || attr.status === 'earlier';

    return (
      <div
        style={isLatest ? { animationDelay: `${colIdx * 70}ms` } : undefined}
        className={`interactive-cell p-1.5 rounded-lg border flex flex-col items-center justify-center min-h-[54px] relative transition-all duration-200 ${getAnimationClass(isLatest)} ${getCellStyle(attr.status, isLatest)}`}
      >
        <div className="font-extrabold text-[11.5px] text-center leading-tight">
          {attr.displayValue}
        </div>
        {isHigher && (
          <div className="flex items-center text-[9.5px] font-black text-amber-200 mt-0.5 animate-bounce">
            <ArrowUp className="w-3 h-3 stroke-[3]" />
            <span>HIGHER</span>
          </div>
        )}
        {isLower && (
          <div className="flex items-center text-[9.5px] font-black text-amber-200 mt-0.5 animate-bounce">
            <ArrowDown className="w-3 h-3 stroke-[3]" />
            <span>LOWER</span>
          </div>
        )}
      </div>
    );
  };

  const renderDevilFruitCell = (
    fruitNameAttr: { status: string; displayValue: string },
    fruitTypeAttr: { status: string; displayValue: string },
    colIdx: number,
    isLatest: boolean
  ) => {
    const name = fruitNameAttr.displayValue;
    const type = fruitTypeAttr.displayValue;
    const isNone = name === 'None' || name === 'Unknown' || !name;
    const cellStatus = fruitNameAttr.status === 'correct' ? 'correct' : (fruitNameAttr.status === 'partial' ? 'partial' : fruitTypeAttr.status);

    return (
      <div
        style={isLatest ? { animationDelay: `${colIdx * 70}ms` } : undefined}
        className={`interactive-cell p-1.5 rounded-lg border flex flex-col items-center justify-center min-h-[54px] transition-all duration-200 ${getAnimationClass(isLatest)} ${getCellStyle(cellStatus, isLatest)}`}
      >
        <div className="font-bold text-[11px] text-center leading-tight break-words max-w-[125px]">
          {name || 'None'}
        </div>
        {!isNone && type && type !== 'None' && (
          <div className="text-[9.5px] opacity-90 font-medium text-center mt-0.5 leading-tight text-amber-200">
            ({type})
          </div>
        )}
      </div>
    );
  };

  const renderHakiCell = (attr: { status: string; displayValue: string }, colIdx: number, isLatest: boolean) => {
    return (
      <div
        style={isLatest ? { animationDelay: `${colIdx * 70}ms` } : undefined}
        className={`interactive-cell p-1.5 rounded-lg border flex flex-col items-center justify-center min-h-[54px] transition-all duration-200 ${getAnimationClass(isLatest)} ${getCellStyle(attr.status, isLatest)}`}
      >
        <HakiBadgeList hakiDisplayValue={attr.displayValue} />
      </div>
    );
  };

  const renderDebutCell = (
    attr: { status: string; displayValue: string },
    colIdx: number,
    isLatest: boolean,
    firstArc?: string | null
  ) => {
    const debut = parseDebutDisplay(attr.displayValue, firstArc);
    const isEarlier = attr.status === 'earlier' || attr.status === 'lower';
    const isLater = attr.status === 'later' || attr.status === 'higher';

    return (
      <div
        style={isLatest ? { animationDelay: `${colIdx * 70}ms` } : undefined}
        className={`interactive-cell p-1.5 rounded-lg border flex flex-col items-center justify-center min-h-[54px] relative transition-all duration-200 ${getAnimationClass(isLatest)} ${getCellStyle(attr.status, isLatest)}`}
      >
        <div className="font-extrabold text-[11.5px] text-center leading-tight drop-shadow-sm line-clamp-2 px-0.5">
          {debut.arcName}
        </div>
        {isEarlier && (
          <div className="flex items-center text-[9.5px] font-black text-amber-200 mt-0.5 animate-bounce">
            <ArrowDown className="w-3 h-3 stroke-[3]" />
            <span>LOWER</span>
          </div>
        )}
        {isLater && (
          <div className="flex items-center text-[9.5px] font-black text-amber-200 mt-0.5 animate-bounce">
            <ArrowUp className="w-3 h-3 stroke-[3]" />
            <span>HIGHER</span>
          </div>
        )}
        {!isEarlier && !isLater && debut.episodeText && (
          <div className="text-[9.5px] opacity-90 font-bold text-center mt-0.5 leading-tight text-amber-200">
            ({debut.episodeText})
          </div>
        )}
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
            <th className="p-2 min-w-[110px] group cursor-default">
              <span className="inline-flex items-center space-x-1">
                <span>Character</span>
                <Info className="w-3 h-3 text-amber-400/70 inline opacity-70 group-hover:opacity-100 transition-opacity" />
              </span>
            </th>
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
                {/* 0. Character Portrait & Name with Hover Lore Tooltip */}
                <td>
                  <CharacterHoverCard character={g.character}>
                    <div
                      style={isLatest ? { animationDelay: '0ms' } : undefined}
                      className={`interactive-cell p-1.5 rounded-lg border flex flex-col items-center justify-center min-h-[54px] w-full transition-all duration-200 group ${getAnimationClass(isLatest)} ${
                        isDark
                          ? 'bg-slate-900 border-amber-600/50 text-slate-100 shadow-md hover:border-amber-400 hover:shadow-[0_0_16px_rgba(245,158,11,0.35)]'
                          : 'bg-white border-slate-300 text-slate-800 shadow-sm hover:border-amber-500 hover:shadow-md'
                      }`}
                    >
                      <CharacterAvatar
                        src={g.character.image_url}
                        name={g.character.name}
                        size="md"
                        className="mb-1"
                      />
                      <div className="font-extrabold text-[11px] leading-tight text-center max-w-[100px] truncate group-hover:text-amber-400 transition-colors">
                        {g.character.name}
                      </div>
                    </div>
                  </CharacterHoverCard>
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
                <td>{renderDebutCell(g.firstAppearance, 10, isLatest, g.character?.first_arc)}</td>

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
