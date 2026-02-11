import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';

import { Role } from '@/shared/enums/role.enum';
import { Order } from '@/modules/order/domain/entities';
import { OrderStatus } from '@/modules/order/domain/enums';
import { UpdateOrderStatusCommand } from '@/modules/order/application';
import { OrderRepository } from '@/modules/order/domain/repositories';

@CommandHandler(UpdateOrderStatusCommand)
export class UpdateOrderStatusHandler implements ICommandHandler<UpdateOrderStatusCommand> {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(command: UpdateOrderStatusCommand): Promise<Order> {
    const { orderId, newStatus, userId, userRole } = command;

    // Only admins and sellers can update order status
    if (userRole !== Role.ADMIN && userRole !== Role.SELLER) {
      throw new ForbiddenException(
        'Only admins and sellers can update order status',
      );
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    // Update status based on the new status
    try {
      switch (newStatus) {
        case OrderStatus.PROCESSING:
          order.markAsProcessing();
          break;
        case OrderStatus.SHIPPING:
          order.markAsShipping();
          break;
        case OrderStatus.DELIVERED:
          order.markAsDelivered();
          break;
        case OrderStatus.RETURN_REQUESTED:
          order.requestReturn();
          break;
        case OrderStatus.RETURN_APPROVED:
          order.approveReturn();
          break;
        case OrderStatus.RETURN_REJECTED:
          order.rejectReturn('Return rejected by admin/seller');
          break;
        case OrderStatus.RETURNED:
          // Note: This might need refund amount calculation
          order.markAsReturned(order.getTotal());
          break;
        default:
          throw new Error(`Cannot update to status: ${newStatus}`);
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }

    // Save and return
    return await this.orderRepository.save(order);
  }
}
