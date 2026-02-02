import { ProductVariant, VariantStatus } from '@/modules/product/domain/entities/product-variant.entity';
import { Prisma } from '@prisma/client';

export class PrismaVariantMapper {
  // DB → Domain
  static toDomain(raw: any): ProductVariant {
    return ProductVariant.from(
      raw.id,
      raw.productId,
      raw.sku,
      raw.variantName,
      raw.price,
      raw.discountPercent,
      raw.stock,
      raw.status as VariantStatus,
      raw.isActive,
      raw.isDeleted,
      raw.sellerProfileId,
      raw.attributes as Record<string, any> | null,
      raw.imageUrl,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  // Domain → DB
  static toPersistence(variant: ProductVariant) {
    const attributes = variant.getAttributes();

    return {
      id: variant.getId(),
      productId: variant.getProductId(),
      sku: variant.getSku(),
      variantName: variant.getVariantName(),
      price: variant.getPrice(),
      discountPercent: variant.getDiscountPercent(),
      stock: variant.getStock(),
      status: variant.getStatus(),
      isActive: variant.getIsActive(),
      isDeleted: variant.getIsDeleted(),
      sellerProfileId: variant.getSellerProfileId(),
      // Handle Prisma JSON type properly
      attributes: attributes === null
        ? Prisma.JsonNull
        : attributes === undefined
        ? Prisma.DbNull
        : attributes,
      imageUrl: variant.getImageUrl(),
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
    };
  }
}
