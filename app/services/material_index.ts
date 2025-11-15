import { supabase } from '@/lib/supabase';

export type MaterialIndexRow = {
  id: string;
  product_id: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  created_at: string;
};

export type MaterialIndexItem = {
  id: string;
  productId: string;
  name: string;
  category?: string;
  unit?: string;
  price?: number; // use avg_price as display price
  avg_price: number;
  min_price: number;
  max_price: number;
  updatedAt?: string;
  supplierId?: string; // not available in index; keep optional
  city?: string; // not available in index; keep optional
  notes?: string;
};

// List material index joined with product basic info
export async function listMaterialIndex(): Promise<MaterialIndexItem[]> {
  const { data, error } = await supabase
    .from('index_material_prices')
    .select(
      'id, product_id, avg_price, min_price, max_price, created_at, materials_products:product_id(id, name, category, unit)'
    )
    .order('created_at', { ascending: false });

  if (error) throw error;

  const items = (data || []).map((row: any) => {
    const prod = row.materials_products || {};
    const item: MaterialIndexItem = {
      id: row.id,
      productId: row.product_id,
      name: prod.name || '—',
      category: prod.category || undefined,
      unit: prod.unit || undefined,
      price: Number(row.avg_price) || 0,
      avg_price: Number(row.avg_price) || 0,
      min_price: Number(row.min_price) || 0,
      max_price: Number(row.max_price) || 0,
      updatedAt: row.created_at,
    };
    return item;
  });
  return items;
}

// Sync index rows via RPC. Assumes a Postgres function material_index_sync(product_id uuid, avg_price numeric, min_price numeric, max_price numeric)
export async function syncMaterialIndex(
  entries: Array<{
    product_id: string;
    avg_price: number;
    min_price: number;
    max_price: number;
  }>
): Promise<void> {
  for (const e of entries) {
    const { error } = await supabase.rpc('material_index_sync', {
      product_id: e.product_id,
      avg_price: e.avg_price,
      min_price: e.min_price,
      max_price: e.max_price,
    } as any);
    if (error) throw error;
  }
}
