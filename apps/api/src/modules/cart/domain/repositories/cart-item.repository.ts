import { CartItem } from '@/modules/cart/domain/entities';

/**
 * Cart Item Repository Interface
 * Defines the contract for cart item data persistence
 */
export interface CartItemRepository {
  /**
   * Find cart item by ID
   */
  findById(id: string): Promise<CartItem | null>;

  /**
   * Find all items for a cart
   */
  findByCartId(cartId: string): Promise<CartItem[]>;

  /**
   * Find item by cart and product variant
   */
  findByCartIdAndProductVariantId(
    cartId: string,
    variantId: string,
  ): Promise<CartItem | null>;

  /**
   * Save cart item (create or update)
   */
  save(cartItem: CartItem): Promise<void>;

  /**
   * Delete cart item
   */
  delete(id: string): Promise<void>;

  /**
   * Delete all items for a cart
   */
  deleteByCartId(cartId: string): Promise<void>;
}
