// components/supplier-materials/ProductDetailClient.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Box } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

export default function ProductDetailClient() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const router = useRouter();
  const { id } = useParams() as { id: string };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      router.push('/supplier-materials/products');
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
  }, [id, router]);

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
      toast.error('Erreur mise à jour');
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
      <span className="text-sm text-slate-600">Chargement du produit...</span>
    </div>
  );

  if (!id) return (
    <div className="p-4 bg-amber-50 text-amber-700 rounded-md">
      <p className="text-sm">ID manquant dans l'URL</p>
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg">
      <Box className="w-8 h-8 text-slate-400 mb-2" />
      <h3 className="text-lg font-medium text-slate-700 mb-1">Produit introuvable</h3>
      <Button 
        variant="outline" 
        onClick={() => router.push('/supplier-materials/products')}
        className="mt-4"
      >
        Retour à la liste
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{product.name}</h2>
          <div className="text-sm text-slate-500">{product.category}</div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/supplier-materials/products')}
          >
            Retour
          </Button>
          <Button 
            onClick={() => setEditing(true)}
            variant="secondary"
          >
            Modifier
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-slate-500 mb-1">Prix</div>
            <div className="text-xl font-semibold">
              {product.price.toLocaleString()} DA / {product.unit}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-500 mb-1">Stock</div>
            <div className="text-xl font-semibold">
              {product.stock} {product.unit}
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-400 mt-4">
          Dernière mise à jour: {new Date(product.updatedAt).toLocaleString()}
        </div>
      </div>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Modifier le produit</h3>
            <div>
              <label className="text-sm block mb-1">Prix (DA)</label>
              <input
                type="number"
                className="w-full border rounded-md px-3 py-2"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Stock</label>
              <input
                type="number"
                className="w-full border rounded-md px-3 py-2"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditing(false)}>
                Annuler
              </Button>
              <Button onClick={save} className="bg-indigo-600 hover:bg-indigo-700">
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
