'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

export default function EngineDetailClient() {
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    async function fetchOne() {
      setLoading(true);
      try {
        const res = await fetch('/api/index/engines');
        const arr = await res.json();
        const match = Array.isArray(arr)
          ? arr.find((x: any) => x.id === id)
          : null;
        setItem(match ?? null);
      } catch (err) {
        setItem(null);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOne();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (!id) return <div>ID manquant</div>;
  if (!item) return <div>Engin introuvable</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{item.name}</h2>
          <div className="text-sm text-slate-500">{item.category}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">
            {(item.dayRate ?? 0).toLocaleString()} DA/j
          </div>
          <div className="text-xs text-slate-500">{item.supplierId ?? '—'}</div>
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-500">Prix /h</div>
            <div className="text-lg font-semibold">
              {(item.hoursRate ?? 0).toLocaleString()} DA
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Transport</div>
            <div className="text-lg font-semibold">
              {(item.transportCost ?? 0).toLocaleString()} DA
            </div>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          Dernière MAJ:{' '}
          {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '—'}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => (location.href = '/promoter/index-engines')}
          variant="outline"
        >
          Retour
        </Button>
        <Button
          onClick={() => {
            const url = new URL(location.href);
            url.pathname = '/promoter/index-materials/compare';
            url.searchParams.set('ids', item.id);
            location.href = url.toString();
          }}
        >
          Comparer
        </Button>
      </div>
    </div>
  );
}
