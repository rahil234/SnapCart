/**
 * Activate Product Command
 *
 * Seller or Admin activates a product to make it visible in the catalog
 */
export class ActivateProductCommand {
  constructor(public readonly productId: string) {}
}
