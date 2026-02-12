import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PaymentService } from '../../domain/services';

@Injectable()
export class RazorpayPaymentService implements PaymentService {
  private razorpay: Razorpay;

  constructor(private readonly configService: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.configService.getOrThrow<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.getOrThrow<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  async createRazorpayOrder(orderId: string, amount: number): Promise<any> {
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `ord_${orderId}`,
    };

    return await this.razorpay.orders.create(options);
  }

  verifyRazorpayPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): boolean {
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (!keySecret) {
      throw new Error('RAZORPAY_KEY_SECRET not configured');
    }

    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
    const generatedSignature = hmac.digest('hex');

    return generatedSignature === razorpaySignature;
  }
}
