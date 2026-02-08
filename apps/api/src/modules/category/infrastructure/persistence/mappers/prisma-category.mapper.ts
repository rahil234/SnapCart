import { Category } from '@/modules/category/domain/entities/category.entity';

export class PrismaCategoryMapper {
  // DB → Domain
  static toDomain(raw: any): Category {
    return Category.from(
      raw.id,
      raw.name,
      raw.status,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  // Domain → DB
  static toPersistence(category: Category) {
    return {
      id: category.id,
      name: category.name,
      status: category.status,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
