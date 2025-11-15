'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import CompareResults from './CompareResults';

export default function ComparePicker() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    async function fetchIndex() {
      try {
        const res = await fetch('/api/index/materials', { cache: 'no-store' });
        const data = await res.json();
        const arr = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data)
          ? data
          : Array.isArray(data?.item)
          ? data.item
          : [];
        setItems(arr);

        // preselect from URL query (?ids=a,b,c)
        const usp = new URLSearchParams(location.search);
        const idsParam = usp.get('ids') ?? '';
        if (idsParam) {
          const ids = idsParam
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
          // only keep ids that exist in items
          const existing = new Set(arr.map((x: any) => x.id));
          setSelected(ids.filter((id) => existing.has(id)).slice(0, 5));
          setShowResults(ids.length >= 2);
        }
      } catch (err) {
        setItems([]);
      }
    }
    fetchIndex();
  }, []);

  function toggle(id: string) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id].slice(0, 5)
    ); // limit 5
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded p-4">
        <div className="text-sm text-slate-500 mb-2">
          Sélectionne jusqu'à 5 offres pour comparer
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-h-64 overflow-auto">
          {items.map((it) => (
            <label
              key={it.id}
              className={`p-3 border rounded flex items-center justify-between cursor-pointer ${
                selected.includes(it.id) ? 'bg-teal-50 border-teal-300' : ''
              }`}
            >
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-xs text-slate-500">
                  {it.supplierId ?? ''} • {it.category}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {(it.price ?? 0).toLocaleString()}
                </div>
                <input
                  type="checkbox"
                  checked={selected.includes(it.id)}
                  onChange={() => toggle(it.id)}
                />
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-3">
          <Button
            variant="ghost"
            onClick={() => {
              setSelected([]);
              setShowResults(false);
            }}
          >
            Réinitialiser
          </Button>
          <Button
            onClick={() => setShowResults(true)}
            disabled={selected.length < 2}
          >
            Comparer ({selected.length})
          </Button>
        </div>
      </div>

      {showResults && (
        <CompareResults ids={selected} onClose={() => setShowResults(false)} />
      )}
    </div>
  );
}
