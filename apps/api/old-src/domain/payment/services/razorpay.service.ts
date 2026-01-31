import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Orders } from 'razorpay/dist/types/orders';
import { Injectable, BadRequestException } from '@nestjs/common';

interface VerifyPaymentParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

@Injectable()
export class RazorpayService {
  private readonly razorpay: Razorpay;
  private readonly RAZORPAY_KEY_ID: string;
  private readonly RAZORPAY_KEY_SECRET: string;

  constructor() {
    const configService = new ConfigService();

    this.RAZORPAY_KEY_ID = configService.getOrThrow<string>('RAZORPAY_KEY_ID');
    this.RAZORPAY_KEY_SECRET = configService.getOrThrow<string>(
      'RAZORPAY_KEY_SECRET',
    );

    this.razorpay = new Razorpay({
      key_id: this.RAZORPAY_KEY_ID,
      key_secret: this.RAZORPAY_KEY_SECRET,
    });
  }

  /**
   * Create Razorpay Order (used in checkout flow)
   * Adds metadata: orderId, orderNumber, userId
   */
  async createOrder(
    userId: string,
    amount: number,
    currency: string,
    metadata: { orderId: string; orderNumber: string },
  ) {
    try {
      const options: Orders.RazorpayOrderCreateRequestBody = {
        amount: amount * 100,
        currency,
        receipt: metadata.orderNumber,
        notes: {
          userId,
          orderId: metadata.orderId,
          orderNumber: metadata.orderNumber,
        },
      };

      const order = await this.razorpay.orders.create(options);

      return {
        id: order.id,
        currency: order.currency,
        amount: order.amount,
        metadata: options.notes,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create Razorpay order', error);
    }
  }

  /**
   * Create Payment Link (used in checkoutLink flow)
   * Adds metadata: orderId, orderNumber, userId
   */
  async createPaymentLink(
    userId: string,
    amount: number,
    currency: string = 'INR',
    metadata: { orderId: string; orderNumber: string },
    customer?: { email?: string; contact?: string; name?: string },
  ) {
    try {
      const link = await this.razorpay.paymentLink.create({
        amount: amount * 100,
        currency,
        description: 'Payment for your SnapCart order',
        customer: {
          name: customer?.name ?? 'SnapCart Customer',
          contact: customer?.contact,
          email: customer?.email,
        },
        notes: {
          userId,
          orderId: metadata.orderId,
          orderNumber: metadata.orderNumber,
        },
        notify: { sms: true, email: true },
        reminder_enable: true,
        callback_url: `https://cloudberrytryon.com/payment/success`,
        callback_method: 'get',
      });

      return {
        paymentUrl: link.short_url,
        metadata: link.notes,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create payment link', error);
    }
  }

  /**
   * Verify webhook / signature
   */
  verifyPaymentSignature(data: VerifyPaymentParams): boolean {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = data;

    const body = `${razorpayOrderId}|${razorpayPaymentId}`;

    const expectedSignature = crypto
      .createHmac('sha256', this.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    return expectedSignature === razorpaySignature;
  }
}
