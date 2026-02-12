import { ApiProperty } from '@nestjs/swagger';

import { Banner } from '@/modules/banner/domain/entities';

export class BannerResponseDto {
  @ApiProperty({
    description: 'Banner ID',
    example: 'clx1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'URL of the banner image',
    example: 'https://res.cloudinary.com/snapcart/image/upload/v1234567890/banners/banner1.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Display order (lower numbers appear first)',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: 'Whether the banner is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-02-12T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-02-12T15:30:00.000Z',
  })
  updatedAt: Date;

  static fromDomain(banner: Banner): BannerResponseDto {
    return {
      id: banner.getId(),
      imageUrl: banner.getImageUrl(),
      order: banner.getOrder(),
      isActive: banner.getIsActive(),
      createdAt: banner.getCreatedAt(),
      updatedAt: banner.getUpdatedAt(),
    };
  }
}

export class UploadUrlResponseDto {
  @ApiProperty({
    description: 'Storage provider',
    example: 'cloudinary',
  })
  provider: 'cloudinary' | 'azure';

  @ApiProperty({
    description: 'Upload URL',
    example: 'https://api.cloudinary.com/v1_1/snapcart/image/upload',
  })
  uploadUrl: string;

  @ApiProperty({
    description: 'HTTP method to use for upload',
    example: 'POST',
  })
  method: 'POST' | 'PUT';

  @ApiProperty({
    description: 'Additional fields required for upload (for cloudinary)',
    example: { api_key: '123', timestamp: '1234567890', signature: 'abc' },
    required: false,
  })
  fields?: Record<string, string>;

  @ApiProperty({
    description: 'Read URL for the uploaded file (for azure)',
    required: false,
  })
  readUrl?: string;
}
