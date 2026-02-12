import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { Order } from '@/modules/order/domain/entities';
import { GetAllOrdersQuery } from '../get-all-orders.query';
import { OrderRepository } from '@/modules/order/domain/repositories';

@QueryHandler(GetAllOrdersQuery)
export class GetAllOrdersHandler implements IQueryHandler<GetAllOrdersQuery> {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(
    query: GetAllOrdersQuery,
  ): Promise<{ orders: Order[]; total: number }> {
    const {
      skip,
      take,
      orderStatus,
      paymentStatus,
      customerId,
      startDate,
      endDate,
    } = query;

    return await this.orderRepository.findAll(
      {
        orderStatus,
        paymentStatus,
        customerId,
        startDate,
        endDate,
      },
      skip,
      take,
    );
  }
}
