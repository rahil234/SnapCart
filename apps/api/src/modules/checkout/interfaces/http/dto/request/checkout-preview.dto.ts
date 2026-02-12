import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CheckoutSource } from '../../../../domain/enums';

/**
 * Request DTO for checkout preview
 */
export class CheckoutPreviewDto {
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
}
