// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import Shell from '@/components//layout/Shell';

export const metadata = {
  title: 'BTP Market Intelligence',
  description: 'Index Matériaux + Index Engins - Admin',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
