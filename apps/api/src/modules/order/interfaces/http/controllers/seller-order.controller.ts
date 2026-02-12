import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';

import { Role } from '@/shared/enums/role.enum';
import {
  ApiAuthErrorResponses,
  ApiCommonErrorResponses,
  ApiNotFoundResponse,
} from '@/shared/decorators/api-error-responses.decorator';
import { Roles } from '@/shared/decorators/roles.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import { UserId } from '@/shared/decorators/user-id.decorator';
import { UserRole } from '@/shared/decorators/user-role.decorator';

import {
  GetSellerOrdersQuery,
  GetOrderByIdQuery,
} from '@/modules/order/application';
import { OrderResponseDto } from '../dtos/response';

@ApiTags('Seller - Orders')
@ApiBearerAuth()
@Controller('seller/orders')
@Roles(Role.SELLER)
export class SellerOrderController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({
    summary: 'Get orders containing my products',
    description: 'Retrieve orders that contain products sold by this seller',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiResponseWithType(
    {
      isArray: true,
      status: HttpStatus.OK,
      description: 'Orders retrieved successfully',
    },
    OrderResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  async getSellerOrders(
    @UserId() userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<HttpResponse<OrderResponseDto[]>> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const result = await this.queryBus.execute(
      new GetSellerOrdersQuery(userId, skip, limitNum),
    );

    return {
      message: 'Orders retrieved successfully',
      data: result.orders.map(OrderResponseDto.fromDomain),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Retrieve detailed information about a specific order (if it contains seller products)',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: 'string',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Order retrieved successfully',
    },
    OrderResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  @ApiNotFoundResponse('Order not found')
  async getOrderById(
    @Param('id') orderId: string,
    @UserId() userId: string,
    @UserRole() userRole: Role,
  ): Promise<HttpResponse<OrderResponseDto>> {
    const order = await this.queryBus.execute(
      new GetOrderByIdQuery(orderId, userId, userRole),
    );

    return {
      message: 'Order retrieved successfully',
      data: OrderResponseDto.fromDomain(order),
    };
  }
}
