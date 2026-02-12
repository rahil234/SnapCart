import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Response DTO for checkout commit
 */
export class CheckoutCommitResponseDto {
  @ApiProperty({
    description: 'Order ID',
    example: 'ord_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Order number',
    example: 'ORD-1234567890-ABC123',
  })
  orderNumber: string;

  @ApiProperty({
    description: 'Subtotal before any discounts',
    example: 1000.0,
  })
  subtotal: number;

  @ApiProperty({
    description: 'Product-level discount',
    example: 100.0,
  })
  discount: number;

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
    description: 'Applied coupon code',
    example: 'SAVE20',
  })
  appliedCouponCode: string | null;

  @ApiProperty({
    description: 'Order items',
    isArray: true,
    type: Object,
  })
  items: any[];

  @ApiProperty({
    description: 'Payment status',
    example: 'pending',
  })
  paymentStatus: string;

  @ApiProperty({
    description: 'Order status',
    example: 'pending',
  })
  orderStatus: string;

  static fromResult(result: any): CheckoutCommitResponseDto {
    return {
      id: result.id,
      orderNumber: result.orderNumber,
      subtotal: result.subtotal,
      discount: result.discount,
      couponDiscount: result.couponDiscount,
      offerDiscount: result.offerDiscount,
      shippingCharge: result.shippingCharge,
      tax: result.tax,
      total: result.total,
      appliedCouponCode: result.appliedCouponCode || null,
      items: result.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        total: item.total,
      })),
      paymentStatus: result.paymentStatus,
      orderStatus: result.orderStatus,
    };
  }
}
