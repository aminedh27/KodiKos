// app/api/devis/route.ts
import { NextResponse } from 'next/server';

let DEVIS = [
  {
    id: 'd1',
    client: 'Sarl ABC',
    items: [{ name: 'Ciment 42.5', qty: 10, unit: 'ton', price: 8500 }],
    total: 85000,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(DEVIS);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = crypto.randomUUID();
    const newDevis = { id, ...body, createdAt: new Date().toISOString() };
    DEVIS.unshift(newDevis);
    return NextResponse.json({ ok: true, devis: newDevis });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
