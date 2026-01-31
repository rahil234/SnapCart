import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { CategoryProductFeedRepository } from '@/modules/feed/application/repositories/category-product-feed.repository';

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
      products: c.products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        discountPercent: p.discountPercent,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    }));
  }
}
