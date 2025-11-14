'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type IndexMaterial = {
  id: string;
  name: string;
  category?: string;
  price?: number;
  unit?: string;
  supplierId?: string;
  city?: string;
  updatedAt?: string;
  notes?: string;
};

export default function MaterialsIndexTable() {
  const [items, setItems] = useState<IndexMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  // filters / sort / search states
  const [q, setQ] = useState(''); // full-text query
  const [category, setCategory] = useState<string>(''); // selected category
  const [city, setCity] = useState<string>(''); // selected city
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<
    'price_asc' | 'price_desc' | 'updated_desc' | 'updated_asc'
  >('price_asc');

  // pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    async function fetchIndex() {
      setLoading(true);
      try {
        const res = await fetch('/api/index/materials');
        const data = await res.json();
        // normalize: if API returns { ok: true, item } or array
        const arr = Array.isArray(data)
          ? data
          : Array.isArray(data?.item)
          ? data.item
          : data?.ok
          ? data.item
            ? [data.item]
            : []
          : [];
        setItems(arr as IndexMaterial[]);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchIndex();
  }, []);

  // derive category & city list for filters
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

  // full-text match helper (case-insensitive)
  function matchesQuery(item: IndexMaterial, query: string) {
    if (!query) return true;
    const ql = query.toLowerCase();
    return (
      (item.name ?? '').toLowerCase().includes(ql) ||
      (item.category ?? '').toLowerCase().includes(ql) ||
      (item.supplierId ?? '').toLowerCase().includes(ql) ||
      (item.notes ?? '').toLowerCase().includes(ql)
    );
  }

  // filtered + sorted items
  const filtered = useMemo(() => {
    let arr = items.slice();

    // search
    if (q.trim()) arr = arr.filter((it) => matchesQuery(it, q.trim()));

    // category filter
    if (category) arr = arr.filter((it) => (it.category ?? '') === category);

    // city filter
    if (city) arr = arr.filter((it) => (it.city ?? '') === city);

    // price range
    if (minPrice !== '')
      arr = arr.filter((it) =>
        typeof it.price === 'number' ? it.price >= Number(minPrice) : false
      );
    if (maxPrice !== '')
      arr = arr.filter((it) =>
        typeof it.price === 'number' ? it.price <= Number(maxPrice) : false
      );

    // sort
    if (sortBy === 'price_asc')
      arr.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sortBy === 'price_desc')
      arr.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    if (sortBy === 'updated_desc')
      arr.sort(
        (a, b) =>
          new Date(b.updatedAt ?? 0).getTime() -
          new Date(a.updatedAt ?? 0).getTime()
      );
    if (sortBy === 'updated_asc')
      arr.sort(
        (a, b) =>
          new Date(a.updatedAt ?? 0).getTime() -
          new Date(b.updatedAt ?? 0).getTime()
      );

    return arr;
  }, [items, q, category, city, minPrice, maxPrice, sortBy]);

  // pagination slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [q, category, city, minPrice, maxPrice, sortBy]);

  if (loading) return <div>Chargement...</div>;
  if (!items.length) return <div>Aucune donnée d'index disponible.</div>;

  return (
    <div className="space-y-4">
      {/* controls */}
      <div className="bg-white border rounded p-3 flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex-1 min-w-0">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Recherche full-text (nom, catégorie, fournisseur, notes)..."
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
            placeholder="min DA"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="border rounded px-2 py-2 w-24"
          />
          <input
            type="number"
            placeholder="max DA"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="border rounded px-2 py-2 w-24"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border rounded px-2 py-2"
          >
            <option value="price_asc">Prix ↑</option>
            <option value="price_desc">Prix ↓</option>
            <option value="updated_desc">Dernière MAJ ↓</option>
            <option value="updated_asc">Dernière MAJ ↑</option>
          </select>
        </div>
      </div>

      {/* table */}
      <div className="bg-white border rounded p-4">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-600 border-b">
            <tr>
              <th className="py-2">Produit</th>
              <th className="py-2">Prix (DA)</th>
              <th className="py-2">Fournisseur / Ville</th>
              <th className="py-2">Dernière MAJ</th>
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
                <td className="py-2">
                  {(it.price ?? 0).toLocaleString()} {it.unit ?? ''}
                </td>
                <td className="py-2">
                  {it.supplierId ?? '—'} {it.city ? `• ${it.city}` : ''}
                </td>
                <td className="py-2 text-slate-500">
                  {it.updatedAt ? new Date(it.updatedAt).toLocaleString() : '—'}
                </td>
                <td className="py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/promoter/index-materials/${it.id}`}
                      className="px-3 py-1 rounded bg-teal-50 text-teal-700 text-sm"
                    >
                      Détails
                    </Link>
                    <button
                      onClick={() => {
                        const url = new URL(location.href);
                        url.pathname = '/promoter/index-materials/compare';
                        const ids = url.searchParams.get('ids') ?? '';
                        const newIds = ids ? `${ids},${it.id}` : it.id;
                        url.searchParams.set('ids', newIds);
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

        {/* pagination */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <div>
            {filteredSummary(
              filteredCount((filtered.length = filtered.length))
            )}
          </div>
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

  // helper to produce a small summary text
  function filteredCount(n: number) {
    return n;
  } // placeholder (kept for readability)
  function filteredSummary(n: number) {
    return `${n} offre(s) — filtre actif`;
  }
}
