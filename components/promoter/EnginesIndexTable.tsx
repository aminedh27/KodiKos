'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type IndexEngine = {
  id: string;
  name: string;
  category?: string;
  hoursRate?: number;
  dayRate?: number;
  transportCost?: number;
  supplierId?: string;
  city?: string;
  updatedAt?: string;
  notes?: string;
};

export default function EnginesIndexTable() {
  const [items, setItems] = useState<IndexEngine[]>([]);
  const [loading, setLoading] = useState(true);

  // filters / search / sort states
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<
    'hour_asc' | 'hour_desc' | 'day_asc' | 'day_desc' | 'updated_desc'
  >('hour_asc');

  // pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    async function fetchIndex() {
      setLoading(true);
      try {
        const res = await fetch('/api/index/engines');
        const data = await res.json();
        const arr = Array.isArray(data)
          ? data
          : Array.isArray(data?.item)
          ? data.item
          : [];
        setItems(arr as IndexEngine[]);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchIndex();
  }, []);

  const categories = useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => {
      if (i.category) s.add(i.category);
    });
    return Array.from(s).sort();
  }, [items]);

  const cities = useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => {
      if (i.city) s.add(i.city);
    });
    return Array.from(s).sort();
  }, [items]);

  function matchesQuery(item: IndexEngine, query: string) {
    if (!query) return true;
    const ql = query.toLowerCase();
    return (
      (item.name ?? '').toLowerCase().includes(ql) ||
      (item.category ?? '').toLowerCase().includes(ql) ||
      (item.supplierId ?? '').toLowerCase().includes(ql) ||
      (item.notes ?? '').toLowerCase().includes(ql)
    );
  }

  const filtered = useMemo(() => {
    let arr = items.slice();

    if (q.trim()) arr = arr.filter((it) => matchesQuery(it, q.trim()));
    if (category) arr = arr.filter((it) => (it.category ?? '') === category);
    if (city) arr = arr.filter((it) => (it.city ?? '') === city);
    if (minPrice !== '')
      arr = arr.filter((it) =>
        typeof it.hoursRate === 'number'
          ? it.hoursRate >= Number(minPrice)
          : false
      );
    if (maxPrice !== '')
      arr = arr.filter((it) =>
        typeof it.hoursRate === 'number'
          ? it.hoursRate <= Number(maxPrice)
          : false
      );

    // sort
    if (sortBy === 'hour_asc')
      arr.sort((a, b) => (a.hoursRate ?? Infinity) - (b.hoursRate ?? Infinity));
    if (sortBy === 'hour_desc')
      arr.sort(
        (a, b) => (b.hoursRate ?? -Infinity) - (a.hoursRate ?? -Infinity)
      );
    if (sortBy === 'day_asc')
      arr.sort((a, b) => (a.dayRate ?? Infinity) - (b.dayRate ?? Infinity));
    if (sortBy === 'day_desc')
      arr.sort((a, b) => (b.dayRate ?? -Infinity) - (a.dayRate ?? -Infinity));
    if (sortBy === 'updated_desc')
      arr.sort(
        (a, b) =>
          new Date(b.updatedAt ?? 0).getTime() -
          new Date(a.updatedAt ?? 0).getTime()
      );

    return arr;
  }, [items, q, category, city, minPrice, maxPrice, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  useEffect(() => {
    setPage(1);
  }, [q, category, city, minPrice, maxPrice, sortBy]);

  if (loading) return <div>Chargement...</div>;
  if (!items.length) return <div>Aucune donnée d'index disponible.</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded p-3 flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex-1 min-w-0">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Recherche (engin, catégorie, fournisseur, notes)..."
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-2 py-2"
          >
            <option value="">Toutes catégories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border rounded px-2 py-2"
          >
            <option value="">Toutes villes</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="min DA/h"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="border rounded px-2 py-2 w-28"
          />
          <input
            type="number"
            placeholder="max DA/h"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="border rounded px-2 py-2 w-28"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border rounded px-2 py-2"
          >
            <option value="hour_asc">Prix /h ↑</option>
            <option value="hour_desc">Prix /h ↓</option>
            <option value="day_asc">Prix /j ↑</option>
            <option value="day_desc">Prix /j ↓</option>
            <option value="updated_desc">Dernière MAJ ↓</option>
          </select>
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-600 border-b">
            <tr>
              <th className="py-2">Engin</th>
              <th className="py-2">Prix /h</th>
              <th className="py-2">Prix /j</th>
              <th className="py-2">Fournisseur / Ville</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((it) => (
              <tr key={it.id} className="hover:bg-slate-50">
                <td className="py-2">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-slate-500">{it.category}</div>
                </td>
                <td className="py-2">{(it.hoursRate ?? 0).toLocaleString()}</td>
                <td className="py-2">{(it.dayRate ?? 0).toLocaleString()}</td>
                <td className="py-2">
                  {it.supplierId ?? '—'} {it.city ? `• ${it.city}` : ''}
                </td>
                <td className="py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/promoter/index-engines/${it.id}`}
                      className="px-3 py-1 rounded bg-teal-50 text-teal-700 text-sm"
                    >
                      Détails
                    </Link>
                    <button
                      onClick={() => {
                        const url = new URL(location.href);
                        url.pathname = '/promoter/index-materials/compare';
                        url.searchParams.set('ids', it.id);
                        location.href = url.toString();
                      }}
                      className="px-3 py-1 rounded bg-slate-50 text-sm"
                    >
                      Comparer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 flex items-center justify-between text-sm">
          <div>{filteredSummary(filtered.length)}</div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Préc
            </button>
            <span>
              Page {page}/{totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Suiv
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function filteredSummary(count: number) {
    return `${count} offre(s) — filtre actif`;
  }
}
