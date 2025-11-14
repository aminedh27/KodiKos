// app/supplier-engines/fleet/[id]/page.tsx
import React from 'react';
import EngineDetailClient from '@/components/supplier-engines/EngineDetailClient';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <section>
      <EngineDetailClient id={params.id} />
    </section>
  );
}
