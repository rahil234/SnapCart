import { v4 as uuidv4 } from 'uuid';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';

import { Role } from '@/shared/enums/role.enum';
import { Order } from '@/modules/order/domain/entities';
import { CancelOrderCommand } from '../cancel-order.command';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';
import { OrderRepository } from '@/modules/order/domain/repositories';
import {
  WalletTransaction,
  WalletTransactionType,
  WalletTransactionStatus,
} from '@/modules/wallet/domain/entities/wallet-transaction.entity';
import { WalletRepository } from '@/modules/wallet/domain/repositories/wallet.repository';

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand> {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
    @Inject('WalletRepository')
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(command: CancelOrderCommand): Promise<Order> {
    const { orderId, userId, userRole, cancelReason } = command;

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    // Authorization check
    if (userRole === Role.CUSTOMER) {
      const customerId =
        await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

      if (order.getCustomerId() !== customerId) {
        throw new ForbiddenException('You can only cancel your own orders');
      }
    }

    // Business logic - check if order can be cancelled
    if (!order.canBeCancelled()) {
      throw new ForbiddenException(
        `Order cannot be cancelled in ${order.getOrderStatus()} status`,
      );
    }

    // Refund to wallet if payment was made via wallet and is paid
    if (order.getPaymentMethod() === 'wallet' && order.getPaymentStatus() === 'paid') {
      const customerId = order.getCustomerId();
      if (customerId) {
        const wallet = await this.walletRepository.findByCustomerId(customerId);

        if (wallet) {
          const refundAmount = order.getTotal();
          const newBalance = wallet.getBalance() + refundAmount;

          // Create refund transaction
          const transaction = WalletTransaction.create(
            uuidv4(),
            wallet.getId(),
            refundAmount,
            WalletTransactionType.REFUND,
            WalletTransactionStatus.COMPLETED,
            `Refund for cancelled order ${order.getOrderNumber()}`,
            null,
            orderId,
            null,
          );

          // Save transaction and update balance atomically
          await this.walletRepository.createTransactionWithBalanceUpdate(
            transaction,
            newBalance,
          );

          // Mark as refunded
          order.setRefundAmount(refundAmount);
        }
      }
    }

    // Cancel the order
    order.cancel(cancelReason);

    // Save and return
    return await this.orderRepository.save(order);
  }
}
