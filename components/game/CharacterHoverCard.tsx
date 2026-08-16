'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Character } from '@/types/character';
import { Sparkles, Cake, Droplet } from 'lucide-react';

export interface CharacterHoverCardProps {
  character?: Partial<Character> | null;
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  japaneseName?: string | null;
  alias?: string | null;
  birthday?: string | null;
  bloodType?: string | null;
  children: ReactNode;
  disabled?: boolean;
}

export default function CharacterHoverCard({
  character,
  name: propName,
  description: propDesc,
  imageUrl: propImageUrl,
  japaneseName: propJapName,
  alias: propAlias,
  birthday: propBirthday,
  bloodType: propBloodType,
  children,
  disabled = false,
}: CharacterHoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    arrowLeft: number;
    placement: 'top' | 'bottom';
  }>({
    top: 0,
    left: 0,
    arrowLeft: 160,
    placement: 'top',
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const name = character?.name || propName || 'Unknown Character';
  const description = character?.description || propDesc;
  const imageUrl = character?.image_url || propImageUrl;
  const japaneseName = character?.japanese_name || propJapName;
  const alias = character?.alias || propAlias;
  const birthday = character?.birthday || propBirthday;
  const bloodType = character?.blood_type || propBloodType;

  // Generate a clean fallback lore description if none provided in DB
  const getDisplayDescription = () => {
    if (description && description.trim().length > 0) {
      return description.trim();
    }

    const parts: string[] = [];
    if (character?.race && character.race !== 'Unknown') parts.push(character.race);
    if (character?.occupations && character.occupations.length > 0) {
      parts.push(character.occupations.join('/'));
    } else {
      parts.push('pirate/lore figure');
    }

    const affiliation = character?.affiliations && character.affiliations.length > 0
      ? ` of the ${character.affiliations.join(', ')}`
      : '';

    const originText = character?.origin && character.origin !== 'Unknown'
      ? ` from ${character.origin}`
      : '';

    return `${name} is a ${parts.join(' ')}${affiliation}${originText}.`;
  };

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const cardWidth = Math.min(320, window.innerWidth - 32);
    const cardEstimatedHeight = 190;

    // Check vertical placement: if room above the element, show above; otherwise below
    const showAbove = rect.top >= cardEstimatedHeight + 16;
    const placement = showAbove ? 'top' : 'bottom';

    let left = rect.left + rect.width / 2 - cardWidth / 2;
    if (left < 16) left = 16;
    if (left + cardWidth > window.innerWidth - 16) {
      left = window.innerWidth - cardWidth - 16;
    }

    const top = showAbove
      ? Math.max(12, rect.top - 10)
      : Math.min(window.innerHeight - cardEstimatedHeight - 12, rect.bottom + 10);

    const arrowLeft = Math.max(18, Math.min(cardWidth - 18, rect.left + rect.width / 2 - left));

    setCoords({ top, left, arrowLeft, placement });
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsOpen(true);
    }, 120);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative inline-flex items-center justify-center cursor-pointer group w-full"
      >
        {children}
      </div>

      {mounted &&
        isOpen &&
        createPortal(
          <div
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: coords.placement === 'top' ? 'translateY(-100%)' : 'translateY(0)',
            }}
            className="fixed z-[99999] pointer-events-none w-[320px] max-w-[calc(100vw-32px)] animate-tooltip-pop"
          >
            <div className="relative rounded-2xl border-2 border-amber-500/70 bg-slate-950/95 backdrop-blur-2xl p-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.85),0_0_24px_rgba(245,158,11,0.25)] text-slate-100 space-y-2.5 overflow-hidden">
              {/* Subtle ambient gradient sheen */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

              {/* Header: Portrait + Name + Japanese/Alias */}
              <div className="flex items-center space-x-3 border-b border-amber-600/30 pb-2.5">
                {imageUrl && (
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-amber-500/80 shrink-0 bg-slate-900 shadow-md">
                    <img
                      src={imageUrl}
                      alt={name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-sm text-amber-300 truncate leading-tight drop-shadow-sm">
                    {name}
                  </h4>
                  {japaneseName && (
                    <div className="text-[10.5px] text-slate-400 font-medium truncate">
                      {japaneseName}
                    </div>
                  )}
                  {alias && (
                    <div className="text-[10.5px] text-amber-400/90 font-semibold italic truncate">
                      &ldquo;{alias}&rdquo;
                    </div>
                  )}
                </div>
              </div>

              {/* Lore / Description Box */}
              <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800 text-xs text-slate-200 leading-relaxed relative">
                <div className="flex items-start space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="line-clamp-3 text-[11.5px] text-slate-300 font-medium">
                    {getDisplayDescription()}
                  </p>
                </div>
              </div>

              {/* Birthday & Blood Type Row */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Birthday */}
                <div className="flex items-center space-x-2 bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <Cake className="w-4 h-4 text-pink-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Birthday</span>
                    <span className="truncate font-extrabold text-amber-300 block text-[11px]">
                      {birthday || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Blood Type */}
                <div className="flex items-center space-x-2 bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <Droplet className="w-4 h-4 text-red-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Blood Type</span>
                    <span className="truncate font-extrabold text-amber-300 block text-[11px]">
                      {bloodType ? `Type ${bloodType}` : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Indicator Arrow */}
              <div
                style={{ left: `${coords.arrowLeft}px` }}
                className={`absolute -translate-x-1/2 w-3 h-3 bg-slate-950 border-amber-500/70 rotate-45 ${
                  coords.placement === 'top'
                    ? '-bottom-1.5 border-b-2 border-r-2'
                    : '-top-1.5 border-t-2 border-l-2'
                }`}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
