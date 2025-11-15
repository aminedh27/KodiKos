// app/supplier-engines/layout.tsx
import React from 'react';
import EnginesSidebar from '@/components/supplier-engines/EnginesSidebar';
import EnginesHeader from '@/components/supplier-engines/EnginesHeader';

export const metadata = { title: 'Fournisseur Engins — BTP Market' };

export default function SupplierEnginesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <aside className="w-64 hidden md:block border-r bg-white">
          <EnginesSidebar />
        </aside>
        <div className="flex-1 min-h-screen">
          <EnginesHeader />
          <main className="p-6 max-w-[1200px] mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
