import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentResponseDto {
  @ApiProperty({
    description: 'Razorpay order ID',
    example: 'order_abcd1234',
  })
  id: string;

  @ApiProperty({
    description: 'Entity type',
    example: 'order',
  })
  entity: string;

  @ApiProperty({
    description: 'Amount in paise',
    example: 100000,
  })
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'INR',
  })
  currency: string;

  @ApiProperty({
    description: 'Receipt identifier',
    example: 'order_ord_123456789',
  })
  receipt: string;

  @ApiProperty({
    description: 'Order status',
    example: 'created',
  })
  status: string;
}
