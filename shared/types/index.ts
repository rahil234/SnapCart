// shared/types/index.ts

export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: string;
  stock: number;
  images: string[];
}

export interface Subcategory {
  subcategory: string;
  subcategoryId: string;
  products: Product[];
}

export interface Category {
  category: string;
  categoryId: string;
  products: Product[];
  subcategories: Subcategory[];
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

interface ImportMetaEnv {
  readonly VITE_googleOAuthClientId: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}