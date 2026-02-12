import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Coupon snapshot in response
 */
export class CouponSnapshotDto {
  @ApiProperty({ description: 'Coupon code', example: 'SAVE20' })
  code: string;

  @ApiProperty({ description: 'Coupon type', example: 'PERCENTAGE' })
  type: string;

  @ApiProperty({ description: 'Discount value', example: 20 })
  discount: number;

  @ApiProperty({ description: 'Discount applied', example: 150.0 })
  discountApplied: number;
}

/**
 * Response DTO for checkout preview
 */
export class CheckoutPreviewResponseDto {
  @ApiProperty({
    description: 'Subtotal before any discounts',
    example: 1000.0,
  })
  subtotal: number;

  @ApiProperty({
    description: 'Product-level discount',
    example: 100.0,
  })
  productDiscount: number;

  @ApiProperty({
    description: 'Coupon discount applied',
    example: 150.0,
  })
  couponDiscount: number;

  @ApiProperty({
    description: 'Offer discount applied',
    example: 0.0,
  })
  offerDiscount: number;

  @ApiProperty({
    description: 'Shipping charge',
    example: 0.0,
  })
  shippingCharge: number;

  @ApiProperty({
    description: 'Tax amount',
    example: 0.0,
  })
  tax: number;

  @ApiProperty({
    description: 'Final total amount',
    example: 750.0,
  })
  total: number;

  @ApiPropertyOptional({
    description: 'Applied coupon details',
    type: CouponSnapshotDto,
  })
  couponSnapshot?: CouponSnapshotDto | null;
}
