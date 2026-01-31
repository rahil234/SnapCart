import { Controller, Post, Body, Get } from '@nestjs/common';

import { RazorpayService } from '@/domain/payment/services/razorpay.service';
import { VarifyPaymentDto } from '@/application/payment/dtos/request/verify-payment.dto';
import { ApiResponseWithType } from '@/common/decorators/api-response.decorator';

@Controller('payment')
export class WalletController {
  constructor() {}

  @Get('balance')
  @ApiResponseWithType({})
  getBalance() {
    return { success: true, data: { balance: 1000 } };
  }

  @Get('transactions')
  @ApiResponseWithType({})
  getTransactions() {
    return {
      success: true,
      data: [{ id: 1, amount: 500, type: 'credit', date: '2024-01-01' }],
    };
  }

  @Post('add-funds')
  @ApiResponseWithType({})
  addFunds(@Body() body: { amount: number }) {
    return {
      success: true,
      data: { message: `Added ${body.amount} to wallet` },
    };
  }
}
