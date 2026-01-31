import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { PrismaProductMapper } from '@/infrastructure/product/persistence/mappers/prisma-product.mapper';
import { CategoryProductFeedRepository } from '@/application/feed/repositories/category-product-feed.repository';

@Injectable()
export class PrismaCategoryProductFeedRepository implements CategoryProductFeedRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFeed(maxCategories: number, maxProductsPerCategory: number) {
    const categories = await this.prisma.category.findMany({
      take: maxCategories,
      orderBy: { createdAt: 'desc' },
      include: {
        products: {
          where: { status: 'active' },
          take: maxProductsPerCategory,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      products: c.products.map(PrismaProductMapper.toDomain),
    }));
  }
}
