// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { Product } from '@/types/product';

let PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Ciment 42.5',
    category: 'Ciment',
    unit: 'ton',
    price: 8500,
    stock: 120,
    updatedat: new Date().toISOString(),
    quantity: 120,
    min_quantity: 120,
    transport_price: 0,
  },
  {
    id: 'p2',
    name: 'Fer 12mm (tonne)',
    category: 'Fer',
    unit: 'ton',
    price: 99000,
    stock: 25,
    updatedat: new Date().toISOString(),
    quantity: 25,
    min_quantity: 25,
    transport_price: 0,
  },
  {
    id: 'p3',
    name: 'Sable lavé (m3)',
    category: 'Sable',
    unit: 'm3',
    price: 2000,
    stock: 500,
    updatedat: new Date().toISOString(),
    quantity: 500,
    min_quantity: 500,
    transport_price: 0,
  },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (id) {
    const prod = PRODUCTS.find((p) => p.id === id);
    if (!prod)
      return NextResponse.json(
        { ok: false, message: 'Not found' },
        { status: 404 }
      );
    return NextResponse.json({ ok: true, product: prod });
  }
  return NextResponse.json(PRODUCTS);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body as any;
    if (action === 'create') {
      const { product } = body as any;
      PRODUCTS.push(product);
      return NextResponse.json({ ok: true, product });
    }
    if (action === 'update') {
      const { product } = body as any;
      const idx = PRODUCTS.findIndex((p) => p.id === product.id);
      if (idx === -1)
        return NextResponse.json(
          { ok: false, message: 'Not found' },
          { status: 404 }
        );
      PRODUCTS[idx] = {
        ...PRODUCTS[idx],
        ...product,
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json({ ok: true, product: PRODUCTS[idx] });
    }
    if (action === 'delete') {
      const { id } = body as any;
      PRODUCTS = PRODUCTS.filter((p) => p.id !== id);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { ok: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: 'Invalid' },
      { status: 400 }
    );
  }
}
