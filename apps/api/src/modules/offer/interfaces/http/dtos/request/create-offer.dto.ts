import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsDateString, IsArray, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OfferType } from '@/modules/offer/domain/enums';

export class CreateOfferDto {
  @ApiProperty({
    description: 'Offer name',
    example: 'Summer Sale 2026',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Type of discount',
    enum: OfferType,
    example: OfferType.PERCENTAGE,
  })
  @IsEnum(OfferType)
  type: OfferType;

  @ApiProperty({
    description: 'Discount value (percentage or flat amount)',
    example: 25,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discount: number;

  @ApiProperty({
    description: 'Offer start date',
    example: '2026-02-09T00:00:00Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Offer end date',
    example: '2026-03-31T23:59:59Z',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Minimum purchase amount required',
    example: 1000,
    minimum: 0,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPurchaseAmount: number = 0;

  @ApiPropertyOptional({
    description: 'Maximum discount amount (for percentage offers)',
    example: 500,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxDiscount?: number;

  @ApiProperty({
    description: 'Priority (higher number = higher priority)',
    example: 10,
    minimum: 0,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priority: number = 0;

  @ApiPropertyOptional({
    description: 'Category IDs this offer applies to',
    example: ['cat_123', 'cat_456'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({
    description: 'Product IDs this offer applies to',
    example: ['prod_123', 'prod_456'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  products?: string[];

  @ApiProperty({
    description: 'Whether offer can be combined with coupons',
    example: false,
    default: false,
  })
  @IsBoolean()
  isStackable: boolean = false;

  @ApiPropertyOptional({
    description: 'Offer description for users',
    example: 'Get 25% off on summer collection',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
