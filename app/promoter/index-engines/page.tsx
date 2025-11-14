// app/promoter/index-engines/page.tsx
import React from 'react';
import EnginesIndexTable from '@/components/promoter/EnginesIndexTable';

export default function EnginesIndexPage() {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Index Engins</h2>
      </div>

      <div className="bg-white border rounded p-4">
        <EnginesIndexTable />
      </div>
    </section>
  );
}
