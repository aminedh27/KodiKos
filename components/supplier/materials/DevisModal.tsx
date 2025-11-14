// components/supplier/materials/DevisModal.tsx
'use client';
import React, { useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';

export default function DevisModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [clientName, setClientName] = useState('');
  const [qty, setQty] = useState(1);

  function total() {
    return (product.price || 0) * qty;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-md w-full max-w-md p-6 shadow-lg">
        <h3 className="text-lg font-medium mb-4">
          Générer devis — {product.name}
        </h3>

        <label className="block text-sm text-slate-600">Client</label>
        <input
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full border rounded-md p-2 mb-3"
        />

        <label className="block text-sm text-slate-600">
          Quantité ({product.unit})
        </label>
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-full border rounded-md p-2 mb-3"
        />

        <div className="mb-4">
          <div className="text-sm text-slate-600">Total estimé</div>
          <div className="text-lg font-semibold">
            {total().toLocaleString()} DA
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
          <Button
            onClick={() => {
              alert('PDF mock généré (simulate)');
            }}
          >
            Télécharger PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
