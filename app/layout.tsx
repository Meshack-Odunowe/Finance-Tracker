import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppLayout from '@/components/AppLayout';
import { StoreInitializer } from '@/components/StoreInitializer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Capital • Personal Finance',
  description: 'Manage your wealth with precision and clarity.',
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-[#fbfbfc]" suppressHydrationWarning>
        <StoreInitializer />
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
