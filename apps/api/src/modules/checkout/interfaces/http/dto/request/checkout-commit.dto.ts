import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CheckoutSource } from '../../../../domain/enums';

/**
 * Request DTO for checkout commit
 */
export class CheckoutCommitDto {
  @ApiProperty({
    description: 'Checkout source - where checkout is initiated from',
    enum: CheckoutSource,
    example: CheckoutSource.CART,
  })
  @IsEnum(CheckoutSource)
  source: CheckoutSource;

  @ApiPropertyOptional({
    description: 'Coupon code to apply',
    example: 'SAVE20',
  })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiProperty({
    description: 'Shipping address ID',
    example: 'addr_123456789',
  })
  @IsString()
  shippingAddressId: string;

  @ApiProperty({
    description: 'Payment method',
    example: 'RAZORPAY',
  })
  @IsString()
  paymentMethod: string;
}
