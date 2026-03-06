import type { Metadata } from 'next';
import './globals.css';
import AppLayout from '@/components/AppLayout';
import { StoreInitializer } from '@/components/StoreInitializer';

export const metadata: Metadata = {
  title: 'Finance Tracker',
  description: 'Track your personal finances',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <StoreInitializer />
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
