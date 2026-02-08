import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCartQuery } from '../get-cart.query';
import { Cart } from '@/modules/cart/domain/entities';
import { CartRepository } from '@/modules/cart/domain/repositories';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';

@QueryHandler(GetCartQuery)
export class GetCartHandler implements IQueryHandler<GetCartQuery> {
  constructor(
    @Inject('CartRepository')
    private readonly cartRepository: CartRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
  ) {}

  async execute(query: GetCartQuery): Promise<Cart> {
    const { userId } = query;

    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    const cart = await this.cartRepository.findByCustomerId(customerId);
    if (!cart) {
      throw new NotFoundException('Cart not found for user');
    }

    return cart;
  }
}
