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
import { getProductById, updateProductById } from '@/app/services/products';
import { FullProduct } from '@/types/supabase';

export default function ProductDetailClient() {
  const [product, setProduct] = useState<FullProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [minQuantity, setMinQuantity] = useState<number>(0);
  const [transportPrice, setTransportPrice] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const router = useRouter();
  const { id } = useParams() as { id: string };

  async function fetchProduct(mounted: boolean) {
      setLoading(true);
      try {
        console.log('fetching product', id);
        const product: FullProduct | null = await getProductById(id);

        if (mounted) {
          if (product) setProduct(product);
          else setProduct(null);
        }
      } catch (err) {
        console.error('fetch product error', err);
        if (mounted) setProduct(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
  useEffect(() => {
    if (!id) {
      setLoading(false);
      router.push('/supplier-materials/products');
      return;
    }

    let mounted = true;
    
    fetchProduct(mounted);
    return () => {
      mounted = false;
    };
  }, [id, router]);

  useEffect(() => {
    if (product) {
      console.log('product', product);
      setPrice(product.price);
      setTransportPrice(product.transport_price);
      setQuantity(product.quantity);
      setMinQuantity(product.min_quantity);
      setStock(product.quantity);
      setName(product.name);
      setCategory(product.category);
      setUnit(product.unit);
    }
  }, [product]);

  async function save() {
    if (!product) return;
    await updateProductById(product.id, {
      name,
      category,
      unit,
      price,
      transport_price: transportPrice,
      quantity,
      min_quantity: minQuantity,
    });
    if (product) {
      fetchProduct(true);
      toast.success('Produit modifié');
    }

    if (!product) {
      toast.error("Produit non trouvé");
    }
    setEditing(false);
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
              {product.quantity} {product.unit}
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-400 mt-4">
          Dernière mise à jour: {new Date(product.updatedat).toLocaleString()}
        </div>
      </div>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Modifier le produit</h3>
            <div>
              <label className="text-sm block mb-1">Nom</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Category</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Unité</label>
              <select
                className="w-full border rounded-md px-3 py-2 bg-white"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="kg">kg</option>
                <option value="sac">sac</option>
                <option value="ton">ton</option>
                <option value="m3">m3</option>
                <option value="piece">piece</option>
              </select>
            </div>
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
              <label className="text-sm block mb-1">Transport Price (DA)</label>
              <input
                type="number"
                className="w-full border rounded-md px-3 py-2"
                value={transportPrice}
                onChange={(e) => setTransportPrice(Number(e.target.value))}
              />
            </div>
            
            <div>
              <label className="text-sm block mb-1">Quantity</label>
              <input
                type="number"
                className="w-full border rounded-md px-3 py-2"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Min Quantity</label>
              <input
                type="number"
                className="w-full border rounded-md px-3 py-2"
                value={minQuantity}
                onChange={(e) => setMinQuantity(Number(e.target.value))}
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
