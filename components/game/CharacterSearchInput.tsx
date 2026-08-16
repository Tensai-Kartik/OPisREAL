'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  alias?: string | null;
  matchedAlias?: string | null;
  japanese_name?: string | null;
  description?: string | null;
  bounty?: number | null;
  origin?: string | null;
  first_arc?: string | null;
  first_appearance?: string | null;
  devil_fruit_name?: string | null;
  devil_fruit_type?: string | null;
  race?: string | null;
  status?: string | null;
}

interface CharacterSearchInputProps {
  onSelectCharacter: (id: string) => void;
  guessedIds: string[];
  disabled?: boolean;
  theme?: 'dark' | 'light';
}

export default function CharacterSearchInput({
  onSelectCharacter,
  guessedIds,
  disabled = false,
  theme = 'dark',
}: CharacterSearchInputProps) {
  const isDark = theme === 'dark';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    let active = true;

    const timer = setTimeout(() => {
      setIsLoading(true);
      fetch(`/api/game/search?q=${encodeURIComponent(trimmed)}`)
        .then((res) => res.json())
        .then((data) => {
          if (active) {
            setResults(data.results || []);
            setIsOpen(true);
            setSelectedIndex(-1);
          }
        })
        .catch(() => {
          if (active) {
            setResults([]);
          }
        })
        .finally(() => {
          if (active) {
            setIsLoading(false);
          }
        });
    }, 120);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: SearchResult) => {
    if (guessedIds.includes(item.id)) return;
    onSelectCharacter(item.id);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        const target = selectedIndex >= 0 && selectedIndex < results.length ? results[selectedIndex] : results[0];
        handleSelect(target);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={dropdownRef}>
      <div className="relative flex items-center group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a character name, alias, or epithet..."
          className={`w-full pl-12 pr-28 py-3.5 border-2 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-4 shadow-2xl text-base backdrop-blur-md transition-all duration-200 font-semibold ${
            isDark
              ? 'bg-slate-900/95 border-amber-600/50 text-slate-100 focus:border-amber-400 focus:ring-amber-500/25 focus:shadow-[0_0_24px_rgba(245,158,11,0.25)]'
              : 'bg-white/95 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-amber-500/25 focus:shadow-[0_0_20px_rgba(245,158,11,0.2)] shadow-slate-200/60'
          }`}
        />
        <div className="absolute left-4 text-amber-500 pointer-events-none transition-transform duration-200 group-focus-within:scale-110">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-amber-400" /> : <Search className="w-5 h-5" />}
        </div>
        <button
          onClick={() => {
            if (results.length > 0) {
              const target = selectedIndex >= 0 ? results[selectedIndex] : results[0];
              handleSelect(target);
            }
          }}
          disabled={disabled || !query.trim() || results.length === 0}
          className="absolute right-2 px-4 py-2 gold-button rounded-lg text-xs font-black uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95 transition-all shrink-0 flex items-center space-x-1"
        >
          <span>GUESS</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 border rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-2xl max-h-84 overflow-y-auto animate-fadeIn ${
          isDark ? 'bg-slate-900/98 border-amber-600/60 shadow-[0_16px_36px_rgba(0,0,0,0.8)]' : 'bg-white/98 border-slate-200 shadow-slate-300/50'
        }`}>
          {results.length === 0 ? (
            <div className={`p-4 text-center text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              No matching characters found in canon database.
            </div>
          ) : (
            results.map((item, idx) => {
              const isAlreadyGuessed = guessedIds.includes(item.id);
              const isSelected = idx === (selectedIndex >= 0 ? selectedIndex : 0);
              const displayAlias = item.matchedAlias ? `"${item.matchedAlias}"` : item.alias;

              return (
                <div
                  key={item.id}
                  onClick={() => !isAlreadyGuessed && handleSelect(item)}
                  className={`w-full flex items-center justify-between p-3 border-b cursor-pointer transition-all duration-150 group/item ${
                    isDark
                      ? `border-slate-800/70 ${
                          isSelected
                            ? 'bg-amber-950/70 text-amber-300 border-l-4 border-l-amber-400 shadow-inner'
                            : 'hover:bg-slate-800/70 hover:translate-x-1 hover:border-l-4 hover:border-l-amber-500/70'
                        }`
                      : `border-slate-100 ${
                          isSelected
                            ? 'bg-amber-50 text-amber-900 border-l-4 border-l-amber-500 font-bold'
                            : 'hover:bg-slate-50 text-slate-900 hover:translate-x-1'
                        }`
                  } ${isAlreadyGuessed ? 'opacity-40 cursor-not-allowed hover:translate-x-0' : ''}`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2 text-left">
                    <CharacterAvatar
                      src={item.image_url}
                      name={item.name}
                      size="md"
                      className="group-hover/item:border-amber-400 group-hover/item:shadow-md"
                    />
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm truncate flex items-center space-x-2 ${
                        isDark ? 'font-extrabold text-slate-100 group-hover/item:text-amber-300' : 'font-extrabold text-slate-900 group-hover/item:text-amber-800'
                      }`}>
                        <span>{item.name}</span>
                        {item.bounty && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-md font-bold shrink-0">
                            {item.bounty.toLocaleString()} ฿
                          </span>
                        )}
                      </div>
                      {displayAlias && (
                        <div className={`text-[11px] font-semibold truncate ${isDark ? 'text-amber-400/90' : 'text-amber-600'}`}>
                          Alias: {displayAlias}
                        </div>
                      )}
                    </div>
                  </div>
                  {isAlreadyGuessed ? (
                    <span className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded font-semibold shrink-0">
                      Guessed
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-amber-500/50 group-hover/item:text-amber-400 group-hover/item:translate-x-0.5 transition-all shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
