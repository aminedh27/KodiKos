'use client';
import React, { useEffect, useState } from 'react';
import { Mission } from '@/types/mission';
import { Button } from '@/components/ui/button';
import ScanSimulator from '@/components/supplier-engines/ScanSimulator';
import { toast } from 'sonner';

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState('');
  const [engineId, setEngineId] = useState('');
  const [engines, setEngines] = useState<any[]>([]);
  const [scanOpen, setScanOpen] = useState(false);

  useEffect(() => {
    fetchAll();
    fetchEngines();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await fetch('/api/missions');
      const data = await res.json();
      setMissions(data);
    } catch (err) {
      console.error(err);
      setMissions([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchEngines() {
    try {
      const res = await fetch('/api/engines');
      const e = await res.json();
      setEngines(e);
    } catch (err) {
      console.error(err);
      setEngines([]);
    }
  }

  async function createMission() {
    if (!engineId || !client) {
      toast.warning('Sélectionner engin et client');
      return;
    }
    const mission = { engineId, client, status: 'planned' };
    const res = await fetch('/api/missions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', mission }),
    });
    const json = await res.json();
    if (json?.ok) {
      setClient('');
      setEngineId('');
      fetchAll();
    } else toast.error('Erreur création mission');
  }

  async function startMission(id: string) {
    const res = await fetch('/api/missions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start', id }),
    });
    const json = await res.json();
    if (json?.ok) fetchAll();
    else toast.error('Erreur démarrage');
  }

  async function stopMission(id: string) {
    const res = await fetch('/api/missions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'stop', id }),
    });
    const json = await res.json();
    if (json?.ok) fetchAll();
    else toast.error('Erreur arrêt');
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Missions</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAll}>
            Rafraîchir
          </Button>
          <Button onClick={() => setScanOpen(true)}>Scanner QR</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border rounded p-4">
          <h3 className="font-medium mb-3">Planifier mission</h3>
          <label className="text-sm">Client</label>
          <input
            className="w-full border rounded px-3 py-2 mb-2"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
          <label className="text-sm">Engin</label>
          <select
            className="w-full border rounded px-3 py-2 mb-3"
            value={engineId}
            onChange={(e) => setEngineId(e.target.value)}
          >
            <option value="">Choisir un engin</option>
            {engines.map((en: any) => (
              <option key={en.id} value={en.id}>
                {en.name}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setClient('');
                setEngineId('');
              }}
            >
              Annuler
            </Button>
            <Button onClick={createMission}>Créer</Button>
          </div>
        </div>

        <div className="bg-white border rounded p-4">
          <h3 className="font-medium mb-3">Missions</h3>
          <ul className="space-y-2">
            {missions.map((m) => (
              <li
                key={m.id}
                className="border rounded p-2 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{m.client}</div>
                  <div className="text-xs text-slate-500">
                    {m.status}{' '}
                    {m.start
                      ? ` • démarré: ${new Date(m.start).toLocaleString()}`
                      : ''}{' '}
                    {m.end
                      ? ` • terminé: ${new Date(m.end).toLocaleString()}`
                      : ''}
                  </div>
                </div>
                <div className="flex gap-2">
                  {m.status === 'planned' && (
                    <Button onClick={() => startMission(m.id)}>Démarrer</Button>
                  )}
                  {m.status === 'in_progress' && (
                    <Button
                      variant="destructive"
                      onClick={() => stopMission(m.id)}
                    >
                      Terminer
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {scanOpen && (
        <ScanSimulator
          onClose={() => {
            setScanOpen(false);
            fetchAll();
          }}
          onResult={() => {
            fetchAll();
            fetchEngines();
            setScanOpen(false);
          }}
        />
      )}
    </section>
  );
}
