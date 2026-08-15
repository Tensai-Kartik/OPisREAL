'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, CheckCircle2, Loader2, ArrowRight, Search, Trash2 } from 'lucide-react';
import { Character } from '@/types/character';

function AdminConflictsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';

  const [allConflicts, setAllConflicts] = useState<Character[]>([]);
  const [filteredConflicts, setFilteredConflicts] = useState<Character[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const updateUrl = (q: string) => {
    if (typeof window === 'undefined') return;
    const newUrl = q.trim() ? `/admin/conflicts?q=${encodeURIComponent(q.trim())}` : '/admin/conflicts';
    window.history.replaceState(null, '', newUrl);
  };

  const applySearch = (list: Character[], q: string) => {
    if (!q.trim()) {
      setFilteredConflicts(list);
      return;
    }
    const lower = q.toLowerCase().trim();
    const result = list.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        (c.japanese_name && c.japanese_name.toLowerCase().includes(lower)) ||
        (c.origin && c.origin.toLowerCase().includes(lower))
    );
    setFilteredConflicts(result);
  };

  const loadConflicts = () => {
    setIsLoading(true);
    fetch('/api/admin/characters?status=conflict&limit=100')
      .then((res) => res.json())
      .then((data) => {
        const list = data.characters || [];
        setAllConflicts(list);
        applySearch(list, initialQuery);
      })
      .catch(() => {
        setAllConflicts([]);
        setFilteredConflicts([]);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadConflicts();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(query);
    applySearch(allConflicts, query);
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
        const updated = allConflicts.filter((c) => c.id !== char.id);
        setAllConflicts(updated);
        applySearch(updated, query);
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Network error deleting character');
    } finally {
      setDeletingId(null);
    }
  };

  const currentFromUrl = `/admin/conflicts${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
        <p className="text-slate-400 text-xs">Checking conflict queue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          <span>Source Conflicts Review Queue ({filteredConflicts.length})</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Characters where external sources reported contradictory information requiring admin verification.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                applySearch(allConflicts, e.target.value);
              }}
              placeholder="Search conflicts by name, origin..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
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
      </div>

      {filteredConflicts.length === 0 ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-xl text-center">
          <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">
            {query.trim() ? 'No Matching Conflicts Found' : 'No Pending Conflicts!'}
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            {query.trim()
              ? 'Try another search query or clear the filter.'
              : 'All character facts currently match consensus or are verified.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConflicts.map((c) => (
            <div key={c.id} className="p-5 bg-slate-900 border border-amber-600/40 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <img
                  src={c.image_url || 'https://via.placeholder.com/80?text=OP'}
                  alt={c.name}
                  className="w-12 h-12 rounded-lg object-cover border border-amber-500/40 bg-slate-950 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-100 text-base truncate">{c.name}</div>
                  {c.japanese_name && (
                    <div className="text-[11px] text-slate-400 truncate">{c.japanese_name}</div>
                  )}
                  <div className="text-xs text-amber-400 font-medium mt-0.5">Contradictory values detected</div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/characters/${c.id}?from=${encodeURIComponent(currentFromUrl)}`}
                  className="px-3.5 py-2 gold-button rounded-lg text-xs font-bold uppercase flex items-center space-x-1 shadow-sm"
                >
                  <span>Resolve</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminConflictsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
          <p className="text-slate-400 text-xs">Checking conflict queue...</p>
        </div>
      }
    >
      <AdminConflictsContent />
    </Suspense>
  );
}
