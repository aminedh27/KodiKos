'use client';

import React, { useEffect, useState } from 'react';
import ProductsTable from '@/components/supplier-materials/ProductsTable';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
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
  function handleEdit(product: Product) {
    // open modal or navigate to edit page
    // for demo we'll navigate to product detail/edit page if exists
    // or just alert
    // example: router.push(`/supplier-materials/products/${product.id}`)
    alert(`Modifier: ${product.name}`);
  }

  function handleDevis(product: Product) {
    // open devis modal or navigate
    alert(`Générer devis pour: ${product.name}`);
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Produits</h2>
        <div className="flex gap-2">
          <Link
            href="/supplier-materials/products/new"
            className="inline-flex items-center px-3 py-2 rounded bg-indigo-600 text-white text-sm"
          >
            Ajouter produit
          </Link>
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
