import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Upload Variant Image DTO
 *
 * Used to confirm image upload after Cloudinary returns the URL
 */
export class SaveVariantImageDto {
  @ApiProperty({
    description: 'Cloudinary public ID returned after upload',
    example: 'snapcart/variants/abc123def456',
  })
  @IsString()
  publicId: string;

  @ApiProperty({
    description: 'Image URL returned from Cloudinary',
    example:
      'https://res.cloudinary.com/demo/image/upload/v1/snapcart/variants/abc123def456.jpg',
  })
  @IsString()
  @IsUrl()
  url: string;
}
