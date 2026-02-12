import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';

import { Order } from '@/modules/order/domain/entities';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { GetSellerOrdersQuery } from '../get-seller-orders.query';
import { OrderRepository } from '@/modules/order/domain/repositories';

@QueryHandler(GetSellerOrdersQuery)
export class GetSellerOrdersHandler
  implements IQueryHandler<GetSellerOrdersQuery>
{
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    query: GetSellerOrdersQuery,
  ): Promise<{ orders: Order[]; total: number }> {
    const { userId, skip, take } = query;

    // Get seller profile ID from user ID
    const sellerProfile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!sellerProfile) {
      throw new NotFoundException('Seller profile not found');
    }

    return await this.orderRepository.findBySellerProducts(
      sellerProfile.id,
      skip,
      take,
    );
  }
}
