// src/types/index.ts

export interface Product {
  name: string;
  price: number;
  quantity: string;
  image: string;
}

export interface Category {
  categoryName: string;
  categoryId: string;
  products: Product[];
}
