// app/api/missions/route.ts
import { NextResponse } from 'next/server';
import { Mission } from '@/types/mission';

let MISSIONS: Mission[] = [
  {
    id: 'm1',
    engineId: 'e1',
    client: 'Promoteur X',
    start: undefined,
    end: undefined,
    status: 'planned',
  },
];

export async function GET(request: Request) {
  return NextResponse.json(MISSIONS);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body as any;
    if (action === 'create') {
      const id = crypto.randomUUID();
      const newM = { id, ...body.mission, status: 'planned' } as Mission;
      MISSIONS.unshift(newM);
      return NextResponse.json({ ok: true, mission: newM });
    }
    if (action === 'start') {
      const { id } = body as any;
      const idx = MISSIONS.findIndex((m) => m.id === id);
      if (idx === -1)
        return NextResponse.json(
          { ok: false, message: 'Not found' },
          { status: 404 }
        );
      MISSIONS[idx].status = 'in_progress';
      MISSIONS[idx].start = new Date().toISOString();
      return NextResponse.json({ ok: true, mission: MISSIONS[idx] });
    }
    if (action === 'stop') {
      const { id } = body as any;
      const idx = MISSIONS.findIndex((m) => m.id === id);
      if (idx === -1)
        return NextResponse.json(
          { ok: false, message: 'Not found' },
          { status: 404 }
        );
      MISSIONS[idx].status = 'completed';
      MISSIONS[idx].end = new Date().toISOString();
      // compute hours if start exists
      if (MISSIONS[idx].start) {
        const start = new Date(MISSIONS[idx].start).getTime();
        const end = new Date().getTime();
        const hours = Math.round((end - start) / 3600000);
        MISSIONS[idx].hours = hours;
      }
      return NextResponse.json({ ok: true, mission: MISSIONS[idx] });
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
