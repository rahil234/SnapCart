export interface VariantImage {
  id: number;
  file: File;
  preview: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  brand?: string;
  status: 'active' | 'inactive' | 'discontinued';
  isActive: boolean;
  isInCatalog: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  variantName: string;
  price: number;
  discountPercent: number;
  finalPrice: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  isActive: boolean;
  inStock: boolean;
  availableForPurchase: boolean;
  sellerProfileId?: object | null;
  attributes?: object | null;
  images: Array<string>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}
