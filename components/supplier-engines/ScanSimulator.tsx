'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Payload = {
  engineId?: string;
  missionId?: string;
  action?: 'start' | 'stop';
};

type Props = {
  onClose: () => void;
  onResult?: (payload: Payload) => void;
};

export default function ScanSimulator({ onClose, onResult }: Props) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  function simulateForEngine(engineId: string) {
    setText(`ENGINE:${engineId}`);
  }

  async function submit() {
    setLoading(true);
    const t = text.trim();
    let engineId: string | undefined;
    let missionId: string | undefined;
    let action: 'start' | 'stop' | undefined;

    if (!t) {
      toast.error('Entrez ou simulez un code (ex: ENGINE:e1 or MISSION:m1:start)');
      setLoading(false);
      return;
    }

    try {
      if (t.startsWith('ENGINE:')) {
        const parts = t.split(':');
        engineId = parts[1];
        if (parts[2] === 'start') action = 'start';
        if (parts[2] === 'stop') action = 'stop';
      } else if (t.startsWith('MISSION:')) {
        const parts = t.split(':');
        missionId = parts[1];
        if (parts[2] === 'start') action = 'start';
        if (parts[2] === 'stop') action = 'stop';
      } else {
        toast.error('Format invalide. Use ENGINE:<id> or MISSION:<id>:start');
        setLoading(false);
        return;
      }

      // If missionId + action -> call start/stop
      if (missionId && action) {
        const res = await fetch('/api/missions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: action === 'start' ? 'start' : 'stop',
            id: missionId,
          }),
        });
        const json = await res.json();
        if (!json?.ok) throw new Error(json?.message || 'Erreur API missions');
        onResult?.({ engineId, missionId, action });
        onClose();
        return;
      }

      // If engineId + action -> create mission then start/stop accordingly
      if (engineId && action) {
        // create mission
        const create = await fetch('/api/missions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            mission: { engineId, client: 'ScanAuto', status: 'planned' },
          }),
        });
        const createJson = await create.json();
        if (!createJson?.ok) throw new Error('Erreur création mission');
        const mid = createJson.mission.id;

        // if start requested, start it
        if (action === 'start') {
          const startRes = await fetch('/api/missions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'start', id: mid }),
          });
          const startJson = await startRes.json();
          if (!startJson?.ok) throw new Error('Erreur démarrage mission');
        }

        onResult?.({ engineId, missionId: mid, action });
        onClose();
        return;
      }

      // If engineId && no action -> create planned mission only
      if (engineId && !action) {
        const create = await fetch('/api/missions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            mission: { engineId, client: 'ScanAuto', status: 'planned' },
          }),
        });
        const createJson = await create.json();
        if (!createJson?.ok) throw new Error('Erreur création mission');
        onResult?.({
          engineId,
          missionId: createJson.mission.id,
          action: 'start',
        });
        onClose();
        return;
      }

      toast.error('Aucune action traitée');
    } catch (err: any) {
      console.error(err);
      toast.error('Erreur: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-md w-full max-w-md p-6 shadow-lg">
        <h3 className="text-lg font-medium mb-3">Simulateur de scan QR</h3>

        <div className="mb-3">
          <div className="text-sm text-slate-600 mb-2">Simulations rapides</div>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => simulateForEngine('e1')}
              className="px-3 py-1 rounded bg-slate-100 text-sm"
            >
              ENGINE:e1
            </button>
            <button
              type="button"
              onClick={() => simulateForEngine('e2')}
              className="px-3 py-1 rounded bg-slate-100 text-sm"
            >
              ENGINE:e2
            </button>
            <button
              type="button"
              onClick={() => setText('ENGINE:e1:start')}
              className="px-3 py-1 rounded bg-indigo-50 text-sm"
            >
              Start e1
            </button>
            <button
              type="button"
              onClick={() => setText('ENGINE:e1:stop')}
              className="px-3 py-1 rounded bg-amber-50 text-sm"
            >
              Stop e1
            </button>
            <button
              type="button"
              onClick={() => setText('MISSION:m1:start')}
              className="px-3 py-1 rounded bg-emerald-50 text-sm"
            >
              Start mission m1
            </button>
          </div>
        </div>

        <label className="text-sm block mb-1">Code scanné</label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="ENGINE:e1 or MISSION:m1:start"
        />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={submit} disabled={loading}>
            {loading ? 'Traitement...' : 'Valider scan'}
          </Button>
        </div>
      </div>
    </div>
  );
}
