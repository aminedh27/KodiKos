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
    <div className="flex">
      
      <div className="flex-1 min-h-screen">
        <main className="p-6 max-w-[1200px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
