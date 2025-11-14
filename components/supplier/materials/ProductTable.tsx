// components/supplier/materials/ProductTable.tsx
'use client';
import React from 'react';
import { Product } from '@/types/product';
import { formatNumber } from '@/lib/format';
import { Button } from '@/components/ui/button';

export default function ProductTable({
  products,
  loading,
  onEdit,
  onDevis,
}: {
  products: Product[];
  loading: boolean;
  onEdit: (p: Product) => void;
  onDevis: (p: Product) => void;
}) {
  if (loading) return <div>Chargement...</div>;
  if (products.length === 0) return <div>Aucun produit.</div>;

  return (
    <table className="w-full text-sm">
      <thead className="text-left text-slate-600 border-b">
        <tr>
          <th className="py-2">Produit</th>
          <th className="py-2">Catégorie</th>
          <th className="py-2">Prix (DA)</th>
          <th className="py-2">Stock</th>
          <th className="py-2">Màj</th>
          <th className="py-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="hover:bg-slate-50">
            <td className="py-3">{p.name}</td>
            <td className="py-3">{p.category}</td>
            <td className="py-3">{formatNumber(p.price)}</td>
            <td className="py-3">
              {p.stock} {p.unit}
            </td>
            <td className="py-3 text-slate-500">
              {new Date(p.updatedAt).toLocaleString()}
            </td>
            <td className="py-3 text-right">
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => onDevis(p)}>
                  Devis
                </Button>
                <Button size="sm" onClick={() => onEdit(p)}>
                  Modifier
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
