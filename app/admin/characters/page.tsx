'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Edit3, CheckCircle2, AlertTriangle, HelpCircle, Loader2, ChevronLeft, ChevronRight, Trash2, Plus } from 'lucide-react';
import { Character } from '@/types/character';
import CharacterAvatar from '@/components/game/CharacterAvatar';

function AdminCharactersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = parseInt(searchParams?.get('page') || '1', 10) || 1;
  const initialStatus = searchParams?.get('status') || 'all';
  const initialQuery = searchParams?.get('q') || '';

  const [characters, setCharacters] = useState<Character[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const updateUrl = (p: number, s: string, q: string) => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (p > 1) params.set('page', p.toString());
    if (s && s !== 'all') params.set('status', s);
    if (q.trim()) params.set('q', q.trim());
    const qs = params.toString();
    const newUrl = qs ? `/admin/characters?${qs}` : '/admin/characters';
    window.history.replaceState(null, '', newUrl);
  };

  const loadCharacters = (targetPage = page, targetStatus = statusFilter, targetQuery = query) => {
    setIsLoading(true);
    setErrorMsg(null);
    const url = `/api/admin/characters?q=${encodeURIComponent(targetQuery)}&status=${targetStatus}&page=${targetPage}&limit=15`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          setCharacters(data.characters || []);
          setTotalPages(data.totalPages || 1);
          setTotalCount(data.total || 0);
        }
      })
      .catch(() => setErrorMsg('Failed to query characters from database.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCharacters(page, statusFilter, query);
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateUrl(1, statusFilter, query);
    loadCharacters(1, statusFilter, query);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
    updateUrl(1, newStatus, query);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl(newPage, statusFilter, query);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCharacter = async (char: Character) => {
    if (!confirm(`Are you sure you want to delete "${char.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(char.id);
    try {
      const res = await fetch(`/api/admin/characters/${char.id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        setCharacters((prev) => prev.filter((c) => c.id !== char.id));
        setTotalCount((prev) => Math.max(0, prev - 1));
        setSuccessMsg(`Character "${char.name}" deleted successfully.`);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        alert(data.error || 'Failed to delete character');
      }
    } catch {
      alert('Network error deleting character');
    } finally {
      setDeletingId(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-green-950/60 border border-green-500/40 text-green-400 rounded-md text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified</span>
          </span>
        );
      case 'conflict':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-950/60 border border-amber-500/40 text-amber-400 rounded-md text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Conflict</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-md text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Sourced</span>
          </span>
        );
    }
  };

  const currentFromUrl = `/admin/characters?page=${page}&status=${statusFilter}${query.trim() ? `&q=${encodeURIComponent(query.trim())}` : ''}`;

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight">
            One Piece Characters Dataset ({totalCount.toLocaleString()})
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Search, filter, inspect source evidence, and curate canonical facts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/admin/characters/new?from=${encodeURIComponent(currentFromUrl)}`}
            className="px-4 py-2 gold-button rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Character</span>
          </Link>
          <div className="text-xs text-slate-300 bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto font-semibold">
            Showing <span className="font-bold text-amber-400">{characters.length}</span> on page
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-950/80 border border-green-500/50 rounded-xl text-green-300 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs font-bold flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by canonical name, japanese name, fruit..."
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

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Verification:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified Only</option>
            <option value="conflict">Conflicts Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>
      </div>

      {/* Characters Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
          <p className="text-slate-400 text-xs">Querying characters repository...</p>
        </div>
      ) : characters.length === 0 ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-400 text-sm">
          No characters match your search filters.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-950/80 uppercase font-black tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Character</th>
                  <th className="p-4">Devil Fruit</th>
                  <th className="p-4">Origin</th>
                  <th className="p-4">Bounty</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {characters.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <CharacterAvatar
                          src={c.image_url}
                          name={c.name}
                          size="md"
                        />
                        <div>
                          <div className="font-bold text-slate-100 text-sm">{c.name}</div>
                          {c.japanese_name && (
                            <div className="text-[11px] text-slate-400">{c.japanese_name}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">
                      <div>{c.devil_fruit_name || 'None'}</div>
                      <div className="text-[10px] text-slate-500">({c.devil_fruit_type})</div>
                    </td>
                    <td className="p-4 text-slate-300 max-w-[180px] truncate">
                      {c.origin || 'Grand Line'}
                    </td>
                    <td className="p-4 text-amber-300 font-bold">
                      {c.bounty ? `${c.bounty.toLocaleString()} Berries` : 'None / Unknown'}
                    </td>
                    <td className="p-4">{renderStatusBadge(c.verification_status)}</td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <Link
                          href={`/admin/characters/${c.id}?from=${encodeURIComponent(currentFromUrl)}`}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg font-bold uppercase transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteCharacter(c)}
                          disabled={deletingId === c.id}
                          title="Delete Character"
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 hover:text-red-100 rounded-lg font-bold transition disabled:opacity-50 cursor-pointer"
                        >
                          {deletingId === c.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              Page <span className="font-bold text-slate-200">{page}</span> of{' '}
              <span className="font-bold text-slate-200">{totalPages}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                className="p-2 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                className="p-2 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCharactersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
          <p className="text-slate-400 text-xs">Loading characters repository...</p>
        </div>
      }
    >
      <AdminCharactersContent />
    </Suspense>
  );
}
