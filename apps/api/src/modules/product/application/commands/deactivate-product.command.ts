/**
 * Deactivate Product Command
 *
 * Seller or Admin deactivates a product to hide it from the catalog
 */
export class DeactivateProductCommand {
  constructor(public readonly productId: string) {}
}
