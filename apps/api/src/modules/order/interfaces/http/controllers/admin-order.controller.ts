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
  GetAllOrdersQuery,
  GetOrderByIdQuery,
  UpdateOrderStatusCommand,
} from '@/modules/order/application';
import { UpdateOrderStatusDto } from '../dtos/request';
import { OrderResponseDto } from '../dtos/response';
import { OrderStatus } from '@/modules/order/domain/enums';

@ApiTags('Admin - Orders')
@ApiBearerAuth()
@Controller('admin/orders')
@Roles(Role.ADMIN)
export class AdminOrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all orders',
    description: 'Retrieve all orders with optional filtering',
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
  @ApiQuery({
    name: 'status',
    required: false,
    enum: OrderStatus,
    description: 'Filter by order status',
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    type: String,
    description: 'Filter by customer ID',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Filter from date (ISO string)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Filter to date (ISO string)',
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
  async getAllOrders(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: OrderStatus,
    @Query('customerId') customerId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<HttpResponse<OrderResponseDto[]>> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const result = await this.queryBus.execute(
      new GetAllOrdersQuery(
        skip,
        limitNum,
        status,
        undefined, // paymentStatus
        customerId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
      ),
    );

    return {
      message: 'Orders retrieved successfully',
      data: result.orders.map(OrderResponseDto.fromDomain),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Retrieve detailed information about a specific order',
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

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update order status',
    description: 'Update the status of an order',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: 'string',
  })
  @ApiResponseWithType(
    {
      status: HttpStatus.OK,
      description: 'Order status updated successfully',
    },
    OrderResponseDto,
  )
  @ApiAuthErrorResponses()
  @ApiCommonErrorResponses()
  @ApiNotFoundResponse('Order not found')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @UserId() userId: string,
    @UserRole() userRole: Role,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<HttpResponse<OrderResponseDto>> {
    const order = await this.commandBus.execute(
      new UpdateOrderStatusCommand(
        orderId,
        updateOrderStatusDto.status,
        userId,
        userRole,
      ),
    );

    return {
      message: 'Order status updated successfully',
      data: OrderResponseDto.fromDomain(order),
    };
  }
}
