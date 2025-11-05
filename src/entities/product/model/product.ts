export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  images?: string[];
  stock: number;
  brand?: string;
  rating: number;
  reviews_count: number;
  barcode: string;
}
