// components/supplier/materials/MaterialsDashboard.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import ProductTable from './ProductTable';
import EditProductModal from './EditProductModal';
import DevisModal from './DevisModal';
import { toast } from 'sonner';

export default function MaterialsDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [devisProduct, setDevisProduct] = useState<Product | null>(null);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function onSave(updated: Partial<Product> & { id: string }) {
    // send update to API mock
    const res = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(updated),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (json?.ok) {
      setProducts((p) =>
        p.map((prod) => (prod.id === json.product.id ? json.product : prod))
      );
      setEditProduct(null);
    } else {
      toast.error('Erreur mise à jour');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Bienvenue</p>
          <h2 className="text-lg font-medium">Gérez vos produits et prix</h2>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() =>
              setDevisProduct({
                id: '',
                name: '',
                category: '',
                price: 0,
                stock: 0,
                unit: 'ton',
                updatedAt: new Date().toISOString(),
              })
            }
          >
            Générer devis (test)
          </Button>
          <Button variant="outline" onClick={fetchProducts}>
            Rafraîchir
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md border p-4">
        <ProductTable
          products={products}
          loading={loading}
          onEdit={(p) => setEditProduct(p)}
          onDevis={(p) => setDevisProduct(p)}
        />
      </div>

      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={onSave}
        />
      )}
      {devisProduct && (
        <DevisModal
          product={devisProduct}
          onClose={() => setDevisProduct(null)}
        />
      )}
    </div>
  );
}
