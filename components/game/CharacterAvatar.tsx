'use client';

import React, { useState, useEffect } from 'react';
import { Character } from '@/types/character';
import CharacterHoverCard from './CharacterHoverCard';

export interface CharacterAvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  fit?: 'cover' | 'contain';
  character?: Partial<Character> | null;
  description?: string | null;
  showTooltip?: boolean;
}

export default function CharacterAvatar({
  src,
  name,
  size = 'md',
  className = '',
  fit = 'cover',
  character,
  description,
  showTooltip = false,
}: CharacterAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error when src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  // Size mapping
  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-32 h-32 text-3xl',
    '2xl': 'w-48 h-64 text-4xl',
  };

  const initial = (name || 'OP')
    .trim()
    .charAt(0)
    .toUpperCase();

  const avatarElement = (!src || hasError) ? (
    <div
      className={`shrink-0 rounded-lg flex items-center justify-center font-black select-none border border-amber-600/40 shadow-inner bg-gradient-to-br from-amber-900/90 via-slate-900 to-amber-950 text-amber-300 transition-all duration-200 group-hover:scale-105 group-hover:border-amber-400/80 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.35)] ${sizeClasses[size]} ${className}`}
      title={showTooltip ? undefined : name}
    >
      <span>{initial}</span>
    </div>
  ) : (
    <div
      className={`shrink-0 relative overflow-hidden rounded-lg border border-amber-600/40 bg-slate-950 shadow-sm flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:border-amber-400/80 group-hover:shadow-[0_0_14px_rgba(245,158,11,0.4)] ${sizeClasses[size]} ${className}`}
    >
      {fit === 'contain' && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 scale-110 pointer-events-none"
        />
      )}
      <img
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setHasError(true)}
        className={`relative z-10 w-full h-full transition-transform duration-300 group-hover:scale-110 ${
          fit === 'contain' ? 'object-contain p-0.5' : 'object-cover object-top'
        }`}
      />
    </div>
  );

  if (showTooltip) {
    return (
      <CharacterHoverCard
        character={character}
        name={name}
        imageUrl={src}
        description={description || character?.description}
      >
        {avatarElement}
      </CharacterHoverCard>
    );
  }

  return avatarElement;
}
