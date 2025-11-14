// app/promoter/settings/page.tsx
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PromoterSettings() {
  const [company, setCompany] = useState('Mon Entreprise');
  const [phone, setPhone] = useState('0555 00 00 00');

  function save() {
    toast.success('Paramètres sauvegardés (mock)');
  }

  return (
    <section className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Paramètres</h2>
      <div className="bg-white border rounded p-4 space-y-3">
        <label className="text-sm">Nom</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <label className="text-sm">Téléphone</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="flex justify-end">
          <Button onClick={save}>Sauvegarder</Button>
        </div>
      </div>
    </section>
  );
}
