import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { Role } from '@/shared/enums/role.enum';
import {
  ApiAuthErrorResponses,
  ApiCommonErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';

import { CreatePaymentDto, VerifyPaymentDto } from '../dtos/request';
import { CreatePaymentResponseDto, VerifyPaymentResponseDto, } from '../dtos/response';
import { CreatePaymentCommand, VerifyPaymentCommand, } from '../../../application/commands';

/**
 * Payment Controller
 * Handles Razorpay payment operations
 */
@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
@Roles(Role.CUSTOMER)
export class PaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Create a Razorpay payment order
   */
  @Post('create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create Razorpay payment order',
    description: 'Creates a Razorpay order for the given order ID',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Razorpay order created successfully',
    },
    CreatePaymentResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  @ApiNotFoundResponse('Order not found')
  async createPayment(
    @Body() dto: CreatePaymentDto,
  ): Promise<HttpResponse<CreatePaymentResponseDto>> {
    const command = new CreatePaymentCommand(dto.orderId);

    const razorpayOrder = await this.commandBus.execute(command);

    return {
      message: 'Razorpay order created successfully',
      data: razorpayOrder,
    };
  }

  /**
   * Verify Razorpay payment
   */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify Razorpay payment',
    description: 'Verifies the Razorpay payment and updates order status',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Payment verified successfully',
    },
    VerifyPaymentResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  @ApiNotFoundResponse('Order not found')
  async verifyPayment(
    @Body() dto: VerifyPaymentDto,
  ): Promise<HttpResponse<VerifyPaymentResponseDto>> {
    const command = new VerifyPaymentCommand(
      dto.razorpay_order_id,
      dto.razorpay_payment_id,
      dto.razorpay_signature,
      dto.orderId,
    );

    const result = await this.commandBus.execute(command);

    return {
      message: 'Payment verified successfully',
      data: {
        message: 'Payment verified successfully',
        orderId: result.orderId,
      },
    };
  }
}
