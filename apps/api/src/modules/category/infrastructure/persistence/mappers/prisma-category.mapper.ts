import { Category as PrismaCategory } from '@prisma/client';

import { Category } from '@/modules/category/domain/entities/category.entity';

export class PrismaCategoryMapper {
  // DB → Domain
  static toDomain(raw: PrismaCategory): Category {
    return Category.from(
      raw.id,
      raw.name,
      raw.status,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  // Domain → DB
  static toPersistence(category: Category): PrismaCategory {
    return {
      id: category.id,
      name: category.name,
      status: category.status,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
