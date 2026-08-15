'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquare, CheckCircle2, Trash2, Clock, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';

interface Feedback {
  id: string;
  type: 'bug_report' | 'suggestion' | 'other';
  message: string;
  status: 'pending' | 'done' | 'bullshit';
  created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  bug_report: '🐛 Bug Report',
  suggestion: '💡 Suggestion',
  other: '💬 Other',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
  done: 'bg-green-950/60 border-green-500/40 text-green-300',
  bullshit: 'bg-red-950/60 border-red-500/40 text-red-300',
};

function AdminFeedbacksContent() {
  const searchParams = useSearchParams();
  const initialFilter = (searchParams.get('filter') as 'all' | 'pending' | 'done' | 'bullshit') || 'all';

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'done' | 'bullshit'>(initialFilter);
  const [updating, setUpdating] = useState<string | null>(null);

  const updateUrl = useCallback((f: string) => {
    const params = new URLSearchParams();
    if (f && f !== 'all') params.set('filter', f);
    const qs = params.toString();
    const target = qs ? `/admin/feedbacks?${qs}` : '/admin/feedbacks';
    window.history.replaceState(null, '', target);
  }, []);

  const load = () => {
    setIsLoading(true);
    fetch('/api/admin/feedbacks')
      .then((r) => r.json())
      .then((d) => setFeedbacks(d.feedbacks || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  // Handle browser back/forward history events
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const f = (params.get('filter') as 'all' | 'pending' | 'done' | 'bullshit') || 'all';
      setFilter(f);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleFilterChange = (newFilter: 'all' | 'pending' | 'done' | 'bullshit') => {
    setFilter(newFilter);
    updateUrl(newFilter);
  };

  const updateStatus = (id: string, status: 'pending' | 'done' | 'bullshit') => {
    setUpdating(id);
    fetch('/api/admin/feedbacks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
      .then(() => {
        setFeedbacks((prev) => prev.map((f) => f.id === id ? { ...f, status } : f));
      })
      .finally(() => setUpdating(null));
  };

  const filtered = feedbacks.filter((f) => filter === 'all' || f.status === filter);
  const counts = {
    all: feedbacks.length,
    pending: feedbacks.filter((f) => f.status === 'pending').length,
    done: feedbacks.filter((f) => f.status === 'done').length,
    bullshit: feedbacks.filter((f) => f.status === 'bullshit').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-amber-500" />
            <span>Player Feedbacks</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Submissions from the game feedback form — bug reports, suggestions, and other messages.
          </p>
        </div>
        <button onClick={load} className="px-4 py-2 gold-button rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 flex-wrap gap-2">
        {(['all', 'pending', 'done', 'bullshit'] as const).map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            className={`px-4 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition ${
              filter === f
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 text-[10px] opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* Feedback Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-amber-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-10 text-center text-slate-500 border border-slate-800 rounded-xl">
          <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="font-semibold text-sm">No feedbacks in this category yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((fb) => (
            <div
              key={fb.id}
              className={`p-5 rounded-xl border bg-slate-900 space-y-3 transition-all ${
                fb.status === 'pending'
                  ? 'border-amber-500/30'
                  : fb.status === 'done'
                  ? 'border-green-500/30 opacity-80'
                  : 'border-red-500/20 opacity-60'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-slate-200">{TYPE_LABELS[fb.type]}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${STATUS_STYLES[fb.status]}`}>
                    {fb.status}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {new Date(fb.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>

              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap border-l-2 border-amber-500/30 pl-3">
                {fb.message}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  disabled={fb.status === 'done' || updating === fb.id}
                  onClick={() => updateStatus(fb.id, 'done')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-950/60 border border-green-500/40 text-green-300 text-xs font-bold rounded-lg hover:bg-green-900/60 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {updating === fb.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Mark Done</span>
                </button>

                <button
                  disabled={fb.status === 'bullshit' || updating === fb.id}
                  onClick={() => updateStatus(fb.id, 'bullshit')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-bold rounded-lg hover:bg-red-900/60 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {updating === fb.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>Bullshit</span>
                </button>

                {fb.status !== 'pending' && (
                  <button
                    disabled={updating === fb.id}
                    onClick={() => updateStatus(fb.id, 'pending')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 border border-slate-600 text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-700 transition disabled:opacity-40"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminFeedbacksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
          <p className="text-slate-400 text-xs">Loading feedbacks...</p>
        </div>
      }
    >
      <AdminFeedbacksContent />
    </Suspense>
  );
}
