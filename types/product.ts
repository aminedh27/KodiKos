// types/product.ts
export type Unit = 'kg' | 'ton' | 'm3' | 'piece';

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number; // DA per unit
  stock: number; // quantity in unit
  quantity: number;
  min_quantity: number;
  transport_price: number;
  updatedat: string; // ISO date
}
