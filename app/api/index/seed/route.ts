// app/api/index/seed/route.ts
import { NextResponse } from 'next/server';

// small seed for dev; adjust values as needed
const MATERIALS_SEED = [
  {
    id: 'm-ciment-42',
    name: 'Ciment 42.5',
    category: 'Ciment',
    price: 8500,
    unit: 'ton',
    supplierId: 'Fournisseur A',
    city: 'Alger',
    updatedAt: new Date().toISOString(),
    notes: 'Livraison 24h',
  },
  {
    id: 'm-fer-12',
    name: 'Fer 12mm (tonne)',
    category: 'Fer',
    price: 99000,
    unit: 'ton',
    supplierId: 'Fournisseur B',
    city: 'Blida',
    updatedAt: new Date().toISOString(),
    notes: 'Qualité S235',
  },
  {
    id: 'm-sable',
    name: 'Sable lavé',
    category: 'Sable',
    price: 2000,
    unit: 'm3',
    supplierId: 'Fournisseur C',
    city: 'Tipaza',
    updatedAt: new Date().toISOString(),
    notes: '',
  },
];

const ENGINES_SEED = [
  {
    id: 'e1',
    name: 'Pelle 20T - CAT',
    category: 'Pelle',
    hoursRate: 8000,
    dayRate: 60000,
    transportCost: 10000,
    supplierId: 'Location A',
    city: 'Alger',
    updatedAt: new Date().toISOString(),
    notes: 'Opérateur inclus',
  },
  {
    id: 'e2',
    name: 'Camion benne 12T',
    category: 'Camion',
    hoursRate: 4000,
    dayRate: 30000,
    transportCost: 7000,
    supplierId: 'Location B',
    city: 'Blida',
    updatedAt: new Date().toISOString(),
    notes: 'Gravel transport',
  },
];

export async function GET(request: Request) {
  // Call the index POST endpoints on the same origin to actually seed the in-memory stores
  try {
    const url = new URL(request.url);
    const origin = `${url.protocol}//${url.host}`;

    const matsRes = await fetch(`${origin}/api/index/materials`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(MATERIALS_SEED),
      cache: 'no-store',
    });

    if (!matsRes.ok) {
      const msg = await safeText(matsRes);
      throw new Error(`Seeding materials failed: ${matsRes.status} ${msg}`);
    }

    const engRes = await fetch(`${origin}/api/index/engines`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(ENGINES_SEED),
      cache: 'no-store',
    });

    if (!engRes.ok) {
      const msg = await safeText(engRes);
      throw new Error(`Seeding engines failed: ${engRes.status} ${msg}`);
    }

    const matsJson = await matsRes.json().catch(() => ({}));
    const engJson = await engRes.json().catch(() => ({}));

    return NextResponse.json({
      ok: true,
      materialsSeeded: Array.isArray(MATERIALS_SEED)
        ? MATERIALS_SEED.length
        : 0,
      enginesSeeded: Array.isArray(ENGINES_SEED) ? ENGINES_SEED.length : 0,
      materials: matsJson?.items ?? null,
      engines: engJson?.items ?? null,
    });
  } catch (err) {
    console.error('seed error', err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch (_) {
    return '';
  }
}
