/**
 * Update Variant Stock Command
 *
 * Dedicated command for stock management operations.
 * Most frequent operation in e-commerce.
 */
export class UpdateVariantStockCommand {
  constructor(
    public readonly variantId: string,
    public readonly action: 'set' | 'add' | 'reduce',
    public readonly quantity: number,
  ) {}
}
