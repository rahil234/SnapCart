import { Injectable } from '@nestjs/common';
import { CartItem as PrismaCartItem } from '@prisma/client';

import { CartItem } from '@/modules/cart/domain/entities';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CartItemRepository } from '@/modules/cart/domain/repositories/cart-item.repository';

@Injectable()
export class PrismaCartItemRepository implements CartItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<CartItem | null> {
    const item = await this.prisma.cartItem.findUnique({ where: { id } });
    if (!item) return null;
    return this.toDomain(item);
  }

  async findByCartId(cartId: string): Promise<CartItem[]> {
    const items = await this.prisma.cartItem.findMany({ where: { cartId } });
    return items.map(this.toDomain);
  }

  async findByCartIdAndProductVariantId(
    cartId: string,
    variantId: string,
  ): Promise<CartItem | null> {
    const item = await this.prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId,
          variantId,
        },
      },
    });

    if (!item) return null;
    return this.toDomain(item);
  }

  async save(cartItem: CartItem): Promise<void> {
    await this.prisma.cartItem.upsert({
      where: { id: cartItem.getId() },
      create: {
        id: cartItem.getId(),
        cartId: cartItem.getCartId(),
        variantId: cartItem.getProductVariantId(),
        productId: cartItem.getProductId(),
        quantity: cartItem.getQuantity(),
        createdAt: cartItem.getCreatedAt(),
        updatedAt: cartItem.getUpdatedAt(),
      },
      update: {
        quantity: cartItem.getQuantity(),
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cartItem.delete({ where: { id } });
  }

  async deleteByCartId(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({ where: { cartId } });
  }

  private toDomain(prismaItem: PrismaCartItem): CartItem {
    return CartItem.from(
      prismaItem.id,
      prismaItem.cartId,
      prismaItem.productId,
      prismaItem.variantId,
      prismaItem.quantity,
      prismaItem.createdAt,
      prismaItem.updatedAt,
    );
  }
}
