// app/promoter/index-materials/compare/page.tsx
import React from 'react';
import ComparePicker from '@/components/promoter/ComparePicker';
import CompareResults from '@/components/promoter/CompareResults';

export default function ComparePage() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Comparer Matériaux</h2>
      <ComparePicker />
    </section>
  );
}
