// components/supplier-materials/ProductDetailClient.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function ProductDetailClient() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let mounted = true;
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`);
        if (!res.ok) {
          setProduct(null);
          return;
        }
        const json = await res.json();
        if (mounted) {
          if (json?.ok) setProduct(json.product);
          else setProduct(null);
        }
      } catch (err) {
        console.error('fetch product error', err);
        if (mounted) setProduct(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (product) {
      setPrice(product.price);
      setStock(product.stock);
    }
  }, [product]);

  async function save() {
    if (!product) return;
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        product: { id: product.id, price, stock },
      }),
    });
    const json = await res.json();
    if (json?.ok) {
      setProduct(json.product);
      setEditing(false);
    } else {
      alert('Erreur mise à jour');
    }
  }

  if (loading) return <div>Chargement...</div>;
  if (!id)
    return <div className="text-sm text-amber-600">ID manquant dans l'URL</div>;
  if (!product) return <div>Produit introuvable</div>;

  return (
    <div className="space-y-4">
      {/* ... UI unchanged */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <div className="text-sm text-slate-600">{product.category}</div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/supplier-materials/products')}
          >
            Retour
          </Button>
          <Button onClick={() => setEditing((e) => !e)}>
            {editing ? 'Annuler' : 'Modifier'}
          </Button>
        </div>
      </div>

      {!editing ? (
        <div className="bg-white border rounded p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-500">Prix</div>
              <div className="text-lg font-semibold">
                {product.price.toLocaleString()} DA / {product.unit}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Stock</div>
              <div className="text-lg font-semibold">
                {product.stock} {product.unit}
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-3">
            Dernière mise à jour: {new Date(product.updatedAt).toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="bg-white border rounded p-4">
          <label className="text-sm block mb-1">Prix (DA)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 mb-3"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <label className="text-sm block mb-1">Stock</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 mb-3"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Annuler
            </Button>
            <Button onClick={save}>Enregistrer</Button>
          </div>
        </div>
      )}
    </div>
  );
}
