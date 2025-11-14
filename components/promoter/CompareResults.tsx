'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CompareResults({
  ids,
  onClose,
}: {
  ids: string[];
  onClose?: () => void;
}) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSelected() {
      try {
        const res = await fetch('/api/index/materials');
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        setItems(arr.filter((a: any) => ids.includes(a.id)));
      } catch (err) {
        setItems([]);
      }
    }
    fetchSelected();
  }, [ids]);

  if (!ids.length) return null;

  return (
    <div className="bg-white border rounded p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Résultats de comparaison</h3>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-600 border-b">
            <tr>
              <th className="py-2">Fournisseur</th>
              <th className="py-2">Prix</th>
              <th className="py-2">Unité</th>
              <th className="py-2">Dernière MAJ</th>
              <th className="py-2">Commentaires</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="hover:bg-slate-50">
                <td className="py-2">{it.supplierId ?? '—'}</td>
                <td className="py-2">{(it.price ?? 0).toLocaleString()}</td>
                <td className="py-2">{it.unit ?? ''}</td>
                <td className="py-2 text-slate-500">
                  {it.updatedAt ? new Date(it.updatedAt).toLocaleString() : '—'}
                </td>
                <td className="py-2">{it.notes ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
