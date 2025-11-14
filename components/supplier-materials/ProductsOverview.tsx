'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';

export default function ProductsOverview() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  const total = products.length;
  const lowStock = products.filter((p) => p.stock <= 10).length;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-white border rounded">
          Produits <div className="text-2xl font-semibold">{total}</div>
        </div>
        <div className="p-4 bg-white border rounded">
          Devis générés <div className="text-2xl font-semibold">--</div>
        </div>
        <div className="p-4 bg-white border rounded">
          Produits basse stock{' '}
          <div className="text-2xl font-semibold">{lowStock}</div>
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <h3 className="font-medium mb-3">Derniers produits</h3>
        <ul className="space-y-2">
          {products.slice(0, 5).map((p) => (
            <li key={p.id} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-slate-500">{p.category}</div>
              </div>
              <div className="text-sm text-slate-600">
                {p.price.toLocaleString()} DA
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
