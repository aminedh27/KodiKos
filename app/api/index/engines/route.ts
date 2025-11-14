// app/api/index/engines/route.ts
import { NextResponse } from 'next/server';

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

let INDEX_ENG: IndexEngine[] = [];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (id) {
      const item = INDEX_ENG.find((i) => i.id === id);
      if (!item)
        return NextResponse.json(
          { ok: false, message: 'Not found' },
          { status: 404 }
        );
      return NextResponse.json({ ok: true, item });
    }
    return NextResponse.json({ ok: true, items: INDEX_ENG });
  } catch (err) {
    console.error('GET index engines error', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const incoming = Array.isArray(body)
      ? body
      : body.item
      ? Array.isArray(body.item)
        ? body.item
        : [body.item]
      : [body];

    for (const it of incoming) {
      if (!it?.id) {
        // eslint-disable-next-line no-undef
        it.id =
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      }
      const idx = INDEX_ENG.findIndex((x) => x.id === it.id);
      if (idx === -1) INDEX_ENG.push({ ...it });
      else INDEX_ENG[idx] = { ...INDEX_ENG[idx], ...it };
    }

    return NextResponse.json({ ok: true, items: INDEX_ENG });
  } catch (err) {
    console.error('POST index engines error', err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
