'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Product } from '@/types/product';
import NewProductForm from './NewProductForm';
import ProductsTable from './ProductsTable';

export default function ProductsOverview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
      <span className="text-sm text-slate-600">Chargement...</span>
    </div>
  );

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

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Derniers produits</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Ajouter produit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <NewProductForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <ProductsTable products={products} loading={false} />
        </div>
      </div>
    </div>
  );
}
