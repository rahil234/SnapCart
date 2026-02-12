import * as crypto from 'crypto';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Headers, HttpCode, HttpStatus, Logger, Post, UnauthorizedException, } from '@nestjs/common';

import { Public } from '@/shared/decorators/public.decorator';

/**
 * Razorpay Webhook Controller
 * Handles payment confirmations via webhooks when frontend verification fails
 */
@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly configService: ConfigService,
  ) {}

  @Post('razorpay')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({
    summary: 'Handle Razorpay webhook',
    description: 'Process payment confirmation webhooks from Razorpay',
  })
  @ApiHeader({
    name: 'X-Razorpay-Signature',
    description: 'Webhook signature for verification',
    required: true,
  })
  async handleRazorpayWebhook(
    @Body() payload: any,
    @Headers('x-razorpay-signature') signature: string,
  ): Promise<{ status: string }> {
    this.logger.log('Received Razorpay webhook', {
      event: payload?.event,
      paymentId: payload?.payload?.payment?.entity?.id,
    });

    // Verify webhook signature
    if (!this.verifyWebhookSignature(JSON.stringify(payload), signature)) {
      this.logger.warn('Invalid webhook signature');
      throw new UnauthorizedException('Invalid signature');
    }

    // Handle different webhook events
    if (payload.event === 'payment.captured') {
      await this.handlePaymentCaptured(payload.payload);
    } else if (payload.event === 'payment.failed') {
      await this.handlePaymentFailed(payload.payload);
    } else {
      this.logger.log(`Unhandled webhook event: ${payload.event}`);
    }

    return { status: 'ok' };
  }

  private verifyWebhookSignature(payload: string, signature: string): boolean {
    const webhookSecret = this.configService.get<string>(
      'RAZORPAY_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      this.logger.warn('RAZORPAY_WEBHOOK_SECRET not configured');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  }

  private async handlePaymentCaptured(payload: any): Promise<void> {
    const payment = payload.payment.entity;
    const orderId =
      payment.notes?.orderId ||
      this.extractOrderIdFromReceipt(payment.description);

    if (!orderId) {
      this.logger.warn('No order ID found in payment webhook', {
        paymentId: payment.id,
      });
      return;
    }

    this.logger.log('Processing payment captured webhook', {
      paymentId: payment.id,
      orderId,
    });

    try {
      // Import the command here to avoid circular dependencies
      const { VerifyPaymentCommand } =
        await import('../../../application/commands');

      // Confirm payment via webhook (similar to frontend verification)
      await this.commandBus.execute(
        new VerifyPaymentCommand(
          payment.order_id,
          payment.id,
          '', // Webhook doesn't have signature, but we've already verified webhook signature
          orderId,
        ),
      );

      this.logger.log('Payment confirmed via webhook', {
        paymentId: payment.id,
        orderId,
      });
    } catch (error) {
      this.logger.error('Failed to confirm payment via webhook', {
        paymentId: payment.id,
        orderId,
        error: error.message,
      });
    }
  }

  private async handlePaymentFailed(payload: any): Promise<void> {
    const payment = payload.payment.entity;
    const orderId =
      payment.notes?.orderId ||
      this.extractOrderIdFromReceipt(payment.description);

    this.logger.log('Payment failed webhook received', {
      paymentId: payment.id,
      orderId,
      errorCode: payment.error_code,
      errorDescription: payment.error_description,
    });

    // Optionally handle payment failures (update order status, send notifications, etc.)
  }

  private extractOrderIdFromReceipt(description: string): string | null {
    // Extract order ID from receipt format "order_ord_12345"
    const match = description?.match(/order_(.+)/);
    return match ? match[1] : null;
  }
}
