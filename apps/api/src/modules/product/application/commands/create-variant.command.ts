/**
 * Create Product Variant Command
 *
 * Creates a sellable unit for a product.
 * This is what customers actually purchase.
 * Images are added separately via /images endpoint.
 */
export class CreateVariantCommand {
  constructor(
    public readonly productId: string,
    public readonly variantName: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly userId: string,
    public readonly discountPercent: number = 0,
    public readonly attributes: Record<string, any> | null = null,
  ) {}
}
