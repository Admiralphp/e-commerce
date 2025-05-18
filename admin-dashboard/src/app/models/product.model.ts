export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCreateDto {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
}

export interface ProductUpdateDto extends ProductCreateDto {
  id: string;
}

export enum ProductCategory {
  CASE = 'case',
  CHARGER = 'charger',
  EARPHONE = 'earphone',
  SCREEN_PROTECTOR = 'screen_protector',
  OTHER = 'other'
}