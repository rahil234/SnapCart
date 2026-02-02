/**
 * Create Product Command
 *
 * Creates a new product catalog entry (identity only).
 * This does NOT create a sellable item yet.
 * You must create at least one variant to make it sellable.
 */
export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly categoryId: string,
    public readonly brand: string | null = null,
  ) {}
}

