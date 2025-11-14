// app/supplier-materials/devis/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DevisPage() {
  const [devis, setDevis] = useState<any[]>([]);
  const [client, setClient] = useState('');
  const [itemName, setItemName] = useState('');
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    fetchDevis();
  }, []);

  async function fetchDevis() {
    const res = await fetch('/api/devis');
    const data = await res.json();
    setDevis(data);
  }

  async function createDevis() {
    const total = qty * price;
    const res = await fetch('/api/devis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client,
        items: [{ name: itemName, qty, price }],
        total,
      }),
    });
    const json = await res.json();
    if (json?.ok) {
      setClient('');
      setItemName('');
      setQty(1);
      setPrice(0);
      fetchDevis();
      alert('Devis créé (mock)');
    } else alert('Erreur');
  }

  return (
    <section>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border rounded p-4">
          <h3 className="font-medium mb-3">Générer un devis rapide</h3>
          <label className="block text-sm mb-1">Client</label>
          <input
            className="w-full border rounded px-3 py-2 mb-2"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
          <label className="block text-sm mb-1">Produit</label>
          <input
            className="w-full border rounded px-3 py-2 mb-2"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <div className="grid grid-cols-3 gap-2 mb-3">
            <input
              type="number"
              className="border rounded px-2 py-1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
            <input
              type="number"
              className="border rounded px-2 py-1"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <div className="flex items-center px-2">
              Total: {(qty * price).toLocaleString()} DA
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setClient('');
                setItemName('');
                setQty(1);
                setPrice(0);
              }}
            >
              Annuler
            </Button>
            <Button onClick={createDevis}>Créer devis</Button>
          </div>
        </div>

        <div className="bg-white border rounded p-4">
          <h3 className="font-medium mb-3">Historique derniers devis</h3>
          <ul className="space-y-2 text-sm">
            {devis.map((d) => (
              <li key={d.id} className="border rounded p-2">
                <div className="flex justify-between">
                  <strong>{d.client}</strong>
                  <span className="text-slate-500 text-xs">
                    {new Date(d.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Total: {d.total.toLocaleString()} DA
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
