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

  const getCellStyle = (status: string) => {
    switch (status) {
      case 'correct':
        return 'bg-green-600 text-white border-green-500/80 shadow-sm';
      case 'partial':
        return 'bg-amber-600 text-white border-amber-400/80 shadow-sm';
      case 'higher':
      case 'lower':
      case 'earlier':
      case 'later':
      case 'incorrect':
        return 'bg-red-600 text-white border-red-500/80 shadow-sm';
      default:
        return isDark
          ? 'bg-slate-700 text-slate-200 border-slate-500/80 shadow-sm'
          : 'bg-slate-600 text-white border-slate-400/80 shadow-sm';
    }
  };

  const renderNumericCell = (attr: { status: string; displayValue: string }) => {
    const isHigher = attr.status === 'higher' || attr.status === 'later';
    const isLower = attr.status === 'lower' || attr.status === 'earlier';

    return (
      <div className={`p-1.5 rounded-md border flex flex-col items-center justify-center min-h-[52px] ${getCellStyle(attr.status)}`}>
        <div className="font-semibold text-[11px] text-center leading-tight tracking-tight">
          {attr.displayValue}
        </div>
        {isHigher && (
          <div className="flex items-center space-x-0.5 mt-0.5 text-amber-300 font-bold text-[10px] animate-bounce">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            <span>HIGHER</span>
          </div>
        )}
        {isLower && (
          <div className="flex items-center space-x-0.5 mt-0.5 text-amber-300 font-bold text-[10px] animate-bounce">
            <ArrowDown className="w-3 h-3 stroke-[2.5]" />
            <span>LOWER</span>
          </div>
        )}
      </div>
    );
  };

  const renderTextCell = (attr: { status: string; displayValue: string }, subtext?: string) => {
    return (
      <div className={`p-1.5 rounded-md border flex flex-col items-center justify-center min-h-[52px] ${getCellStyle(attr.status)}`}>
        <div className="font-semibold text-[11px] text-center leading-tight break-words max-w-[110px]">
          {attr.displayValue}
        </div>
        {subtext && (
          <div className="text-[9px] opacity-90 font-medium text-center mt-0.5 leading-none">
            ({subtext})
          </div>
        )}
      </div>
    );
  };

  const renderDevilFruitCell = (fruitAttr: { status: string; displayValue: string }, typeAttr: { status: string; displayValue: string }) => {
    const typeHeading = typeAttr.displayValue;
    const fruitName = fruitAttr.displayValue;
    const cellStatus = fruitAttr.status === 'correct' ? 'correct' : (fruitAttr.status === 'partial' ? 'partial' : typeAttr.status);

    return (
      <div className={`p-1.5 rounded-md border flex flex-col items-center justify-center min-h-[52px] ${getCellStyle(cellStatus)}`}>
        <div className="font-bold text-[11px] text-center leading-tight break-words max-w-[120px]">
          {typeHeading}
        </div>
        {fruitName && fruitName !== 'None' && fruitName !== 'Unknown' && (
          <div className="text-[9.5px] opacity-90 font-medium text-center mt-0.5 leading-tight break-words max-w-[120px]">
            ({fruitName})
          </div>
        )}
      </div>
    );
  };

  const renderHakiCell = (attr: { status: string; displayValue: string }) => {
    return (
      <div className={`p-1.5 rounded-md border flex flex-col items-center justify-center min-h-[52px] ${getCellStyle(attr.status)}`}>
        <HakiBadgeList hakiDisplayValue={attr.displayValue} />
      </div>
    );
  };

  const renderDebutCell = (attr: { status: string; displayValue: string }) => {
    const raw = attr.displayValue || 'Unknown';
    const match = raw.match(/^(.*?)\s*\((.*?)\)$/);

    if (match) {
      const chapterPart = match[1];
      const arcPart = match[2];
      return (
        <div className={`p-1.5 rounded-md border flex flex-col items-center justify-center min-h-[52px] ${getCellStyle(attr.status)}`}>
          <div className="font-bold text-[11px] text-center leading-tight">
            {chapterPart}
          </div>
          <div className="text-[9.5px] opacity-90 font-semibold text-center mt-0.5 leading-tight text-amber-200">
            ({arcPart})
          </div>
        </div>
      );
    }

    return (
      <div className={`p-1.5 rounded-md border flex flex-col items-center justify-center min-h-[52px] ${getCellStyle(attr.status)}`}>
        <div className="font-semibold text-[11px] text-center leading-tight break-words max-w-[110px]">
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
              <tr key={g.character.id} className={isLatest ? 'animate-fadeIn' : ''}>
                {/* Character Portrait & Name */}
                <td>
                  <div className={`p-1.5 rounded-md border flex flex-col items-center justify-center min-h-[52px] ${
                    isDark ? 'bg-slate-900 border-amber-600/40 text-slate-100' : 'bg-white border-slate-300 text-slate-800'
                  }`}>
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

                {/* Gender */}
                <td>{renderTextCell(g.gender)}</td>

                {/* Race */}
                <td>{renderTextCell(g.race)}</td>

                {/* Affiliation */}
                <td>{renderTextCell(g.affiliation)}</td>

                {/* Status */}
                <td>{renderTextCell(g.status)}</td>

                {/* Devil Fruit (Fruit Type as Main Heading, Fruit Name in Braces) */}
                <td>{renderDevilFruitCell(g.devilFruit, g.devilFruitType)}</td>

                {/* Haki */}
                <td>{renderHakiCell(g.haki)}</td>

                {/* Bounty */}
                <td>{renderNumericCell(g.bounty)}</td>

                {/* Age */}
                <td>{renderNumericCell(g.age)}</td>

                {/* Height */}
                <td>{renderNumericCell(g.height)}</td>

                {/* Debut */}
                <td>{renderDebutCell(g.firstAppearance)}</td>

                {/* Origin */}
                <td>{renderTextCell(g.origin)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
