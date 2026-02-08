import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { Product } from '@/modules/product/domain/entities/product.entity';
import { ProductVariant } from '@/modules/product/domain/entities/product-variant.entity';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { PrismaProductMapper } from '@/modules/product/infrastructure/persistence/mappers/prisma-product.mapper';
import { PrismaVariantMapper } from '@/modules/product/infrastructure/persistence/mappers/prisma-variant.mapper';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // PRODUCT (Identity) Operations
  // ============================================

  async saveProduct(product: Product): Promise<Product> {
    const data = PrismaProductMapper.toPersistence(product);
    const doc = await this.prisma.product.create({ data });
    return PrismaProductMapper.toDomain(doc);
  }

  async updateProduct(product: Product): Promise<Product> {
    const data = PrismaProductMapper.toPersistence(product);
    const doc = await this.prisma.product.update({
      where: { id: product.id },
      data,
    });
    return PrismaProductMapper.toDomain(doc);
  }

  async findProductById(id: string): Promise<Product | null> {
    const record = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!record) return null;
    return PrismaProductMapper.toDomain(record);
  }

  async findProductByVariantId(variantId: string): Promise<Product | null> {
    const record = await this.prisma.product.findFirst({
      where: {
        variants: {
          some: {
            id: variantId,
            isDeleted: false,
          },
        },
      },
    });
    if (!record) return null;
    return PrismaProductMapper.toDomain(record);
  }

  async findAllProducts(filters?: {
    categoryId?: string;
    status?: string;
    isDeleted?: boolean;
  }): Promise<Product[]> {
    const where: any = {};
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.status) where.status = filters.status;
    if (filters?.isDeleted !== undefined) where.isDeleted = filters.isDeleted;

    const records = await this.prisma.product.findMany({ where });
    return records.map(PrismaProductMapper.toDomain);
  }

  async productExists(id: string): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: { id },
    });
    return count > 0;
  }

  // ============================================
  // PRODUCT VARIANT (Sellable Unit) Operations
  // ============================================

  async saveVariant(variant: ProductVariant): Promise<ProductVariant> {
    const data = PrismaVariantMapper.toPersistence(variant);
    const doc = await this.prisma.productVariant.create({ data });
    return PrismaVariantMapper.toDomain(doc);
  }

  async updateVariant(variant: ProductVariant): Promise<ProductVariant> {
    const data = PrismaVariantMapper.toPersistence(variant);
    const doc = await this.prisma.productVariant.update({
      where: { id: variant.getId() },
      data,
    });
    return PrismaVariantMapper.toDomain(doc);
  }

  async findVariantById(id: string): Promise<ProductVariant | null> {
    const record = await this.prisma.productVariant.findUnique({
      where: { id },
      include: { images: { orderBy: { createdAt: 'asc' } } },
    });
    if (!record) return null;
    return PrismaVariantMapper.toDomain(record);
  }

  async findVariantsByProductId(productId: string): Promise<ProductVariant[]> {
    const records = await this.prisma.productVariant.findMany({
      where: {
        productId,
        isDeleted: false,
      },
      include: { images: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });
    return records.map(PrismaVariantMapper.toDomain);
  }

  async findAvailableVariantsByProductId(
    productId: string,
  ): Promise<ProductVariant[]> {
    const records = await this.prisma.productVariant.findMany({
      where: {
        productId,
        isActive: true,
        isDeleted: false,
      },
      include: { images: { orderBy: { createdAt: 'asc' } } },
      orderBy: { price: 'asc' },
    });
    return records.map(PrismaVariantMapper.toDomain);
  }

  async findVariantsBySellerId(
    sellerProfileId: string,
  ): Promise<ProductVariant[]> {
    const records = await this.prisma.productVariant.findMany({
      where: {
        sellerProfileId,
        isDeleted: false,
      },
      include: { images: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(PrismaVariantMapper.toDomain);
  }

  async variantExists(id: string): Promise<boolean> {
    const count = await this.prisma.productVariant.count({
      where: { id },
    });
    return count > 0;
  }

  // ============================================
  // COMBINED QUERIES (Product + Variants)
  // ============================================

  async findProductWithVariants(productId: string): Promise<{
    product: Product;
    variants: ProductVariant[];
  } | null> {
    const record = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: {
          where: { isDeleted: false },
          include: { images: { orderBy: { createdAt: 'asc' } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!record) return null;

    return {
      product: PrismaProductMapper.toDomain(record),
      variants: record.variants.map(PrismaVariantMapper.toDomain),
    };
  }

  async findProductsForCatalog(filters?: {
    categoryId?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    products: Array<{
      product: Product;
      variants: ProductVariant[];
    }>;
    total: number;
  }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [records, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          variants: {
            where: {
              isActive: true,
              isDeleted: false,
            },
            include: { images: { orderBy: { createdAt: 'asc' } } },
            orderBy: { price: 'asc' },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: records.map((record) => ({
        product: PrismaProductMapper.toDomain(record),
        variants: record.variants.map(PrismaVariantMapper.toDomain),
      })),
      total,
    };
  }

  // ============================================
  // VARIANT IMAGE Operations (UPDATED)
  // ============================================

  async saveVariantImage(
    variantId: string,
    publicId: string,
    url: string,
  ): Promise<void> {
    // Get the next position for ordering (1-indexed)
    const existingImages = await this.prisma.variantImage.findMany({
      where: { variantId },
      select: { position: true },
      orderBy: { position: 'desc' },
    });

    const nextPosition =
      existingImages.length > 0
        ? Math.min(existingImages[0].position + 1, 6)
        : 1;

    await this.prisma.variantImage.create({
      data: {
        variantId,
        publicId,
        url,
        position: nextPosition,
      },
    });
  }

  async deleteVariantImage(variantId: string, position: number): Promise<void> {
    await this.prisma.variantImage.deleteMany({
      where: {
        variantId,
        position,
      },
    });
  }

  async findVariantImages(variantId: string): Promise<string[]> {
    const images = await this.prisma.variantImage.findMany({
      where: { variantId },
      select: { url: true },
      orderBy: { createdAt: 'asc' },
    });

    return images.map((img) => img.url);
  }

  async deleteVariantImagesByVariantId(variantId: string): Promise<void> {
    await this.prisma.variantImage.deleteMany({
      where: { variantId },
    });
  }

  // ============================================
  // SELLER-SPECIFIC QUERIES
  // ============================================

  async findProductsBySellerProfileId(
    sellerProfileId: string,
    filters?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    },
  ): Promise<{
    products: Array<{
      product: Product;
      variants: ProductVariant[];
    }>;
    total: number;
  }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      sellerProfileId,
      isDeleted: false,
    };

    if (filters?.status) {
      where.status = filters.status as 'active';
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          variants: {
            where: {
              sellerProfileId,
              isDeleted: false,
            },
            include: {
              images: {
                orderBy: { position: 'asc' },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map((p) => ({
        product: PrismaProductMapper.toDomain(p),
        variants: p.variants.map((v) => PrismaVariantMapper.toDomain(v)),
      })),
      total,
    };
  }

  // ============================================
  // ADMIN-SPECIFIC QUERIES
  // ============================================

  async findAllProductsForAdmin(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    categoryId?: string;
  }): Promise<{
    products: Array<{ product: Product; variants: ProductVariant[] }>;
    total: number;
  }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {
      isDeleted: false,
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          variants: {
            where: {
              isDeleted: false,
            },
            include: {
              images: {
                orderBy: { position: 'asc' },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map((p) => ({
        product: PrismaProductMapper.toDomain(p),
        variants: p.variants.map((v) => PrismaVariantMapper.toDomain(v)),
      })),
      total,
    };
  }
}
