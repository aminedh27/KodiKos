// app/supplier-engines/fleet/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Engine } from '@/types/engine';
import EnginesTable from '@/components/supplier-engines/EnginesTable';
import Link from 'next/link';

export default function FleetPage() {
  const [engines, setEngines] = useState<Engine[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchEngines() {
    setLoading(true);
    const res = await fetch('/api/engines');
    const data = await res.json();
    setEngines(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchEngines();
  }, []);

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Flotte</h2>
        <div className="flex gap-2">
          <Link
            href="/supplier-engines/fleet/new"
            className="inline-flex items-center px-3 py-2 rounded bg-amber-500 text-white text-sm"
          >
            Ajouter engin
          </Link>
          <button className="px-3 py-2 rounded border" onClick={fetchEngines}>
            Rafraîchir
          </button>
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <EnginesTable engines={engines} loading={loading} />
      </div>
    </section>
  );
}
