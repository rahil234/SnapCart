import { ApiProperty } from '@nestjs/swagger';

export class CheckoutCartResponseDto {
  @ApiProperty({
    description: 'Razorpay order ID',
    example: 'order_9A33XWu170gUtm',
  })
  id: string;

  @ApiProperty({
    description: 'Amount for the order in smallest currency unit',
    example: 50000,
  })
  amount: number;

  @ApiProperty({
    description: 'Currency for the order',
    example: 'INR',
  })
  currency: 'INR';

  constructor(rzp_order: {
    id: string;
    amount: number | string;
    currency: string;
  }) {
    this.id = rzp_order.id;
    this.amount =
      typeof rzp_order.amount === 'string'
        ? parseInt(rzp_order.amount)
        : rzp_order.amount;
    this.currency = rzp_order.currency === 'INR' ? 'INR' : 'INR';
  }
}
