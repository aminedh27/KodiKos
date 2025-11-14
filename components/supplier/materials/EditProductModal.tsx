'use client';
import React, { useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';

export default function EditProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (data: Partial<Product> & { id: string }) => Promise<void>;
}) {
  const [price, setPrice] = useState<number>(product.price);
  const [stock, setStock] = useState<number>(product.stock);
  const [saving, setSaving] = useState(false);
  const [synced, setSynced] = useState(false);

  async function save() {
    setSaving(true);
    try {
      // call onSave (which should call /api/products update)
      await onSave({ id: product.id, price, stock });

      // fetch latest product from API to retrieve updatedAt (or rely on returned product from onSave)
      // but we'll attempt to sync optimistic data to index
      await fetch('/api/index/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          category: product.category,
          unit: product.unit,
          price,
          stock,
          updatedAt: new Date().toISOString(),
          supplierId: 'supplier_123',
        }),
      });

      setSynced(true);
      setTimeout(() => setSynced(false), 3000);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-md w-full max-w-md p-6 shadow-lg">
        <h3 className="text-lg font-medium mb-4">Modifier {product.name}</h3>

        <label className="block text-sm text-slate-600">
          Prix (DA / {product.unit})
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border rounded-md p-2 mb-4"
        />

        <label className="block text-sm text-slate-600">
          Stock ({product.unit})
        </label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className="w-full border rounded-md p-2 mb-4"
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            {synced ? 'Index synchronisé' : ''}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
