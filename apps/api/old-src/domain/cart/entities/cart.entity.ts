import { CartItem as PrismaCartItem } from '@prisma/client';

export class Cart {
  id: string;
  userId: string;
  items: PrismaCartItem[];
  createdAt: Date;
  updatedAt: Date;
}
