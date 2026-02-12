import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'Razorpay order ID',
    example: 'order_abcd1234',
  })
  @IsNotEmpty()
  @IsString()
  razorpay_order_id: string;

  @ApiProperty({
    description: 'Razorpay payment ID',
    example: 'pay_abcd1234',
  })
  @IsNotEmpty()
  @IsString()
  razorpay_payment_id: string;

  @ApiProperty({
    description: 'Razorpay signature for verification',
    example: 'a1b2c3d4e5f6',
  })
  @IsNotEmpty()
  @IsString()
  razorpay_signature: string;

  @ApiProperty({
    description: 'Our internal order ID',
    example: 'ord_123456789',
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
