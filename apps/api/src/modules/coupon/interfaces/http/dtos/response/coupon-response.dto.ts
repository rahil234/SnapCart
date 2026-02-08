import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Coupon } from '@/modules/coupon/domain/entities';
import { CouponType, CouponStatus, Applicability } from '@/modules/coupon/domain/enums';

export class CouponResponseDto {
  @ApiProperty({
    description: 'Coupon ID',
    example: 'clx1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Coupon code',
    example: 'SAVE20',
  })
  code: string;

  @ApiProperty({
    description: 'Discount type',
    enum: CouponType,
    example: CouponType.PERCENTAGE,
  })
  type: CouponType;

  @ApiProperty({
    description: 'Discount value',
    example: 20,
  })
  discount: number;

  @ApiProperty({
    description: 'Minimum cart amount required',
    example: 500,
  })
  minAmount: number;

  @ApiPropertyOptional({
    description: 'Maximum discount amount',
    example: 100,
  })
  maxDiscount?: number;

  @ApiProperty({
    description: 'Coupon start date',
    example: '2026-02-08T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Coupon end date',
    example: '2026-03-08T23:59:59.000Z',
  })
  endDate: Date;

  @ApiProperty({
    description: 'Coupon status',
    enum: CouponStatus,
    example: CouponStatus.ACTIVE,
  })
  status: CouponStatus;

  @ApiPropertyOptional({
    description: 'Total usage limit',
    example: 1000,
  })
  usageLimit?: number;

  @ApiProperty({
    description: 'Times this coupon has been used',
    example: 250,
  })
  usedCount: number;

  @ApiProperty({
    description: 'Maximum times a user can use this coupon',
    example: 1,
  })
  maxUsagePerUser: number;

  @ApiProperty({
    description: 'Applicability scope',
    enum: Applicability,
    example: Applicability.ALL,
  })
  applicableTo: Applicability;

  @ApiProperty({
    description: 'Can be stacked with offers',
    example: false,
  })
  isStackable: boolean;

  @ApiPropertyOptional({
    description: 'Coupon description',
    example: 'Get 20% off on orders above ₹500',
  })
  description?: string;

  @ApiProperty({
    description: 'Whether coupon is currently active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether usage limit is reached',
    example: false,
  })
  isLimitReached: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-02-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-02-05T15:30:00.000Z',
  })
  updatedAt: Date;

  static fromDomain(coupon: Coupon): CouponResponseDto {
    return {
      id: coupon.getId(),
      code: coupon.getCode(),
      type: coupon.getType(),
      discount: coupon.getDiscount(),
      minAmount: coupon.getMinAmount(),
      maxDiscount: coupon.getMaxDiscount(),
      startDate: coupon.getStartDate(),
      endDate: coupon.getEndDate(),
      status: coupon.getStatus(),
      usageLimit: coupon.getUsageLimit(),
      usedCount: coupon.getUsedCount(),
      maxUsagePerUser: coupon.getMaxUsagePerUser(),
      applicableTo: coupon.getApplicableTo(),
      isStackable: coupon.getIsStackable(),
      description: coupon.getDescription(),
      isActive: coupon.isActive(),
      isLimitReached: !coupon.isWithinUsageLimit(),
      createdAt: coupon.getCreatedAt(),
      updatedAt: coupon.getUpdatedAt(),
    };
  }
}
