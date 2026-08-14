'use client';

import { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, Loader2, Database, AlertTriangle } from 'lucide-react';

export default function AdminImportsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [report, setReport] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunImport = async () => {
    setIsRunning(true);
    setErrorMsg(null);
    setLogMessages([
      'Starting live data ingestion run across all connected sources...',
      'Connecting to Jikan MAL API (anime/21/characters)...',
      'Fetching One Piece REST API (/v2/characters/en)...',
      'Loading Wiki/Kaggle canon baseline dataset...',
      'Enriching Observation, Armament & Conqueror Haki dataset...',
      'Processing record deduplication, normalization & evidence reconciliation...',
    ]);

    try {
      const res = await fetch('/api/admin/imports', { method: 'POST' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete data import');
      }

      setReport(data.report);
      setLogMessages((prev) => [
        ...prev,
        `Consolidated ${data.report.recordsFetched} raw records into database!`,
        `Created ${data.report.charactersCreated} new character entries.`,
        `Updated/Matched ${data.report.charactersMatched} existing records.`,
        '✓ Unified One Piece Character Ingestion Completed Successfully!',
      ]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Import failed');
      setLogMessages((prev) => [...prev, `✖ Error: ${err.message || 'Import failed'}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center space-x-2">
            <Download className="w-6 h-6 text-amber-500" />
            <span>Data Ingestion & Source Sync</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Automated multi-source pipeline fetching, normalizing, and populating 1,300+ One Piece character records.
          </p>
        </div>

        <button
          onClick={handleRunImport}
          disabled={isRunning}
          className="px-5 py-2.5 gold-button rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 disabled:opacity-50"
        >
          {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>{isRunning ? 'Importing Data...' : 'Import All Sources'}</span>
        </button>
      </div>

      {/* Configured Data Sources List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-100 text-sm">
            <span>1. Jikan (MyAnimeList) API</span>
            <span className="text-xs px-2 py-0.5 bg-green-950 text-green-400 border border-green-500/40 rounded">
              Enabled
            </span>
          </div>
          <p className="text-xs text-slate-400">https://api.jikan.moe/v4/anime/21/characters</p>
          <div className="text-[11px] text-slate-500">1,470+ anime character portraits & Japanese names</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-100 text-sm">
            <span>2. One Piece REST API</span>
            <span className="text-xs px-2 py-0.5 bg-green-950 text-green-400 border border-green-500/40 rounded">
              Enabled
            </span>
          </div>
          <p className="text-xs text-slate-400">https://api.api-onepiece.com/v2/characters/en</p>
          <div className="text-[11px] text-slate-500">780+ REST records with bounties, ages, heights, devil fruits & crews</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-100 text-sm">
            <span>3. Canon Wiki Baseline Dataset</span>
            <span className="text-xs px-2 py-0.5 bg-green-950 text-green-400 border border-green-500/40 rounded">
              Enabled
            </span>
          </div>
          <p className="text-xs text-slate-400">Structured Canon Character Facts & High-Res Portraits</p>
          <div className="text-[11px] text-slate-500">Primary canon fact baseline ingestion adapter</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-100 text-sm">
            <span>4. One Piece Haki Dataset</span>
            <span className="text-xs px-2 py-0.5 bg-green-950 text-green-400 border border-green-500/40 rounded">
              Enabled
            </span>
          </div>
          <p className="text-xs text-slate-400">Observation / Armament / Conqueror Haki Attributes</p>
          <div className="text-[11px] text-slate-500">Multi-type Haki classification mapping</div>
        </div>
      </div>

      {/* Real-time Import Log & Report */}
      {logMessages.length > 0 && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 font-mono text-xs">
          <h3 className="font-bold text-amber-400 uppercase tracking-wider font-sans text-sm flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>Ingestion Pipeline Execution Log</span>
          </h3>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-slate-300 space-y-1 max-h-60 overflow-y-auto">
            {logMessages.map((msg, idx) => (
              <div key={idx} className="text-slate-300">
                {msg}
              </div>
            ))}
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-lg text-red-200 font-sans flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {report && (
            <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-lg text-amber-200 font-sans space-y-2">
              <div className="font-bold text-amber-400 uppercase tracking-wider text-xs flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Sync Summary Audit Report</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Sources Processed</span>
                  <span className="font-bold text-slate-100">{report.sourcesProcessed}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Records Processed</span>
                  <span className="font-bold text-slate-100">{report.recordsFetched}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Characters Created</span>
                  <span className="font-bold text-green-400">{report.charactersCreated}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Characters Matched</span>
                  <span className="font-bold text-amber-300">{report.charactersMatched}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
