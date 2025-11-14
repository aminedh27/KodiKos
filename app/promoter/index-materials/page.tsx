// app/promoter/index-materials/page.tsx
import React from 'react';
import MaterialsIndexTable from '@/components/promoter/MaterialsIndexTable';

export default function MaterialsIndexPage() {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Index Matériaux</h2>
        <div className="text-sm text-slate-500">
          Filtrer par ville / catégorie (coming)
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <MaterialsIndexTable />
      </div>
    </section>
  );
}
