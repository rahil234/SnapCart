import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CouponValidationResponseDto {
  @ApiProperty({
    description: 'Whether the coupon is valid',
    example: true,
  })
  valid: boolean;

  @ApiPropertyOptional({
    description: 'Reason if coupon is invalid',
    example: 'Minimum cart value of ₹500 required',
  })
  reason?: string;

  @ApiPropertyOptional({
    description: 'Discount amount that will be applied',
    example: 100,
  })
  discount?: number;

  @ApiPropertyOptional({
    description: 'Coupon code that was validated',
    example: 'SAVE20',
  })
  code?: string;
}
