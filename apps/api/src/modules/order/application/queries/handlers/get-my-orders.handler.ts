import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Order } from '@/modules/order/domain/entities';
import { GetMyOrdersQuery } from '../get-my-orders.query';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';
import { OrderRepository } from '@/modules/order/domain/repositories';

@QueryHandler(GetMyOrdersQuery)
export class GetMyOrdersHandler implements IQueryHandler<GetMyOrdersQuery> {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
  ) {}

  async execute(
    query: GetMyOrdersQuery,
  ): Promise<{ orders: Order[]; total: number }> {
    const { userId, skip, take } = query;

    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    return await this.orderRepository.findByCustomerId(customerId, skip, take);
  }
}
