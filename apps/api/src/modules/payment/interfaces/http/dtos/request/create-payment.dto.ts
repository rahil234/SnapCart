import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Order ID for which to create payment',
    example: 'ord_123456789',
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
