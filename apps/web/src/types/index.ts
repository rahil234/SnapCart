export interface SellerProfile {
  id: string;
  storeName: string;
  isVerified: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  cartId: string;
}

export interface User {
  userId: string;
  email: string;
  sellerProfile?: SellerProfile;
  customerProfile?: CustomerProfile;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  status: 'active' | 'inactive' | 'blocked';
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
  description: string;
  categoryId: string;
  brand: string;
  isInCatalog: boolean;
  isActive: boolean;

  status: 'active';
}
