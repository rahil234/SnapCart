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
          where: {
            status: 'active',
            isDeleted: false,
          },
          take: maxProductsPerCategory,
          orderBy: { createdAt: 'desc' },
          include: {
            variants: {
              where: {
                isActive: true,
                isDeleted: false,
              },
              take: 1, // Get first available variant for display
              orderBy: { price: 'asc' }, // Show cheapest variant first
            },
          },
        },
      },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      products: c.products.map((p) => {
        // Get the first variant's price info for display
        const firstVariant = p.variants[0];

        return {
          id: p.id,
          name: p.name,
          description: p.description,
          brand: p.brand,
          // Include variant info for pricing
          price: firstVariant?.price || 0,
          discountPercent: firstVariant?.discountPercent || 0,
          variantId: firstVariant?.id,
          variantName: firstVariant?.variantName,
          inStock: firstVariant?.stock > 0,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        };
      }),
    }));
  }
}
