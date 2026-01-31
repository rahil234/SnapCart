export class ProductVariant {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly name: string,
    public readonly sku: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly imageUrl: string | null,
    public readonly attributes: Record<string, any>,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
