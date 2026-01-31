import { IsString } from 'class-validator';

export class VarifyPaymentDto {
  @IsString({
    message: 'razorpay_order_id must be a string',
  })
  razorpay_order_id: string;

  @IsString({
    message: 'razorpay_payment_id must be a string',
  })
  razorpay_payment_id: string;

  @IsString({
    message: 'razorpay_signature must be a string',
  })
  razorpay_signature: string;
}
