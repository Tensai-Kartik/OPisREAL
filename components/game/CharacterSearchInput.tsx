'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  aliases?: string[];
  matchedAlias?: string;
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
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(true);
      fetch(`/api/game/search?q=${encodeURIComponent(query.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results || []);
          setIsOpen(true);
          setSelectedIndex(-1);
        })
        .catch(() => setResults([]))
        .finally(() => setIsLoading(false));
    }, 180);

    return () => clearTimeout(timer);
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
      return;
    }

    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
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
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a character name, alias, or epithet..."
          className={`w-full pl-12 pr-28 py-3.5 border-2 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-4 shadow-2xl text-base backdrop-blur-md transition-all font-semibold ${
            isDark
              ? 'bg-slate-900/95 border-amber-600/50 text-slate-100 focus:border-amber-400 focus:ring-amber-500/20'
              : 'bg-white/95 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-amber-500/20 shadow-slate-200/60'
          }`}
        />
        <div className="absolute left-4 text-amber-500 pointer-events-none">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </div>
        <button
          onClick={() => {
            if (results.length > 0) {
              const target = selectedIndex >= 0 ? results[selectedIndex] : results[0];
              handleSelect(target);
            }
          }}
          disabled={disabled || !query.trim() || results.length === 0}
          className="absolute right-2 px-4 py-2 gold-button rounded-lg text-xs font-black uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95 transition-all shrink-0"
        >
          GUESS
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 border rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl max-h-80 overflow-y-auto ${
          isDark ? 'bg-slate-900/95 border-amber-600/50' : 'bg-white border-slate-200 shadow-slate-300/40'
        }`}>
          {results.length === 0 ? (
            <div className={`p-3 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              No matching characters found.
            </div>
          ) : (
            results.map((item, idx) => {
              const isAlreadyGuessed = guessedIds.includes(item.id);
              const isSelected = idx === (selectedIndex >= 0 ? selectedIndex : 0);
              const aliasDisplay = item.aliases && item.aliases.length > 0 ? item.aliases.join(', ') : item.matchedAlias;

              return (
                <div
                  key={item.id}
                  onClick={() => !isAlreadyGuessed && handleSelect(item)}
                  className={`flex items-center justify-between p-3 border-b cursor-pointer transition-colors ${
                    isDark
                      ? `border-slate-800/80 ${isSelected ? 'bg-amber-950/60 text-amber-300 border-l-4 border-l-amber-500' : 'hover:bg-slate-800/60'}`
                      : `border-slate-100 ${isSelected ? 'bg-slate-100 text-slate-900 border-l-4 border-l-amber-500 font-bold' : 'hover:bg-slate-50 text-slate-900'}`
                  } ${isAlreadyGuessed ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
                    <CharacterAvatar
                      src={item.image_url}
                      name={item.name}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm ${isDark ? 'font-extrabold text-slate-100' : 'font-extrabold text-slate-900'} truncate`}>
                        {item.name}
                      </div>
                      {aliasDisplay && (
                        <div className={`text-[11px] font-semibold truncate ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                          <span className="opacity-75">Alias:</span> {aliasDisplay}
                        </div>
                      )}
                    </div>
                  </div>
                  {isAlreadyGuessed && (
                    <span className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded font-semibold shrink-0">
                      Guessed
                    </span>
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
