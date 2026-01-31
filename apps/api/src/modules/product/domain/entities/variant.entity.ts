export class Variant {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly name: string,
    public readonly sku: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
