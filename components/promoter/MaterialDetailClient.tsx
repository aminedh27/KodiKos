'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

export default function MaterialDetailClient() {
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const params = useParams();

  useEffect(() => {
    const id = params.id;
    if (!id) {
      setLoading(false);
      return;
    }
    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/index/materials`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        const current = arr.find((x: any) => x.id === id);
        setItem(current ?? null);

        // gather suppliers for same product name (simple heuristic)
        const sameName = arr
          .filter((x: any) => x.name === current?.name)
          .slice(0, 8);
        setSuppliers(sameName);
      } catch (err) {
        console.error(err);
        setItem(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (!item) return <div>Produit introuvable dans l'index</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{item.name}</h2>
          <div className="text-sm text-slate-500">{item.category}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">
            {(item.price ?? 0).toLocaleString()} {item.unit ?? ''}{' '}
          </div>
          <div className="text-xs text-slate-500">{item.supplierId ?? '—'}</div>
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <h3 className="font-medium mb-3">Autres offres similaires</h3>
        <ul className="space-y-2">
          {suppliers.map((s) => (
            <li key={s.id} className="flex justify-between items-center">
              <div>
                <div className="font-medium">
                  {s.supplierId ?? 'Fournisseur inconnu'}
                </div>
                <div className="text-xs text-slate-500">{s.category}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {(s.price ?? 0).toLocaleString()} {s.unit ?? ''}
                </div>
                <div className="text-xs text-slate-500">
                  {s.updatedAt ? new Date(s.updatedAt).toLocaleString() : ''}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            const url = new URL(location.href);
            url.pathname = '/promoter/index-materials/compare';
            url.searchParams.set('ids', suppliers.map((s) => s.id).join(','));
            location.href = url.toString();
          }}
        >
          Comparer ces offres
        </Button>
        <Button
          variant="outline"
          onClick={() => (location.href = '/promoter/index-materials')}
        >
          Retour
        </Button>
      </div>
    </div>
  );
}
