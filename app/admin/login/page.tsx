'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, KeyRound, Lock, Loader2, AlertCircle } from 'lucide-react';

function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get('from');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    setErrorMsg(null);

    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const targetUrl = fromParam && fromParam.startsWith('/admin') && fromParam !== '/admin/login'
            ? fromParam
            : '/admin';
          router.push(targetUrl);
          router.refresh();
        } else {
          setErrorMsg(data.error || 'Incorrect password');
        }
      })
      .catch(() => setErrorMsg('Network error during login'))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md parchment-panel rounded-2xl border-2 border-amber-600/40 p-8 shadow-2xl space-y-6 text-center">
        <div className="w-16 h-16 mx-auto bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center text-amber-400 shadow-inner">
          <Shield className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-slate-100 gold-gradient-text uppercase tracking-tight">
            ADMIN PORTAL LOGIN
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Enter the password to access canonical data curation & evidence management.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center space-x-2 font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Admin Password
            </label>
            <div className="relative flex items-center">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-amber-600/40 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-semibold"
                autoFocus
              />
              <KeyRound className="w-5 h-5 text-amber-500 absolute left-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-3.5 gold-button rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
            <span>ENTER ADMIN SYSTEM</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-amber-400">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p className="text-xs font-bold uppercase tracking-wider">Loading Portal...</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
