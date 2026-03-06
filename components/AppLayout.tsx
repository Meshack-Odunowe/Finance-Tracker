import { Sidebar } from '@/components/Sidebar';
import { Toaster } from 'sonner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
          {children}
        </div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
