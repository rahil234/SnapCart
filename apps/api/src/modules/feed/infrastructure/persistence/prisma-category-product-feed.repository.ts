import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { CategoryProductFeedRepository } from '@/modules/feed/application/repositories/category-product-feed.repository';
import { CategoryProductFeedItem } from '@/modules/feed/application/queries/results';

@Injectable()
export class PrismaCategoryProductFeedRepository implements CategoryProductFeedRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFeed(
    maxCategories: number,
    maxProductsPerCategory: number,
  ): Promise<CategoryProductFeedItem[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        status: 'active',
        products: { some: { status: 'active', isDeleted: false } },
      },
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
              include: {
                images: {
                  select: {
                    url: true,
                    position: true,
                  },
                },
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
          category: {
            id: c.id,
            name: c.name,
          },
          variant: {
            id: firstVariant.id,
            name: firstVariant.variantName,
            price: firstVariant.price,
            discountPercent: firstVariant.discountPercent,
            images: firstVariant.images.map((img) => img.url),
          },
        } satisfies CategoryProductFeedItem['products'][number];
      }),
    }));
  }
}
