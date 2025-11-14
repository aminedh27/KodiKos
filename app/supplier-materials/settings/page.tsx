// app/supplier-materials/settings/page.tsx
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [name, setName] = useState('Mon dépôt');
  const [phone, setPhone] = useState('0555 00 00 00');
  const [zones, setZones] = useState('Alger, Blida');

  function save() {
    toast.success('Paramètres sauvegardés (mock).');
  }

  return (
    <section className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Paramètres</h2>
      <div className="bg-white border rounded p-4 space-y-3">
        <label className="text-sm">Nom entreprise</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="text-sm">Téléphone</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <label className="text-sm">Zones de livraison</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={zones}
          onChange={(e) => setZones(e.target.value)}
        />
        <div className="flex justify-end">
          <Button onClick={save}>Sauvegarder</Button>
        </div>
      </div>
    </section>
  );
}
