export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly categoryId: string,
    public readonly price: number,
    public readonly discountPercent?: number | null,
    public readonly tryOn?: boolean,
  ) {}
}
