import { Inject, Injectable } from '@nestjs/common';

import { CartItem } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CartItemRepository } from '@/infrastructure/cart/repositories/cart-item.repository';

@Injectable()
export class PrismaCartItemRepository implements CartItemRepository {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}

  async addToCart(
    cartId: string,
    data: {
      productId: string;
      variantId: string;
      quantity: number;
    },
  ): Promise<CartItem> {
    return this.prisma.cartItem.create({
      data: {
        cartId,
        productId: data.productId,
        variantId: data.variantId,
        quantity: data.quantity,
      },
    });
  }

  async findCartItems(cartId: string): Promise<CartItem[]> {
    return this.prisma.cartItem.findMany({
      where: { cartId },
      include: {
        product: { include: { category: true, variants: true } },
      },
    });
  }

  async updateQuantity(
    itemId: string,
    dto: {
      quantity: number;
    },
  ): Promise<CartItem> {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });
  }

  async removeItem(itemId: string): Promise<CartItem> {
    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }

  async findItemById(itemId: string): Promise<CartItem | null> {
    return this.prisma.cartItem.findUnique({ where: { id: itemId } });
  }

  async findExistingItem(
    cartId: string,
    productId: string,
    variantId?: string,
  ): Promise<CartItem | null> {
    return this.prisma.cartItem.findFirst({
      where: { cartId, productId, variantId },
    });
  }

  /** Clear all items from the cart
   * @param cartId - The ID of the cart to clear
   * */
  async clearCart(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({ where: { cartId } });
  }
}
