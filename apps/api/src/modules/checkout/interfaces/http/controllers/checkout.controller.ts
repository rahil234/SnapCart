import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Role } from '@/shared/enums/role.enum';
import { Roles } from '@/shared/decorators/roles.decorator';
import { UserId } from '@/shared/decorators/user-id.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import { CheckoutPreviewQuery } from '@/modules/checkout/application/queries';
import { CheckoutCommitCommand } from '@/modules/checkout/application/commands';
import {
  CheckoutPreviewDto,
  CheckoutCommitDto,
} from '../dto/request';
import {
  CheckoutPreviewResponseDto,
  CheckoutCommitResponseDto,
} from '../dto/response';

/**
 * CheckoutController
 * Handles checkout operations with CQRS pattern
 * Routes:
 * - POST /checkout/preview - Get pricing breakdown without committing
 * - POST /checkout/commit - Create order and commit checkout
 */
@ApiTags('Checkout')
@ApiBearerAuth()
@Controller('checkout')
@Roles(Role.CUSTOMER)
export class CheckoutController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Preview checkout with pricing breakdown
   * Idempotent - safe to call multiple times
   * No database writes
   */
  @Post('preview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Preview checkout pricing',
    description:
      'Get pricing breakdown for checkout without committing. Validates coupon if provided. Safe to call multiple times.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cart is empty or invalid request',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Coupon not found',
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Checkout preview retrieved successfully',
  }, CheckoutPreviewResponseDto)
  async previewCheckout(
    @UserId() userId: string,
    @Body() dto: CheckoutPreviewDto,
  ): Promise<HttpResponse<CheckoutPreviewResponseDto>> {
    const query = new CheckoutPreviewQuery(
      userId,
      dto.source,
      dto.couponCode,
    );

    const pricing = await this.queryBus.execute(query);

    return {
      message: 'Checkout preview retrieved successfully',
      data: {
        subtotal: pricing.subtotal,
        productDiscount: pricing.productDiscount,
        couponDiscount: pricing.couponDiscount,
        offerDiscount: pricing.offerDiscount,
        shippingCharge: pricing.shippingCharge,
        tax: pricing.tax,
        total: pricing.total,
        couponSnapshot: pricing.couponSnapshot
          ? {
              code: pricing.couponSnapshot.code,
              type: pricing.couponSnapshot.type,
              discount: pricing.couponSnapshot.discount,
              discountApplied: pricing.couponSnapshot.discountApplied,
            }
          : null,
      },
    };
  }

  /**
   * Commit checkout and create order
   * Revalidates all pricing before creating order
   * Records coupon usage and clears cart if source is CART
   */
  @Post('commit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Commit checkout and create order',
    description:
      'Creates an order with pricing snapshot. Revalidates coupon, records usage, and clears cart if source is CART.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cart is empty or invalid request',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Coupon or shipping address not found',
  })
  @ApiResponseWithType({
    status: HttpStatus.CREATED,
    description: 'Order created successfully',
  }, CheckoutCommitResponseDto)
  async commitCheckout(
    @UserId() userId: string,
    @Body() dto: CheckoutCommitDto,
  ): Promise<HttpResponse<CheckoutCommitResponseDto>> {
    const command = new CheckoutCommitCommand(
      userId,
      dto.source,
      dto.couponCode,
      dto.shippingAddressId,
      dto.paymentMethod,
    );

    const order = await this.commandBus.execute(command);

    return {
      message: 'Order created successfully',
      data: order,
    };
  }
}
