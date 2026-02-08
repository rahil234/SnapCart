import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ValidateCouponDto {
  @ApiProperty({
    description: 'Coupon code to validate',
    example: 'SAVE20',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Current cart total amount',
    example: 1500,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  cartTotal: number;
}
