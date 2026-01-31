import { Cart } from '@/domain/cart/entities/cart.entity';

export interface CartRepository {
  createCart(userId: string): Promise<Cart>;
  findById(id: string): Promise<Cart | null>;
  findByUserId(userId: string): Promise<Cart | null>;
}
