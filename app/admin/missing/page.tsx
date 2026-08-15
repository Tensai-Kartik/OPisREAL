'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HelpCircle, Edit3, Loader2, Search, Filter, Trash2, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { Character } from '@/types/character';
import CharacterAvatar from '@/components/game/CharacterAvatar';

export default function AdminMissingDataPage() {
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [query, setQuery] = useState('');
  const [missingFilter, setMissingFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 18;

  const loadMissingCharacters = () => {
    setIsLoading(true);
    fetch('/api/admin/characters?limit=2000')
      .then((res) => res.json())
      .then((data) => {
        const all = data.characters || [];
        const missing = all.filter(
          (c: Character) =>
            c.verification_status !== 'verified' &&
            ((c.bounty === null || c.bounty === undefined) ||
              !c.age ||
              !c.height ||
              !c.image_url ||
              c.devil_fruit_type === 'Unknown' ||
              !c.origin ||
              c.origin === 'Unknown' ||
              (!c.first_appearance && !c.first_arc) ||
              (!c.alias && !c.romanized_name))
        );
        setAllCharacters(missing);
        applyFilters(missing, query, missingFilter);
      })
      .catch(() => {
        setAllCharacters([]);
        setFilteredCharacters([]);
      })
      .finally(() => setIsLoading(false));
  };

  const applyFilters = (list: Character[], q: string, filter: string) => {
    let result = list;

    if (q.trim()) {
      const lower = q.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          (c.japanese_name && c.japanese_name.toLowerCase().includes(lower)) ||
          (c.alias && c.alias.toLowerCase().includes(lower)) ||
          (c.origin && c.origin.toLowerCase().includes(lower))
      );
    }

    if (filter === 'bounty') {
      result = result.filter((c) => c.bounty === null || c.bounty === undefined);
    } else if (filter === 'age') {
      result = result.filter((c) => !c.age);
    } else if (filter === 'height') {
      result = result.filter((c) => !c.height);
    } else if (filter === 'image') {
      result = result.filter((c) => !c.image_url);
    } else if (filter === 'fruit') {
      result = result.filter((c) => c.devil_fruit_type === 'Unknown');
    } else if (filter === 'origin') {
      result = result.filter((c) => !c.origin || c.origin === 'Unknown');
    } else if (filter === 'debut') {
      result = result.filter((c) => !c.first_appearance && !c.first_arc);
    } else if (filter === 'alias') {
      result = result.filter((c) => !c.alias && !c.romanized_name);
    }

    setFilteredCharacters(result);
    setPage(1);
  };

  useEffect(() => {
    loadMissingCharacters();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(allCharacters, query, missingFilter);
  };

  const handleFilterChange = (filter: string) => {
    setMissingFilter(filter);
    applyFilters(allCharacters, query, filter);
  };

  const handleDelete = async (char: Character) => {
    if (!confirm(`Are you sure you want to delete "${char.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(char.id);
    try {
      const res = await fetch(`/api/admin/characters/${char.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        const updated = allCharacters.filter((c) => c.id !== char.id);
        setAllCharacters(updated);
        applyFilters(updated, query, missingFilter);
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Network error deleting character');
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate pagination slice
  const totalItems = filteredCharacters.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const currentCharacters = filteredCharacters.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin mb-3" />
        <p className="text-slate-400 text-xs">Checking missing fields queue across all characters...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center space-x-2">
            <HelpCircle className="w-6 h-6 text-sky-400" />
            <span>Missing Attributes Queue ({totalItems})</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Characters requiring fact completion: age, height, bounty, origin, debut, alias, or portrait image.
          </p>
        </div>

        {/* Page counter pill */}
        <div className="text-xs text-slate-300 bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto font-semibold">
          Page <span className="font-black text-amber-400">{page}</span> of <span className="font-bold text-slate-100">{totalPages}</span> ({totalItems} total)
        </div>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                applyFilters(allCharacters, e.target.value, missingFilter);
              }}
              placeholder="Search missing characters by name, alias, origin..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 gold-button rounded-lg text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
            <Filter className="w-4 h-4 text-sky-400" />
            <span>Missing:</span>
          </div>
          <select
            value={missingFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Missing Fields</option>
            <option value="bounty">Missing Bounty (Undisclosed/Null)</option>
            <option value="age">Missing Age</option>
            <option value="height">Missing Height</option>
            <option value="image">Missing Portrait</option>
            <option value="fruit">Unknown Devil Fruit</option>
            <option value="origin">Unknown Origin</option>
            <option value="debut">Missing Debut / Arc</option>
            <option value="alias">Missing Alias / Epithet</option>
          </select>
        </div>
      </div>

      {/* Grid of Missing Characters */}
      {filteredCharacters.length === 0 ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-400 text-sm">
          {query.trim() || missingFilter !== 'all'
            ? 'No missing characters matched the search criteria.'
            : 'No missing critical fields detected!'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentCharacters.map((c) => {
              const missingList = [];
              if (c.bounty === null || c.bounty === undefined) missingList.push('Bounty');
              if (!c.age) missingList.push('Age');
              if (!c.height) missingList.push('Height');
              if (!c.image_url) missingList.push('Image');
              if (c.devil_fruit_type === 'Unknown') missingList.push('Fruit');
              if (!c.origin || c.origin === 'Unknown') missingList.push('Origin');
              if (!c.first_appearance && !c.first_arc) missingList.push('Debut');
              if (!c.alias && !c.romanized_name) missingList.push('Alias');

              const displayAlias = c.alias || c.romanized_name;

              return (
                <div key={c.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between space-y-4 shadow-md hover:border-slate-700 transition">
                  <div className="flex items-start space-x-3">
                    <CharacterAvatar
                      src={c.image_url}
                      name={c.name}
                      size="lg"
                      className="border-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 text-base truncate">{c.name}</div>
                      {c.japanese_name && (
                        <div className="text-[11px] text-slate-400 truncate">{c.japanese_name}</div>
                      )}
                      {displayAlias && (
                        <div className="text-[11px] text-amber-400 truncate flex items-center space-x-1 mt-0.5">
                          <Tag className="w-3 h-3 inline shrink-0" />
                          <span>{displayAlias}</span>
                        </div>
                      )}
                      <div className="text-[11px] text-sky-400 font-semibold mt-1">
                        Missing: {missingList.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <Link
                      href={`/admin/characters/${c.id}`}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Fill Missing Data</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(c)}
                      disabled={deletingId === c.id}
                      title="Delete Character"
                      className="p-2 bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 hover:text-red-100 rounded-lg transition disabled:opacity-50 cursor-pointer"
                    >
                      {deletingId === c.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Bar */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              Showing <span className="font-bold text-slate-200">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-slate-200">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{' '}
              <span className="font-bold text-slate-200">{totalItems}</span> characters
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-200 font-bold flex items-center space-x-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              {/* Page Number Indicators */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setPage(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-8 h-8 rounded-lg font-bold transition cursor-pointer ${
                        page === pageNum
                          ? 'gold-button text-slate-950'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-200 font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
