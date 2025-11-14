// app/supplier-materials/devis/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Loader } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const CLIENTS = [
  { id: '1', name: 'Client A' },
  { id: '2', name: 'Client B' },
  { id: '3', name: 'Client C' },
];

export default function DevisPage() {
  const [devis, setDevis] = useState<any[]>([]);
  const [client, setClient] = useState('');
  const [itemName, setItemName] = useState('');
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [loadingDevis, setLoadingDevis] = useState(false);

  useEffect(() => {
    fetchDevis();
  }, []);

  async function fetchDevis() {
    setLoadingDevis(true);
    const res = await fetch('/api/devis');
    const data = await res.json();
    setDevis(data);
    setLoadingDevis(false);
  }

  async function createDevis() {
    setLoading(true);
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
      toast.success('Devis créé avec succès');
    } else {
      toast.error('Erreur lors de la création du devis');
    }
    setLoading(false);
  }

  return (
    <section className="p-4">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Générer un devis rapide</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Client</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    {client || 'Sélectionner un client'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {CLIENTS.map((c) => (
                    <DropdownMenuItem 
                      key={c.id} 
                      onClick={() => setClient(c.name)}
                    >
                      {c.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Produit</label>
              <input
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <input
                type="number"
                className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />
              <input
                type="number"
                className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <div className="flex items-center px-2">
                Total: {(qty * price).toLocaleString()} DA
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setClient('');
                  setItemName('');
                  setQty(1);
                  setPrice(0);
                }}
              >
                Annuler
              </Button>
              <Button 
                onClick={createDevis}
                disabled={loading}
                className="min-w-[120px] bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Créer devis
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Historique</h3>
          <div className="space-y-3">
            {loadingDevis ? (
              <div className="flex justify-center">
                <Loader className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              devis.map((d) => (
                <div 
                  key={d.id} 
                  className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="font-medium">{d.client}</strong>
                      <div className="text-sm text-slate-500 mt-1">
                        {new Date(d.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-indigo-600">
                        {d.total.toLocaleString()} DA
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {d.items.length} article{d.items.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
