import React from 'react';

export function getHakiSymbol(hakiType: string) {
  const lower = hakiType.toLowerCase();
  if (lower.includes('observation') || lower.includes('kenbunshoku')) {
    return { symbol: '👁️', label: 'Observation', code: 'OBS' };
  }
  if (lower.includes('armament') || lower.includes('busoshoku')) {
    return { symbol: '🛡️', label: 'Armament', code: 'ARM' };
  }
  if (lower.includes('conqueror') || lower.includes('haoshoku')) {
    return { symbol: '👑', label: 'Conqueror', code: 'CONQ' };
  }
  return { symbol: '⚡', label: hakiType, code: 'OTH' };
}

export function HakiBadgeList({ hakiDisplayValue }: { hakiDisplayValue: string }) {
  if (!hakiDisplayValue || hakiDisplayValue === 'None' || hakiDisplayValue === 'Unknown') {
    return <span className="font-semibold text-[11px] text-center">None</span>;
  }

  // Deduplicate Haki items to avoid duplicates
  const rawItems = hakiDisplayValue.split(',').map((s) => s.trim()).filter(Boolean);
  const items = Array.from(new Set(rawItems));

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 my-0.5">
      {items.map((item, idx) => {
        const info = getHakiSymbol(item);
        return (
          <span
            key={idx}
            className="inline-flex items-center space-x-0.5 px-1 py-0.5 bg-slate-900/90 border border-amber-400/40 rounded text-[10px] font-bold text-amber-200 shadow-sm"
            title={info.label}
          >
            <span>{info.symbol}</span>
            <span>{info.code}</span>
          </span>
        );
      })}
    </div>
  );
}
