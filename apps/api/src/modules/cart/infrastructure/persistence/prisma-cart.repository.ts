import { Injectable } from '@nestjs/common';
import { Cart as PrismaCart, CartItem as PrismaCartItem } from '@prisma/client';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { Cart, CartItem } from '@/modules/cart/domain/entities';
import { CartRepository } from '@/modules/cart/domain/repositories';

type PrismaCartWithItems = PrismaCart & { items: PrismaCartItem[] };

@Injectable()
export class PrismaCartRepository implements CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Cart | null> {
    const cart = (await this.prisma.cart.findUnique({
      where: { id },
      include: { items: true },
    })) satisfies PrismaCartWithItems | null;

    if (!cart) return null;

    return this.toDomain(cart);
  }

  async findByCustomerId(customerId: string): Promise<Cart | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { customerId },
      include: { items: true },
    });

    if (!cart) return null;
    return this.toDomain(cart);
  }

  async save(cart: Cart): Promise<void> {
    await this.prisma.cart.upsert({
      where: { id: cart.getId() },
      create: {
        id: cart.getId(),
        customerId: cart.getCustomerId(),
        createdAt: cart.getCreatedAt(),
        updatedAt: cart.getUpdatedAt(),
      },
      update: {
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cart.delete({ where: { id } });
  }

  async existsByCustomerId(customerId: string): Promise<boolean> {
    const count = await this.prisma.cart.count({
      where: { customerId: customerId },
    });
    return count > 0;
  }

  private toDomain(prismaCart: PrismaCartWithItems): Cart {
    const items = prismaCart.items.map((item: any) =>
      CartItem.from(
        item.id,
        item.cartId,
        item.productId,
        item.productVariantId,
        item.quantity,
        item.createdAt,
        item.updatedAt,
      ),
    );

    return Cart.from(
      prismaCart.id,
      prismaCart.customerId,
      items,
      prismaCart.createdAt,
      prismaCart.updatedAt,
    );
  }
}
