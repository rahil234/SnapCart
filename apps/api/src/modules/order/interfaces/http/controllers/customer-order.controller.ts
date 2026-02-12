import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

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
  GetMyOrdersQuery,
  CancelOrderCommand,
  GetOrderByIdQuery,  // Add this import
} from '@/modules/order/application';
import { CancelOrderDto } from '../dtos/request';
import { OrderResponseDto } from '../dtos/response';

@ApiTags('Orders - Customer')
@ApiBearerAuth()
@Controller('orders')
@Roles(Role.CUSTOMER)
export class CustomerOrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('my-orders')
  @ApiOperation({
    summary: 'Get my orders',
    description: 'Retrieve all orders for the authenticated customer',
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
  async getMyOrders(
    @UserId() userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<HttpResponse<OrderResponseDto[]>> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const result = await this.queryBus.execute(
      new GetMyOrdersQuery(userId, skip, limitNum),
    );

    return {
      message: 'Orders retrieved successfully',
      data: result.orders.map(OrderResponseDto.fromDomain),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Retrieve a specific order by its ID',
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

  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Cancel order',
    description: 'Cancel an order if it is still cancellable',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: 'string',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Order cancelled successfully',
    },
    OrderResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  @ApiNotFoundResponse('Order not found')
  async cancelOrder(
    @Param('id') orderId: string,
    @UserId() userId: string,
    @UserRole() userRole: Role,
    @Body() cancelOrderDto: CancelOrderDto,
  ): Promise<HttpResponse<OrderResponseDto>> {
    const order = await this.commandBus.execute(
      new CancelOrderCommand(
        orderId,
        userId,
        userRole,
        cancelOrderDto.cancelReason,
      ),
    );

    return {
      message: 'Order cancelled successfully',
      data: OrderResponseDto.fromDomain(order),
    };
  }
}
