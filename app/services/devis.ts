import { supabase } from '@/lib/supabase';

export type NewDevisInput = {
  supplier_id?: string; // optional if handled by RLS/session
  client_name: string;
  client_phone?: string;
  total: number;
  items: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;
};

export type DevisRow = {
  id: string;
  supplier_id: string | null;
  client_name: string;
  client_phone: string | null;
  total: number;
  created_at: string;
};

export type DevisWithItems = DevisRow & {
  items: Array<{
    id: string;
    devis_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;
};

export async function listDevis(): Promise<DevisWithItems[]> {
  const { data, error } = await supabase
    .from('materials_devis')
    .select('*, materials_devis_items(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Normalize relation key to `items`
  return (data || []).map((row: any) => ({
    id: row.id,
    supplier_id: row.supplier_id ?? null,
    client_name: row.client_name,
    client_phone: row.client_phone ?? null,
    total: Number(row.total),
    created_at: row.created_at,
    items: (row.materials_devis_items || []).map((it: any) => ({
      id: it.id,
      devis_id: it.devis_id,
      product_id: it.product_id,
      quantity: Number(it.quantity),
      unit_price: Number(it.unit_price),
      subtotal: Number(it.subtotal),
    })),
  }));
}

export async function createDevis(
  input: NewDevisInput
): Promise<DevisWithItems> {
  // 1) Insert header
  const { data: header, error: headerErr } = await supabase
    .from('materials_devis')
    .insert({
      supplier_id: input.supplier_id ?? null,
      client_name: input.client_name,
      client_phone: input.client_phone ?? null,
      total: input.total,
    })
    .select('*')
    .single();

  if (headerErr) throw headerErr;

  // 2) Insert items with returned header id
  const rows = input.items.map((it) => ({
    devis_id: header.id,
    product_id: it.product_id,
    quantity: it.quantity,
    unit_price: it.unit_price,
    subtotal: it.subtotal,
  }));

  const { error: itemsErr } = await supabase
    .from('materials_devis_items')
    .insert(rows);

  if (itemsErr) throw itemsErr;

  // 3) Return full object with items
  const { data: full, error: fullErr } = await supabase
    .from('materials_devis')
    .select('*, materials_devis_items(*)')
    .eq('id', header.id)
    .single();

  if (fullErr) throw fullErr;

  return {
    id: full.id,
    supplier_id: full.supplier_id ?? null,
    client_name: full.client_name,
    client_phone: full.client_phone ?? null,
    total: Number(full.total),
    created_at: full.created_at,
    items: (full.materials_devis_items || []).map((it: any) => ({
      id: it.id,
      devis_id: it.devis_id,
      product_id: it.product_id,
      quantity: Number(it.quantity),
      unit_price: Number(it.unit_price),
      subtotal: Number(it.subtotal),
    })),
  };
}
