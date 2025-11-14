// app/api/engines/route.ts
import { NextResponse } from 'next/server';
import { Engine } from '@/types/engine';

let ENGINES: Engine[] = [
  {
    id: 'e1',
    name: 'Pelle 20T - CAT',
    category: 'Pelle',
    hoursRate: 8000,
    dayRate: 60000,
    transportCost: 10000,
    available: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'e2',
    name: 'Camion benne 12T',
    category: 'Camion',
    hoursRate: 4000,
    dayRate: 30000,
    transportCost: 7000,
    available: true,
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (id) {
    const eng = ENGINES.find((e) => e.id === id);
    if (!eng)
      return NextResponse.json(
        { ok: false, message: 'Not found' },
        { status: 404 }
      );
    return NextResponse.json({ ok: true, engine: eng });
  }
  return NextResponse.json(ENGINES);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body as any;
    if (action === 'create') {
      const { engine } = body as any;
      ENGINES.push(engine);
      return NextResponse.json({ ok: true, engine });
    }
    if (action === 'update') {
      const { engine } = body as any;
      const idx = ENGINES.findIndex((e) => e.id === engine.id);
      if (idx === -1)
        return NextResponse.json(
          { ok: false, message: 'Not found' },
          { status: 404 }
        );
      ENGINES[idx] = {
        ...ENGINES[idx],
        ...engine,
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json({ ok: true, engine: ENGINES[idx] });
    }
    if (action === 'delete') {
      const { id } = body as any;
      ENGINES = ENGINES.filter((e) => e.id !== id);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { ok: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Invalid' },
      { status: 400 }
    );
  }
}
