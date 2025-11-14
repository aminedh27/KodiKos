// components/supplier-materials/ProductsTable.tsx
'use client';
import React from 'react';
import { Product } from '@/types/product';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProductsTable({
  products,
  loading,
}: {
  products: Product[];
  loading: boolean;
}) {
  if (loading) return <div>Loading...</div>;
  if (!products.length) return <div>Aucun produit</div>;

  return (
    <table className="w-full text-sm">
      <thead className="text-left text-slate-600 border-b">
        <tr>
          <th className="py-2">Produit</th>
          <th className="py-2">Prix (DA)</th>
          <th className="py-2">Stock</th>
          <th className="py-2">Dernière maj</th>
          <th className="py-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="hover:bg-slate-50">
            <td className="py-2">
              {p.name}{' '}
              <div className="text-xs text-slate-500">{p.category}</div>
            </td>
            <td className="py-2">{p.price.toLocaleString()}</td>
            <td className="py-2">
              {p.stock} {p.unit}
            </td>
            <td className="py-2 text-slate-500">
              {new Date(p.updatedAt).toLocaleString()}
            </td>
            <td className="py-2 text-right">
              <div className="flex justify-end gap-2">
                <Link
                  href={`/supplier-materials/products/${p.id}`}
                  className="px-3 py-1 rounded bg-indigo-50 text-indigo-700 text-sm"
                >
                  Voir
                </Link>
                <button
                  className="px-3 py-1 rounded bg-slate-50"
                  onClick={async () => {
                    if (confirm('Supprimer ce produit ?')) {
                      await fetch('/api/products', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'delete', id: p.id }),
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
