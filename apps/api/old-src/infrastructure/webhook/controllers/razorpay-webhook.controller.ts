import {
  Controller,
  Post,
  Headers,
  BadRequestException,
  Req,
} from '@nestjs/common';
import crypto from 'crypto';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';

import { Public } from '@/common/decorators/public.decorator';
import { RawBody } from '@/common/decorators/raw-body.decorator';
import { RazorpayWebhookPayload } from '@/common/types/razorpay';
import { RazorpayWebhookService } from '@/domain/payment/services/razorpay-webhook.service';

@Controller('webhook/razorpay')
@ApiExcludeController()
export class RazorpayWebhookController {
  private readonly RAZORPAY_WEBHOOK_SECRET: string;

  constructor(
    private readonly _razorpayWebhookService: RazorpayWebhookService,
  ) {
    const configService = new ConfigService();
    this.RAZORPAY_WEBHOOK_SECRET = configService.getOrThrow<string>(
      'RAZORPAY_WEBHOOK_SECRET',
    );
  }

  @Post()
  @Public()
  async handleRazorpayWebhook(
    @RawBody() rawBody: Buffer,
    @Req() req: Request,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    const webhookSecret = this.RAZORPAY_WEBHOOK_SECRET;

    if (!rawBody) {
      console.log('⚠️ Missing raw body');
      throw new BadRequestException('Missing raw body');
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.log('⚠️ Invalid Signature');
      throw new BadRequestException('Invalid signature');
    }

    const event = req.body as RazorpayWebhookPayload<any, unknown>;

    return this._razorpayWebhookService.handleWebhook(event);
  }
}
