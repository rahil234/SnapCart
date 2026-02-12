/**
 * Discontinue Product Command
 *
 * Admin permanently discontinues a product (one-way operation)
 */
export class DiscontinueProductCommand {
  constructor(public readonly productId: string) {}
}
