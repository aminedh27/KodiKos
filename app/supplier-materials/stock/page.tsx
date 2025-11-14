// app/supplier-materials/stock/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  async function updateStock(id: string, delta: number) {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const newStock = Math.max(0, prod.stock + delta);
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        product: { id, stock: newStock },
      }),
    });
    const json = await res.json();
    if (json?.ok) {
      setProducts((p) => p.map((x) => (x.id === id ? json.product : x)));
    } else 
      toast.error('Erreur');
  }

  if (loading) return <div>Chargement...</div>;

  return (
    <section>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Gestion du stock</h2>
        <Button variant="outline" onClick={fetchProducts}>
          Rafraîchir
        </Button>
      </div>

      <div className="bg-white border rounded p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-600 border-b">
            <tr>
              <th className="py-2">Produit</th>
              <th className="py-2">Stock</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="py-2">{p.name}</td>
                <td className="py-2">
                  {p.stock} {p.unit}
                </td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 rounded bg-green-50"
                      onClick={() => updateStock(p.id, 1)}
                    >
                      +1
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-red-50"
                      onClick={() => updateStock(p.id, -1)}
                    >
                      -1
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-slate-100"
                      onClick={() => {
                        const qty = Number(prompt('Ajouter quantité') || '0');
                        if (qty) updateStock(p.id, qty);
                      }}
                    >
                      Ajouter
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
