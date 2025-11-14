// types/product.ts
export type Unit = 'kg' | 'ton' | 'm3' | 'piece';

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: Unit;
  price: number; // DA per unit
  stock: number; // quantity in unit
  updatedAt: string; // ISO date
}
