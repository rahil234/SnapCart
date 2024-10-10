// shared/types/index.ts

export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: string;
  image: string;
}

export interface Category {
  category: string;
  categoryId: string;
  products: Product[];
}

export type UserRole = 'admin' | 'user' | 'seller';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  DOB: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}