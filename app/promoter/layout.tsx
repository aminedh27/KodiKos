// app/promoter/layout.tsx
import React from 'react';
import PromoterSidebar from '@/components/promoter/PromoterSidebar';
import PromoterHeader from '@/components/promoter/PromoterHeader';

export const metadata = { title: 'Promoteur — BTP Market' };

export default function PromoterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <aside className="w-64 hidden md:block border-r bg-gray-50">
          <PromoterSidebar />
        </aside>
        <div className="flex-1 min-h-screen">
          <PromoterHeader />
          <main className="p-6 max-w-[1200px] mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
