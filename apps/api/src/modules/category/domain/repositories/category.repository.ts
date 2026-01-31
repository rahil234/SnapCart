import { Category } from '@/modules/category/domain/entities';

export interface CategoryRepository {
  save(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  delete(id: string): Promise<void>;
}
