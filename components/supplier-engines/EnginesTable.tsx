'use client';
import React from 'react';
import { Engine } from '@/types/engine';
import Link from 'next/link';

export default function EnginesTable({
  engines,
  loading,
}: {
  engines: Engine[];
  loading: boolean;
}) {
  if (loading) return <div>Chargement...</div>;
  if (!engines.length) return <div>Aucun engin</div>;

  return (
    <table className="w-full text-sm">
      <thead className="text-left text-slate-600 border-b">
        <tr>
          <th className="py-2">Engin</th>
          <th className="py-2">Catégorie</th>
          <th className="py-2">Prix /h</th>
          <th className="py-2">Prix /j</th>
          <th className="py-2">Disponibilité</th>
          <th className="py-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {engines.map((e) => (
          <tr key={e.id} className="hover:bg-slate-50">
            <td className="py-2">{e.name}</td>
            <td className="py-2">{e.category}</td>
            <td className="py-2">{e.hoursRate.toLocaleString()}</td>
            <td className="py-2">{e.dayRate.toLocaleString()}</td>
            <td className="py-2">{e.available ? 'Libre' : 'Occupé'}</td>
            <td className="py-2 text-right">
              <div className="flex justify-end gap-2">
                <Link
                  href={`/supplier-engines/fleet/${e.id}`}
                  className="px-3 py-1 rounded bg-amber-50 text-amber-700 text-sm"
                >
                  Voir
                </Link>
                <button
                  className="px-3 py-1 rounded bg-slate-50"
                  onClick={async () => {
                    if (confirm('Supprimer cet engin ?')) {
                      await fetch('/api/engines', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'delete', id: e.id }),
                      });
                      location.reload();
                    }
                  }}
                >
                  Suppr
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
