// app/supplier-materials/page.tsx
import ProductsOverview from '@/components/supplier-materials/ProductsOverview';
import React from 'react';

export default function Page() {
  return (
    <section className="space-y-6">
      <ProductsOverview />
    </section>
  );
}
