import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UploadDescriptor } from '@/shared/infrastructure/storage/upload-descriptor';

/**
 * Variant Image Response DTO
 *
 * Represents a single image attached to a product variant
 */
export class UploadVariantImageResponseDto {
  @ApiProperty({
    example: 'cloudinary',
    enum: ['cloudinary', 'azure'],
    description: 'Image storage provider',
  })
  provider: 'cloudinary' | 'azure';

  @ApiProperty({
    example: 'https://example-bucket.com',
    description: 'URL of the storage bucket to upload the image to',
  })
  uploadUrl: string;

  @ApiProperty({
    example: 'PUT',
    description: 'HTTP method to use for upload',
  })
  method: 'PUT' | 'POST';

  @ApiPropertyOptional({
    example: 'https://example-bucket.com/image.jpg',
    description: 'URL to read/access the uploaded image',
  })
  readUrl?: string;

  @ApiPropertyOptional({
    example: { folder: 'products/variant123', tags: 'summer,sale' },
    description: 'Additional fields required for the upload',
  })
  fields?: Record<string, string>;

  static fromDomain(
    descriptor: UploadDescriptor,
  ): UploadVariantImageResponseDto {
    switch (descriptor.provider) {
      case 'azure':
        return {
          provider: descriptor.provider,
          uploadUrl: descriptor.uploadUrl,
          method: descriptor.method,
          readUrl: descriptor.readUrl,
        };

      case 'cloudinary':
        return {
          provider: descriptor.provider,
          uploadUrl: descriptor.uploadUrl,
          method: descriptor.method,
          fields: descriptor.fields,
        };

      default:
        return descriptor;
    }
  }
}
