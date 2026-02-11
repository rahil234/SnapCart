import { ApiProperty } from '@nestjs/swagger';

export class CouponValidationResponseDto {
  @ApiProperty({
    description: 'Whether the coupon is valid',
    example: true,
    type: Boolean,
  })
  valid: boolean;

  @ApiProperty({
    description: 'Reason if coupon is invalid',
    example: 'Minimum cart value of ₹500 required',
    type: String,
    nullable: true,
  })
  reason: string | null;

  @ApiProperty({
    description: 'Discount amount that will be applied',
    example: 100,
  })
  discount: number;

  @ApiProperty({
    description: 'Coupon code that was validated',
    example: 'SAVE20',
  })
  code: string;

  static fromValidationResult(
    valid: boolean,
    discount: number,
    code: string,
    reason?: string,
  ): CouponValidationResponseDto {
    return {
      valid,
      discount,
      code,
      reason: reason || null,
    };
  }
}
