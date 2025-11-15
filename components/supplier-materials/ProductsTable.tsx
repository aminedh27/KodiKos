// components/supplier-materials/ProductsTable.tsx
'use client';
import React, { useState } from 'react';
import { FullProduct } from '@/app/services/products';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Box } from 'lucide-react';
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog';
import NewProductForm from './NewProductForm';

export default function ProductsTable({
  products,
  loading,
}: {
  products: FullProduct[];
  loading: boolean;
}) {
  const [open, setOpen] = useState(false);

  console.log(products);
  if (loading) return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
    </div>
  );

  if (!products.length) return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg">
      <Box className="w-8 h-8 text-slate-400 mb-2" />
      <h3 className="text-lg font-medium text-slate-700 mb-1">Aucun produit trouvé</h3>
      <p className="text-sm text-slate-500 mb-4">Commencez par ajouter votre premier produit</p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          >
            Ajouter un produit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <NewProductForm 
            onSuccess={() => {
              setOpen(false);
              // Optionally redirect here if needed
              // router.push('/supplier-materials/products');
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="py-3 px-4 font-medium">Produit</th>
            <th className="py-3 px-4 font-medium">Prix (DA)</th>
            <th className="py-3 px-4 font-medium">Stock</th>
            <th className="py-3 px-4 font-medium">Dernière maj</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
              <td className="py-3 px-4">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-slate-500 mt-1">{p.category}</div>
              </td>
              <td className="py-3 px-4">{p.price.toLocaleString()}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  p.quantity > 10 ? 'bg-green-100 text-green-800' : 
                  p.quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {p.quantity} {p.unit}
                </span>
              </td>
              <td className="py-3 px-4 text-slate-500">
                {new Date(p.updatedat).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/supplier-materials/products/${p.id}`}
                    className="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 transition-colors"
                  >
                    Voir
                  </Link>
                  <button
                    className="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 text-sm hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-colors"
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
    </div>
  );
}
