/**
 * Delete Variant Image Command
 *
 * Removes an image from a variant by URL
 */
export class DeleteVariantImageCommand {
  constructor(
    public readonly variantId: string,
    public readonly position: number,
  ) {}
}
