'use client';

import React, { useState, useEffect } from 'react';

interface CharacterAvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  fit?: 'cover' | 'contain';
}

export default function CharacterAvatar({
  src,
  name,
  size = 'md',
  className = '',
  fit = 'cover',
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

  // If no source or failed to load, render fallback avatar
  if (!src || hasError) {
    return (
      <div
        className={`shrink-0 rounded-lg flex items-center justify-center font-black select-none border border-amber-600/40 shadow-inner bg-gradient-to-br from-amber-900/90 via-slate-900 to-amber-950 text-amber-300 ${sizeClasses[size]} ${className}`}
        title={name}
      >
        <span>{initial}</span>
      </div>
    );
  }

  const fitClass = fit === 'contain' ? 'object-contain p-0.5' : 'object-cover object-top';

  return (
    <div className={`shrink-0 relative overflow-hidden rounded-lg border border-amber-600/40 bg-slate-950 shadow-sm flex items-center justify-center ${sizeClasses[size]} ${className}`}>
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
        className={`relative z-10 w-full h-full ${fitClass}`}
      />
    </div>
  );
}
