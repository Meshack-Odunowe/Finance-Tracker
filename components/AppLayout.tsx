'use client';

import { Sidebar } from '@/components/Sidebar';
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';
import { DashboardHeader } from '@/components/DashboardHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth') && pathname !== '/auth/change-password';
  const isLandingPage = pathname === '/';

  if (isAuthPage || isLandingPage) {
    return (
      <div className="min-h-screen bg-[#fbfbfc] dark:bg-slate-900 transition-colors duration-300">
        <main className="flex-1">
          {children}
        </main>
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#fbfbfc] dark:bg-slate-900 overflow-hidden transition-colors duration-300">

      {/* Sidebar handles both desktop and mobile overlay */}
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Universal Top Header */}
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}
