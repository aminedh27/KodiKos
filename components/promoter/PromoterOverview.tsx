'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function PromoterOverview() {
  const [materialsCount, setMaterialsCount] = useState(0);
  const [enginesCount, setEnginesCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const m = await fetch('/api/index/materials').then((r) => r.json());
        setMaterialsCount(Array.isArray(m) ? m.length : m?.length ?? 0);
      } catch {
        setMaterialsCount(0);
      }
      try {
        const e = await fetch('/api/index/engines').then((r) => r.json());
        setEnginesCount(Array.isArray(e) ? e.length : e?.length ?? 0);
      } catch {
        setEnginesCount(0);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border rounded">
          <div className="text-sm text-slate-500">Offres matériaux</div>
          <div className="text-2xl font-semibold">{materialsCount}</div>
        </div>
        <div className="p-4 bg-white border rounded">
          <div className="text-sm text-slate-500">Offres engins</div>
          <div className="text-2xl font-semibold">{enginesCount}</div>
        </div>
        <div className="p-4 bg-white border rounded">
          <div className="text-sm text-slate-500">Comparateurs</div>
          <div className="text-2xl font-semibold">2</div>
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <h3 className="font-medium mb-3">Actions rapides</h3>
        <div className="flex gap-3">
          <Button onClick={() => (location.href = '/promoter/index-materials')}>
            Voir index matériaux
          </Button>
          <Button
            variant="outline"
            onClick={() => (location.href = '/promoter/index-engines')}
          >
            Voir index engins
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              (location.href = '/promoter/index-materials/compare')
            }
          >
            Comparer
          </Button>
        </div>
      </div>
    </div>
  );
}
