// app/supplier-materials/products/[id]/page.tsx
import React from 'react';
import ProductDetailClient from '@/components/supplier-materials/ProductDetailClient';

export default function ProductDetailPage() {
  // pass the id prop (string) — server -> client serialization is fine
  return (
    <section>
      <ProductDetailClient />
    </section>
  );
}
