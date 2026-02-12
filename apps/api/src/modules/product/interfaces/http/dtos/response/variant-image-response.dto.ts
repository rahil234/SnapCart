import { ApiProperty } from '@nestjs/swagger';
import { VariantImage } from '@/modules/product/domain/value-objects/variant-image';

/**
 * Variant Image Response DTO
 *
 * Represents a single image attached to a product variant
 */
export class VariantImageResponseDto {
  @ApiProperty({
    description: 'Image ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Cloudinary public ID',
    example: 'snapcart/variants/abc123def456',
  })
  publicId: string;

  @ApiProperty({
    description: 'Image URL (secure delivery)',
    example: 'https://res.cloudinary.com/...',
  })
  url: string;

  @ApiProperty({
    description: 'Image position (1-6, where 1 is primary)',
    example: 1,
    minimum: 1,
    maximum: 6,
  })
  position: number;

  @ApiProperty({
    description: 'Whether this is the primary/thumbnail image',
    example: true,
  })
  isPrimary: boolean;

  @ApiProperty({
    description: 'Creation date',
    example: '2026-02-01T10:00:00.000Z',
  })
  createdAt: Date;

  static fromDomain(image: VariantImage): VariantImageResponseDto {
    return {
      id: image.getId(),
      publicId: image.getPublicId(),
      url: image.getUrl(),
      position: image.getPosition(),
      isPrimary: image.isPrimary(),
      createdAt: image.createdAt,
    };
  }

  static fromDomainArray(images: VariantImage[]): VariantImageResponseDto[] {
    return images
      .sort((a, b) => a.getPosition() - b.getPosition())
      .map((img) => VariantImageResponseDto.fromDomain(img));
  }
}
