'use client';
import React, { useEffect, useState } from 'react';
import { Engine } from '@/types/engine';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ScanSimulator from './ScanSimulator';
import { toast } from 'sonner';

export default function EngineDetailClient({ id }: { id?: string }) {
  const [engine, setEngine] = useState<Engine | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [hoursRate, setHoursRate] = useState<number>(0);
  const [dayRate, setDayRate] = useState<number>(0);
  const [scanOpen, setScanOpen] = useState(false);
  const [synced, setSynced] = useState(false);
  const router = useRouter();

  async function fetchEngine() {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/engines?id=${encodeURIComponent(id)}`);
      const json = await res.json();
      if (json?.ok) setEngine(json.engine);
      else setEngine(null);
    } catch (err) {
      console.error(err);
      setEngine(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetchEngine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (engine) {
      setHoursRate(engine.hoursRate);
      setDayRate(engine.dayRate);
    }
  }, [engine]);

  async function save() {
    if (!engine) return;
    const res = await fetch('/api/engines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        engine: { id: engine.id, hoursRate, dayRate },
      }),
    });
    const json = await res.json();
    if (json?.ok) {
      setEngine(json.engine);
      setEditing(false);

      // sync to index
      try {
        await fetch('/api/index/engines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: json.engine.id,
            name: json.engine.name,
            category: json.engine.category,
            hoursRate: json.engine.hoursRate,
            dayRate: json.engine.dayRate,
            transportCost: json.engine.transportCost,
            available: json.engine.available,
            updatedAt: json.engine.updatedAt,
            supplierId: 'supplier_123', // mock supplier id
          }),
        });
        setSynced(true);
        setTimeout(() => setSynced(false), 3000);
      } catch (err) {
        console.error('sync index engines error', err);
      }
    } else {
      toast.error('Erreur lors de la sauvegarde');
    }
  }

  if (loading) return <div>Chargement...</div>;
  if (!id) return <div className="text-sm text-amber-600">ID manquant</div>;
  if (!engine) return <div>Engin introuvable</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{engine.name}</h2>
          <div className="text-sm text-slate-500">{engine.category}</div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/supplier-engines/fleet')}
          >
            Retour
          </Button>
          <Button onClick={() => setEditing((e) => !e)}>
            {editing ? 'Annuler' : 'Modifier'}
          </Button>
          <Button onClick={() => setScanOpen(true)}>Scan QR</Button>
        </div>
      </div>

      {!editing ? (
        <div className="bg-white border rounded p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-500">Prix /h</div>
              <div className="text-lg font-semibold">
                {engine.hoursRate.toLocaleString()} DA
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Prix /j</div>
              <div className="text-lg font-semibold">
                {engine.dayRate.toLocaleString()} DA
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-3">
            Dernière mise à jour: {new Date(engine.updatedAt).toLocaleString()}
          </div>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="text-slate-500">Index:</span>
            <span
              className={`font-medium ${
                synced ? 'text-emerald-600' : 'text-slate-600'
              }`}
            >
              {synced ? 'Synchronisé' : '—'}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white border rounded p-4">
          <label className="text-sm block mb-1">Prix /h</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 mb-3"
            value={hoursRate}
            onChange={(e) => setHoursRate(Number(e.target.value))}
          />
          <label className="text-sm block mb-1">Prix /j</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 mb-3"
            value={dayRate}
            onChange={(e) => setDayRate(Number(e.target.value))}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Annuler
            </Button>
            <Button onClick={save}>Enregistrer</Button>
          </div>
        </div>
      )}

      {scanOpen && (
        <ScanSimulator
          onClose={() => setScanOpen(false)}
          onResult={async (payload) => {
            // refresh engine & missions after scan result
            await fetchEngine();
            // optionally refresh missions or global data - we just refetch engine here
          }}
        />
      )}
    </div>
  );
}
