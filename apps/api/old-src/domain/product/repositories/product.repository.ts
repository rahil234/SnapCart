import { Product } from '@/domain/product/entities/product.entity';

export interface ProductCreateInput {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  discountPercent?: number | null;
  tryOn?: boolean;
}

export interface ProductUpdateInput {
  name?: string;
  description?: string;
  price?: number;
  discountPercent?: number | null;
  tryOn?: boolean;
  status?: string;
}

export interface ProductFindOptions {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: string;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductRepository {
  create(data: ProductCreateInput): Promise<Product>;

  findById(id: string): Promise<Product | null>;

  find(options: ProductFindOptions): Promise<Product[]>;

  count(options?: Partial<ProductFindOptions>): Promise<number>;

  update(id: string, data: ProductUpdateInput): Promise<Product>;

  delete(id: string): Promise<void>;

  existsById(id: string): Promise<boolean>;

  findByCategory(categoryId: string): Promise<Product[]>;
}
