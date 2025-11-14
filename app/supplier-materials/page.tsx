// app/supplier-materials/page.tsx
import { redirect } from 'next/navigation';
import ProductsOverview from '@/components/supplier-materials/ProductsOverview';
import React from 'react';

export default function Page() {
  // Redirect to default sub-page
  redirect('/supplier-materials/products');
}
