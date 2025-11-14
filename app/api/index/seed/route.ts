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

export async function GET() {
  // forward the seed to the index POST handlers programmatically
  try {
    // call the materials and engines POST endpoints internally (so they fill the in-memory arrays)
    // Note: we use absolute paths because calling internal route functions directly is not trivial here.
    // For simplicity, return the arrays and instruct user to POST them if needed.
    return NextResponse.json({
      ok: true,
      materials: MATERIALS_SEED,
      engines: ENGINES_SEED,
    });
  } catch (err) {
    console.error('seed error', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
