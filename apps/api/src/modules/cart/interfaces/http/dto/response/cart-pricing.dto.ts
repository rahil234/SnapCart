import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AppliedOfferDto {
  @ApiProperty({
    description: 'Offer ID',
    example: 'offer_clx123',
  })
  id: string;

  @ApiProperty({
    description: 'Offer name',
    example: 'Summer Sale 25% Off',
  })
  name: string;

  @ApiProperty({
    description: 'Discount amount applied',
    example: 125.5,
  })
  discount: number;
}

export class CartPricingDto {
  @ApiProperty({
    description: 'Subtotal before any discounts',
    example: 1500,
  })
  subtotal: number;

  @ApiProperty({
    description: 'Total discount from offers',
    example: 150,
  })
  offerDiscount: number;

  @ApiProperty({
    description: 'Discount from applied coupon',
    example: 100,
  })
  couponDiscount: number;

  @ApiProperty({
    description: 'Total discount amount',
    example: 250,
  })
  totalDiscount: number;

  @ApiProperty({
    description: 'Final total after all discounts',
    example: 1250,
  })
  finalTotal: number;

  @ApiProperty({
    description: 'IDs of applied offers',
    type: [String],
    example: ['offer_clx123', 'offer_clx456'],
  })
  appliedOfferIds: string[];

  @ApiPropertyOptional({
    description: 'Applied coupon code',
    example: 'SAVE20',
  })
  appliedCouponCode?: string;

  @ApiProperty({
    description: 'Total savings from all discounts',
    example: 250,
  })
  savings: number;

  @ApiProperty({
    description: 'List of applied offers with details',
    type: [AppliedOfferDto],
  })
  appliedOffers: AppliedOfferDto[];
}
