export class AddItemToCartCommand {
  constructor(
    public readonly userId: string,
    public readonly productId: string,
    public readonly productVariantId: string,
    public readonly quantity: number,
  ) {}
}
