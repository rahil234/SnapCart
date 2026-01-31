import { ApiProperty } from '@nestjs/swagger';

export class CheckoutCartLinkResponseDto {
  @ApiProperty({
    description: 'URL to proceed with the payment for the cart checkout',
    example: 'https://payment-gateway.com/checkout/xyz123',
  })
  payment_url: string;

  constructor(data: { paymentUrl: string }) {
    this.payment_url = data.paymentUrl;
  }
}
