'use client';

import React, { useEffect, useState } from 'react';
import ProductsTable from '@/components/supplier-materials/ProductsTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import NewProductForm from '@/components/supplier-materials/NewProductForm';
import { toast } from 'sonner';
import { searchProducts, FullProduct } from '@/app/services/products';

export default function ProductsPage() {
  const [products, setProducts] = useState<FullProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);

  async function fetchProducts() {
    setLoading(true);
    try {
      const products = await searchProducts('');
      setProducts(products);
    } catch (err) {
      console.error('fetch products error', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handlers must be defined in client component (so they can be passed)
  function handleEdit(product: FullProduct) {
    // open modal or navigate to edit page
    // for demo we'll navigate to product detail/edit page if exists
    // or just alert
    // example: router.push(`/supplier-materials/products/${product.id}`)
    toast.success(`Modifier: ${product.name}`);
  }

  function handleDevis(product: FullProduct) {
    // open devis modal or navigate
    toast.success(`Générer devis pour: ${product.name}`);
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Produits</h2>
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="inline-flex items-center px-3 py-2 rounded bg-indigo-600 text-white text-sm">
                Ajouter produit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <NewProductForm 
                onSuccess={() => {
                  setOpen(false);
                  fetchProducts(); // Refresh the product list
                  toast.success('Produit ajouté avec succès');
                }} 
              />
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={fetchProducts}>
            Rafraîchir
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-md p-4">
        <ProductsTable products={products} loading={loading} />
      </div>
    </section>
  );
}
