import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Applicability, CouponType } from '@/modules/coupon/domain/enums';

export class CreateCouponDto {
  @ApiProperty({
    description: 'Unique coupon code (will be converted to uppercase)',
    example: 'SAVE20',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Type of discount',
    enum: CouponType,
    example: CouponType.PERCENTAGE,
  })
  @IsEnum(CouponType)
  type: CouponType;

  @ApiProperty({
    description: 'Discount value (percentage or flat amount)',
    example: 20,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  discount: number;

  @ApiProperty({
    description: 'Minimum cart amount required to use coupon',
    example: 500,
    minimum: 0,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minAmount: number = 0;

  @ApiProperty({
    description: 'Coupon start date',
    example: '2026-02-08T00:00:00Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Coupon end date',
    example: '2026-03-08T23:59:59Z',
  })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({
    description: 'Maximum discount amount (for percentage coupons)',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxDiscount?: number;

  @ApiPropertyOptional({
    description: 'Total usage limit for this coupon',
    example: 1000,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  usageLimit?: number;

  @ApiProperty({
    description: 'Maximum times a single user can use this coupon',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  maxUsagePerUser: number = 1;

  @ApiProperty({
    description: 'Applicability scope',
    enum: Applicability,
    example: Applicability.ALL,
    default: Applicability.ALL,
  })
  @IsEnum(Applicability)
  applicableTo: Applicability = Applicability.ALL;

  @ApiProperty({
    description: 'Whether coupon can be combined with offers',
    example: false,
    default: false,
  })
  @IsBoolean()
  isStackable: boolean = false;

  @ApiPropertyOptional({
    description: 'Coupon description for users',
    example: 'Get 20% off on orders above ₹500',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
