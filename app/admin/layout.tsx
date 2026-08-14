'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Database, AlertTriangle, HelpCircle, Download, LayoutDashboard, Anchor, LogOut, Loader2, MessageSquare } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    fetch('/api/admin/check-auth')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        router.push('/admin/login');
      });
  }, [pathname, router]);

  const handleLogout = () => {
    fetch('/api/admin/logout', { method: 'POST' }).then(() => {
      router.push('/admin/login');
      router.refresh();
    });
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-amber-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p className="text-xs font-bold uppercase tracking-wider">Verifying Admin Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Characters', href: '/admin/characters', icon: Database },
    { label: 'Conflicts', href: '/admin/conflicts', icon: AlertTriangle },
    { label: 'Missing Fields', href: '/admin/missing', icon: HelpCircle },
    { label: 'Data Imports', href: '/admin/imports', icon: Download },
    { label: 'Feedbacks', href: '/admin/feedbacks', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Admin Navigation Bar */}
      <header className="bg-slate-900 border-b border-amber-600/30 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-100 text-lg uppercase tracking-wider gold-gradient-text">
                ONE PIECE DATA CURATION
              </span>
              <span className="text-xs text-slate-400 block font-medium">Protected Admin Portal</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="px-3.5 py-1.5 bg-slate-800 border border-slate-700 text-amber-400 hover:text-amber-300 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5"
            >
              <Anchor className="w-4 h-4" />
              <span>Back to Game</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-red-950/60 border border-red-500/40 text-red-400 hover:bg-red-900/60 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Sub-header Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto border-t border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-amber-500 text-amber-400 bg-amber-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">{children}</main>

      <footer className="bg-slate-900 border-t border-slate-800 text-center py-4 text-xs text-slate-500">
        One Piece Canonical Dataset Curation System • Internal Password Protected Portal
      </footer>
    </div>
  );
}
