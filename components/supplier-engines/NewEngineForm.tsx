'use client';
import React, { useState } from 'react';
import { Engine, EngineCategory } from '@/types/engine';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const CATEGORIES: EngineCategory[] = [
  'Pelle',
  'Bulldozer',
  'Compacteur',
  'Camion',
  'Nacelle',
  'Autre',
];

export default function NewEngineForm() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<EngineCategory>('Pelle');
  const [hoursRate, setHoursRate] = useState<number | ''>('');
  const [dayRate, setDayRate] = useState<number | ''>('');
  const [transportCost, setTransportCost] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function validate() {
    if (!name.trim()) return 'Nom requis';
    if (hoursRate === '' || Number(hoursRate) < 0) return 'Prix /h invalide';
    if (dayRate === '' || Number(dayRate) < 0) return 'Prix /j invalide';
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) return toast.error(v);
    setLoading(true);
    const engine: Engine = {
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      hoursRate: Number(hoursRate),
      dayRate: Number(dayRate),
      transportCost: Number(transportCost || 0),
      available: true,
      updatedAt: new Date().toISOString(),
    };
    const res = await fetch('/api/engines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', engine }),
    });
    const json = await res.json();
    setLoading(false);
    if (json?.ok) {
      router.push('/supplier-engines/fleet');
    } else {
      toast.error('Erreur création');
    }
  }

  return (
    <form onSubmit={submit} className="bg-white border rounded p-6 max-w-xl">
      <div className="grid gap-3">
        <label className="text-sm">Nom</label>
        <input
          className="border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="text-sm">Catégorie</label>
        <select
          className="border rounded px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value as EngineCategory)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm">Prix /h (DA)</label>
            <input
              type="number"
              className="border rounded px-3 py-2"
              value={hoursRate}
              onChange={(e) =>
                setHoursRate(
                  e.target.value === '' ? '' : Number(e.target.value)
                )
              }
            />
          </div>
          <div>
            <label className="text-sm">Prix /j (DA)</label>
            <input
              type="number"
              className="border rounded px-3 py-2"
              value={dayRate}
              onChange={(e) =>
                setDayRate(e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </div>
        </div>

        <label className="text-sm">Transport (DA)</label>
        <input
          type="number"
          className="border rounded px-3 py-2"
          value={transportCost}
          onChange={(e) =>
            setTransportCost(
              e.target.value === '' ? '' : Number(e.target.value)
            )
          }
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </div>
    </form>
  );
}
