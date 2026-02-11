import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Role } from '@/shared/enums/role.enum';
import { Roles } from '@/shared/decorators/roles.decorator';
import { UserId } from '@/shared/decorators/user-id.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import {
  ApiAuthErrorResponses,
  ApiCommonErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';

import { ValidateCouponDto } from '../dtos/request';
import {
  CouponResponseDto,
  CouponValidationResponseDto,
} from '../dtos/response';
import { ValidateCouponCommand } from '@/modules/coupon/application/commands';
import {
  GetAvailableCouponsQuery,
  GetCouponByCodeQuery,
} from '@/modules/coupon/application/queries';

@ApiTags('Coupons')
@ApiBearerAuth()
@Controller('coupons')
export class CouponController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('available')
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Get available coupons for user',
    description:
      'Returns all active coupons that the user can still use based on per-user usage limits',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Available coupons retrieved successfully',
      isArray: true,
    },
    CouponResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async getAvailableCoupons(
    @UserId() userId: string,
  ): Promise<HttpResponse<CouponResponseDto[]>> {
    const coupons = await this.queryBus.execute(
      new GetAvailableCouponsQuery(userId),
    );

    return {
      message: 'Available coupons retrieved successfully',
      data: coupons.map(CouponResponseDto.fromDomain),
    };
  }

  @Post('validate')
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Validate coupon for cart',
    description:
      'Validates if a coupon can be applied to the cart with given total. Returns discount amount if valid.',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Coupon validation result',
    },
    CouponValidationResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async validateCoupon(
    @UserId() userId: string,
    @Body() dto: ValidateCouponDto,
  ): Promise<HttpResponse<CouponValidationResponseDto>> {
    const result = await this.commandBus.execute(
      new ValidateCouponCommand(dto.code, userId, dto.cartTotal),
    );

    return {
      message: result.valid
        ? 'Coupon is valid'
        : result.reason || 'Coupon is invalid',
      data: CouponValidationResponseDto.fromValidationResult(
        result.valid,
        result.discount,
        dto.code,
        result.reason,
      ),
    };
  }

  @Get('code/:code')
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Get coupon by code',
    description: 'Retrieve coupon details by code',
  })
  @ApiParam({
    name: 'code',
    description: 'Coupon code',
    example: 'SAVE20',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Coupon retrieved successfully',
    },
    CouponResponseDto,
  )
  @ApiNotFoundResponse('Coupon')
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async getCouponByCode(
    @Param('code') code: string,
  ): Promise<HttpResponse<CouponResponseDto>> {
    const coupon = await this.queryBus.execute(new GetCouponByCodeQuery(code));

    return {
      message: 'Coupon retrieved successfully',
      data: CouponResponseDto.fromDomain(coupon),
    };
  }
}
