import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';

import { Role } from '@/shared/enums/role.enum';
import { Order } from '@/modules/order/domain/entities';
import { GetOrderByIdQuery } from '../get-order-by-id.query';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { OrderRepository } from '@/modules/order/domain/repositories';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';

@QueryHandler(GetOrderByIdQuery)
export class GetOrderByIdHandler implements IQueryHandler<GetOrderByIdQuery> {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
    private readonly prisma: PrismaService,
  ) {}

  async execute(query: GetOrderByIdQuery): Promise<Order> {
    const { orderId, userId, userRole } = query;

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    // Authorization check
    if (userRole === Role.CUSTOMER) {
      const customerId =
        await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

      if (order.getCustomerId() !== customerId) {
        throw new ForbiddenException('You can only view your own orders');
      }
    } else if (userRole === Role.SELLER) {
      // Check if seller has products in this order
      const sellerProfile = await this.prisma.sellerProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!sellerProfile) {
        throw new ForbiddenException('Seller profile not found');
      }

      const sellerProducts = await this.prisma.product.findMany({
        where: {
          sellerProfileId: sellerProfile.id,
          isDeleted: false,
        },
        select: { id: true },
      });

      const sellerProductIds = sellerProducts.map((p) => p.id);
      const orderItems = order.getItems();

      const hasSellerProduct = orderItems.some((item) =>
        sellerProductIds.includes(item.productId),
      );

      if (!hasSellerProduct) {
        throw new ForbiddenException(
          'You can only view orders containing your products',
        );
      }
    }

    // ADMIN can view all orders without restrictions

    return order;
  }
}
