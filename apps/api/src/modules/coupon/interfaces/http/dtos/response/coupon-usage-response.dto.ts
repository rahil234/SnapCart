import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CouponUsage } from '@/modules/coupon/domain/entities';

export class CouponUsageResponseDto {
  @ApiProperty({
    description: 'Usage record ID',
    example: 'clx1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Coupon ID',
    example: 'clx0987654321',
  })
  couponId: string;

  @ApiProperty({
    description: 'User ID who used the coupon',
    example: 'clx1111111111',
  })
  userId: string;

  @ApiPropertyOptional({
    description: 'Order ID where coupon was applied',
    example: 'order_123',
  })
  orderId?: string;

  @ApiProperty({
    description: 'Discount amount that was applied',
    example: 100,
  })
  discountApplied: number;

  @ApiProperty({
    description: 'When the coupon was used',
    example: '2026-02-08T14:30:00.000Z',
  })
  usedAt: Date;

  static fromDomain(usage: CouponUsage): CouponUsageResponseDto {
    return {
      id: usage.getId(),
      couponId: usage.getCouponId(),
      userId: usage.getUserId(),
      orderId: usage.getOrderId(),
      discountApplied: usage.getDiscountApplied(),
      usedAt: usage.getUsedAt(),
    };
  }
}
