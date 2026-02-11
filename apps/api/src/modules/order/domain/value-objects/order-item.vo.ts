/**
 * OrderItem Value Object
 * Represents an immutable order item snapshot
 */
export class OrderItem {
  private constructor(
    public readonly productId: string,
    public readonly productName: string,
    public readonly variantId: string,
    public readonly variantName: string,
    public readonly quantity: number,
    public readonly basePrice: number,
    public readonly discountPercent: number,
    public readonly finalPrice: number,
    public readonly attributes: any,
    public readonly imageUrl: string | null,
  ) {
    this.validate();
  }

  static create(
    productId: string,
    productName: string,
    variantId: string,
    variantName: string,
    quantity: number,
    basePrice: number,
    discountPercent: number,
    finalPrice: number,
    attributes: any,
    imageUrl: string | null = null,
  ): OrderItem {
    return new OrderItem(
      productId,
      productName,
      variantId,
      variantName,
      quantity,
      basePrice,
      discountPercent,
      finalPrice,
      attributes,
      imageUrl,
    );
  }

  static fromJSON(json: any): OrderItem {
    return new OrderItem(
      json.productId,
      json.productName,
      json.variantId,
      json.variantName,
      json.quantity,
      json.basePrice,
      json.discountPercent,
      json.finalPrice,
      json.attributes,
      json.imageUrl || null,
    );
  }

  private validate(): void {
    if (this.quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (this.basePrice < 0) {
      throw new Error('Base price cannot be negative');
    }
    if (this.finalPrice < 0) {
      throw new Error('Final price cannot be negative');
    }
  }

  toJSON(): any {
    return {
      productId: this.productId,
      productName: this.productName,
      variantId: this.variantId,
      variantName: this.variantName,
      quantity: this.quantity,
      basePrice: this.basePrice,
      discountPercent: this.discountPercent,
      finalPrice: this.finalPrice,
      attributes: this.attributes,
      imageUrl: this.imageUrl,
    };
  }

  getTotalPrice(): number {
    return this.finalPrice * this.quantity;
  }
}
