import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({
    description: 'URL of the banner image',
    example: 'https://res.cloudinary.com/snapcart/image/upload/v1234567890/banners/banner1.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @ApiPropertyOptional({
    description: 'Display order of the banner (lower numbers appear first)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}

export class UpdateBannerDto {
  @ApiPropertyOptional({
    description: 'URL of the banner image',
    example: 'https://res.cloudinary.com/snapcart/image/upload/v1234567890/banners/banner1.jpg',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Whether the banner is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class BannerOrderItemDto {
  @ApiProperty({
    description: 'Banner ID',
    example: 'clx1234567890',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'New order position',
    example: 1,
  })
  @IsNumber()
  @Min(0)
  order: number;
}

export class ReorderBannersDto {
  @ApiProperty({
    description: 'Array of banner IDs with their new order positions',
    type: [BannerOrderItemDto],
    example: [
      { id: 'clx1234567890', order: 0 },
      { id: 'clx0987654321', order: 1 },
    ],
  })
  banners: BannerOrderItemDto[];
}

export class GenerateBannerUploadUrlDto {
  @ApiProperty({
    description: 'Original filename for the banner image',
    example: 'banner-image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;
}
