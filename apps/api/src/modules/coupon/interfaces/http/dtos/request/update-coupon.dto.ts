import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsDateString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CouponType, Applicability } from '@/modules/coupon/domain/enums';

export class UpdateCouponDto {
  @ApiPropertyOptional({
    description: 'Unique coupon code',
    example: 'SAVE20',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: 'Type of discount',
    enum: CouponType,
    example: CouponType.PERCENTAGE,
  })
  @IsOptional()
  @IsEnum(CouponType)
  type?: CouponType;

  @ApiPropertyOptional({
    description: 'Discount value',
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discount?: number;

  @ApiPropertyOptional({
    description: 'Minimum cart amount',
    example: 500,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minAmount?: number;

  @ApiPropertyOptional({
    description: 'Maximum discount amount',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxDiscount?: number;

  @ApiPropertyOptional({
    description: 'Start date',
    example: '2026-02-08T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date',
    example: '2026-03-08T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Total usage limit',
    example: 1000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  usageLimit?: number;

  @ApiPropertyOptional({
    description: 'Max usage per user',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  maxUsagePerUser?: number;

  @ApiPropertyOptional({
    description: 'Applicability scope',
    enum: Applicability,
  })
  @IsOptional()
  @IsEnum(Applicability)
  applicableTo?: Applicability;

  @ApiPropertyOptional({
    description: 'Stackable with offers',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isStackable?: boolean;

  @ApiPropertyOptional({
    description: 'Coupon description',
    example: 'Get 20% off on orders above ₹500',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
