import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

export type FullProduct = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
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

export async function updateProductById(id: string, product: UpdateProductInput): Promise<void> {
  const { error } = await supabase.rpc("update_full_product", {
  _category: product.category,
  _min_quantity: product.min_quantity,
  _name: product.name,
  _price: product.price,
  _product_id: id,
  _quantity: product.quantity,
  _transport_price: product.transport_price,
  _unit: product.unit
});


  if (error) throw error;
}


// Example usage:
// const results = await searchProducts('cement');