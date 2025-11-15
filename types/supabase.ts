// Basic type definitions for Supabase
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          stock: number;
          created_at: string;
        };
      };
      materials_products: {
        Row: {
          id: string;
          name: string;
          category: string;
          unit: string;
        };
      };
      materials_prices: {
        Row: {
          product_id: string;
          price: number;
          transport_price: number;
        };
      };
      materials_stock: {
        Row: {
          product_id: string;
          quantity: number;
          min_quantity: number;
        };
      };
    };
    Functions: {
      full_products: {
        Args: { keyword: string };
        Returns: FullProduct[];
      };
    };
  };
};

export type Product = Database['public']['Tables']['products']['Row'];

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
