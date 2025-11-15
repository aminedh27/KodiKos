// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import Shell from '@/components//layout/Shell';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'BTP Market Intelligence',
  description: 'Index Matériaux + Index Engins - Admin',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
