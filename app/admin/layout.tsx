'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Database, AlertTriangle, HelpCircle, Download, LayoutDashboard, Anchor, LogOut, Loader2, MessageSquare } from 'lucide-react';

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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between min-h-[56px] sm:h-16 py-2 sm:py-0 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <Link href="/admin" className="flex items-center space-x-2 sm:space-x-2.5 group min-w-0">
              <Image
                src="/logo_bg.png"
                alt="OP is Real Logo"
                width={36}
                height={36}
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)] group-hover:scale-105 transition-transform shrink-0"
                priority
              />
              <div className="min-w-0">
                <span className="font-extrabold text-slate-100 text-xs sm:text-base md:text-lg uppercase tracking-wider gold-gradient-text truncate block">
                  <span className="hidden sm:inline">ONE PIECE </span>DATA CURATION
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium truncate">
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <Link
              href="/"
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 bg-slate-800 border border-slate-700 text-amber-400 hover:text-amber-300 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1 sm:space-x-1.5"
            >
              <Anchor className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span><span className="hidden sm:inline">Back to </span>Game</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 bg-red-950/60 border border-red-500/40 text-red-400 hover:bg-red-900/60 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1 sm:space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Sub-header Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto border-t border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-amber-500 text-amber-400 bg-amber-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
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
