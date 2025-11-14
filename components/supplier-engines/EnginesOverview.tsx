'use client';
import React, { useEffect, useState } from 'react';
import { Engine } from '@/types/engine';

export default function EnginesOverview() {
  const [engines, setEngines] = useState<Engine[]>([]);

  useEffect(() => {
    fetch('/api/engines')
      .then((r) => r.json())
      .then(setEngines)
      .catch(() => setEngines([]));
  }, []);

  const total = engines.length;
  const inUse = engines.filter((e) => !e.available).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border rounded">
          Total engins <div className="text-2xl font-semibold">{total}</div>
        </div>
        <div className="p-4 bg-white border rounded">
          En service <div className="text-2xl font-semibold">{inUse}</div>
        </div>
        <div className="p-4 bg-white border rounded">
          Disponibles{' '}
          <div className="text-2xl font-semibold">{total - inUse}</div>
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <h3 className="font-medium mb-3">Derniers engins</h3>
        <ul className="space-y-2">
          {engines.slice(0, 5).map((e) => (
            <li key={e.id} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{e.name}</div>
                <div className="text-xs text-slate-500">{e.category}</div>
              </div>
              <div className="text-sm text-slate-600">
                {e.dayRate.toLocaleString()} DA/jour
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
