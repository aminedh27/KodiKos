// app/supplier-materials/layout.tsx
import React from 'react';
import MaterialsSidebar from '@/components/supplier-materials/MaterialsSidebar';
import MaterialsHeader from '@/components/supplier-materials/MaterialsHeader';

export const metadata = {
  title: 'Fournisseur Matériaux — BTP Market',
};

export default function SupplierMaterialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <aside className="w-64 hidden md:block border-r bg-white">
          <MaterialsSidebar />
        </aside>
        <div className="flex-1 min-h-screen">
          <MaterialsHeader />
          <main className="p-6 max-w-[1200px] mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
