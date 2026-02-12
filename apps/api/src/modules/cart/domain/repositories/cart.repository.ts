import { Cart } from '../entities/cart.entity';

/**
 * Cart Repository Interface
 * Defines the contract for cart data persistence
 */
export interface CartRepository {
  /**
   * Find cart by ID
   */
  findById(id: string): Promise<Cart | null>;

  /**
   * Find cart by customer ID
   */
  findByCustomerId(customerId: string): Promise<Cart | null>;

  /**
   * Save cart (create or update)
   */
  save(cart: Cart): Promise<void>;

  /**
   * Delete cart
   */
  delete(id: string): Promise<void>;

  /**
   * Check if cart exists for customer ID
   */
  existsByCustomerId(customerId: string): Promise<boolean>;
}
