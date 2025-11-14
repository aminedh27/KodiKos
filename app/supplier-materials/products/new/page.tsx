// app/supplier-materials/products/new/page.tsx
import NewProductForm from '@/components/supplier-materials/NewProductForm';
import React from 'react';

export default function NewProductPage() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Ajouter un produit</h2>
      <NewProductForm />
    </section>
  );
}
