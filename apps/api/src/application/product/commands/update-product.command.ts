export class UpdateProductCommand {
  constructor(
    public readonly productId: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly price?: number,
    public readonly discountPercent?: number | null,
    public readonly status?: string,
  ) {}
}
