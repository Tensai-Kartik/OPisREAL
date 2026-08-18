'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Database, CheckCircle2, AlertTriangle, HelpCircle, RefreshCw, Loader2, ArrowRight } from 'lucide-react';

interface Metrics {
  totalCharacters: number;
  verifiedCharacters: number;
  conflictsCount: number;
  missingCount: number;
  verifiedPercent: number;
  lastImport: string;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMetrics = () => {
    setIsLoading(true);
    setErrorMsg(null);
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setErrorMsg(data.error);
        else setMetrics(data);
      })
      .catch(() => setErrorMsg('Failed to load metrics from Supabase.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
        <p className="text-slate-400 text-sm font-semibold">Loading data health metrics...</p>
      </div>
    );
  }

  if (errorMsg || !metrics) {
    return (
      <div className="p-6 bg-slate-900 border border-red-500/40 rounded-xl text-center max-w-lg mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-100 mb-1">Unable to Load Dashboard</h3>
        <p className="text-slate-400 text-xs mb-4">{errorMsg || 'Database query error'}</p>
        <button onClick={fetchMetrics} className="px-4 py-2 gold-button rounded-lg text-xs font-bold uppercase">
          Retry Query
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-tight">
            Database Health & Data Quality
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time status of canonical character facts and source evidence.
          </p>
        </div>
        <button
          onClick={fetchMetrics}
          className="self-start sm:self-auto px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 cursor-pointer shadow-sm transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Characters */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Characters</span>
            <Database className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-100">{metrics.totalCharacters}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active in Grand Line dataset</div>
        </div>

        {/* Verified Characters */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Characters</span>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-black text-green-400">{metrics.verifiedCharacters}</div>
          <div className="text-[11px] text-green-500/80 mt-1">{metrics.verifiedPercent}% of total verified</div>
        </div>

        {/* Conflicting Characters */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Conflicts</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-400">{metrics.conflictsCount}</div>
          <Link
            href="/admin/conflicts"
            className="text-[11px] text-amber-400 hover:underline flex items-center space-x-1 mt-1 font-semibold"
          >
            <span>Review conflicts queue</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Missing Fields */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Missing Fields</span>
            <HelpCircle className="w-5 h-5 text-sky-500" />
          </div>
          <div className="text-3xl font-black text-sky-400">{metrics.missingCount}</div>
          <Link
            href="/admin/missing"
            className="text-[11px] text-sky-400 hover:underline flex items-center space-x-1 mt-1 font-semibold"
          >
            <span>Fill missing data queue</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Quality Health Progress Bar */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Data Quality Composition
        </h3>
        <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${metrics.verifiedPercent}%` }}
            className="bg-green-500 h-full transition-all"
            title={`Verified: ${metrics.verifiedPercent}%`}
          />
          <div
            style={{
              width: `${metrics.totalCharacters > 0 ? (metrics.conflictsCount / metrics.totalCharacters) * 100 : 0}%`,
            }}
            className="bg-amber-500 h-full transition-all"
            title="Conflicts"
          />
          <div
            style={{
              width: `${metrics.totalCharacters > 0 ? (metrics.missingCount / metrics.totalCharacters) * 100 : 0}%`,
            }}
            className="bg-sky-500 h-full transition-all"
            title="Missing Data"
          />
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 bg-green-500 rounded-sm inline-block" />
            <span>Verified: {metrics.verifiedPercent}%</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 bg-amber-500 rounded-sm inline-block" />
            <span>Conflicts: {metrics.conflictsCount}</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 bg-sky-500 rounded-sm inline-block" />
            <span>Missing Critical Fields: {metrics.missingCount}</span>
          </span>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/characters"
          className="p-5 bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 rounded-xl transition group"
        >
          <h4 className="font-bold text-slate-100 group-hover:text-amber-400 text-sm mb-1">
            Browse All Characters
          </h4>
          <p className="text-xs text-slate-400">Search, edit, verify attributes and manage character images.</p>
        </Link>
        <Link
          href="/admin/conflicts"
          className="p-5 bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 rounded-xl transition group"
        >
          <h4 className="font-bold text-slate-100 group-hover:text-amber-400 text-sm mb-1">
            Resolve Source Conflicts
          </h4>
          <p className="text-xs text-slate-400">Review contradictory facts reported by external sources.</p>
        </Link>
        <Link
          href="/admin/imports"
          className="p-5 bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 rounded-xl transition group"
        >
          <h4 className="font-bold text-slate-100 group-hover:text-amber-400 text-sm mb-1">
            Data Source Imports
          </h4>
          <p className="text-xs text-slate-400">Trigger sync runs for OnePieceQL, One Piece REST API & datasets.</p>
        </Link>
      </div>
    </div>
  );
}
