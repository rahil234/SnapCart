import { Controller, Post, Body } from '@nestjs/common';

import { RazorpayService } from '@/domain/payment/services/razorpay.service';
import { VarifyPaymentDto } from '@/application/payment/dtos/request/verify-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly _razorpayService: RazorpayService) {}

  @Post('verify')
  verifyPayment(@Body() body: VarifyPaymentDto) {
    const isValid = this._razorpayService.verifyPaymentSignature({
      razorpayOrderId: body.razorpay_order_id,
      razorpayPaymentId: body.razorpay_payment_id,
      razorpaySignature: body.razorpay_signature,
    });

    return { success: isValid };
  }
}
