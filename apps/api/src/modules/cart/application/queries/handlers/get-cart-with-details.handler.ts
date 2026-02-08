import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetCartWithDetailsQuery } from '../get-cart-with-details.query';
import { CartReadRepository } from '@/modules/cart/domain/repositories/cart-read.repository';
import { CartWithDetailsResponseDto } from '@/modules/cart/interfaces/http/dto/response/cart-with-details-response.dto';

import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';

@QueryHandler(GetCartWithDetailsQuery)
export class GetCartWithDetailsHandler implements IQueryHandler<GetCartWithDetailsQuery> {
  constructor(
    @Inject('CartReadRepository')
    private readonly cartReadRepository: CartReadRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
  ) {}

  async execute(
    query: GetCartWithDetailsQuery,
  ): Promise<CartWithDetailsResponseDto> {
    const { userId } = query;

    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    const cart =
      await this.cartReadRepository.findByCustomerIdWithDetails(customerId);

    if (!cart) {
      throw new NotFoundException('Cart not found for customer');
    }

    return cart;
  }
}
