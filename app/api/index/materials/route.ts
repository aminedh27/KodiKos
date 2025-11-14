// app/api/index/materials/route.ts
import { NextResponse } from 'next/server';

type IndexItem = {
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

let INDEX_MATS: IndexItem[] = [];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (id) {
      const item = INDEX_MATS.find((i) => i.id === id);
      if (!item)
        return NextResponse.json(
          { ok: false, message: 'Not found' },
          { status: 404 }
        );
      return NextResponse.json({ ok: true, item });
    }
    return NextResponse.json({ ok: true, items: INDEX_MATS });
  } catch (err) {
    console.error('GET index materials error', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Accept either single item or array
    const incoming = Array.isArray(body)
      ? body
      : body.item
      ? Array.isArray(body.item)
        ? body.item
        : [body.item]
      : [body];

    for (const it of incoming) {
      if (!it?.id) {
        // try to generate an id if missing (dev only)
        // eslint-disable-next-line no-undef
        it.id =
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      }
      const idx = INDEX_MATS.findIndex((x) => x.id === it.id);
      if (idx === -1) INDEX_MATS.push({ ...it });
      else INDEX_MATS[idx] = { ...INDEX_MATS[idx], ...it };
    }

    return NextResponse.json({ ok: true, items: INDEX_MATS });
  } catch (err) {
    console.error('POST index materials error', err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
