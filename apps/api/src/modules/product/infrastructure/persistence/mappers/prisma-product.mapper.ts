import {
  Product,
  ProductStatus,
} from '@/modules/product/domain/entities/product.entity';

export class PrismaProductMapper {
  // DB → Domain
  static toDomain(raw: any): Product {
    return Product.from(
      raw.id,
      raw.name,
      raw.description,
      raw.categoryId,
      raw.brand,
      raw.sellerProfileId,
      raw.status as ProductStatus,
      raw.isDeleted,
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
      brand: product.getBrand(),
      sellerProfileId: product.getSellerProfileId(),
      status: product.getStatus(),
      isDeleted: product.getIsDeleted(),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
