import { Inject, Injectable } from '@nestjs/common';

import { Cart } from '@/domain/cart/entities/cart.entity';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CartRepository } from '@/infrastructure/cart/repositories/cart.repository';

@Injectable()
export class PrismaCartRepository implements CartRepository {
  constructor(
    @Inject('PrismaService') private readonly prisma: PrismaService,
  ) {}

  createCart(userId: string): Promise<Cart> {
    return this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: {
        items: true,
      },
    });
  }

  async findById(id: string): Promise<Cart | null> {
    return this.prisma.cart.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });
  }
}
