import {
  Product,
  ProductStatus,
} from '@/domain/product/entities/product.entity';

export class PrismaProductMapper {
  // DB → Domain
  static toDomain(raw: any): Product {
    return Product.from(
      raw.id,
      raw.name,
      raw.description,
      raw.categoryId,
      raw.price,
      raw.discountPercent,
      raw.status as ProductStatus,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  // Domain → DB
  static toPersistence(product: Product) {
    return {
      id: product.id,
      name: product.getName(),
      description: product.getDescription(),
      categoryId: product.getCategoryId(),
      price: product.getPrice(),
      discountPercent: product.getDiscountPercent(),
      status: product.getStatus(),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
