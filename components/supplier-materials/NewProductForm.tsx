'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // adapte le chemin si besoin
import { Product, Unit } from '@/types/product';

const UNIT_OPTIONS: Unit[] = ['kg', 'ton', 'm3', 'piece'];

export default function NewProductForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState<Unit>('ton');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function validate() {
    if (!name.trim()) return 'Le nom du produit est requis';
    if (!category.trim()) return 'La catégorie est requise';
    if (price === '' || Number(price) < 0) return 'Prix invalide';
    if (stock === '' || Number(stock) < 0) return 'Stock invalide';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: name.trim(),
      category: category.trim(),
      unit,
      price: Number(price),
      stock: Number(stock),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', product: newProduct }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || 'Erreur lors de la création');
        setLoading(false);
        return;
      }

      setSuccess('Produit créé avec succès');
      // small delay so user sees success
      setTimeout(() => {
        router.push('/supplier-materials/products');
      }, 700);
    } catch (err) {
      console.error(err);
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-md p-6 max-w-xl"
    >
      <h3 className="text-lg font-semibold mb-4">Ajouter un nouveau produit</h3>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
      {success && <div className="mb-3 text-sm text-green-600">{success}</div>}

      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="text-sm block mb-1">Nom du produit</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Ex: Ciment 42.5"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Catégorie</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Ex: Ciment / Fer / Sable"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm block mb-1">Unité</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              className="w-full border rounded-md px-3 py-2"
            >
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm block mb-1">Prix (DA)</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) =>
                setPrice(e.target.value === '' ? '' : Number(e.target.value))
              }
              className="w-full border rounded-md px-3 py-2"
              placeholder="Ex: 8500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm block mb-1">Stock ({unit})</label>
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) =>
              setStock(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="w-full border rounded-md px-3 py-2"
            placeholder="Ex: 120"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="ghost"
            type="button"
            onClick={() => router.push('/supplier-materials/products')}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Ajouter le produit'}
          </Button>
        </div>
      </div>
    </form>
  );
}
