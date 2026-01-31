import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateLandingPageDto {
  @ApiPropertyOptional({
    example: 'Welcome to Our Store',
    description: 'The main title displayed on the landing page hero section',
  })
  @IsOptional()
  @IsString()
  heroTitle?: string;

  @ApiPropertyOptional({
    example: 'Discover our exclusive products and offers',
    description: 'The subtitle displayed on the landing page hero section',
  })
  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['cat123', 'cat456', 'cat789'],
    description: 'List of top category IDs to be featured on the landing page',
  })
  @IsOptional()
  @IsArray()
  topCategoryIds?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['prod123', 'prod456', 'prod789'],
    description: 'List of top product IDs to be featured on the landing page',
  })
  @IsOptional()
  @IsArray()
  topProductIds?: string[];
}
