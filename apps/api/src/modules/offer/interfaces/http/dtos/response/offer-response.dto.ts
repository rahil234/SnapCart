import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Offer } from '@/modules/offer/domain/entities';
import { OfferStatus, OfferType } from '@/modules/offer/domain/enums';

export class OfferResponseDto {
  @ApiProperty({
    description: 'Offer ID',
    example: 'offer_clx1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Offer name',
    example: 'Summer Sale 2026',
  })
  name: string;

  @ApiProperty({
    description: 'Discount type',
    enum: OfferType,
    example: OfferType.PERCENTAGE,
  })
  type: OfferType;

  @ApiProperty({
    description: 'Discount value',
    example: 25,
  })
  discount: number;

  @ApiProperty({
    description: 'Minimum purchase amount required',
    example: 1000,
  })
  minPurchaseAmount: number;

  @ApiPropertyOptional({
    description: 'Maximum discount amount',
    example: 500,
  })
  maxDiscount?: number;

  @ApiProperty({
    description: 'Priority (higher = more important)',
    example: 10,
  })
  priority: number;

  @ApiProperty({
    description: 'Offer start date',
    example: '2026-02-09T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Offer end date',
    example: '2026-03-31T23:59:59.000Z',
  })
  endDate: Date;

  @ApiProperty({
    description: 'Offer status',
    enum: OfferStatus,
    example: OfferStatus.ACTIVE,
  })
  status: OfferStatus;

  @ApiProperty({
    description: 'Can be stacked with coupons',
    example: false,
  })
  isStackable: boolean;

  @ApiProperty({
    description: 'Applicable category IDs',
    type: [String],
    example: ['cat_123', 'cat_456'],
  })
  categories: string[];

  @ApiProperty({
    description: 'Applicable product IDs',
    type: [String],
    example: ['prod_123', 'prod_456'],
  })
  products: string[];

  @ApiPropertyOptional({
    description: 'Offer description',
    example: 'Get 25% off on summer collection',
  })
  description?: string;

  @ApiProperty({
    description: 'Whether offer is currently active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-02-09T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-02-09T15:30:00.000Z',
  })
  updatedAt: Date;

  static fromDomain(offer: Offer): OfferResponseDto {
    return {
      id: offer.getId(),
      name: offer.getName(),
      type: offer.getType(),
      discount: offer.getDiscount(),
      minPurchaseAmount: offer.getMinPurchaseAmount(),
      maxDiscount: offer.getMaxDiscount(),
      priority: offer.getPriority(),
      startDate: offer.getStartDate(),
      endDate: offer.getEndDate(),
      status: offer.getStatus(),
      isStackable: offer.getIsStackable(),
      categories: offer.getCategories(),
      products: offer.getProducts(),
      description: offer.getDescription(),
      isActive: offer.isActive(),
      createdAt: offer.getCreatedAt(),
      updatedAt: offer.getUpdatedAt(),
    };
  }
}
