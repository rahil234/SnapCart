import cuid from '@paralleldrive/cuid2';
import { CartItem } from './cart-item.entity';

/**
 * Cart Aggregate Root
 * Manages the shopping cart and enforces business rules
 */
export class Cart {
  private constructor(
    public readonly id: string,
    private readonly customerId: string,
    private items: CartItem[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Factory method for creating new carts
  static create(customerId: string): Cart {
    return new Cart(cuid.createId(), customerId, [], new Date(), new Date());
  }

  // Factory method for reconstructing from persistence
  static from(
    id: string,
    customerId: string,
    items: CartItem[],
    createdAt: Date,
    updatedAt: Date,
  ): Cart {
    return new Cart(id, customerId, items, createdAt, updatedAt);
  }

  // ============================================
  // BUSINESS METHODS - Item Management
  // ============================================

  /**
   * Add item to cart or update quantity if already exists
   */
  addItem(
    productId: string,
    productVariantId: string,
    quantity: number,
  ): CartItem {
    const existingItem = this.items.find(
      (item) => item.getProductVariantId() === productVariantId,
    );

    if (existingItem) {
      existingItem.incrementQuantity(quantity);
      return existingItem;
    }

    const newItem = CartItem.create(
      this.id,
      productId,
      productVariantId,
      quantity,
    );
    this.items.push(newItem);
    return newItem;
  }

  /**
   * Remove item from cart
   */
  removeItem(itemId: string): void {
    const index = this.items.findIndex((item) => item.getId() === itemId);
    if (index === -1) {
      throw new Error('Item not found in cart');
    }
    this.items.splice(index, 1);
  }

  /**
   * Update item quantity
   */
  updateItemQuantity(itemId: string, newQuantity: number): void {
    const item = this.items.find((item) => item.getId() === itemId);
    if (!item) {
      throw new Error('Item not found in cart');
    }
    item.updateQuantity(newQuantity);
  }

  /**
   * Clear all items from cart
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Check if cart contains a specific product variant
   */
  hasProductVariant(productVariantId: string): boolean {
    return this.items.some(
      (item) => item.getProductVariantId() === productVariantId,
    );
  }

  /**
   * Get item by product variant ID
   */
  getItemByProductVariantId(productVariantId: string): CartItem | undefined {
    return this.items.find(
      (item) => item.getProductVariantId() === productVariantId,
    );
  }

  /**
   * Get item by cart item ID
   */
  getItemById(itemId: string): CartItem | undefined {
    return this.items.find((item) => item.getId() === itemId);
  }

  // ============================================
  // BUSINESS METHODS - Calculations
  // ============================================

  /**
   * Get total number of items in cart
   */
  getTotalItems(): number {
    return this.items.reduce((sum, item) => sum + item.getQuantity(), 0);
  }

  /**
   * Get total number of unique products in cart
   */
  getUniqueItemsCount(): number {
    return this.items.length;
  }

  /**
   * Check if cart is empty
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // ============================================
  // GETTERS
  // ============================================

  getId(): string {
    return this.id;
  }

  getCustomerId(): string {
    return this.customerId;
  }

  getItems(): CartItem[] {
    return [...this.items]; // Return copy to prevent external modification
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
