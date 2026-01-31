export interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export interface Category {
  _id: string;
  name: string;
  status: string;
  soldCount: number;
}

export interface Subcategory {
  _id: string;
  name: string;
  status: 'Active' | 'Blocked';
  category: string;
  soldCount: number;
}

export interface VariantImage {
  id: number;
  file: File;
  preview: string;
}

export interface Variant {
  id: number;
  name: string;
  price: number;
  stock: number;
  images: VariantImage[];
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  subcategory: Subcategory;
  variants: Variant[];
  status: 'Active' | 'Blocked';
}
