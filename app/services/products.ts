import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

export type FullProduct = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  transport_price: number;
  quantity: number;
  min_quantity: number;
  updatedat: string;
};

type UpdateProductInput = {
  name: string;
  category: string;
  unit: string;
  price: number;
  transport_price: number;
  quantity: number;
  min_quantity: number;
};

export type CreateProductInput = {
  name: string;
  category: string;
  unit: string;
  price: number;
  transport_price: number;
  quantity: number;
  min_quantity: number;
};

export async function searchProducts(keyword: string): Promise<FullProduct[]> {
  const { data, error } = await supabase
    .rpc('full_products', { keyword })
    .select('*');

  if (error) throw error;
  return data as FullProduct[];
}

export async function getProductById(id: string): Promise<FullProduct | null> {
  const { data, error } = await supabase
    .rpc('full_product_by_id', { product_id: id })
    .select('*');

  if (error) throw error;
  return data[0] as FullProduct | null;
}

export async function updateProductById(
  id: string,
  product: UpdateProductInput
): Promise<void> {
  const { error } = await supabase.rpc('update_full_product', {
    _category: product.category,
    _min_quantity: product.min_quantity,
    _name: product.name,
    _price: product.price,
    _product_id: id,
    _quantity: product.quantity,
    _transport_price: product.transport_price,
    _unit: product.unit,
  });

  if (error) throw error;
}

export async function createProduct(
  product: CreateProductInput
): Promise<FullProduct> {
  const { data: prodInsert, error: prodErr } = await supabase
    .from('materials_products')
    .insert({
      name: product.name,
      category: product.category,
      unit: product.unit,
    })
    .select('id')
    .single();

  if (prodErr) throw prodErr;
  const newId = prodInsert.id as string;

  const { error: priceErr } = await supabase.from('materials_prices').insert({
    product_id: newId,
    price: product.price,
    transport_price: product.transport_price,
  });
  if (priceErr) throw priceErr;

  const { error: stockErr } = await supabase.from('materials_stock').insert({
    product_id: newId,
    quantity: product.quantity,
    min_quantity: product.min_quantity,
  });
  if (stockErr) throw stockErr;

  const created = await getProductById(newId);
  if (!created) throw new Error('Failed to load created product');
  return created;
}

export async function deleteProductById(id: string): Promise<void> {
  const { error: priceErr } = await supabase
    .from('materials_prices')
    .delete()
    .eq('product_id', id);
  if (priceErr) throw priceErr;

  const { error: stockErr } = await supabase
    .from('materials_stock')
    .delete()
    .eq('product_id', id);
  if (stockErr) throw stockErr;

  const { error: prodErr } = await supabase
    .from('materials_products')
    .delete()
    .eq('id', id);
  if (prodErr) throw prodErr;
}

// Update only the stock quantity for a given product and return the fresh full product
export async function updateQuantity(
  productId: string,
  newQuantity: number
): Promise<FullProduct> {
  const { error } = await supabase
    .from('materials_stock')
    .update({ quantity: newQuantity })
    .eq('product_id', productId);
  if (error) throw error;

  const updated = await getProductById(productId);
  if (!updated) throw new Error('Failed to load updated product');
  return updated;
}

// Record a stock movement (you may need to create this table in your DB or adjust table name/columns)
export async function recordStockMovement(params: {
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason?: string;
  date?: string; // ISO
}): Promise<void> {
  const { productId, type, quantity, reason, date } = params;
  const { error } = await supabase.from('materials_stock_movements').insert({
    product_id: productId,
    type,
    quantity,
    reason: reason ?? null,
    date: date ?? new Date().toISOString(),
  });
  if (error) throw error;
}

// Example usage:
// const results = await searchProducts('cement');
