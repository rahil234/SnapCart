import { CartItem } from '@prisma/client';

export interface CartItemRepository {
  addToCart(
    userId: string,
    dto: {
      variantId: string;
      productId: string;
      quantity: number;
    },
  ): Promise<CartItem>;
  updateQuantity(
    itemId: string,
    dto: {
      quantity: number;
    },
  ): Promise<CartItem>;
  removeItem(itemId: string): Promise<CartItem>;
  findItemById(itemId: string): Promise<CartItem | null>;
  findExistingItem(
    userId: string,
    productId: string,
    variantId?: string,
  ): Promise<CartItem | null>;
  clearCart(cartId: string): Promise<void>;
}
