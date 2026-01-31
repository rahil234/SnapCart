import { Product as PrismaProduct } from '@prisma/client';
import { Product, ProductStatus } from '@/domain/product/entities/product.entity';

export const ProductMapper = {
  toDomain(prismaProduct: PrismaProduct): Product {
    return Product.from(
      prismaProduct.id,
      prismaProduct.name,
      prismaProduct.description || '',
      prismaProduct.categoryId,
      prismaProduct.price,
      prismaProduct.discountPercent,
      prismaProduct.tryOn || false,
      prismaProduct.status as ProductStatus,
      prismaProduct.createdAt,
      prismaProduct.updatedAt,
    );
  },

  toPrisma(product: Product): Omit<PrismaProduct, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      name: product.getName(),
      description: product.getDescription(),
      categoryId: product.getCategoryId(),
      price: product.getPrice(),
      discountPercent: product.getDiscountPercent(),
      tryOn: product.isTryOnEnabled(),
      status: product.getStatus(),
    };
  },

  toPrismaCreate(data: {
    name: string;
    description: string;
    categoryId: string;
    price: number;
    discountPercent?: number | null;
    tryOn?: boolean;
  }): Omit<PrismaProduct, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      price: data.price,
      discountPercent: data.discountPercent || null,
      tryOn: data.tryOn || false,
      status: ProductStatus.ACTIVE,
    };
  },

  toPrismaUpdate(data: {
    name?: string;
    description?: string;
    price?: number;
    discountPercent?: number | null;
    tryOn?: boolean;
    status?: string;
  }): Partial<Omit<PrismaProduct, 'id' | 'createdAt' | 'updatedAt' | 'categoryId'>> {
    return {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.discountPercent !== undefined && { discountPercent: data.discountPercent }),
      ...(data.tryOn !== undefined && { tryOn: data.tryOn }),
      ...(data.status !== undefined && { status: data.status }),
    };
  },
};
