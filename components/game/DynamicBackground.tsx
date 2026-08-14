'use client';

import { useEffect, useState } from 'react';
import { getRandomBackground, GameBackground, ALL_BACKGROUNDS } from '@/lib/game/backgrounds';

interface DynamicBackgroundProps {
  theme?: 'dark' | 'light';
}

export default function DynamicBackground({ theme = 'dark' }: DynamicBackgroundProps) {
  const [bg, setBg] = useState<GameBackground>(ALL_BACKGROUNDS[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeUrl, setActiveUrl] = useState(ALL_BACKGROUNDS[0].file);

  useEffect(() => {
    const selected = getRandomBackground();
    setBg(selected);

    // Try loading local file first (or Supabase URL if configured)
    const img = new window.Image();
    img.src = selected.file;
    img.onload = () => {
      setActiveUrl(selected.file);
      setIsLoaded(true);
    };
    img.onerror = () => {
      // Fallback to Supabase URL if local fails
      const fallbackImg = new window.Image();
      fallbackImg.src = selected.supabaseUrl;
      fallbackImg.onload = () => {
        setActiveUrl(selected.supabaseUrl);
        setIsLoaded(true);
      };
      fallbackImg.onerror = () => {
        // Fallback to default bg1
        setActiveUrl('/backgrounds/bg1.jpg');
        setIsLoaded(true);
      };
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
      {/* Background artwork — highlighted & prominently visible */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat scale-100 transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${activeUrl})`,
          filter: isDark ? 'brightness(0.92) contrast(1.05)' : 'brightness(0.96) contrast(1.02)',
        }}
      />

      {/* Fallback subtle atmosphere gradient during initial load */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
        }}
      />

      {/* Dark mode: Subtle cinematic contrast overlay — leaves art fully visible & highlighted */}
      {isDark && (
        <>
          <div className="absolute inset-0 bg-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/15 to-slate-950/65" />
        </>
      )}

      {/* Light mode: Clean neutral contrast — preserves original background colors */}
      {!isDark && (
        <>
          <div className="absolute inset-0 bg-white/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-slate-100/60" />
        </>
      )}

      {/* Gentle bottom edge blend */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(to top, rgba(2,6,23,0.75) 0%, transparent 100%)'
            : 'linear-gradient(to top, rgba(248,250,252,0.8) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
