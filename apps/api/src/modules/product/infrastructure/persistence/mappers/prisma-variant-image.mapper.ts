import { VariantImage } from '@/modules/product/domain/value-objects/variant-image';

/**
 * Prisma VariantImage Mapper
 *
 * Converts between domain value objects and database records
 */
export class PrismaVariantImageMapper {
  /**
   * Convert DB record to domain value object
   */
  static toDomain(raw: any): VariantImage {
    return VariantImage.from(
      raw.id,
      raw.variantId,
      raw.publicId,
      raw.url,
      raw.position,
      raw.createdAt,
    );
  }

  /**
   * Convert domain value object to DB record
   */
  static toPersistence(image: VariantImage) {
    return {
      id: image.getId(),
      variantId: image.getVariantId(),
      publicId: image.getPublicId(),
      url: image.getUrl(),
      position: image.getPosition(),
      createdAt: image.createdAt,
    };
  }

  /**
   * Convert array of DB records to domain value objects
   */
  static toDomainArray(raw: any[]): VariantImage[] {
    return raw.map((item) => this.toDomain(item));
  }

  /**
   * Convert array of domain objects to DB records
   */
  static toPersistenceArray(images: VariantImage[]) {
    return images.map((image) => this.toPersistence(image));
  }
}
