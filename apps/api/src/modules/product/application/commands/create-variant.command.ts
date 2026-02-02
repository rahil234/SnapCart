/**
 * Create Product Variant Command
 *
 * Creates a sellable unit for a product.
 * This is what customers actually purchase.
 */
export class CreateVariantCommand {
  constructor(
    public readonly productId: string,
    public readonly sku: string,
    public readonly variantName: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly sellerProfileId: string | null = null,
    public readonly discountPercent: number = 0,
    public readonly attributes: Record<string, any> | null = null,
    public readonly imageUrl: string | null = null,
  ) {}
}
