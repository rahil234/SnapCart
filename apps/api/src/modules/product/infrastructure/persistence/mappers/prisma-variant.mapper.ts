import {
  ProductVariant,
  VariantStatus,
} from '@/modules/product/domain/entities/product-variant.entity';
import { Prisma } from '@prisma/client';

export class PrismaVariantMapper {
  // DB → Domain
  static toDomain(raw: any): ProductVariant {
    // Map images URLs from the images relation (VariantImage table)
    const imageUrls = raw.images ? raw.images.map((img: any) => img.url) : [];

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
      imageUrls,
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
      variantName: variant.getVariantName(),
      price: variant.getPrice(),
      discountPercent: variant.getDiscountPercent(),
      stock: variant.getStock(),
      status: variant.getStatus(),
      isActive: variant.getIsActive(),
      isDeleted: variant.getIsDeleted(),
      sellerProfileId: variant.getSellerProfileId(),
      attributes:
        attributes === null
          ? Prisma.JsonNull
          : attributes === undefined
            ? Prisma.DbNull
            : attributes,
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
    };
  }
}
