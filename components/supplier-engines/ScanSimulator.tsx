'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  QrCode,
  Scan,
  Truck,
  Play,
  Square,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const quickActions = [
    {
      label: 'Engin E1',
      value: 'ENGINE:e1',
      color: 'bg-slate-100 hover:bg-slate-200',
      icon: Truck,
    },
    {
      label: 'Engin E2',
      value: 'ENGINE:e2',
      color: 'bg-slate-100 hover:bg-slate-200',
      icon: Truck,
    },
    {
      label: 'Start E1',
      value: 'ENGINE:e1:start',
      color: 'bg-green-50 hover:bg-green-100 text-green-700',
      icon: Play,
    },
    {
      label: 'Stop E1',
      value: 'ENGINE:e1:stop',
      color: 'bg-red-50 hover:bg-red-100 text-red-700',
      icon: Square,
    },
    {
      label: 'Mission M1',
      value: 'MISSION:m1:start',
      color: 'bg-amber-50 hover:bg-amber-100 text-amber-700',
      icon: CheckCircle2,
    },
  ];

  function simulateCode(value: string) {
    setText(value);
    setError('');
    setSuccess(false);
  }

  async function submit() {
    setLoading(true);
    setError('');
    setSuccess(false);

    const t = text.trim();
    let engineId: string | undefined;
    let missionId: string | undefined;
    let action: 'start' | 'stop' | undefined;

    if (!t) {
      setError('Veuillez entrer ou sélectionner un code QR');
      setLoading(false);
      return;
    }

    try {
      // Parse QR code format
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
        setError('Format invalide. Utilisez ENGINE:<id> ou MISSION:<id>:start');
        setLoading(false);
        return;
      }

      // Handle mission with action
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

        if (!json?.ok) {
          throw new Error(
            json?.message || 'Erreur lors de la mise à jour de la mission'
          );
        }

        setSuccess(true);
        setTimeout(() => {
          onResult?.({ engineId, missionId, action });
          onClose();
        }, 1500);
        return;
      }

      // Handle engine with action
      if (engineId && action) {
        // Create mission
        const create = await fetch('/api/missions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            mission: { engineId, client: 'ScanAuto', status: 'planned' },
          }),
        });
        const createJson = await create.json();

        if (!createJson?.ok) {
          throw new Error('Erreur lors de la création de la mission');
        }

        const mid = createJson.mission.id;

        // Start mission if requested
        if (action === 'start') {
          const startRes = await fetch('/api/missions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'start', id: mid }),
          });
          const startJson = await startRes.json();

          if (!startJson?.ok) {
            throw new Error('Erreur lors du démarrage de la mission');
          }
        }

        setSuccess(true);
        setTimeout(() => {
          onResult?.({ engineId, missionId: mid, action });
          onClose();
        }, 1500);
        return;
      }

      // Handle engine without action (create planned mission)
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

        if (!createJson?.ok) {
          throw new Error('Erreur lors de la création de la mission');
        }

        setSuccess(true);
        setTimeout(() => {
          onResult?.({
            engineId,
            missionId: createJson.mission.id,
            action: 'start',
          });
          onClose();
        }, 1500);
        return;
      }

      setError('Action non reconnue');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Scanner QR Code</CardTitle>
              <CardDescription>
                Démarrez ou arrêtez une mission rapidement
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success Alert */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 font-medium">
                Action réalisée avec succès !
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Actions */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">
              Actions Rapides
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.value}
                    type="button"
                    variant="outline"
                    onClick={() => simulateCode(action.value)}
                    disabled={loading}
                    className={`h-auto py-3 flex-col gap-2 ${action.color} border transition-all`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Manual Input */}
          <div className="space-y-2">
            <Label
              htmlFor="qr-code"
              className="text-sm font-medium text-slate-700"
            >
              Code QR Scanné
            </Label>
            <div className="relative">
              <Scan className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="qr-code"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError('');
                  setSuccess(false);
                }}
                disabled={loading}
                className="pl-10"
                placeholder="ENGINE:e1 ou MISSION:m1:start"
              />
            </div>
            <p className="text-xs text-slate-500">
              Format: ENGINE:&lt;id&gt;[:action] ou
              MISSION:&lt;id&gt;:&lt;action&gt;
            </p>
          </div>

          {/* Format Examples */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-2">
              Formats acceptés:
            </p>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px]">
                  ENGINE:e1
                </Badge>
                <span>Créer mission planifiée</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px]">
                  ENGINE:e1:start
                </Badge>
                <span>Créer et démarrer mission</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px]">
                  MISSION:m1:start
                </Badge>
                <span>Démarrer mission existante</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px]">
                  MISSION:m1:stop
                </Badge>
                <span>Terminer mission</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={submit}
              disabled={loading || !text.trim()}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 mr-2" />
                  Valider Scan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
