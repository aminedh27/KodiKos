// app/supplier-engines/fleet/new/page.tsx
import React from 'react';
import NewEngineForm from '@/components/supplier-engines/NewEngineForm';

export default function NewEnginePage() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Ajouter un engin</h2>
      <NewEngineForm />
    </section>
  );
}
