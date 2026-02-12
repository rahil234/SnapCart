import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentResponseDto {
  @ApiProperty({
    description: 'Payment verification success message',
    example: 'Payment verified successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Order ID',
    example: 'ord_123456789',
  })
  orderId: string;
}
