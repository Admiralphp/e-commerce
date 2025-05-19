export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  features: string[];
  inStock: boolean;
  featured: boolean;
}