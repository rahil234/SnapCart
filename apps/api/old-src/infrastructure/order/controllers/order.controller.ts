import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';

import {
  HttpPaginatedResponse,
  HttpResponse,
} from '@/common/dto/http-response.dto';
import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
import { OrderService } from '@/domain/order/services/order.service';
import { UserId } from '@/common/decorators/user-id.decorator';
import { UpdateOrderDto } from '@/application/order/dtos/request/update-order.dto';
import { OrderResponseDto } from '@/application/order/dtos/response/order.response.dto';
import { ApiResponseWithType } from '@/common/decorators/api-response.decorator';
import { OrderPaginatedQueryDto } from '@/application/order/dtos/request/order-paginated-query.dto';
import { CancelOrderRequestDto } from '@/application/order/dtos/request/cancel-order.request.dto';
import { ReturnOrderRequestDto } from '@/application/order/dtos/request/return-order.request.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles(Role.USER)
  @ApiResponseWithType({ isArray: true }, OrderResponseDto)
  async findAllByUser(
    @UserId() userId: string,
    @Query() query: OrderPaginatedQueryDto,
  ): Promise<HttpPaginatedResponse<OrderResponseDto[]>> {
    const { orders } = await this.orderService.listByUser(userId, query);

    return {
      message: 'User orders retrieved successfully',
      success: true,
      data: orders.map(OrderResponseDto.fromEntity),
      limit: query.limit,
      page: query.page,
      total: orders.length,
    };
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  @ApiResponseWithType({ isArray: true }, OrderResponseDto)
  async findAll(
    @Query() query: OrderPaginatedQueryDto,
  ): Promise<HttpPaginatedResponse<OrderResponseDto[]>> {
    const { page, limit } = query;

    const { orders, total } = await this.orderService.listAll(query);

    return {
      message: 'Orders retrieved successfully',
      success: true,
      data: orders.map(OrderResponseDto.fromEntity),
      limit,
      page,
      total,
    };
  }

  @Get(':id')
  @ApiResponseWithType({}, OrderResponseDto)
  @Roles(Role.USER, Role.ADMIN)
  async findOne(
    @Param('id') id: string,
  ): Promise<HttpResponse<OrderResponseDto>> {
    const order = await this.orderService.findById(id);

    return {
      message: 'Order retrieved successfully',
      success: true,
      data: OrderResponseDto.fromEntity(order),
    };
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiResponseWithType({}, OrderResponseDto)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<HttpResponse<OrderResponseDto>> {
    const updated = await this.orderService.updateStatus(id, dto.status);

    return {
      message: 'Order updated successfully',
      success: true,
      data: OrderResponseDto.fromEntity(updated),
    };
  }

  @Patch(':id/cancel')
  @Roles(Role.USER)
  @ApiResponseWithType({}, OrderResponseDto)
  async cancelOrder(
    @UserId() userId: string,
    @Param('id') orderId: string,
    @Body() dto: CancelOrderRequestDto,
  ): Promise<HttpResponse<OrderResponseDto>> {
    const order = await this.orderService.cancelOrder(
      orderId,
      userId,
      dto.reason,
    );

    return {
      success: true,
      message: 'Order cancelled successfully',
      data: OrderResponseDto.fromEntity(order),
    };
  }

  @Patch(':id/return')
  @Roles(Role.USER)
  @ApiResponseWithType({}, OrderResponseDto)
  async requestReturn(
    @UserId() userId: string,
    @Param('id') orderId: string,
    @Body() dto: ReturnOrderRequestDto,
  ): Promise<HttpResponse<OrderResponseDto>> {
    const order = await this.orderService.requestReturn(
      orderId,
      userId,
      dto.reason,
    );

    return {
      success: true,
      message: 'Return request submitted successfully',
      data: OrderResponseDto.fromEntity(order),
    };
  }

  @Patch(':id/refund')
  @Roles(Role.ADMIN)
  @ApiResponseWithType({}, OrderResponseDto)
  async refundPayment(
    @Param('id') orderId: string,
  ): Promise<HttpResponse<OrderResponseDto>> {
    const order = await this.orderService.refundPayment(orderId);

    return {
      success: true,
      message: 'Payment refunded successfully',
      data: OrderResponseDto.fromEntity(order),
    };
  }
}
