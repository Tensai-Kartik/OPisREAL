'use client';

import React, { useState } from 'react';

interface CharacterAvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function CharacterAvatar({
  src,
  name,
  size = 'md',
  className = '',
}: CharacterAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Size mapping
  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-32 h-32 text-3xl',
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

  return (
    <img
      src={src}
      alt={name}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={`shrink-0 rounded-lg object-cover object-top border border-amber-600/40 bg-slate-950 shadow-sm ${sizeClasses[size]} ${className}`}
    />
  );
}
