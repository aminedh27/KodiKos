// app/supplier-materials/products/[id]/page.tsx
import React from 'react';
import ProductDetailClient from '@/components/supplier-materials/ProductDetailClient';

interface Props {
  params: { id: string };
}

export default function ProductDetailPage({ params }: Props) {
  // pass the id prop (string) — server -> client serialization is fine
  return (
    <section>
      <ProductDetailClient id={params?.id} />
    </section>
  );
}
