import cuid from '@paralleldrive/cuid2';

/**
 * CartItem Entity
 * Represents a single item in the shopping cart
 */
export class CartItem {
  private constructor(
    public readonly id: string,
    private readonly cartId: string,
    private readonly productId: string,
    private readonly variantId: string,
    private quantity: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validateQuantity(quantity);
  }

  // Factory method for creating new cart items
  static create(
    cartId: string,
    productId: string,
    variantId: string,
    quantity: number,
  ): CartItem {
    return new CartItem(
      cuid.createId(),
      cartId,
      productId,
      variantId,
      quantity,
      new Date(),
      new Date(),
    );
  }

  // Factory method for reconstructing from persistence
  static from(
    id: string,
    cartId: string,
    productId: string,
    variantId: string,
    quantity: number,
    createdAt: Date,
    updatedAt: Date,
  ): CartItem {
    return new CartItem(
      id,
      cartId,
      productId,
      variantId,
      quantity,
      createdAt,
      updatedAt,
    );
  }

  // Business methods
  updateQuantity(newQuantity: number): void {
    this.validateQuantity(newQuantity);
    this.quantity = newQuantity;
  }

  incrementQuantity(amount: number = 1): void {
    this.updateQuantity(this.quantity + amount);
  }

  decrementQuantity(amount: number = 1): void {
    const newQuantity = this.quantity - amount;
    if (newQuantity <= 0) {
      throw new Error(
        'Cannot decrement quantity below 1. Remove item instead.',
      );
    }
    this.updateQuantity(newQuantity);
  }

  // Validation
  private validateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (!Number.isInteger(quantity)) {
      throw new Error('Quantity must be an integer');
    }
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getCartId(): string {
    return this.cartId;
  }

  getProductId(): string {
    return this.productId;
  }

  getProductVariantId(): string {
    return this.variantId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
